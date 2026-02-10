import { HashnodePost } from '../types';

// Blog API requests are proxied through our Cloudflare Worker
// The Hashnode token is stored server-side as a Worker secret — never exposed to the client
const BLOG_PROXY_API = 'https://blog-proxy.iith-nishant.workers.dev';

export const blogApi = {
    getPosts: async (host: string, first: number = 10): Promise<HashnodePost[]> => {
        try {
            const response = await fetch(BLOG_PROXY_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'GetPosts',
                    variables: { host, first },
                }),
            });

            if (!response.ok) {
                throw new Error(`Blog proxy returned ${response.status}`);
            }

            const data = await response.json();

            if (data.errors) {
                console.error('Blog API Error:', data.errors);
                return [];
            }

            return data.data?.publication?.posts?.edges?.map((edge: any) => edge.node) || [];
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            return [];
        }
    },

    getPost: async (host: string, slug: string): Promise<HashnodePost | null> => {
        try {
            const response = await fetch(BLOG_PROXY_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'GetPost',
                    variables: { host, slug },
                }),
            });

            if (!response.ok) {
                throw new Error(`Blog proxy returned ${response.status}`);
            }

            const data = await response.json();

            if (data.errors) {
                console.error('Blog API Error:', data.errors);
                return null;
            }

            return data.data?.publication?.post || null;
        } catch (error) {
            console.error('Failed to fetch post:', error);
            return null;
        }
    }
};
