/**
 * /api/timer
 *
 * Spec:
 *   GET /api/timer
 *     → { target_timestamp: number, server_time: number, mode: 'EVENT'|'CHALLENGE' }
 *
 *   POST /api/timer  { action: 'start' | 'stop' | 'reset' | 'fast-forward' }
 *     → same shape, updated
 *
 * The server NEVER ticks. It stores only target_timestamp.
 * Clients compute remaining = target_timestamp - Date.now() locally.
 */

// April 25, 2026 at 11:00 AM IST is exactly 5:30 AM UTC
const EVENT_TARGET_MS = Date.UTC(2026, 3, 25, 5, 30, 0); 
const CHALLENGE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORE_KEY = 'openloop:timer:v2';

// ─── Redis helpers (Upstash REST) ────────────────────────────────────────────
const upstashUrl   = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const MEM_KEY      = '__OPENLOOP_TIMER_V2__';

const canRedis = () => Boolean(upstashUrl && upstashToken);

async function redisGet() {
  try {
    const res = await fetch(`${upstashUrl}/get/${STORE_KEY}`, {
      headers: { Authorization: `Bearer ${upstashToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const j = await res.json();
    return j?.result ?? null;
  } catch (e) {
    console.error('Redis GET error:', e);
    return null;
  }
}

async function redisSet(value) {
  try {
    await fetch(`${upstashUrl}/set/${STORE_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upstashToken}`,
      },
      body: value, // Send raw JSON string directly to Upstash
      cache: 'no-store',
    });
  } catch (e) {
    console.error('Redis SET error:', e);
  }
}

// ─── Persistence: Redis (prod) or in-process memory (dev) ────────────────────
async function loadState() {
  let state = null;
  try {
    if (canRedis()) {
      const raw = await redisGet();
      if (raw) state = JSON.parse(raw);
    } else {
      if (globalThis[MEM_KEY]) state = globalThis[MEM_KEY];
    }
  } catch {
    // fall through to default
  }
  
  if (!state || typeof state.target_timestamp !== 'number' || isNaN(state.target_timestamp)) {
    return { mode: 'EVENT', target_timestamp: EVENT_TARGET_MS };
  }
  return state;
}

async function saveState(state) {
  try {
    if (canRedis()) {
      await redisSet(JSON.stringify(state));
    } else {
      globalThis[MEM_KEY] = state;
    }
  } catch {
    // best-effort
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  // ── GET: return current state ──────────────────────────────────────────────
  if (req.method === 'GET') {
    const state = await loadState();
    return res.status(200).json({
      target_timestamp: (state.mode === 'CHALLENGE_PAUSED' || state.mode === 'EVENT') ? EVENT_TARGET_MS : state.target_timestamp,
      paused_remaining_ms: state.mode === 'CHALLENGE_PAUSED' ? state.remaining_ms : null,
      server_time: Date.now(),
      mode: state.mode,
    });
  }

  // ── POST: mutate state ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { action } = req.body ?? {};
    const now = Date.now();

    let state = await loadState();

    if (action === 'start') {
      // Always reset to a fresh 24h window from now
      state = {
        mode: 'CHALLENGE',
        target_timestamp: now + CHALLENGE_DURATION_MS,
      };
    } else if (action === 'stop' || action === 'suspend') {
      if (state.mode === 'CHALLENGE') {
        const remaining = Math.max(0, state.target_timestamp - now);
        state = {
          mode: 'CHALLENGE_PAUSED',
          target_timestamp: now + remaining,
          remaining_ms: remaining,
        };
      }
    } else if (action === 'resume') {
      if (state.mode === 'CHALLENGE_PAUSED') {
        state = {
          mode: 'CHALLENGE',
          target_timestamp: now + (state.remaining_ms ?? CHALLENGE_DURATION_MS),
        };
      } else if (state.mode === 'EVENT') {
        // If they resume from event, just start a new challenge
        state = {
          mode: 'CHALLENGE',
          target_timestamp: now + CHALLENGE_DURATION_MS,
        };
      }
    } else if (action === 'reset') {
      state = { mode: 'EVENT', target_timestamp: EVENT_TARGET_MS };
    } else if (action === 'fast-forward') {
      // Move target 1 hour closer
      if (state.mode === 'CHALLENGE') {
        state = {
          ...state,
          target_timestamp: Math.max(now, state.target_timestamp - 3_600_000),
        };
      }
    } else {
      return res.status(400).json({ error: 'Unknown action' });
    }

    await saveState(state);

    return res.status(200).json({
      target_timestamp: (state.mode === 'CHALLENGE_PAUSED' || state.mode === 'EVENT')
        ? EVENT_TARGET_MS  // Hero will see Event target
        : state.target_timestamp,
      paused_remaining_ms: state.mode === 'CHALLENGE_PAUSED' ? state.remaining_ms : null,
      server_time: now,
      mode: state.mode,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
