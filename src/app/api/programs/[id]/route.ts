import { NextRequest, NextResponse } from 'next/server';
import { getProgramById, getScholarshipsForProgram } from '@/lib/db';

// GET /api/programs/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const program = await getProgramById(id);
  
  if (!program) {
    return NextResponse.json(
      { error: 'Program not found' },
      { status: 404 }
    );
  }
  
  // Get scholarships for this program
  const scholarships = await getScholarshipsForProgram(id);
  
  // Return program with related scholarships
  return NextResponse.json({
    ...program,
    scholarships
  });
} 