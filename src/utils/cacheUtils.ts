export interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number; // in milliseconds
}

export const cacheUtils = {
    set: <T>(key: string, data: T, ttlHours = 24): void => {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttlHours * 60 * 60 * 1000
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
    }
};
