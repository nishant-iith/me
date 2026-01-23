import axios from 'axios';
import { LeetCodeData } from '../types';
import { cacheUtils } from '../../../utils/cacheUtils';

export const LEETCODE_USERNAME = 'Nishant-iith';
const CACHE_KEY = `leetcode_stats_${LEETCODE_USERNAME}`;

export const leetcodeApi = {
    getStats: async (username = LEETCODE_USERNAME): Promise<LeetCodeData> => {
        const cached = cacheUtils.get<LeetCodeData>(CACHE_KEY);
        if (cached && username === LEETCODE_USERNAME) return cached;

        const [calendarRes, solvedRes] = await Promise.all([
            axios.get(`https://alfa-leetcode-api.onrender.com/${username}/calendar`),
            axios.get(`https://alfa-leetcode-api.onrender.com/${username}/solved`)
        ]);

        const calendar = calendarRes.data.submissionCalendar ? JSON.parse(calendarRes.data.submissionCalendar) : {};
        const contributions = Object.entries(calendar).map(([ts, count]) => ({
            date: new Date(parseInt(ts) * 1000).toISOString().split('T')[0],
            count: Number(count)
        }));

        const result = {
            contributions,
            totalActiveDays: calendarRes.data.totalActiveDays || contributions.length,
            solvedProblem: solvedRes.data.solvedProblem || 0
        };

        if (username === LEETCODE_USERNAME) {
            cacheUtils.set(CACHE_KEY, result);
        }
        return result;
    }
};
