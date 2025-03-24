'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
        refetchOnWindowFocus: false, // Prevent refetch on window focus
        refetchOnMount: false, // Prevent refetch on component mount
        retry: 1, // Only retry failed requests once
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 