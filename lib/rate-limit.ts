// Simple in-memory rate limiter for serverless/edge environments
// For production, use Redis-based rate limiting (e.g., Upstash Redis)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}

interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetAt: number } {
  const { limit = 5, windowMs = 15 * 60 * 1000 } = options; // 5 requests per 15 minutes by default

  cleanup();

  const now = Date.now();
  const key = `rl:${identifier}`;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, newEntry);
    return { success: true, remaining: limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
