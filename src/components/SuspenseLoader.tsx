import { Suspense } from 'react';

interface SuspenseLoaderProps {
    children: React.ReactNode;
}

export function SuspenseLoader({ children }: SuspenseLoaderProps) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            {children}
        </Suspense>
    );
}

function PageSkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-pulse pt-4">
            {/* Title skeleton */}
            <div className="flex flex-col gap-3">
                <div className="h-8 bg-zinc-800/60 rounded-md w-3/5" />
                <div className="h-4 bg-zinc-800/40 rounded w-2/5" />
            </div>

            {/* Divider skeleton */}
            <div className="h-8 bg-zinc-800/20 rounded w-full -mx-4 sm:-mx-10" style={{ width: 'calc(100% + 2rem)' }} />

            {/* Content block skeletons */}
            <div className="flex flex-col gap-4">
                <div className="h-4 bg-zinc-800/40 rounded w-full" />
                <div className="h-4 bg-zinc-800/40 rounded w-5/6" />
                <div className="h-4 bg-zinc-800/40 rounded w-4/6" />
            </div>

            {/* Card grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="border border-zinc-800/50 rounded-lg p-5 flex flex-col gap-3">
                        <div className="h-5 bg-zinc-800/50 rounded w-3/4" />
                        <div className="h-3 bg-zinc-800/30 rounded w-full" />
                        <div className="h-3 bg-zinc-800/30 rounded w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SuspenseLoader;
