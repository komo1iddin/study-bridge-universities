import { getTranslations, Link } from '@/i18n/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';

interface PageParams {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({
  params
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  
  const translations = await getTranslations(locale, ['home']);
  
  return {
    title: translations.home?.title || 'Study Bridge - Your Path to Education in China',
    description: translations.home?.description || 'Study Bridge helps international students find and apply to universities in China.',
  };
}

export default async function HomePage({
  params
}: PageParams) {
  const { locale } = await params;
  
  const translations = await getTranslations(locale, ['home', 'common']);
  
  function t(key: string): string {
    const parts = key.split('.');
    let result: any = translations.home;
    
    for (const part of parts) {
      if (result && typeof result === 'object') {
        result = result[part];
      } else {
        return key; // Fallback to the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/china-landmarks.jpg" 
            alt="Chinese landmarks" 
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${locale}/programs`}>
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  {t('hero.browsePrograms')}
                </Button>
              </Link>
              <Link href={`/${locale}/universities`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
                  {t('hero.exploreUniversities')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Programs section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t('popularPrograms.title')}</h2>
            <Link href={`/${locale}/programs`} className="text-blue-600 hover:text-blue-800">
              {t('popularPrograms.viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Program cards would go here */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image 
                    src={`/images/program-${item}.jpg`} 
                    alt="Program" 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-medium text-blue-600 mb-1">
                    {item === 1 ? 'Tsinghua University' : item === 2 ? 'Peking University' : 'Fudan University'}
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {item === 1 ? 'Computer Science' : item === 2 ? 'Business Administration' : 'Medicine'}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>{item === 1 ? 'Bachelor' : item === 2 ? 'Master' : 'Bachelor'}</span>
                    <span>${(item * 5000).toLocaleString()} / year</span>
                  </div>
                  <Link href={`/${locale}/programs/${item}`}>
                    <Button variant="outline" className="w-full">{t('popularPrograms.viewDetails')}</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">{t('cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}/programs`}>
              <Button size="lg">{t('cta.browseButton')}</Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button size="lg" variant="outline">{t('cta.contactButton')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
