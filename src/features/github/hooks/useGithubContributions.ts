import { useSuspenseQuery } from '@tanstack/react-query';
import { githubApi, GITHUB_USERNAME } from '../api/githubApi';

export const useGithubContributions = (username = GITHUB_USERNAME) => {
    return useSuspenseQuery({
        queryKey: ['github', 'contributions', username],
        queryFn: () => githubApi.getContributions(username),
    });
};
