import { getPrograms, getUniversities } from '@/lib/db';
import { getTranslations } from '@/i18n/utils';
import { Metadata } from 'next';
import { Locale } from '@/i18n/config';
import ProgramsFilteredGrid from '@/components/features/programs/ProgramsFilteredGrid';

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
    description: 'Explore available study programs in Chinese universities',
  };
}

export default async function ProgramsPage({
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
    moreDetails: translations.programs?.card?.detailsButton || 'More Details',
    filterTitle: translations.programs?.filters?.title || 'Filters',
    searchPlaceholder: translations.programs?.filters?.searchPlaceholder || 'Search programs...',
    degreeLevel: translations.programs?.filters?.degreeLevel || 'Degree Level',
    language: translations.programs?.filters?.language || 'Language',
    format: translations.programs?.filters?.format || 'Format',
    duration: translations.programs?.filters?.duration || 'Duration',
    scholarshipAvailable: translations.programs?.filters?.scholarshipAvailable || 'Scholarship Available',
    applyFilters: translations.programs?.filters?.applyButton || 'Apply Filters',
    resetFilters: translations.programs?.filters?.resetButton || 'Reset',
    popularFilters: translations.programs?.filters?.popularFilters || 'Popular Filters',
    noResults: translations.programs?.filters?.noResults || 'No programs found matching your criteria'
  };
  
  // Define popular keywords
  const popularFilters = [
    locale === 'ru' ? 'Компьютерные науки' : locale === 'uz' ? 'Kompyuter ilmlari' : 'Computer Science',
    locale === 'ru' ? 'Бизнес' : locale === 'uz' ? 'Biznes' : 'Business',
    locale === 'ru' ? 'Английский язык' : locale === 'uz' ? 'Ingliz tili' : 'English Language',
    locale === 'ru' ? 'Инженерия' : locale === 'uz' ? 'Muhandislik' : 'Engineering',
    locale === 'ru' ? 'Стипендия' : locale === 'uz' ? 'Stipendiya' : 'Scholarship',
    locale === 'ru' ? 'Медицина' : locale === 'uz' ? 'Tibbiyot' : 'Medicine'
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">
          {translations.programs?.title || 'Study Programs'}
        </h1>
        
        {/* Client component with filtering capabilities */}
        <ProgramsFilteredGrid 
          programs={programs}
          universityMap={universityMap}
          locale={locale}
          translations={cardTranslations}
          popularFilters={popularFilters}
        />
      </div>
    </div>
  );
}