export type SharedTimerState = 'IDLE' | 'RUNNING' | 'STOPPED';
export type TimerMode = 'EVENT' | 'CHALLENGE';

export interface TimerSnapshot {
  mode: TimerMode;
  state: SharedTimerState;
  remainingSeconds: number;
  eventRemainingSeconds: number;
}

const API_PATH = '/api/timer';
const EVENT_TARGET_MS = new Date('2026-04-25T11:00:00+05:30').getTime();
const FALLBACK_CHANNEL_NAME = 'openloop-timer-fallback';

export const TOTAL_SECONDS = 24 * 60 * 60;

interface FallbackState {
  mode: TimerMode;
  state: SharedTimerState;
  remainingSeconds: number;
  endAtMs: number | null;
}

const clampSeconds = (value: number, max = TOTAL_SECONDS): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, Math.floor(value)));
};

const getEventRemainingSeconds = (): number => {
  return clampSeconds(Math.ceil((EVENT_TARGET_MS - Date.now()) / 1000), 365 * 24 * 60 * 60);
};

let fallbackState: FallbackState = {
  mode: 'EVENT',
  state: 'IDLE',
  remainingSeconds: TOTAL_SECONDS,
  endAtMs: null,
};

let fallbackChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  fallbackChannel = new BroadcastChannel(FALLBACK_CHANNEL_NAME);
  fallbackChannel.onmessage = (event: MessageEvent<FallbackState>) => {
    const incoming = event.data;
    if (!incoming) return;
    fallbackState = incoming;
  };
}

const publishFallback = () => {
  if (!fallbackChannel) return;
  fallbackChannel.postMessage(fallbackState);
};

const getFallbackSnapshot = (): TimerSnapshot => {
  const eventRemaining = getEventRemainingSeconds();

  if (fallbackState.mode !== 'CHALLENGE') {
    fallbackState = {
      mode: 'EVENT',
      state: 'IDLE',
      remainingSeconds: TOTAL_SECONDS,
      endAtMs: null,
    };

    return {
      mode: 'EVENT',
      state: 'IDLE',
      remainingSeconds: TOTAL_SECONDS,
      eventRemainingSeconds: eventRemaining,
    };
  }

  if (fallbackState.state !== 'RUNNING' || fallbackState.endAtMs === null) {
    return {
      mode: fallbackState.mode,
      state: fallbackState.state,
      remainingSeconds: clampSeconds(fallbackState.remainingSeconds),
      eventRemainingSeconds: eventRemaining,
    };
  }

  const live = clampSeconds(Math.ceil((fallbackState.endAtMs - Date.now()) / 1000));
  fallbackState = {
    ...fallbackState,
    remainingSeconds: live,
  };

  if (live === 0) {
    fallbackState = {
      mode: 'EVENT',
      state: 'IDLE',
      remainingSeconds: TOTAL_SECONDS,
      endAtMs: null,
    };
    publishFallback();
    return {
      mode: 'EVENT',
      state: 'IDLE',
      remainingSeconds: TOTAL_SECONDS,
      eventRemainingSeconds: eventRemaining,
    };
  }

  return {
    mode: 'CHALLENGE',
    state: 'RUNNING',
    remainingSeconds: live,
    eventRemainingSeconds: eventRemaining,
  };
};

const fallbackSnapshot = (): TimerSnapshot => ({
  ...getFallbackSnapshot(),
});

export const getTimerSnapshot = async (): Promise<TimerSnapshot> => {
  const res = await fetch(API_PATH, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Timer GET failed: ${res.status}`);
  }
  return (await res.json()) as TimerSnapshot;
};

export const safeGetTimerSnapshot = async (): Promise<TimerSnapshot> => {
  try {
    return await getTimerSnapshot();
  } catch {
    return fallbackSnapshot();
  }
};

const postAction = async (action: 'start' | 'stop' | 'reset' | 'fast-forward'): Promise<TimerSnapshot> => {
  try {
    const res = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      throw new Error(`Timer action failed: ${res.status}`);
    }

    return (await res.json()) as TimerSnapshot;
  } catch {
    if (action === 'start') {
      fallbackState = {
        mode: 'CHALLENGE',
        state: 'RUNNING',
        remainingSeconds: TOTAL_SECONDS,
        endAtMs: Date.now() + TOTAL_SECONDS * 1000,
      };
      publishFallback();
      return getFallbackSnapshot();
    }

    if (action === 'stop' || action === 'reset') {
      fallbackState = {
        mode: 'EVENT',
        state: 'IDLE',
        remainingSeconds: TOTAL_SECONDS,
        endAtMs: null,
      };
      publishFallback();
      return getFallbackSnapshot();
    }

    if (
      action === 'fast-forward' &&
      fallbackState.mode === 'CHALLENGE' &&
      fallbackState.state === 'RUNNING' &&
      fallbackState.endAtMs !== null
    ) {
      fallbackState = {
        ...fallbackState,
        endAtMs: Math.max(Date.now(), fallbackState.endAtMs - 3600 * 1000),
      };
      publishFallback();
      return getFallbackSnapshot();
    }

    return getFallbackSnapshot();
  }
};

export const startChallengeTimer = () => postAction('start');
export const stopChallengeTimer = () => postAction('stop');
export const resetChallengeTimer = () => postAction('reset');
export const fastForwardChallengeTimer = () => postAction('fast-forward');
