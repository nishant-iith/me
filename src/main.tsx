import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App'
import ErrorBoundary from '~components/ErrorBoundary'

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      gcTime: 1000 * 60 * 30, // 30 minutes default
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Check if we should use hydration or fresh render
// Brave/extensions may modify DOM causing hydration mismatches
const rootElement = document.getElementById('root')!;
const shouldHydrate = rootElement.hasChildNodes();

const AppTree = (
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);

if (shouldHydrate) {
  // Suppress hydration warnings in production
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('hydrat')) {
      return; // Ignore hydration errors
    }
    originalConsoleError.apply(console, args);
  };

  try {
    hydrateRoot(rootElement, AppTree);
  } catch {
    // If hydration fails, fall back to fresh render
    rootElement.innerHTML = '';
    createRoot(rootElement).render(AppTree);
  }
} else {
  createRoot(rootElement).render(AppTree);
}
