import axios from 'axios';
import { CodeforcesData } from '../types';
import { cacheUtils, requestDeduplicator, apiRateLimiter } from '../../../utils/cacheUtils';

export const CODEFORCES_USERNAME = 'so-called-iitian';
const CACHE_KEY = `codeforces_data_${CODEFORCES_USERNAME}`;
const REQUEST_KEY = 'codeforces_api_request';

interface CodeforcesSubmission {
    creationTimeSeconds: number;
    verdict?: string;
    problem?: {
        contestId?: number;
        index?: string;
        name?: string;
    };
}

interface CodeforcesUser {
    handle: string;
    rating?: number;
    rank?: string;
}

interface CodeforcesStatusResponse {
    status: string;
    result?: CodeforcesSubmission[];
}

interface CodeforcesInfoResponse {
    status: string;
    result?: CodeforcesUser[];
}

interface ContributionEntry {
    date: string;
    count: number;
}

const fetchCodeforcesData = async (username: string): Promise<CodeforcesData> => {
    return apiRateLimiter.throttle(async () => {
        const [statusRes, infoRes] = await Promise.all([
            axios.get<CodeforcesStatusResponse>(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`),
            axios.get<CodeforcesInfoResponse>(`https://codeforces.com/api/user.info?handles=${username}`)
        ]);

        let contributions: ContributionEntry[] = [];
        let total = 0;
        let rating = 0;
        let rank = '';

        if (statusRes.data.status === 'OK' && statusRes.data.result) {
            const dateMap: Record<string, number> = {};
            statusRes.data.result.forEach((sub) => {
                const dateStr = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
                dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
            });
            contributions = Object.entries(dateMap).map(([date, count]) => ({ date, count }));

            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            total = contributions
                .filter(c => new Date(c.date) >= oneYearAgo)
                .reduce((s, d) => s + d.count, 0);
        }

        if (infoRes.data.status === 'OK' && infoRes.data.result && infoRes.data.result.length > 0) {
            const user = infoRes.data.result[0];
            rating = user.rating || 0;
            rank = user.rank ? user.rank.replace(/^\w/, (c: string) => c.toUpperCase()) : '';
        }

        return { contributions, total, rating, rank };
    });
};

export const codeforcesApi = {
    getData: async (username = CODEFORCES_USERNAME): Promise<CodeforcesData> => {
        const cached = cacheUtils.get<CodeforcesData>(CACHE_KEY);
        if (cached && username === CODEFORCES_USERNAME) {
            return cached;
        }

        if (username !== CODEFORCES_USERNAME) {
            return fetchCodeforcesData(username);
        }

        return requestDeduplicator.dedupe(REQUEST_KEY, async () => {
            const staleCache = cacheUtils.getWithStaleFallback<CodeforcesData>(CACHE_KEY);
            
            try {
                const result = await fetchCodeforcesData(username);
                cacheUtils.set(CACHE_KEY, result, 24, 168);
                return result;
            } catch (error) {
                if (staleCache.data) {
                    return staleCache.data;
                }
                throw error;
            }
        });
    }
};
