import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.error('[ErrorBoundary] Caught error:', error.message, error.stack);
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Error details:', error, errorInfo.componentStack);
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            const isChunkError = this.state.error?.message?.includes('chunk') || 
                                 this.state.error?.message?.includes('Loading chunk');
            
            if (isChunkError) {
                window.location.reload();
                return null;
            }

            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#18181b]">
                    <h1 className="text-3xl font-bold mb-4 text-zinc-100">Something went wrong</h1>
                    <p className="text-zinc-400 mb-2">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <p className="text-zinc-500 text-sm mb-6 max-w-md">
                        This might be due to a network issue or outdated cached data.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={this.resetError}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-200"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-200"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary };
export default ErrorBoundary;
