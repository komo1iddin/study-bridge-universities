import { getTranslations } from '@/i18n/utils';
import { Link } from '@/i18n/utils';
import { Metadata } from 'next';
import ClientHome from '@/components/ClientHome';
import { Locale } from '@/i18n/config';

interface PageParams {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({
  params
}: PageParams): Promise<Metadata> {
  // Ожидаем получение параметров
  const { locale } = await params;
  
  try {
    const translations = await getTranslations(locale, ['home']);
    
    return {
      title: translations.home?.hero?.title || 'Study Bridge - Your Path to Education in China',
      description: translations.home?.hero?.subtitle || 'Find and apply to universities in China with our streamlined platform',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Study Bridge - Your Path to Education in China',
      description: 'Find and apply to universities in China with our streamlined platform',
    };
  }
}

export default async function HomePage({
  params
}: PageParams) {
  // Ожидаем получение параметров
  const { locale } = await params;
  
  try {
    const translations = await getTranslations(locale, ['home', 'common']);
    
    return <ClientHome translations={translations} />;
  } catch (error) {
    console.error('Error in HomePage:', error);
    throw error;
  }
}
