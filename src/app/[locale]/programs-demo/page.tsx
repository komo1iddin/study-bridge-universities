import { getPrograms, getUniversities } from '@/lib/db';
import { getTranslations } from '@/i18n/utils';
import { Metadata } from 'next';
import { Locale } from '@/i18n/config';
import { ProgramCard } from '@/components/cards/ProgramCard';
import { University } from '@/types/database.types';

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
    title: translations.programs?.title || 'Programs Demo - Study Bridge',
    description: 'Demo of program cards display',
  };
}

export default async function ProgramsDemoPage({
  params
}: PageParams) {
  const { locale } = await params;
  
  // Get translations for this page
  const translations = await getTranslations(locale, ['programs', 'common']);
  
  // Fetch programs and universities from Supabase
  const [programs, universities] = await Promise.all([
    getPrograms(),
    getUniversities()
  ]);
  
  // Create a map of university IDs to university names for easier lookup
  const universityMap = universities.reduce((map, university) => {
    map[university.id] = university.name;
    return map;
  }, {} as Record<string, string>);
  
  // Extract the necessary translations for program cards
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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        {translations.programs?.title || 'Programs Demo'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            universityName={universityMap[program.university_id] || `University ${program.university_id}`}
            locale={locale}
            translations={cardTranslations}
          />
        ))}
      </div>
    </div>
  );
} 