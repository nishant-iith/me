import axios from 'axios';
import { LeetCodeData } from '../types';
import { cacheUtils, requestDeduplicator, apiRateLimiter } from '../../../utils/cacheUtils';

export const LEETCODE_USERNAME = 'Nishant-iith';
const CACHE_KEY = `leetcode_stats_${LEETCODE_USERNAME}`;
const REQUEST_KEY = 'leetcode_api_request';

const fetchLeetCodeData = async (username: string): Promise<LeetCodeData> => {
    // Serialize requests to avoid hitting rate limits
    const calendarRes = await apiRateLimiter.throttle(async () => {
        return axios.get(`https://alfa-leetcode-api.onrender.com/${username}/calendar`);
    });
    
    const solvedRes = await apiRateLimiter.throttle(async () => {
        return axios.get(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
    });

    const calendar = calendarRes.data.submissionCalendar ? JSON.parse(calendarRes.data.submissionCalendar) : {};
    const contributions = Object.entries(calendar).map(([ts, count]) => ({
        date: new Date(parseInt(ts) * 1000).toISOString().split('T')[0],
        count: Number(count)
    }));

    return {
        contributions,
        totalActiveDays: calendarRes.data.totalActiveDays || contributions.length,
        solvedProblem: solvedRes.data.solvedProblem || 0
    };
};

export const leetcodeApi = {
    getStats: async (username = LEETCODE_USERNAME): Promise<LeetCodeData> => {
        // Check for fresh cache first
        const cached = cacheUtils.get<LeetCodeData>(CACHE_KEY);
        if (cached && username === LEETCODE_USERNAME) {
            return cached;
        }

        // For non-default usernames, skip cache
        if (username !== LEETCODE_USERNAME) {
            return fetchLeetCodeData(username);
        }

        return requestDeduplicator.dedupe(REQUEST_KEY, async () => {
            // Check for stale cache as fallback
            const staleCache = cacheUtils.getWithStaleFallback<LeetCodeData>(CACHE_KEY);
            
            try {
                const result = await fetchLeetCodeData(username);
                // Cache for 48 hours with 30-day stale fallback
                cacheUtils.set(CACHE_KEY, result, 48, 720);
                return result;
            } catch (error) {
                // If API fails, use stale cache even if it's old
                if (staleCache.data) {
                    return staleCache.data;
                }
                throw error;
            }
        });
    }
};
