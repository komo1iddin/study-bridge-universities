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

export async function generateMetadata({
  params
}: PageParams): Promise<Metadata> {
  const { locale, id } = await params;
  
  const program = await getProgramById(id);
  
  if (!program) {
    return {
      title: 'Program Not Found - Study Bridge',
      description: 'The requested program could not be found',
    };
  }
  
  return {
    title: `${program.program_name} | Study Bridge`,
    description: `Learn about the ${program.degree_level} program in ${program.program_name}`,
  };
}

export default async function ProgramDetailPage({
  params
}: PageParams) {
  const { locale, id } = await params;
  
  const translations = await getTranslations(locale, ['programs', 'common']);
  const program = await getProgramById(id);
  
  if (!program) {
    notFound();
  }

  // Get university data
  const university = await getUniversityById(program.university_id);
  const universityName = university?.name || `University ${program.university_id}`;

  // Create the same translations structure as main page
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
  
  return (
    <ProgramDetailClient 
      translations={translations} 
      program={program}
      locale={locale}
      universityName={universityName}
      cardTranslations={cardTranslations}
    />
  );
}