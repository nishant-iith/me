import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

/**
 * Simple visitor counter using localStorage + API
 * Counts EVERY page view (not unique visitors)
 */
const VisitorCounter = () => {
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                // Use countapi.xyz for simple hit counting
                const response = await fetch('https://api.countapi.xyz/hit/nishant-portfolio/visits');
                const data = await response.json();
                setCount(data.value);
            } catch (error) {
                // Fallback: use localStorage counter
                const stored = localStorage.getItem('portfolio-visits') || '1000';
                const newCount = parseInt(stored) + 1;
                localStorage.setItem('portfolio-visits', newCount.toString());
                setCount(newCount);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, []);

    const formatCount = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num?.toLocaleString() || '—';
    };

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-dashed border-zinc-800 bg-black/10 rounded-sm">
            <Eye size={14} className="text-zinc-600" />
            <span className="font-mono text-[11px] text-zinc-500">
                {loading ? (
                    <span className="animate-pulse">...</span>
                ) : (
                    <>{formatCount(count)} views</>
                )}
            </span>
        </div>
    );
};

export default VisitorCounter;
