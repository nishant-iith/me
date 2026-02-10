// Cloudflare Worker for view counter API
// Save this as: worker/view-counter.js

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Get total views
      if (path === '/api/views' && request.method === 'GET') {
        const views = await env.VIEW_COUNTER.get('total_views') || '0';
        return new Response(JSON.stringify({ 
          views: parseInt(views),
          timestamp: Date.now()
        }), { headers: corsHeaders });
      }

      // Increment views
      if (path === '/api/views/increment' && request.method === 'POST') {
        // Get client IP for basic rate limiting (1 increment per IP per minute)
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        const rateLimitKey = `rate_limit:${clientIP}`;
        
        // Check rate limit
        const lastIncrement = await env.VIEW_COUNTER.get(rateLimitKey);
        const now = Date.now();
        
        if (lastIncrement && (now - parseInt(lastIncrement)) < 60000) {
          // Return current count without incrementing
          const views = await env.VIEW_COUNTER.get('total_views') || '0';
          return new Response(JSON.stringify({ 
            views: parseInt(views),
            timestamp: now,
            cached: true
          }), { headers: corsHeaders });
        }

        // Increment counter
        const currentViews = await env.VIEW_COUNTER.get('total_views') || '0';
        const newViews = parseInt(currentViews) + 1;
        
        // Update KV
        await env.VIEW_COUNTER.put('total_views', newViews.toString());
        await env.VIEW_COUNTER.put(rateLimitKey, now.toString(), { expirationTtl: 60 });

        return new Response(JSON.stringify({ 
          views: newViews,
          timestamp: now
        }), { headers: corsHeaders });
      }

      // 404 for unknown paths
      return new Response(JSON.stringify({ error: 'Not found' }), { 
        status: 404, 
        headers: corsHeaders 
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};
