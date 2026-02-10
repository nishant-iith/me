// Cloudflare Worker for view counter API
// Save this as: worker/view-counter.js

// Allowed origins - restrict to your domains
const ALLOWED_ORIGINS = [
  'https://nishant-sde.pages.dev',
  'https://nishant-sde.vercel.app',
  'http://localhost:5173',  // Development
  'http://localhost:3000'   // Alternative dev port
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Get the origin from request
    const requestOrigin = request.headers.get('Origin');
    
    // Strict CORS: reject unknown origins entirely
    if (requestOrigin && !ALLOWED_ORIGINS.includes(requestOrigin)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // CORS headers - only set if origin is allowed
    const corsHeaders = {
      ...(requestOrigin && { 'Access-Control-Allow-Origin': requestOrigin }),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
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
        const now = Date.now();
        const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
        const userAgent = request.headers.get('User-Agent') || '';
        const referer = request.headers.get('Referer') || '';
        const country = request.headers.get('CF-IPCountry') || '';

        // Track total requests (for monitoring)
        const totalRequests = parseInt(await env.VIEW_COUNTER.get('stats:total_requests') || '0');
        await env.VIEW_COUNTER.put('stats:total_requests', (totalRequests + 1).toString());

        // Layer 1: Basic validation checks
        if (!clientIP || clientIP === 'unknown') {
          return new Response(JSON.stringify({
            error: 'Unable to identify client',
            code: 'INVALID_REQUEST'
          }), { status: 400, headers: corsHeaders });
        }

        // Layer 2: User-Agent validation (block obvious bots)
        const suspiciousPatterns = [
          /bot/i, /spider/i, /crawler/i, /scraper/i,
          /python/i, /curl/i, /wget/i, /postman/i,
          /insomnia/i, /^$/
        ];

        if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
          console.log(`Blocked suspicious User-Agent: ${userAgent} from ${clientIP}`);
          const views = await env.VIEW_COUNTER.get('total_views') || '0';
          const blockedCount = parseInt(await env.VIEW_COUNTER.get('stats:blocked') || '0');
          await env.VIEW_COUNTER.put('stats:blocked', (blockedCount + 1).toString());
          return new Response(JSON.stringify({
            views: parseInt(views),
            timestamp: now
          }), { headers: corsHeaders });
        }

        // Layer 3: Geographic filtering (optional - block known VPN/proxy countries)
        const blockedCountries = ['T1', 'XX']; // T1 = Tor, XX = Unknown
        if (blockedCountries.includes(country)) {
          console.log(`Blocked request from ${country}: ${clientIP}`);
          const views = await env.VIEW_COUNTER.get('total_views') || '0';
          const blockedCount = parseInt(await env.VIEW_COUNTER.get('stats:blocked') || '0');
          await env.VIEW_COUNTER.put('stats:blocked', (blockedCount + 1).toString());
          return new Response(JSON.stringify({
            views: parseInt(views),
            timestamp: now
          }), { headers: corsHeaders });
        }

        // Layer 4: Enhanced rate limiting with multiple tiers
        const rateLimitKeys = [
          `rate_limit:ip:${clientIP}`,           // Per IP: 1 per minute
          `rate_limit:ip_hourly:${clientIP}`,    // Per IP: 10 per hour
          `rate_limit:ua:${userAgent}`,          // Per User-Agent: 5 per minute
          `rate_limit:global`                    // Global: 100 per minute
        ];

        const limits = [
          { key: rateLimitKeys[0], maxRequests: 1, windowMs: 60000 },     // 1 per minute per IP
          { key: rateLimitKeys[1], maxRequests: 10, windowMs: 3600000 },   // 10 per hour per IP
          { key: rateLimitKeys[2], maxRequests: 5, windowMs: 60000 },      // 5 per minute per UA
          { key: rateLimitKeys[3], maxRequests: 100, windowMs: 60000 }     // 100 per minute global
        ];

        // Check all rate limits
        for (const limit of limits) {
          const currentCount = parseInt(await env.VIEW_COUNTER.get(limit.key) || '0');
          if (currentCount >= limit.maxRequests) {
            const views = await env.VIEW_COUNTER.get('total_views') || '0';
            const blockedCount = parseInt(await env.VIEW_COUNTER.get('stats:blocked') || '0');
            await env.VIEW_COUNTER.put('stats:blocked', (blockedCount + 1).toString());
            console.log(`Rate limit exceeded for ${limit.key}: ${currentCount}/${limit.maxRequests}`);
            return new Response(JSON.stringify({
              views: parseInt(views),
              timestamp: now
            }), {
              status: 429,
              headers: {
                ...corsHeaders,
                'Retry-After': Math.ceil(limit.windowMs / 1000).toString()
              }
            });
          }
        }

        // Layer 5: Request fingerprinting (detect rapid-fire requests)
        const fingerprint = `${clientIP}:${userAgent.substring(0, 50)}`;
        // Create a simple hash for the fingerprint key
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
          const char = fingerprint.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        const fingerprintKey = `fingerprint:${Math.abs(hash).toString(36)}`;
        const fingerprintData = await env.VIEW_COUNTER.get(fingerprintKey);

        if (fingerprintData) {
          const data = JSON.parse(fingerprintData);
          const timeDiff = now - data.lastRequest;
          const requestCount = data.count + 1;

          // If more than 3 requests in 10 seconds, suspicious
          if (requestCount > 3 && timeDiff < 10000) {
            console.log(`Suspicious fingerprint pattern: ${requestCount} requests in ${timeDiff}ms`);
            const views = await env.VIEW_COUNTER.get('total_views') || '0';
            const blockedCount = parseInt(await env.VIEW_COUNTER.get('stats:blocked') || '0');
            await env.VIEW_COUNTER.put('stats:blocked', (blockedCount + 1).toString());
            return new Response(JSON.stringify({
              views: parseInt(views),
              timestamp: now
            }), { headers: corsHeaders });
          }

          // Update fingerprint data
          await env.VIEW_COUNTER.put(fingerprintKey, JSON.stringify({
            count: requestCount,
            lastRequest: now
          }), { expirationTtl: 300 }); // 5 minutes
        } else {
          // First request from this fingerprint
          await env.VIEW_COUNTER.put(fingerprintKey, JSON.stringify({
            count: 1,
            lastRequest: now
          }), { expirationTtl: 300 });
        }

        // All checks passed - increment counter
        const currentViews = await env.VIEW_COUNTER.get('total_views') || '0';
        const newViews = parseInt(currentViews) + 1;

        // Update KV
        await env.VIEW_COUNTER.put('total_views', newViews.toString());

        // Update rate limit counters
        for (let i = 0; i < rateLimitKeys.length; i++) {
          const currentCount = parseInt(await env.VIEW_COUNTER.get(rateLimitKeys[i]) || '0');
          const ttl = limits[i].windowMs / 1000;
          await env.VIEW_COUNTER.put(rateLimitKeys[i], (currentCount + 1).toString(), { expirationTtl: ttl });
        }

        // Log successful increment
        console.log(`View incremented: ${newViews} from ${clientIP} (${country})`);

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
      // Log error internally (in production, use proper logging)
      console.error('Worker error:', error);
      
      // Return generic error message
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};
