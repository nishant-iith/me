import axios from 'axios';
import { LeetCodeData } from '../types';

export const LEETCODE_USERNAME = 'Nishant-iith';

export const leetcodeApi = {
    getStats: async (username = LEETCODE_USERNAME): Promise<LeetCodeData> => {
        const [calendarRes, solvedRes] = await Promise.all([
            axios.get(`https://alfa-leetcode-api.onrender.com/${username}/calendar`),
            axios.get(`https://alfa-leetcode-api.onrender.com/${username}/solved`)
        ]);

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
    }
};
