'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminReset() {
  const router = useRouter();
  const [message, setMessage] = useState('Initializing reset...');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    const resetFlags = async () => {
      try {
        setMessage('Clearing all refresh loop flags...');
        
        // Clear all session storage flags
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.removeItem('admin_login_redirect');
          sessionStorage.removeItem('admin_login_timestamp');
          sessionStorage.removeItem('admin_redirect_handled');
          sessionStorage.removeItem('admin-auth-active');
          sessionStorage.removeItem('admin_load_count');
          sessionStorage.removeItem('admin_last_load_time');
          sessionStorage.removeItem('loop_detected');
          sessionStorage.removeItem('admin_session_checked');
          sessionStorage.removeItem('admin_user_email');
        }
        
        // Clear all local storage flags
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('admin_session_checked');
          localStorage.removeItem('admin-auth-active');
          localStorage.removeItem('loop_detected');
        }
        
        setMessage('Successfully cleared flags. Redirecting to admin dashboard...');
        setIsRedirecting(true);
        
        // Call the reset API endpoint
        try {
          await fetch('/api/auth/reset-loops');
          console.log('Reset API called successfully');
        } catch (apiError) {
          console.error('Error calling reset API:', apiError);
        }
        
        // Redirect to admin page after a delay
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } catch (error) {
        setMessage(`Error during reset: ${(error as Error).message}`);
        console.error('Error during admin reset:', error);
      }
    };
    
    resetFlags();
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Admin System Reset</h1>
        
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div 
              className={`h-2 bg-blue-600 rounded-full transition-all duration-500 ${
                isRedirecting ? 'w-full' : 'w-1/2'
              }`}
            ></div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{message}</p>
        
        {isRedirecting && (
          <p className="text-sm text-gray-500">
            You will be redirected to the admin dashboard momentarily.
          </p>
        )}
      </div>
    </div>
  );
} 