import { useQuery, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi';

const HASHNODE_HOST = 'lets-learn-cs.hashnode.dev';

export const useBlogPosts = (first: number = 10) => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['blog', 'posts', HASHNODE_HOST, first],
        queryFn: () => blogApi.getPosts(HASHNODE_HOST, first),
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60 * 24,
        retry: 1,
    });

    return {
        data: isError ? [] : (data ?? []),
        isLoading,
        isError
    };
};

export const useBlogPost = (slug: string) => {
    const { data, isError, isFetching, error } = useQuery({
        queryKey: ['blog', 'post', HASHNODE_HOST, slug],
        queryFn: () => blogApi.getPost(HASHNODE_HOST, slug),
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60 * 24,
        retry: 1,
        enabled: !!slug,
    });

    return {
        data: isError ? null : data,
        isFetching,
        error: isError ? error : null
    };
};

export const usePrefetchBlogPost = () => {
    const queryClient = useQueryClient();

    return (slug: string) => {
        queryClient.prefetchQuery({
            queryKey: ['blog', 'post', HASHNODE_HOST, slug],
            queryFn: () => blogApi.getPost(HASHNODE_HOST, slug),
            staleTime: 1000 * 60 * 30,
        });
    };
};
