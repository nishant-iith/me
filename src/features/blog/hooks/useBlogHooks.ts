import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi';

const HASHNODE_HOST = 'lets-learn-cs.hashnode.dev';

export const useBlogPosts = (first: number = 10) => {
    return useSuspenseQuery({
        queryKey: ['blog', 'posts', HASHNODE_HOST, first],
        queryFn: () => blogApi.getPosts(HASHNODE_HOST, first),
    });
};

export const useBlogPost = (slug: string) => {
    return useSuspenseQuery({
        queryKey: ['blog', 'post', HASHNODE_HOST, slug],
        queryFn: () => blogApi.getPost(HASHNODE_HOST, slug),
    });
};

export const usePrefetchBlogPost = () => {
    const queryClient = useQueryClient();

    return (slug: string) => {
        queryClient.prefetchQuery({
            queryKey: ['blog', 'post', HASHNODE_HOST, slug],
            queryFn: () => blogApi.getPost(HASHNODE_HOST, slug),
            staleTime: 1000 * 60 * 5,
        });
    };
};
