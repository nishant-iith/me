import { HashnodePost } from '../types';

const HASHNODE_API = 'https://gql.hashnode.com/';
const HASHNODE_TOKEN = import.meta.env.VITE_HASHNODE_TOKEN;

const GET_POSTS = `
  query GetPosts($host: String!, $first: Int!) {
    publication(host: $host) {
      posts(first: $first) {
        edges {
          node {
            id
            slug
            title
            brief
            publishedAt
            readTimeInMinutes
            tags {
              name
              slug
            }
            coverImage {
              url
            }
            content {
              html
            }
          }
        }
      }
    }
  }
`;

const GET_POST = `
  query GetPost($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id
        slug
        title
        brief
        publishedAt
        readTimeInMinutes
        tags {
          name
          slug
        }
        coverImage {
          url
        }
        content {
          html
        }
      }
    }
  }
`;

export const blogApi = {
    getPosts: async (host: string, first: number = 10): Promise<HashnodePost[]> => {
        try {
            const response = await fetch(HASHNODE_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': HASHNODE_TOKEN || '',
                },
                body: JSON.stringify({
                    query: GET_POSTS,
                    variables: { host, first },
                }),
            });

            const data = await response.json();

            if (data.errors) {
                console.error('Hashnode API Error:', data.errors);
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
            const response = await fetch(HASHNODE_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': HASHNODE_TOKEN || '',
                },
                body: JSON.stringify({
                    query: GET_POST,
                    variables: { host, slug },
                }),
            });

            const data = await response.json();

            if (data.errors) {
                console.error('Hashnode API Error:', data.errors);
                return null;
            }

            return data.data?.publication?.post || null;
        } catch (error) {
            console.error('Failed to fetch post:', error);
            return null;
        }
    }
};
