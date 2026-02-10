import axios from 'axios';
import { GithubContributions } from '../types';
import { cacheUtils, requestDeduplicator, apiRateLimiter } from '../../../utils/cacheUtils';

export const GITHUB_USERNAME = 'nishant-iith';
const CACHE_KEY = `github_contributions_${GITHUB_USERNAME}`;
const REQUEST_KEY = 'github_api_request';

const fetchGithubData = async (username: string): Promise<GithubContributions> => {
    return apiRateLimiter.throttle(async () => {
        const { data } = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        return {
            totalContributions: data.total?.lastYear || 0,
            contributions: data.contributions || []
        };
    });
};

export const githubApi = {
    getContributions: async (username = GITHUB_USERNAME): Promise<GithubContributions> => {
        const cached = cacheUtils.get<GithubContributions>(CACHE_KEY);
        if (cached && username === GITHUB_USERNAME) {
            return cached;
        }

        if (username !== GITHUB_USERNAME) {
            return fetchGithubData(username);
        }

        return requestDeduplicator.dedupe(REQUEST_KEY, async () => {
            const staleCache = cacheUtils.getWithStaleFallback<GithubContributions>(CACHE_KEY);
            
            try {
                const result = await fetchGithubData(username);
                cacheUtils.set(CACHE_KEY, result, 24, 168);
                return result;
            } catch (error) {
                if (staleCache.data) {
                    console.warn('GitHub API failed, using stale cache');
                    return staleCache.data;
                }
                throw error;
            }
        });
    }
};
