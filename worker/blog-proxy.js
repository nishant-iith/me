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

// --- RSS fallback -----------------------------------------------------------
// Hashnode retired free GraphQL API access (May 2026): gql.hashnode.com now
// redirects to an HTML announcement page, so the JSON parse of the upstream
// response throws. The publication's RSS feed stays public and tokenless, so
// when GraphQL fails we map RSS items to the same shape the client expects.

const RSS_URL = `https://${HASHNODE_HOST}/rss.xml`;

const decodeXml = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
   .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');

const stripHtml = (html) =>
  decodeXml(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());

// Extract the first CDATA (or plain text) inside a tag within an XML chunk
const tagValue = (chunk, tag) => {
  const match = chunk.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tag}>`));
  if (!match) return '';
  return (match[1] ?? match[2] ?? '').trim();
};

const rssItemToPost = (item) => {
  const link = tagValue(item, 'link');
  const slug = link.split('/').filter(Boolean).pop() || '';
  const title = decodeXml(tagValue(item, 'title'));
  const brief = stripHtml(tagValue(item, 'description'));
  const html = tagValue(item, 'content:encoded');
  const pubDate = tagValue(item, 'pubDate');
  const parsedDate = pubDate ? new Date(pubDate) : null;
  const categories = [...item.matchAll(/<category[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/category>/g)]
    .map((m) => decodeXml((m[1] ?? m[2] ?? '').trim()))
    .filter(Boolean);
  const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;

  return {
    id: tagValue(item, 'guid') || link,
    slug,
    title,
    brief,
    publishedAt: parsedDate && !isNaN(parsedDate) ? parsedDate.toISOString() : '',
    readTimeInMinutes: Math.max(1, Math.round(wordCount / 200)),
    tags: categories.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-') })),
    coverImage: null,
    content: { html }
  };
};

async function fetchRSSFallback(operation, variables) {
  try {
    const response = await fetch(RSS_URL);
    if (!response.ok) return null;
    const xml = await response.text();
    const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => rssItemToPost(m[1]));

    if (operation === 'GetPosts') {
      const first = variables.first || 10;
      return { data: { publication: { posts: { edges: posts.slice(0, first).map((node) => ({ node })) } } } };
    }
    if (operation === 'GetPost') {
      return { data: { publication: { post: posts.find((p) => p.slug === variables.slug) || null } } };
    }
    return null;
  } catch (error) {
    console.error('RSS fallback error:', error);
    return null;
  }
}

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

    // NOTE: KV-based IP rate limiting (e.g. 20 req/min) would go here, but this
    // worker currently has no KV binding configured. To enable it, bind a KV
    // namespace (e.g. BLOG_KV) in wrangler.toml and add the rate limiting block
    // using env.BLOG_KV similarly to how view-counter.js uses env.VIEW_COUNTER.

    // Limit request body size to prevent abuse (GraphQL queries are small)
    const contentLength = parseInt(request.headers.get('content-length') || '0');
    if (contentLength > 10000) {
      return new Response(JSON.stringify({ error: 'Request too large' }), {
        status: 413,
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

      try {
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
          throw new Error(`Hashnode API error: ${hashnodeResponse.status}`);
        }

        const data = await hashnodeResponse.json();

        // Check for GraphQL errors without valid data
        if (data.errors && !data.data) {
          throw new Error('Hashnode GraphQL error: ' + JSON.stringify(data.errors));
        }

        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            'Cache-Control': 'public, max-age=300, s-maxage=600'
          }
        });
      } catch (gqlError) {
        // GraphQL is unavailable (Hashnode made the API paid in May 2026) —
        // fall back to the publication's public RSS feed.
        console.error('GraphQL failed, falling back to RSS:', gqlError);
        const rssData = await fetchRSSFallback(body.operation, body.variables);
        if (!rssData) {
          return new Response(JSON.stringify({ error: 'Upstream API error' }), {
            status: 502,
            headers: corsHeaders
          });
        }
        return new Response(JSON.stringify(rssData), {
          headers: {
            ...corsHeaders,
            'Cache-Control': 'public, max-age=300, s-maxage=600'
          }
        });
      }

    } catch (error) {
      console.error('Blog proxy error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
