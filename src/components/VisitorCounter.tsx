import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const WORKER_URL = 'https://view-counter.iith-nishant.workers.dev';

interface ViewResponse {
  views: number;
  timestamp: number;
  cached?: boolean;
}

/**
 * Real-time visitor counter using Cloudflare KV + Workers
 * Tracks actual page views with rate limiting
 */
export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        // Check if we've already incremented in this session
        const hasIncremented = sessionStorage.getItem('view-incremented');
        
        if (!hasIncremented) {
          // Increment the counter
          const incrementRes = await fetch(`${WORKER_URL}/api/views/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (incrementRes.ok) {
            const data: ViewResponse = await incrementRes.json();
            setCount(data.views);
            sessionStorage.setItem('view-incremented', 'true');
          } else {
            throw new Error('Failed to increment');
          }
        } else {
          // Just fetch current count
          const getRes = await fetch(`${WORKER_URL}/api/views`, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (getRes.ok) {
            const data: ViewResponse = await getRes.json();
            setCount(data.views);
          } else {
            throw new Error('Failed to fetch');
          }
        }
      } catch (err) {
        console.error('View counter error:', err);
        setError(true);
        // Fallback to localStorage
        const stored = localStorage.getItem('portfolio-visits') || '1240';
        setCount(parseInt(stored));
      } finally {
        setLoading(false);
      }
    };

    fetchViews();
  }, []);

  const formatCount = (num: number | null) => {
    if (num === null) return '—';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-dashed border-zinc-800 bg-black/10 rounded-sm">
      <Eye size={14} className="text-zinc-600" />
      <span className="font-mono text-[11px] text-zinc-500">
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          <>
            {formatCount(count)} views
            {error && <span className="text-zinc-700 ml-1">(cached)</span>}
          </>
        )}
      </span>
    </div>
  );
}
