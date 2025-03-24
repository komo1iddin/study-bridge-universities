'use client';

import { useState, useEffect } from 'react';

export default function AdminLoopReset() {
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  // Check if we need to clear flags on mount (if cookie is present)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldClear = document.cookie.includes('clear-admin-loop-flags=true');
      
      if (shouldClear) {
        clearAllFlags();
        
        // Clear the cookie
        document.cookie = 'clear-admin-loop-flags=; path=/; max-age=0';
        
        // Reload after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }, []);
  
  // Function to clear all flags that might cause refresh loops
  const clearAllFlags = () => {
    try {
      // Clear sessionStorage flags
      sessionStorage.removeItem('admin_login_redirect');
      sessionStorage.removeItem('admin_login_timestamp');
      sessionStorage.removeItem('admin_redirect_handled');
      
      // Clear localStorage flags
      localStorage.removeItem('admin_session_checked');
      
      // Also clear any other potentially problematic flags
      sessionStorage.removeItem('admin-auth-active');
      localStorage.removeItem('admin-auth-active');
      
      console.log('[AdminLoopReset] Successfully cleared all refresh loop flags');
      
      setMessage('All refresh loop flags cleared successfully!');
    } catch (err) {
      console.error('[AdminLoopReset] Error clearing flags:', err);
      setMessage('Error clearing flags: ' + (err as Error).message);
    }
  };
  
  const handleResetClick = async () => {
    setIsResetting(true);
    setMessage(null);
    
    try {
      // Call the API to clear flags
      const response = await fetch('/api/auth/reset-loops');
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Reset successful! Page will reload shortly...');
        
        // Reload the page after a delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage('Error: ' + (data.error || 'Unknown error'));
        setIsResetting(false);
      }
    } catch (err) {
      console.error('[AdminLoopReset] Error calling reset API:', err);
      setMessage('Error: ' + (err as Error).message);
      setIsResetting(false);
    }
  };
  
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md">
      <h3 className="font-medium text-yellow-800 mb-2">Admin Refresh Loop Manager</h3>
      <p className="text-sm text-yellow-700 mb-3">
        If you're experiencing refresh loops, click the button below to reset all flags.
      </p>
      
      {message && (
        <div className="my-3 p-2 text-sm bg-white rounded border border-gray-200">
          {message}
        </div>
      )}
      
      <button
        onClick={handleResetClick}
        disabled={isResetting}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isResetting ? 'Resetting...' : 'Reset Refresh Loops'}
      </button>
    </div>
  );
} 