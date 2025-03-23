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
      {/* Enhanced Hero section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <Image 
            src="/images/china-landmarks.jpg" 
            alt="Chinese landmarks" 
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="scale-105 animate-slow-zoom"
          />
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-28 md:py-36 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block mb-6 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
              🌎 {t('hero.welcomeTag') || 'International Study Opportunities in China'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${locale}/programs`}>
                <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8">
                  {t('hero.browsePrograms')} →
                </Button>
              </Link>
              <Link href={`/${locale}/universities`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium rounded-full px-8">
                  {t('hero.exploreUniversities')}
                </Button>
              </Link>
            </div>
            <div className="mt-16 flex items-center gap-4 text-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold">T</div>
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-bold">P</div>
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold">F</div>
              </div>
              <span className="text-blue-100">
                <strong>300+</strong> Students already enrolled through our platform
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Programs section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">{t('popularPrograms.title')}</h2>
            <Link href={`/${locale}/programs`} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 group">
              {t('popularPrograms.viewAll')} 
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program cards would go here */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={`/images/program-${item}.jpg`} 
                    alt="Program" 
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="text-white font-medium">
                      {item === 1 ? 'Tsinghua University' : item === 2 ? 'Peking University' : 'Fudan University'}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">
                      {item === 1 ? 'Computer Science' : item === 2 ? 'Business Administration' : 'Medicine'}
                    </h3>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {item === 1 ? 'Bachelor' : item === 2 ? 'Master' : 'Bachelor'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item === 1 ? '4 years' : item === 2 ? '2 years' : '5 years'}
                    </span>
                    <span className="font-medium">${(item * 5000).toLocaleString()} / year</span>
                  </div>
                  <Link href={`/${locale}/programs/${item}`}>
                    <Button variant="outline" className="w-full hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {t('popularPrograms.viewDetails')}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">{t('cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href={`/${locale}/programs`}>
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-full px-8 shadow-lg">
                {t('cta.browseButton')}
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8">
                {t('cta.contactButton')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
