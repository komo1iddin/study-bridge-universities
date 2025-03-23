import { NextRequest, NextResponse } from 'next/server';
import { getPrograms, filterPrograms } from '@/lib/db';

// GET /api/programs
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  // Get filter parameters
  const universityId = searchParams.get('university_id') || undefined;
  const educationLevel = searchParams.getAll('education_level');
  const language = searchParams.getAll('language');
  const durationMin = searchParams.get('duration_min') 
    ? parseInt(searchParams.get('duration_min')!) 
    : undefined;
  const durationMax = searchParams.get('duration_max') 
    ? parseInt(searchParams.get('duration_max')!) 
    : undefined;
  const specialization = searchParams.getAll('specialization');
  const format = searchParams.getAll('format');
  const tuitionMin = searchParams.get('tuition_min') 
    ? parseFloat(searchParams.get('tuition_min')!) 
    : undefined;
  const tuitionMax = searchParams.get('tuition_max') 
    ? parseFloat(searchParams.get('tuition_max')!) 
    : undefined;
  const startDate = searchParams.get('start_date') || undefined;

  // If there are filter parameters, use the filter function
  if (
    universityId !== undefined ||
    educationLevel.length > 0 ||
    language.length > 0 ||
    durationMin !== undefined ||
    durationMax !== undefined ||
    specialization.length > 0 ||
    format.length > 0 ||
    tuitionMin !== undefined ||
    tuitionMax !== undefined ||
    startDate !== undefined
  ) {
    const filteredPrograms = await filterPrograms({
      university_id: universityId,
      education_level: educationLevel.length > 0 ? educationLevel : undefined,
      language: language.length > 0 ? language : undefined,
      duration_min: durationMin,
      duration_max: durationMax,
      specialization: specialization.length > 0 ? specialization : undefined,
      format: format.length > 0 ? format : undefined,
      tuition_min: tuitionMin,
      tuition_max: tuitionMax,
      start_date: startDate
    });
    
    return NextResponse.json(filteredPrograms);
  }
  
  // Otherwise, get all programs
  const programs = await getPrograms();
  return NextResponse.json(programs);
} 