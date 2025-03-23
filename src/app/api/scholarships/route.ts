import { NextRequest, NextResponse } from 'next/server';
import { getScholarships, filterScholarships } from '@/lib/db';

// GET /api/scholarships
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  // Get filter parameters
  const type = searchParams.getAll('type');
  const coverage = searchParams.getAll('coverage');
  const educationLevels = searchParams.getAll('education_levels');
  const applicationDeadline = searchParams.get('application_deadline') || undefined;

  // If there are filter parameters, use the filter function
  if (
    type.length > 0 ||
    coverage.length > 0 ||
    educationLevels.length > 0 ||
    applicationDeadline !== undefined
  ) {
    const filteredScholarships = await filterScholarships({
      type: type.length > 0 ? type : undefined,
      coverage: coverage.length > 0 ? coverage : undefined,
      education_levels: educationLevels.length > 0 ? educationLevels : undefined,
      application_deadline: applicationDeadline
    });
    
    return NextResponse.json(filteredScholarships);
  }
  
  // Otherwise, get all scholarships
  const scholarships = await getScholarships();
  return NextResponse.json(scholarships);
} 