// Cloudflare Worker for proxying Hashnode GraphQL API
// Keeps the Hashnode API token server-side, never exposed to the client
// Uses predefined queries — clients specify an operation + variables, not raw GraphQL

const ALLOWED_ORIGINS = [
  'https://nishant-sde.pages.dev',
  'https://nishant-sde.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const HASHNODE_API = 'https://gql.hashnode.com/';
const HASHNODE_HOST = 'lets-learn-cs.hashnode.dev';

// Predefined queries — the client cannot send arbitrary GraphQL
const QUERIES = {
  GetPosts: {
    query: `query GetPosts($host: String!, $first: Int!) { publication(host: $host) { posts(first: $first) { edges { node { id slug title brief publishedAt readTimeInMinutes tags { name slug } coverImage { url } content { html } } } } } }`,
    validate: (vars) => {
      if (vars.host !== HASHNODE_HOST) return 'Invalid host';
      if (typeof vars.first !== 'number' || vars.first < 1 || vars.first > 50) return 'Invalid first parameter';
      return null;
    }
  },
  GetPost: {
    query: `query GetPost($host: String!, $slug: String!) { publication(host: $host) { post(slug: $slug) { id slug title brief publishedAt readTimeInMinutes tags { name slug } coverImage { url } content { html } } } }`,
    validate: (vars) => {
      if (vars.host !== HASHNODE_HOST) return 'Invalid host';
      if (typeof vars.slug !== 'string' || vars.slug.length === 0 || vars.slug.length > 200) return 'Invalid slug';
      // Only allow alphanumeric, hyphens, and underscores in slugs
      if (!/^[a-zA-Z0-9_-]+$/.test(vars.slug)) return 'Invalid slug format';
      return null;
    }
  }
};

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get('Origin');

    // Strict CORS: reject unknown origins
    if (requestOrigin && !ALLOWED_ORIGINS.includes(requestOrigin)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const corsHeaders = {
      ...(requestOrigin && { 'Access-Control-Allow-Origin': requestOrigin }),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Content-Type': 'application/json'
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only POST allowed
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const body = await request.json();

      // Client sends: { operation: "GetPosts", variables: { host: "...", first: 10 } }
      if (!body || !body.operation || !body.variables) {
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Look up the predefined query
      const queryDef = QUERIES[body.operation];
      if (!queryDef) {
        return new Response(JSON.stringify({ error: 'Unknown operation' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Validate variables
      const validationError = queryDef.validate(body.variables);
      if (validationError) {
        return new Response(JSON.stringify({ error: validationError }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Build upstream request with server-side query and token
      const upstreamHeaders = { 'Content-Type': 'application/json' };
      if (env.HASHNODE_TOKEN) {
        upstreamHeaders['Authorization'] = env.HASHNODE_TOKEN;
      }

      const hashnodeResponse = await fetch(HASHNODE_API, {
        method: 'POST',
        headers: upstreamHeaders,
        body: JSON.stringify({
          query: queryDef.query,
          variables: body.variables,
          operationName: body.operation
        })
      });

      if (!hashnodeResponse.ok) {
        console.error('Hashnode API error:', hashnodeResponse.status);
        return new Response(JSON.stringify({ error: 'Upstream API error' }), {
          status: 502,
          headers: corsHeaders
        });
      }

      const data = await hashnodeResponse.json();

      // Check for GraphQL errors without valid data
      if (data.errors && !data.data) {
        console.error('Hashnode GraphQL error:', JSON.stringify(data.errors));
        return new Response(JSON.stringify({
          errors: [{ message: 'GraphQL query error' }]
        }), {
          status: 200,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Cache-Control': 'public, max-age=300, s-maxage=600'
        }
      });

    } catch (error) {
      console.error('Blog proxy error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
