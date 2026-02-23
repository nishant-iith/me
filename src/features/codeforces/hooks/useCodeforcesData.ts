import { useSuspenseQuery } from '@tanstack/react-query';
import { codeforcesApi, CODEFORCES_USERNAME } from '../api/codeforcesApi';
import type { CodeforcesData } from '../types';

const DEFAULT_DATA: CodeforcesData = {
    contributions: [],
    total: 0,
    rating: 0,
    rank: ''
};

export const useCodeforcesData = (username = CODEFORCES_USERNAME) => {
    const { data } = useSuspenseQuery({
        queryKey: ['codeforces', 'data', username],
        queryFn: async () => {
            try {
                return await codeforcesApi.getData(username);
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
