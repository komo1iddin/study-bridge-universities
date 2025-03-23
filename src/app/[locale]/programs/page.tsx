import { getTranslations } from '@/i18n/utils';
import { Metadata } from 'next';
import ProgramsClient from '@/components/programs/ProgramsClient';
import { Locale } from '@/i18n/config';

interface PageParams {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({
  params
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  
  const translations = await getTranslations(locale, ['programs']);
  
  return {
    title: translations.programs?.title || 'Study Programs - Study Bridge',
    description: translations.programs?.description || 'Find the perfect study program in China',
  };
}

export default async function ProgramsPage({
  params
}: PageParams) {
  const { locale } = await params;
  
  const translations = await getTranslations(locale, ['programs', 'common']);
  
  // In a real application, you would fetch programs data from an API or database
  const programs = [
    {
      id: '1',
      universityName: 'Tsinghua University',
      programName: 'Computer Science and Technology',
      degreeLevel: 'Bachelor',
      duration: '4 years',
      languageRequirements: 'HSK 5 or IELTS 6.5',
      ageRequirements: '18-25',
      availableSeats: 50,
      annualTuition: '30,000 CNY',
      scholarship: true,
      status: 'Open',
      universityRanking: 1
    },
    {
      id: '2',
      universityName: 'Peking University',
      programName: 'International Business',
      degreeLevel: 'Master',
      duration: '2 years',
      languageRequirements: 'HSK 4 or IELTS 6.0',
      ageRequirements: '22-35',
      availableSeats: 30,
      annualTuition: '40,000 CNY',
      scholarship: true,
      status: 'Open',
      universityRanking: 2
    },
    {
      id: '3',
      universityName: 'Fudan University',
      programName: 'Medicine',
      degreeLevel: 'Bachelor',
      duration: '5 years',
      languageRequirements: 'HSK 5 or IELTS 6.5',
      ageRequirements: '18-25',
      availableSeats: 20,
      annualTuition: '45,000 CNY',
      scholarship: false,
      status: 'Open',
      universityRanking: 3
    },
    {
      id: '4',
      universityName: 'Shanghai Jiao Tong University',
      programName: 'Mechanical Engineering',
      degreeLevel: 'Master',
      duration: '3 years',
      languageRequirements: 'HSK 4 or IELTS 6.0',
      ageRequirements: '22-35',
      availableSeats: 40,
      annualTuition: '38,000 CNY',
      scholarship: true,
      status: 'Open',
      universityRanking: 4
    },
    {
      id: '5',
      universityName: 'Zhejiang University',
      programName: 'Economics',
      degreeLevel: 'Bachelor',
      duration: '4 years',
      languageRequirements: 'HSK 4 or IELTS 6.0',
      ageRequirements: '18-25',
      availableSeats: 35,
      annualTuition: '32,000 CNY',
      scholarship: true,
      status: 'Closing Soon',
      universityRanking: 5
    }
  ];
  
  const popularFilters = [
    'Scholarship Available',
    'Computer Science',
    'Business',
    'Medicine',
    'Engineering',
    'Bachelor',
    'Master',
    'English Taught',
    'Low Tuition'
  ];
  
  return <ProgramsClient 
    translations={translations} 
    programs={programs} 
    popularFilters={popularFilters}
    locale={locale}
  />;
} 