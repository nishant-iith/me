export interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number;
    staleTtl?: number;
}

class RequestDeduplicator {
    private inFlightRequests = new Map<string, Promise<any>>();

    async dedupe<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
        if (this.inFlightRequests.has(key)) {
            return this.inFlightRequests.get(key)!;
        }

        const promise = requestFn().finally(() => {
            this.inFlightRequests.delete(key);
        });

        this.inFlightRequests.set(key, promise);
        return promise;
    }
}

export const requestDeduplicator = new RequestDeduplicator();

export const cacheUtils = {
    set: <T>(key: string, data: T, ttlHours = 24, staleTtlHours = 168): void => {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttlHours * 60 * 60 * 1000,
            staleTtl: staleTtlHours * 60 * 60 * 1000
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    get: <T>(key: string): T | null => {
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        try {
            const item: CacheItem<T> = JSON.parse(raw);
            const now = Date.now();

            if (now - item.timestamp > item.ttl) {
                localStorage.removeItem(key);
                return null;
            }

            return item.data;
        } catch (e) {
            localStorage.removeItem(key);
            return null;
        }
    },

    getWithStaleFallback: <T>(key: string): { data: T | null; isStale: boolean } => {
        const raw = localStorage.getItem(key);
        if (!raw) return { data: null, isStale: false };

        try {
            const item: CacheItem<T> = JSON.parse(raw);
            const now = Date.now();
            const age = now - item.timestamp;

            if (age > (item.staleTtl || item.ttl * 7)) {
                localStorage.removeItem(key);
                return { data: null, isStale: false };
            }

            const isStale = age > item.ttl;
            return { data: item.data, isStale };
        } catch (e) {
            localStorage.removeItem(key);
            return { data: null, isStale: false };
        }
    },

    remove: (key: string): void => {
        localStorage.removeItem(key);
    }
};

export class RateLimiter {
    private lastRequestTime = 0;
    private minInterval: number;

    constructor(requestsPerSecond = 2) {
        this.minInterval = 1000 / requestsPerSecond;
    }

    async throttle<T>(fn: () => Promise<T>): Promise<T> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const delayNeeded = this.minInterval - timeSinceLastRequest;

        if (delayNeeded > 0) {
            await new Promise(resolve => setTimeout(resolve, delayNeeded));
        }

        this.lastRequestTime = Date.now();
        return fn();
    }
}

export const apiRateLimiter = new RateLimiter(0.33); // 1 request every 3 seconds
