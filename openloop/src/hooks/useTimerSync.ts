import { useEffect, useState, useCallback, useRef } from 'react';
import { safeGetTimerSnapshot, type TimerSnapshot } from '../utils/timerClient';

const BROADCAST_CHANNEL_NAME = 'openloop-timer-sync';
const POLL_INTERVAL = 3000; // Increased poll interval to reduce server overhead while relying on live ticking
const EVENT_TARGET_MS = new Date('2026-04-25T11:00:00+05:30').getTime();

let broadcastChannel: BroadcastChannel | null = null;

// Initialize broadcast channel once
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch {
    console.warn('BroadcastChannel not available');
  }
}

export const publishTimerSync = (snapshot: TimerSnapshot) => {
  if (!broadcastChannel) return;
  try {
    broadcastChannel.postMessage({
      type: 'timer-sync',
      timestamp: Date.now(),
      data: snapshot,
    });
  } catch (error) {
    console.warn('Failed to publish timer sync:', error);
  }
};

interface UseTimerSyncOptions {
  onUpdate?: (snapshot: TimerSnapshot) => void;
  pollInterval?: number;
}

export const useTimerSync = (options: UseTimerSyncOptions = {}) => {
  const { onUpdate, pollInterval = POLL_INTERVAL } = options;

  const [snapshot, setSnapshot] = useState<TimerSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);
  const onUpdateRef = useRef<typeof onUpdate>(onUpdate);
  const baseSnapshotRef = useRef<TimerSnapshot | null>(null);
  const baseReceivedAtRef = useRef<number>(Date.now());

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const buildLiveSnapshot = useCallback((base: TimerSnapshot): TimerSnapshot => {
    const now = Date.now();
    // Use floor for consistent ticking
    const eventRemainingSeconds = Math.max(0, Math.floor((EVENT_TARGET_MS - now) / 1000));

    // Determine the active mode: 
    // Always prefer CHALLENGE if it's explicitly RUNNING on the server/client
    const isActiveChallenge = base.mode === 'CHALLENGE' && base.state === 'RUNNING';

    if (!isActiveChallenge) {
      return {
        mode: 'EVENT',
        state: 'IDLE',
        remainingSeconds: 24 * 60 * 60,
        eventRemainingSeconds: eventRemainingSeconds,
      };
    }

    // High precision calculation for the challenge timer
    const elapsedMs = now - baseReceivedAtRef.current;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const liveRemaining = clamp(base.remainingSeconds - elapsedSeconds, 0, 24 * 60 * 60);

    return {
      ...base,
      state: liveRemaining <= 0 ? 'STOPPED' : 'RUNNING',
      remainingSeconds: liveRemaining,
      eventRemainingSeconds,
    };
  }, []);

  const emitSnapshot = useCallback((next: TimerSnapshot) => {
    if (!isMountedRef.current) return;
    setSnapshot(next);
    setError(null);
    onUpdateRef.current?.(next);
  }, []);

  const applyBaseSnapshot = useCallback(
    (next: TimerSnapshot) => {
      baseSnapshotRef.current = next;
      // Record exactly when we received this snapshot to calculate drift
      baseReceivedAtRef.current = Date.now();
      emitSnapshot(buildLiveSnapshot(next));
    },
    [buildLiveSnapshot, emitSnapshot]
  );

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Sync from backend
  const syncFromBackend = useCallback(async () => {
    try {
      const data = await safeGetTimerSnapshot();
      if (!isMountedRef.current) return;

      applyBaseSnapshot(data);
    } catch (err) {
      console.warn('Timer sync failed:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Sync failed');
      }
    }
  }, [applyBaseSnapshot]);

  // Listen for broadcasts from other tabs/components
  useEffect(() => {
    if (!broadcastChannel) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'timer-sync') {
        if (!isMountedRef.current) return;
        applyBaseSnapshot(event.data.data as TimerSnapshot);
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => {
      broadcastChannel?.removeEventListener('message', handleMessage);
    };
  }, [applyBaseSnapshot]);

  // Listen for visibility changes to refresh when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) return;
      // Tab became visible - sync immediately
      void syncFromBackend();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncFromBackend]);

  // Setup polling
  useEffect(() => {
    // Initial sync immediately
    void syncFromBackend();

    // Setup interval
    pollIntervalRef.current = setInterval(syncFromBackend, pollInterval);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [syncFromBackend, pollInterval]);

  // Live ticking from last known snapshot to prevent "stuck" timers using requestAnimationFrame for zero-lag UI
  useEffect(() => {
    let animationFrameId: number;
    let lastEventSec = -1;
    let lastChallengeSec = -1;
    let lastMode = '';
    let lastState = '';

    const tick = () => {
      // Always use the latest base snapshot if available, or a dummy one just for the event timer
      const base = baseSnapshotRef.current || ({
        mode: 'EVENT',
        state: 'IDLE',
        remainingSeconds: 86400,
        eventRemainingSeconds: 0
      } as TimerSnapshot);

      if (isMountedRef.current) {
        const live = buildLiveSnapshot(base);
        
        // Only emit if something meaningful changed to avoid render thrashes
        const hasChanged = 
          live.eventRemainingSeconds !== lastEventSec || 
          live.remainingSeconds !== lastChallengeSec ||
          live.mode !== lastMode ||
          live.state !== lastState;

        if (hasChanged) {
          emitSnapshot(live);
          lastEventSec = live.eventRemainingSeconds;
          lastChallengeSec = live.remainingSeconds;
          lastMode = live.mode;
          lastState = live.state;
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [buildLiveSnapshot, emitSnapshot]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return { snapshot, error };
};
