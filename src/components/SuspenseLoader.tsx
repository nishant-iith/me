import { Suspense, Component, type ReactNode } from 'react';

interface SuspenseLoaderProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class SuspenseErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <h2 className="font-mono text-xl text-zinc-300">Failed to load content</h2>
                    <p className="text-zinc-500 text-sm max-w-md text-center">
                        {this.state.error?.message || 'Something went wrong while loading this page.'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-200 text-sm"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export function SuspenseLoader({ children }: SuspenseLoaderProps) {
    return (
        <SuspenseErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
                {children}
            </Suspense>
        </SuspenseErrorBoundary>
    );
}

function PageSkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-pulse pt-4">
            <div className="flex flex-col gap-3">
                <div className="h-8 bg-zinc-800/60 rounded-md w-3/5" />
                <div className="h-4 bg-zinc-800/40 rounded w-2/5" />
            </div>

            <div className="h-8 bg-zinc-800/20 rounded w-full -mx-4 sm:-mx-10" style={{ width: 'calc(100% + 2rem)' }} />

            <div className="flex flex-col gap-4">
                <div className="h-4 bg-zinc-800/40 rounded w-full" />
                <div className="h-4 bg-zinc-800/40 rounded w-5/6" />
                <div className="h-4 bg-zinc-800/40 rounded w-4/6" />
            </div>

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
