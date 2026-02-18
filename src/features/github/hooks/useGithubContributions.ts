import { useQuery } from '@tanstack/react-query';
import { githubApi, GITHUB_USERNAME } from '../api/githubApi';
import type { GithubContributions } from '../types';

const DEFAULT_DATA: GithubContributions = {
    totalContributions: 0,
    contributions: []
};

export const useGithubContributions = (username = GITHUB_USERNAME) => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['github', 'contributions', username],
        queryFn: () => githubApi.getContributions(username),
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
