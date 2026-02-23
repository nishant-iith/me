import { useSuspenseQuery } from '@tanstack/react-query';
import { githubApi, GITHUB_USERNAME } from '../api/githubApi';
import type { GithubContributions } from '../types';

const DEFAULT_DATA: GithubContributions = {
    totalContributions: 0,
    contributions: []
};

export const useGithubContributions = (username = GITHUB_USERNAME) => {
    const { data } = useSuspenseQuery({
        queryKey: ['github', 'contributions', username],
        queryFn: async () => {
            try {
                return await githubApi.getContributions(username);
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
