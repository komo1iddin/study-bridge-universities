import { NextRequest, NextResponse } from 'next/server';

// API route to clear any flags that might be causing refresh loops
export async function GET(req: NextRequest) {
  console.log('[API] Admin refresh loop reset requested');
  
  // Create the response
  const response = NextResponse.json({
    success: true,
    message: 'Cleared all refresh loop flags. The page will reload automatically.',
    timestamp: new Date().toISOString()
  });
  
  // Set special cookies that the client will use to clear local storage
  response.cookies.set('clear-admin-loop-flags', 'true', {
    path: '/',
    maxAge: 60, // Very short lifespan
    httpOnly: false
  });
  
  return response;
} 