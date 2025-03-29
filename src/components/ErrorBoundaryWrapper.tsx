'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong:</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{error.message}</pre>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

export default function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
} 