import axios from 'axios';
import { GithubContributions } from '../types';
import { cacheUtils } from '../../../utils/cacheUtils';

export const GITHUB_USERNAME = 'nishant-iith';
const CACHE_KEY = `github_contributions_${GITHUB_USERNAME}`;

export const githubApi = {
    getContributions: async (username = GITHUB_USERNAME): Promise<GithubContributions> => {
        const cached = cacheUtils.get<GithubContributions>(CACHE_KEY);
        if (cached && username === GITHUB_USERNAME) return cached;

        const { data } = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        const result = {
            totalContributions: data.total?.lastYear || 0,
            contributions: data.contributions || []
        };

        if (username === GITHUB_USERNAME) {
            cacheUtils.set(CACHE_KEY, result);
        }
        return result;
    }
};
