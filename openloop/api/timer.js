const TOTAL_SECONDS = 24 * 60 * 60;
const EVENT_TARGET_MS = new Date('2026-04-25T11:00:00+05:30').getTime();
const TIMER_KEY = 'openloop:timer:state:v1';

const isFiniteNumber = (v) => typeof v === 'number' && Number.isFinite(v);

const clamp = (v, min, max) => Math.min(max, Math.max(min, Math.floor(v)));

const eventRemainingSeconds = () => clamp(Math.ceil((EVENT_TARGET_MS - Date.now()) / 1000), 0, 365 * 24 * 60 * 60);

const defaultState = () => ({
  mode: 'EVENT',
  state: 'IDLE',
  targetTimestamp: EVENT_TARGET_MS,
  updatedAt: Date.now(),
});

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const memoryStoreKey = '__OPENLOOP_TIMER_STATE__';

const canUseRedis = () => Boolean(upstashUrl && upstashToken);

const upstashFetch = async (path, options = {}) => {
  const res = await fetch(`${upstashUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${upstashToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Upstash request failed: ${res.status}`);
  }

  return res.json();
};

const loadState = async () => {
  if (!canUseRedis()) {
    const memoryState = globalThis[memoryStoreKey];
    return memoryState || defaultState();
  }

  const data = await upstashFetch(`/get/${TIMER_KEY}`);
  const raw = data?.result;

  if (!raw) {
    return defaultState();
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode === 'CHALLENGE' ? 'CHALLENGE' : 'EVENT',
      state: parsed.state === 'RUNNING' || parsed.state === 'STOPPED' ? parsed.state : 'IDLE',
      targetTimestamp: isFiniteNumber(parsed.targetTimestamp) ? parsed.targetTimestamp : (parsed.mode === 'CHALLENGE' ? Date.now() + TOTAL_SECONDS * 1000 : EVENT_TARGET_MS),
      updatedAt: isFiniteNumber(parsed.updatedAt) ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return defaultState();
  }
};

const saveState = async (state) => {
  if (!canUseRedis()) {
    globalThis[memoryStoreKey] = state;
    return;
  }

  await upstashFetch('/set', {
    method: 'POST',
    body: JSON.stringify([TIMER_KEY, JSON.stringify(state)]),
  });
};

const normalizeState = (state) => {
  if (state.mode !== 'CHALLENGE') {
    return {
      ...defaultState(),
      mode: 'EVENT',
      state: 'IDLE',
      targetTimestamp: EVENT_TARGET_MS,
      updatedAt: Date.now(),
    };
  }

  const now = Date.now();
  if (state.state === 'RUNNING') {
    const remaining = state.targetTimestamp - now;
    if (remaining <= 0) {
      return {
        ...state,
        state: 'STOPPED',
        targetTimestamp: now,
        updatedAt: now,
      };
    }
  }

  return {
    ...state,
    updatedAt: now,
  };
};

const toSnapshot = (state) => ({
  mode: state.mode,
  state: state.state,
  targetTimestamp: state.targetTimestamp,
  serverTime: Date.now(),
});

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const current = normalizeState(await loadState());
      await saveState(current);
      return res.status(200).json(toSnapshot(current));
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const action = req.body?.action;
    const current = normalizeState(await loadState());

    let next = current;

    if (action === 'start') {
      const startFromMs =
        current.mode === 'CHALLENGE' && current.state === 'STOPPED' && (current.targetTimestamp - Date.now()) > 0
          ? (current.targetTimestamp - Date.now())
          : TOTAL_SECONDS * 1000;

      next = {
        mode: 'CHALLENGE',
        state: 'RUNNING',
        targetTimestamp: Date.now() + startFromMs,
        updatedAt: Date.now(),
      };
    } else if (action === 'stop') {
      const now = Date.now();
      const remainingAtStop = current.state === 'RUNNING' ? Math.max(0, current.targetTimestamp - now) : (current.targetTimestamp - now);

      next = {
        mode: 'CHALLENGE',
        state: 'STOPPED',
        targetTimestamp: now + remainingAtStop,
        updatedAt: now,
      };
    } else if (action === 'reset') {
      next = {
        mode: 'EVENT',
        state: 'IDLE',
        targetTimestamp: EVENT_TARGET_MS,
        updatedAt: Date.now(),
      };
    } else if (action === 'fast-forward') {
      if (current.mode === 'CHALLENGE' && current.state === 'RUNNING') {
        const nextTarget = current.targetTimestamp - 3600 * 1000;
        next = {
          ...current,
          targetTimestamp: nextTarget,
          updatedAt: Date.now(),
        };
      }
    } else {
      return res.status(400).json({ error: 'Unsupported action' });
    }

    next = normalizeState(next);
    await saveState(next);
    return res.status(200).json(toSnapshot(next));
  } catch (error) {
    return res.status(500).json({
      error: 'Timer service error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
