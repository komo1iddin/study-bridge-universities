'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Try to ping the Supabase API to check connectivity
        const { data, error } = await supabase.from('pg_stat_statements').select('query').limit(1);
        
        // If we get an error that mentions permission denied, that's actually good!
        // It means we connected successfully but just don't have permission to access this table
        if (error && error.message && error.message.includes('permission denied')) {
          console.log('Supabase connection successful (permission denied is expected)');
          setConnectionStatus('connected');
          return;
        }
        
        if (error && !error.message.includes('permission denied')) {
          throw error;
        }
        
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
        console.error('Supabase connection error:', error);
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-2">Supabase Connection Status</h2>
      {connectionStatus === 'loading' && <p>Checking connection...</p>}
      {connectionStatus === 'connected' && (
        <p className="text-green-600">✓ Connected to Supabase successfully!</p>
      )}
      {connectionStatus === 'error' && (
        <div>
          <p className="text-red-600">✗ Failed to connect to Supabase</p>
          {errorMessage && <p className="text-sm mt-2 p-2 bg-red-50 rounded">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
} 