import axios from 'axios';
import { GithubContributions } from '../types';

export const GITHUB_USERNAME = 'nishant-iith';

export const githubApi = {
    getContributions: async (username = GITHUB_USERNAME): Promise<GithubContributions> => {
        const { data } = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        return {
            totalContributions: data.total?.lastYear || 0,
            contributions: data.contributions || []
        };
    }
};
