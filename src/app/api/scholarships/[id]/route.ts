import { NextRequest, NextResponse } from 'next/server';
import { getScholarshipById } from '@/lib/db';

// GET /api/scholarships/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const scholarship = await getScholarshipById(id);
  
  if (!scholarship) {
    return NextResponse.json(
      { error: 'Scholarship not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(scholarship);
} 