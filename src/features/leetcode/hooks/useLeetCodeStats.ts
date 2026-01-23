import { useSuspenseQuery } from '@tanstack/react-query';
import { leetcodeApi, LEETCODE_USERNAME } from '../api/leetcodeApi';

export const useLeetCodeStats = (username = LEETCODE_USERNAME) => {
    return useSuspenseQuery({
        queryKey: ['leetcode', 'stats', username],
        queryFn: () => leetcodeApi.getStats(username),
    });
};
