import axios from 'axios';
import { CodeforcesData } from '../types';

export const CODEFORCES_USERNAME = 'so-called-iitian';

export const codeforcesApi = {
    getData: async (username = CODEFORCES_USERNAME): Promise<CodeforcesData> => {
        const [statusRes, infoRes] = await Promise.all([
            axios.get(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`),
            axios.get(`https://codeforces.com/api/user.info?handles=${username}`)
        ]);

        let contributions: any[] = [];
        let total = 0;
        let rating = 0;
        let rank = '';

        if (statusRes.data.status === 'OK') {
            const dateMap: Record<string, number> = {};
            statusRes.data.result.forEach((sub: any) => {
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

        if (infoRes.data.status === 'OK' && infoRes.data.result.length > 0) {
            const user = infoRes.data.result[0];
            rating = user.rating || 0;
            rank = user.rank ? user.rank.replace(/^\w/, (c: string) => c.toUpperCase()) : '';
        }

        return { contributions, total, rating, rank };
    }
};
