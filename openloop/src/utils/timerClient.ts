import { useState, useEffect } from 'react';

export type SharedTimerState = 'IDLE' | 'RUNNING' | 'STOPPED';
export type TimerMode = 'EVENT' | 'CHALLENGE';

export interface TimerSnapshot {
  mode: TimerMode;
  state: SharedTimerState;
  targetTimestamp: number;
  serverTime: number;
}

const API_PATH = '/api/timer';
const EVENT_TARGET_MS = new Date('2026-04-25T11:00:00+05:30').getTime();
const SYNC_CHANNEL_NAME = 'openloop-timer-sync';

export const TOTAL_SECONDS = 24 * 60 * 60;

// Global State
let globalTargetTimestamp = EVENT_TARGET_MS;
let globalMode: TimerMode = 'EVENT';
let globalState: SharedTimerState = 'IDLE';
let globalSkew = 0; // serverTime - localTime
let listeners: Array<(snapshot: TimerSnapshot) => void> = [];

const broadcast = typeof window !== 'undefined' ? new BroadcastChannel(SYNC_CHANNEL_NAME) : null;

if (broadcast) {
  broadcast.onmessage = (event) => {
    const data = event.data as TimerSnapshot;
    updateGlobalState(data, false);
  };
}

function updateGlobalState(snapshot: TimerSnapshot, shouldBroadcast = true) {
  globalTargetTimestamp = snapshot.targetTimestamp;
  globalMode = snapshot.mode;
  globalState = snapshot.state;
  globalSkew = snapshot.serverTime - Date.now();

  if (shouldBroadcast && broadcast) {
    broadcast.postMessage(snapshot);
  }

  listeners.forEach(l => l(snapshot));
}

export const getTimerSnapshot = async (): Promise<TimerSnapshot> => {
  const res = await fetch(API_PATH, { method: 'GET', cache: 'no-store' });
  if (!res.ok) throw new Error(`Timer GET failed: ${res.status}`);
  const snapshot = await res.json() as TimerSnapshot;
  updateGlobalState(snapshot, true);
  return snapshot;
};

export const safeGetTimerSnapshot = async (): Promise<TimerSnapshot> => {
  try {
    return await getTimerSnapshot();
  } catch {
    const fallback: TimerSnapshot = {
      mode: globalMode,
      state: globalState,
      targetTimestamp: globalTargetTimestamp,
      serverTime: Date.now() + globalSkew
    };
    return fallback;
  }
};

const postAction = async (action: 'start' | 'stop' | 'reset' | 'fast-forward'): Promise<TimerSnapshot> => {
  const res = await fetch(API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });

  if (!res.ok) throw new Error(`Timer action failed: ${res.status}`);
  const snapshot = await res.json() as TimerSnapshot;
  updateGlobalState(snapshot, true);
  return snapshot;
};

export const startChallengeTimer = () => postAction('start');
export const stopChallengeTimer = () => postAction('stop');
export const resetChallengeTimer = () => postAction('reset');
export const fastForwardChallengeTimer = () => postAction('fast-forward');

/**
 * useTimer Hook
 * 1. Synchronizes with server on mount.
 * 2. Re-syncs every 10 seconds (if active) or 60 seconds (if idle).
 * 3. Provides real-time remaining seconds based on local clock + skew.
 */
export const useTimer = () => {
  const [snapshot, setSnapshot] = useState<TimerSnapshot>({
    mode: globalMode,
    state: globalState,
    targetTimestamp: globalTargetTimestamp,
    serverTime: Date.now() + globalSkew
  });

  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const handler = (s: TimerSnapshot) => setSnapshot(s);
    listeners.push(handler);

    // Initial sync on mount
    void safeGetTimerSnapshot();

    // Smart background re-sync
    const syncInterval = setInterval(() => {
      // Poll faster if we are in a challenge, otherwise slower
      const interval = globalMode === 'CHALLENGE' ? 10000 : 30000;
      if (Date.now() % interval < 1000) {
        void safeGetTimerSnapshot();
      }
    }, 1000);

    // Re-sync on window focus / visibility change
    const handleSync = () => {
      if (document.visibilityState === 'visible') {
        void safeGetTimerSnapshot();
      }
    };
    window.addEventListener('focus', handleSync);
    document.addEventListener('visibilitychange', handleSync);

    return () => {
      listeners = listeners.filter(l => l !== handler);
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleSync);
    };
  }, []);

  useEffect(() => {
    // Local ticker (1s)
    const tick = () => {
      const now = Date.now();
      
      let diffSeconds = 0;
      if (snapshot.mode === 'EVENT') {
         // Standard event target
         diffSeconds = Math.max(0, Math.floor((snapshot.targetTimestamp - (now + globalSkew)) / 1000));
      } else {
        if (snapshot.state === 'RUNNING') {
          // Dynamic remaining calculation using authoritative skew
          diffSeconds = Math.max(0, Math.floor((snapshot.targetTimestamp - (now + globalSkew)) / 1000));
        } else {
          // Fixed remaining time when stopped/idle
          diffSeconds = Math.max(0, Math.floor((snapshot.targetTimestamp - snapshot.serverTime) / 1000));
        }
      }
      setRemaining(diffSeconds);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [snapshot]);

  return {
    remaining,
    mode: snapshot.mode,
    state: snapshot.state,
    targetTimestamp: snapshot.targetTimestamp
  };
};
