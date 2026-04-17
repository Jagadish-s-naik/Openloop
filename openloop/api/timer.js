const TOTAL_SECONDS = 24 * 60 * 60;
const EVENT_TARGET_MS = new Date('2026-04-25T11:00:00+05:30').getTime();
const TIMER_KEY = 'openloop:timer:state:v1';

const isFiniteNumber = (v) => typeof v === 'number' && Number.isFinite(v);

const clamp = (v, min, max) => Math.min(max, Math.max(min, Math.floor(v)));

const eventRemainingSeconds = () => clamp(Math.ceil((EVENT_TARGET_MS - Date.now()) / 1000), 0, 365 * 24 * 60 * 60);

const defaultState = () => ({
  mode: 'EVENT',
  state: 'IDLE',
  remainingSeconds: TOTAL_SECONDS,
  endAtMs: null,
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
      remainingSeconds: clamp(isFiniteNumber(parsed.remainingSeconds) ? parsed.remainingSeconds : TOTAL_SECONDS, 0, TOTAL_SECONDS),
      endAtMs: isFiniteNumber(parsed.endAtMs) ? parsed.endAtMs : null,
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
      updatedAt: Date.now(),
    };
  }

  if (state.state !== 'RUNNING' || !isFiniteNumber(state.endAtMs)) {
    return {
      ...state,
      mode: 'CHALLENGE',
      state: state.state === 'STOPPED' ? 'STOPPED' : 'IDLE',
      endAtMs: null,
      remainingSeconds: clamp(state.remainingSeconds, 0, TOTAL_SECONDS),
      updatedAt: Date.now(),
    };
  }

  const remaining = clamp(Math.ceil((state.endAtMs - Date.now()) / 1000), 0, TOTAL_SECONDS);

  if (remaining === 0) {
    return {
      ...state,
      mode: 'CHALLENGE',
      state: 'STOPPED',
      remainingSeconds: 0,
      endAtMs: null,
      updatedAt: Date.now(),
    };
  }

  return {
    ...state,
    mode: 'CHALLENGE',
    state: 'RUNNING',
    remainingSeconds: remaining,
    updatedAt: Date.now(),
  };
};

const toSnapshot = (state) => ({
  mode: state.mode,
  state: state.state,
  remainingSeconds: state.remainingSeconds,
  eventRemainingSeconds: eventRemainingSeconds(),
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
      next = {
        mode: 'CHALLENGE',
        state: 'RUNNING',
        remainingSeconds: TOTAL_SECONDS,
        endAtMs: Date.now() + TOTAL_SECONDS * 1000,
        updatedAt: Date.now(),
      };
    } else if (action === 'stop') {
      next = {
        ...defaultState(),
        mode: 'EVENT',
        state: 'IDLE',
        updatedAt: Date.now(),
      };
    } else if (action === 'reset') {
      next = {
        ...defaultState(),
        mode: 'EVENT',
        state: 'IDLE',
        updatedAt: Date.now(),
      };
    } else if (action === 'fast-forward') {
      if (current.mode === 'CHALLENGE' && current.state === 'RUNNING' && isFiniteNumber(current.endAtMs)) {
        const endAtMs = Math.max(Date.now(), current.endAtMs - 3600 * 1000);
        const remaining = clamp(Math.ceil((endAtMs - Date.now()) / 1000), 0, TOTAL_SECONDS);
        next = {
          ...current,
          state: remaining === 0 ? 'STOPPED' : 'RUNNING',
          remainingSeconds: remaining,
          endAtMs: remaining === 0 ? null : endAtMs,
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
