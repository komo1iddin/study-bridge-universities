import { NextRequest, NextResponse } from 'next/server';
import { getUniversityById } from '@/lib/db';

// GET /api/universities/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const university = await getUniversityById(id);
  
  if (!university) {
    return NextResponse.json(
      { error: 'University not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(university);
} 