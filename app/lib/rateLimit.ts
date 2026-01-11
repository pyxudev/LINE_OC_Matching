const store = new Map<string, { count: number; time: number }>();

export function rateLimit(key: string, limit = 5, interval = 60_000) {
  const now = Date.now();
  const record = store.get(key);

  if (!record) {
    store.set(key, { count: 1, time: now });
    return;
  }

  if (now - record.time > interval) {
    store.set(key, { count: 1, time: now });
    return;
  }

  if (record.count >= limit) {
    throw new Error("Too many requests");
  }

  record.count++;
}