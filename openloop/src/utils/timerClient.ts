/**
 * timerClient.ts
 *
 * Implements the spec exactly:
 *  - ONE API call on load (+ re-sync every 60s)
 *  - Client computes remaining = target_timestamp - Date.now() locally via setInterval
 *  - Clock skew: skew = server_time - Date.now() at fetch time, applied every tick
 *  - BroadcastChannel for instant same-device cross-tab sync
 *  - useTimer() hook for React components
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
export const CHALLENGE_DURATION_MS = 24 * 60 * 60 * 1000;

const API_PATH = '/api/timer';
const BROADCAST_CHANNEL = 'openloop-timer-v2';
const RESYNC_INTERVAL_MS = 60_000; // 60 seconds

// ─── Module-level shared state ────────────────────────────────────────────────
// One fetch, shared across all hook instances in the same tab.

let cachedData: TimerData = {
  target_timestamp: EVENT_TARGET_MS,
  server_time: Date.now(),
  mode: 'EVENT',
};

// Clock skew = server_time - local_time_at_fetch
let skew = 0;

// Subscribers
type Listener = (data: TimerData) => void;
let listeners: Set<Listener> = new Set();

// BroadcastChannel for same-device cross-tab sync
const bc = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(BROADCAST_CHANNEL)
  : null;

if (bc) {
  bc.onmessage = (event: MessageEvent<TimerData>) => {
    applyData(event.data, false); // don't re-broadcast
  };
}

function applyData(data: TimerData, broadcast = true) {
  cachedData = data;
  // Skew calculated at the moment this data is received
  skew = data.server_time - Date.now();
  listeners.forEach(fn => fn(data));
  if (broadcast && bc) bc.postMessage(data);
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchTimer(): Promise<TimerData> {
  const res = await fetch(API_PATH, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /api/timer failed: ${res.status}`);
  const data: TimerData = await res.json();
  applyData(data, true);
  return data;
}

export async function safeFetchTimer(): Promise<TimerData> {
  try {
    return await fetchTimer();
  } catch {
    return cachedData;
  }
}

async function postAction(action: string): Promise<TimerData> {
  const res = await fetch(API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`POST /api/timer failed: ${res.status}`);
  const data: TimerData = await res.json();
  applyData(data, true);
  return data;
}

export const startChallengeTimer   = () => postAction('start');
export const stopChallengeTimer    = () => postAction('stop');
export const resumeChallengeTimer  = () => postAction('resume');
export const resetChallengeTimer   = () => postAction('reset');
export const fastForwardChallengeTimer = () => postAction('fast-forward');

// ─── Remaining time calculation ───────────────────────────────────────────────

export function computeRemaining(data: TimerData): number {
  // Apply skew correction: adjust target by the measured server-client offset
  const correctedTarget = data.target_timestamp - skew;
  return Math.max(0, Math.floor((correctedTarget - Date.now()) / 1000));
}

// ─── Module-level background sync ────────────────────────────────────────────
// One setInterval at module level — not per hook instance. This is the ONLY
// place we poll the server.

let bgSyncStarted = false;

function startBackgroundSync() {
  if (bgSyncStarted || typeof window === 'undefined') return;
  bgSyncStarted = true;

  // Initial fetch
  void safeFetchTimer();

  // Re-sync every 60 seconds
  setInterval(() => {
    void safeFetchTimer();
  }, RESYNC_INTERVAL_MS);

  // Re-sync on tab focus
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      void safeFetchTimer();
    }
  });

  window.addEventListener('focus', () => {
    void safeFetchTimer();
  });
}

// ─── React Hook ──────────────────────────────────────────────────────────────

export function useTimer() {
  const [data, setData] = useState<TimerData>(cachedData);
  const [remaining, setRemaining] = useState(() => computeRemaining(cachedData));

  useEffect(() => {
    // Register listener
    listeners.add(setData);
    // Kick off the background sync (idempotent)
    startBackgroundSync();

    return () => {
      listeners.delete(setData);
    };
  }, []);

  // Local tick — runs entirely in the browser, zero server involvement
  useEffect(() => {
    const tick = () => setRemaining(computeRemaining(data));
    tick(); // immediate

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data]);

  // Helpers
  const isChallenge = data.mode === 'CHALLENGE';
  const isPaused    = data.mode === 'CHALLENGE_PAUSED';

  return {
    remaining,      // seconds
    mode: data.mode,
    isChallenge,
    isPaused,
    isEvent: !isChallenge && !isPaused,
    target_timestamp: data.target_timestamp,
  };
}
