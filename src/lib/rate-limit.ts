type Bucket = { count: number; resetAt: number };

/** Limitador en memoria por instancia. Suficiente para tráfico inicial (ver RIESGOS R7). */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return {
    check(key: string, now = Date.now()): { ok: boolean; remaining: number } {
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        if (buckets.size > 5000) {
          for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
        }
        return { ok: true, remaining: limit - 1 };
      }
      if (bucket.count >= limit) return { ok: false, remaining: 0 };
      bucket.count += 1;
      return { ok: true, remaining: limit - bucket.count };
    },
    reset() {
      buckets.clear();
    },
  };
}

export const contactRateLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
