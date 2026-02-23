import { useSuspenseQuery } from '@tanstack/react-query';
import { leetcodeApi, LEETCODE_USERNAME } from '../api/leetcodeApi';
import type { LeetCodeData } from '../types';

const DEFAULT_DATA: LeetCodeData = {
    contributions: [],
    totalActiveDays: 0,
    solvedProblem: 0
};

export const useLeetCodeStats = (username = LEETCODE_USERNAME) => {
    const { data } = useSuspenseQuery({
        queryKey: ['leetcode', 'stats', username],
        queryFn: async () => {
            try {
                return await leetcodeApi.getStats(username);
            } catch {
                return DEFAULT_DATA;
            }
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: 0,
    });

    return {
        data: data ?? DEFAULT_DATA,
    };
};
