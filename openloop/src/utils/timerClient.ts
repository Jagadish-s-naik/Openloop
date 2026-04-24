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
  paused_remaining_ms?: number | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// April 25, 2026 at 11:00 AM IST is exactly 5:30 AM UTC
export const EVENT_TARGET_MS = Date.UTC(2026, 3, 25, 5, 30, 0);
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

// True once we've received at least one successful API response
let _synced = false;

type Listener = (data: TimerData) => void;
const listeners = new Set<Listener>();
const syncListeners = new Set<(s: boolean) => void>();

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
  // If we are in ChallengePage, we might want to show the paused time.
  // BUT the Hero Section should show the event target if mode is CHALLENGE_PAUSED.
  // The logic in api/timer.js already returns EVENT_TARGET_MS as target_timestamp
  // when mode is CHALLENGE_PAUSED.

  // If we have paused_remaining_ms and we're NOT in the hero (who just uses target_timestamp),
  // we can use it. However, computeRemaining is generic.
  
  // Logic: 
  // 1. If mode is CHALLENGE_PAUSED, computeRemaining returns the EVENT countdown.
  // 2. We'll add a new property to useTimer to get the paused challenge time specifically.

  const correctedNow = Date.now() + skew;
  return Math.max(0, Math.floor((data.target_timestamp - correctedNow) / 1000));
}

// ─── API helpers (with local fallbacks) ──────────────────────────────────────

async function _apiGet(): Promise<TimerData | null> {
  // Simple check to avoid proxy errors in local dev when Vercel isn't running
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // We check if the server is likely there by looking at a global or just trying it
  }
  
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // Increased for production cold starts

    const res = await fetch(API_PATH, { 
      cache: 'no-store',
      signal: controller.signal 
    });
    clearTimeout(id);

    if (!res.ok) return null;
    return (await res.json()) as TimerData;
  } catch (err) {
    // Silently fail and use client fallback
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
  } catch (err) {
    // Silently fail and use client fallback
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchTimer(): Promise<void> {
  const data = await _apiGet();
  if (data) {
    _apply(data, true);
    if (!_synced) {
      _synced = true;
      syncListeners.forEach(fn => fn(true));
    }
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
  const correctedNow = now + skew;
  const remaining = Math.max(0, cachedData.target_timestamp - correctedNow);
  
  const optimistic: TimerData = {
    mode: 'CHALLENGE_PAUSED',
    target_timestamp: EVENT_TARGET_MS,
    server_time: now,
    paused_remaining_ms: remaining,
  };
  _apply(optimistic, true);

  const data = await _apiPost('stop');
  if (data) _apply(data, true);
}

export async function resumeChallengeTimer(): Promise<void> {
  const now = Date.now();
  // Use stored paused time if available
  const remaining = cachedData.paused_remaining_ms || CHALLENGE_DURATION_MS;
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
  const [synced, setSynced] = useState(_synced);

  useEffect(() => {
    // Subscribe to any future state updates
    listeners.add(setData);
    syncListeners.add(setSynced);
    // Kick off background sync (idempotent)
    _startBgSync();
    
    // Fallback: if we haven't synced in 4 seconds, just show the local state
    // so the UI doesn't hang on "SYNCING..."
    const timeout = setTimeout(() => {
      if (!_synced) {
        _synced = true;
        setSynced(true);
      }
    }, 4000);

    // If already synced from another component, update immediately
    if (_synced) {
      setSynced(true);
      clearTimeout(timeout);
    }
    
    return () => {
      listeners.delete(setData);
      syncListeners.delete(setSynced);
      clearTimeout(timeout);
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
    pausedRemaining: data.paused_remaining_ms ? Math.floor(data.paused_remaining_ms / 1000) : 0,
    synced,                               // true once first API response received
  };
}
