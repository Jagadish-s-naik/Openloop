/**
 * timerClient.ts
 *
 * SPEC:
 *  - ONE API call on load, re-sync every 60s
 *  - Clients compute remaining = target_timestamp - Date.now() locally via setInterval
 *  - Clock skew correction: skew = server_time - Date.now()
 *  - BroadcastChannel for instant same-device cross-tab sync
 *  - Full local fallback so the timer works even without the API (local dev)
 */

import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimerMode = 'EVENT' | 'CHALLENGE' | 'CHALLENGE_PAUSED';

export interface TimerData {
  target_timestamp: number;
  server_time: number;
  mode: TimerMode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const EVENT_TARGET_MS = new Date('2026-04-25T11:00:00+05:30').getTime();
export const CHALLENGE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hrs in ms
const API_PATH = '/api/timer';
const BC_NAME = 'openloop-timer-v2';
const RESYNC_MS = 60_000;

// ─── Module-level shared state ────────────────────────────────────────────────

let cachedData: TimerData = {
  target_timestamp: EVENT_TARGET_MS,
  server_time: Date.now(),
  mode: 'EVENT',
};

// clock skew: server_time - local_time_at_fetch
let skew = 0;

type Listener = (data: TimerData) => void;
const listeners = new Set<Listener>();

// ─── BroadcastChannel ─────────────────────────────────────────────────────────

const bc: BroadcastChannel | null =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel(BC_NAME)
    : null;

if (bc) {
  bc.onmessage = (e: MessageEvent<TimerData>) => {
    // Another tab updated the state — apply it locally, don't re-broadcast
    _apply(e.data, false);
  };
}

// ─── Core state application ───────────────────────────────────────────────────

function _apply(data: TimerData, broadcast = true) {
  cachedData = data;
  skew = data.server_time - Date.now();
  listeners.forEach(fn => fn(data));
  if (broadcast && bc) bc.postMessage(data);
}

// ─── Remaining time calculation ───────────────────────────────────────────────

export function computeRemaining(data: TimerData): number {
  // If the timer is paused, the server returns target_timestamp = server_time + remaining
  // This means the remaining time is simply target_timestamp - server_time.
  // We do not want it to keep ticking against Date.now()!
  if (data.mode === 'CHALLENGE_PAUSED') {
    return Math.max(0, Math.floor((data.target_timestamp - data.server_time) / 1000));
  }

  // Otherwise, timer is running.
  // Apply skew: if server clock is ahead of local clock, skew > 0
  // correctedNow is the "true" current time
  const correctedNow = Date.now() + skew;
  return Math.max(0, Math.floor((data.target_timestamp - correctedNow) / 1000));
}

// ─── API helpers (with local fallbacks) ──────────────────────────────────────

async function _apiGet(): Promise<TimerData | null> {
  try {
    const res = await fetch(API_PATH, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as TimerData;
  } catch {
    return null;
  }
}

async function _apiPost(action: string): Promise<TimerData | null> {
  try {
    const res = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as TimerData;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchTimer(): Promise<void> {
  const data = await _apiGet();
  if (data) {
    _apply(data, true);
  }
  // If API failed: keep cachedData, timer ticks from it — that's fine
}

export async function startChallengeTimer(): Promise<void> {
  const now = Date.now();
  // Optimistic local update immediately so UI responds instantly
  const optimistic: TimerData = {
    mode: 'CHALLENGE',
    target_timestamp: now + CHALLENGE_DURATION_MS,
    server_time: now,
  };
  _apply(optimistic, true);

  // Then try to sync with server (server‐authoritative timestamp wins)
  const data = await _apiPost('start');
  if (data) _apply(data, true);
}

export async function stopChallengeTimer(): Promise<void> {
  const now = Date.now();
  const remaining = Math.max(0, cachedData.target_timestamp - now - skew * 1000);
  const optimistic: TimerData = {
    mode: 'CHALLENGE_PAUSED',
    target_timestamp: now + remaining,
    server_time: now,
  };
  _apply(optimistic, true);

  const data = await _apiPost('stop');
  if (data) _apply(data, true);
}

export async function resumeChallengeTimer(): Promise<void> {
  const now = Date.now();
  // Compute leftover time from paused snapshot
  const remaining = Math.max(0, cachedData.target_timestamp - now);
  const optimistic: TimerData = {
    mode: 'CHALLENGE',
    target_timestamp: now + remaining,
    server_time: now,
  };
  _apply(optimistic, true);

  const data = await _apiPost('resume');
  if (data) _apply(data, true);
}

export async function resetChallengeTimer(): Promise<void> {
  const optimistic: TimerData = {
    mode: 'EVENT',
    target_timestamp: EVENT_TARGET_MS,
    server_time: Date.now(),
  };
  _apply(optimistic, true);

  const data = await _apiPost('reset');
  if (data) _apply(data, true);
}

export async function fastForwardChallengeTimer(): Promise<void> {
  const now = Date.now();
  const optimistic: TimerData = {
    ...cachedData,
    target_timestamp: Math.max(now + 1000, cachedData.target_timestamp - 3_600_000),
    server_time: now,
  };
  _apply(optimistic, true);

  const data = await _apiPost('fast-forward');
  if (data) _apply(data, true);
}

// ─── Background sync (started once per page lifetime) ────────────────────────

let _bgStarted = false;

function _startBgSync() {
  if (_bgStarted || typeof window === 'undefined') return;
  _bgStarted = true;

  // Initial fetch
  void fetchTimer();

  // Re-sync every 60 seconds
  setInterval(() => void fetchTimer(), RESYNC_MS);

  // Re-sync when user returns to this tab / window
  const resync = () => {
    if (document.visibilityState === 'visible') void fetchTimer();
  };
  document.addEventListener('visibilitychange', resync);
  window.addEventListener('focus', resync);
}

// ─── React Hook ───────────────────────────────────────────────────────────────

export function useTimer() {
  const [data, setData] = useState<TimerData>(cachedData);
  const [remaining, setRemaining] = useState(() => computeRemaining(cachedData));

  useEffect(() => {
    // Subscribe to any future state updates
    listeners.add(setData);
    // Kick off background sync (idempotent)
    _startBgSync();
    return () => {
      listeners.delete(setData);
    };
  }, []);

  // Local tick: runs every second, entirely in the browser
  useEffect(() => {
    const tick = () => setRemaining(computeRemaining(data));
    tick(); // immediate first tick
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data]); // re-run when data changes (new target received)

  return {
    remaining,                            // seconds (ticks locally every 1s)
    mode: data.mode,
    isChallenge: data.mode === 'CHALLENGE',
    isPaused:    data.mode === 'CHALLENGE_PAUSED',
    isEvent:     data.mode === 'EVENT',
  };
}
