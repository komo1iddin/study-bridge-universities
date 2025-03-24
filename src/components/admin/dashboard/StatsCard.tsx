import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface StatsCardProps {
  title: string;
  value?: number;
  loading?: boolean;
}

export function StatsCard({ title, value, loading = false }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      
      <div className="mt-2 relative h-10">
        <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${loading ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-3xl font-semibold text-gray-900">
            {value?.toLocaleString() ?? '0'}
          </p>
        </div>
      </div>
    </div>
  );
} 