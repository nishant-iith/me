// React Query custom hooks for data fetching with caching
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, fetchPost } from '../services/hashnode';
import { fetchContributions } from '../services/github';
import { fetchLeetCodeContributions } from '../services/leetcode';
import { fetchCodeforcesContributions } from '../services/codeforces';

const HASHNODE_HOST = 'lets-learn-cs.hashnode.dev';

// Hashnode Posts Hook
export function useHashnodePosts(first = 10) {
    return useQuery({
        queryKey: ['hashnode', 'posts', first],
        queryFn: () => fetchPosts(HASHNODE_HOST, first),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime in v5)
    });
}

// Single Hashnode Post Hook
export function useHashnodePost(slug) {
    return useQuery({
        queryKey: ['hashnode', 'post', slug],
        queryFn: () => fetchPost(HASHNODE_HOST, slug),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        enabled: !!slug,
    });
}

// Prefetch single post on hover
export function usePrefetchPost() {
    const queryClient = useQueryClient();
    
    return (slug) => {
        queryClient.prefetchQuery({
            queryKey: ['hashnode', 'post', slug],
            queryFn: () => fetchPost(HASHNODE_HOST, slug),
            staleTime: 1000 * 60 * 5,
        });
    };
}

// GitHub Contributions Hook
export function useGitHubContributions(username) {
    return useQuery({
        queryKey: ['contributions', 'github', username],
        queryFn: () => fetchContributions(username),
        staleTime: 1000 * 60 * 60, // 1 hour (already has localStorage cache)
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        enabled: !!username,
    });
}

// LeetCode Contributions Hook
export function useLeetCodeContributions(username) {
    return useQuery({
        queryKey: ['contributions', 'leetcode', username],
        queryFn: () => fetchLeetCodeContributions(username),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!username,
    });
}

// Codeforces Contributions Hook
export function useCodeforcesContributions(handle) {
    return useQuery({
        queryKey: ['contributions', 'codeforces', handle],
        queryFn: () => fetchCodeforcesContributions(handle),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!handle,
    });
}
