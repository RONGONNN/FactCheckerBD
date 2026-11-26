export interface LimitDecision {
  allowed: boolean;
  retryAfterSeconds: number;
}

// Expired windows are swept once the map grows past this size.
const SWEEP_SIZE = 10_000;

/** Fixed-window counter kept in memory: it starts again when the server restarts. */
export function createRateLimiter(limit: number, windowMs: number, now: () => number = Date.now) {
  const windows = new Map<string, { count: number; resetAt: number }>();

  return {
    take(key: string): LimitDecision {
      const time = now();
      if (windows.size >= SWEEP_SIZE) {
        for (const [name, window] of windows) {
          if (window.resetAt <= time) windows.delete(name);
        }
      }

      let window = windows.get(key);
      if (!window || window.resetAt <= time) {
        window = { count: 0, resetAt: time + windowMs };
        windows.set(key, window);
      }
      const allowed = window.count < limit;
      if (allowed) window.count += 1;
      return { allowed, retryAfterSeconds: Math.ceil((window.resetAt - time) / 1000) };
    },
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
