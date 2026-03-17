import { useQuery } from '@tanstack/react-query';
import { leetcodeApi, LEETCODE_USERNAME } from '../api/leetcodeApi';
import type { LeetCodeData } from '../types';

const DEFAULT_DATA: LeetCodeData = {
    contributions: [],
    totalActiveDays: 0,
    solvedProblem: 0
};

export const useLeetCodeStats = (username = LEETCODE_USERNAME) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['leetcode', 'stats', username],
        queryFn: () => leetcodeApi.getStats(username),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: 2,
    });

    return {
        data: data ?? DEFAULT_DATA,
        isLoading,
        error,
    };
};
