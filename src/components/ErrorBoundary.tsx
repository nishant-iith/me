import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Send to error tracking service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                    <p className="text-zinc-400 mb-6">
                        We apologize for the inconvenience. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
