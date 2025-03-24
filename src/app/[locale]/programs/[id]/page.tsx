import { getTranslations } from '@/i18n/utils';
import { Metadata } from 'next';
import ProgramDetailClient from '@/components/features/programs/ProgramDetailClient';
import { Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { getProgramById, getUniversityById } from '@/lib/db';

interface PageParams {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  try {
    const { id } = await params;
    const program = await getProgramById(id);
    
    if (!program) {
      return {
        title: 'Program Not Found',
        description: 'The requested program could not be found.'
      };
    }
    
    return {
      title: `${program.name} | Study Bridge`,
      description: program.description || 'Study program details on Study Bridge'
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Program Details | Study Bridge',
      description: 'Study program details on Study Bridge'
    };
  }
}

export default async function ProgramDetailPage({
  params
}: PageParams) {
  const { locale, id } = await params;
  
  try {
    const translations = await getTranslations(locale, ['programs', 'common']);
    
    // Safely fetch program data with error handling
    let dbProgram;
    try {
      dbProgram = await getProgramById(id);
      console.log(`Fetched program ${id}:`, dbProgram ? 'Found' : 'Not found');
    } catch (error) {
      console.error(`Error fetching program ${id}:`, error);
      notFound();
    }
    
    if (!dbProgram) {
      console.error(`Program ${id} not found`);
      notFound();
    }

    // Get university data with error handling
    let university;
    let universityName;
    
    try {
      university = await getUniversityById(dbProgram.university_id);
      universityName = university?.name || `University ${dbProgram.university_id}`;
    } catch (error) {
      console.error(`Error fetching university for program ${id}:`, error);
      universityName = dbProgram.universities?.name || `University ${dbProgram.university_id}`;
    }

    // Create the translations structure
    const cardTranslations = {
      top50: locale === 'ru' ? 'Топ 50' : locale === 'uz' ? 'Top 50' : 'Top 50',
      openEnrollment: locale === 'ru' ? 'Набор открыт' : locale === 'uz' ? 'Qabul ochiq' : 'Enrollment Open',
      scholarship: locale === 'ru' ? 'Стипендия доступна' : locale === 'uz' ? 'Stipendiya mavjud' : 'Scholarship Available',
      bachelor: locale === 'ru' ? 'Бакалавриат' : locale === 'uz' ? 'Bakalavr' : 'Bachelor',
      years: locale === 'ru' ? 'года' : locale === 'uz' ? 'yil' : 'years',
      languageRequirements: translations.programs?.card?.languageRequirements || 'Language Requirements',
      age: locale === 'ru' ? 'Возраст' : locale === 'uz' ? 'Yosh' : 'Age',
      seats: translations.programs?.card?.availableSeats || 'Available Seats',
      tuition: translations.programs?.card?.annualTuition || 'Tuition',
      perYear: locale === 'ru' ? '/год' : locale === 'uz' ? '/yil' : '/year',
      otherPrograms: locale === 'ru' ? 'Другие программы' : locale === 'uz' ? 'Boshqa dasturlar' : 'Other Programs',
      moreDetails: translations.programs?.card?.detailsButton || 'More Details'
    };
    
    // Adapt the database program to the client component expected structure
    const adaptedProgram = {
      id: dbProgram.id,
      universityName: universityName,
      programName: dbProgram.name || 'Program',
      degreeLevel: dbProgram.education_level || 'bachelor',
      duration: `${dbProgram.duration} years`,
      languageRequirements: dbProgram.requirements?.language?.english || 'IELTS 6.0',
      ageRequirements: '18+',
      availableSeats: 100,
      annualTuition: `$${dbProgram.tuition}`,
      scholarship: true,
      status: 'Open',
      universityRanking: university?.ranking || 50,
      description: dbProgram.description || 'No description available',
      admissionRequirements: Array.isArray(dbProgram.requirements?.documents) 
        ? dbProgram.requirements.documents 
        : ['Passport', 'Transcripts'],
      curriculum: ['Core Courses', 'Electives', 'Research Project'],
      careerProspects: ['Industry Positions', 'Research', 'Further Studies'],
      applicationDeadline: dbProgram.start_dates?.[0] || '2024-09-01',
      startDate: dbProgram.start_dates?.[0] || '2024-09-01',
      contactInfo: {
        email: 'admissions@university.edu',
        phone: '+1234567890',
        website: university?.website_url || 'https://university.edu'
      }
    };
    
    return (
      <ProgramDetailClient 
        translations={translations} 
        program={adaptedProgram}
        locale={locale}
      />
    );
  } catch (error) {
    console.error(`Error rendering program detail page for ${id}:`, error);
    notFound();
  }
}