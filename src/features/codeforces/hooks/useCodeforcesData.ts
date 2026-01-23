import { useSuspenseQuery } from '@tanstack/react-query';
import { codeforcesApi, CODEFORCES_USERNAME } from '../api/codeforcesApi';

export const useCodeforcesData = (username = CODEFORCES_USERNAME) => {
    return useSuspenseQuery({
        queryKey: ['codeforces', 'data', username],
        queryFn: () => codeforcesApi.getData(username),
    });
};
