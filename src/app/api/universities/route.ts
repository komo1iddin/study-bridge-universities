import { NextRequest, NextResponse } from 'next/server';
import { getUniversities, filterUniversities } from '@/lib/db';

// GET /api/universities
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  // Get filter parameters
  const province = searchParams.getAll('province');
  const city = searchParams.getAll('city');
  const rankingMax = searchParams.get('ranking_max') 
    ? parseInt(searchParams.get('ranking_max')!) 
    : undefined;
  const universityType = searchParams.getAll('university_type');
  const hasEnglishPrograms = searchParams.get('has_english_programs') 
    ? searchParams.get('has_english_programs') === 'true' 
    : undefined;
  const tuitionMin = searchParams.get('tuition_min') 
    ? parseFloat(searchParams.get('tuition_min')!) 
    : undefined;
  const tuitionMax = searchParams.get('tuition_max') 
    ? parseFloat(searchParams.get('tuition_max')!) 
    : undefined;
  const hasDormitory = searchParams.get('has_dormitory') 
    ? searchParams.get('has_dormitory') === 'true' 
    : undefined;
  const specialization = searchParams.getAll('specialization');

  // If there are filter parameters, use the filter function
  if (
    province.length > 0 ||
    city.length > 0 ||
    rankingMax !== undefined ||
    universityType.length > 0 ||
    hasEnglishPrograms !== undefined ||
    tuitionMin !== undefined ||
    tuitionMax !== undefined ||
    hasDormitory !== undefined ||
    specialization.length > 0
  ) {
    const filteredUniversities = await filterUniversities({
      province: province.length > 0 ? province : undefined,
      city: city.length > 0 ? city : undefined,
      ranking_max: rankingMax,
      university_type: universityType.length > 0 ? universityType : undefined,
      has_english_programs: hasEnglishPrograms,
      tuition_min: tuitionMin,
      tuition_max: tuitionMax,
      has_dormitory: hasDormitory,
      specialization: specialization.length > 0 ? specialization : undefined,
    });
    
    return NextResponse.json(filteredUniversities);
  }
  
  // Otherwise, get all universities
  const universities = await getUniversities();
  return NextResponse.json(universities);
} 