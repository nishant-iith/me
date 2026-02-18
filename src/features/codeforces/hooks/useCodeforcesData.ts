import { useQuery } from '@tanstack/react-query';
import { codeforcesApi, CODEFORCES_USERNAME } from '../api/codeforcesApi';
import type { CodeforcesData } from '../types';

const DEFAULT_DATA: CodeforcesData = {
    contributions: [],
    total: 0,
    rating: 0,
    rank: ''
};

export const useCodeforcesData = (username = CODEFORCES_USERNAME) => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['codeforces', 'data', username],
        queryFn: () => codeforcesApi.getData(username),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: 1,
    });

    return {
        data: isError ? DEFAULT_DATA : (data ?? DEFAULT_DATA),
        isLoading,
        isError
    };
};
