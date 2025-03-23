import { getTranslations } from '@/i18n/utils';
import { Metadata } from 'next';
import { Locale } from '@/i18n/config';
import Image from 'next/image';

interface PageParams {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({
  params
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  
  const translations = await getTranslations(locale, ['common']);
  
  return {
    title: 'About Us - Study Bridge',
    description: 'Learn about Study Bridge and our mission to help international students study in China',
  };
}

export default async function AboutPage({
  params
}: PageParams) {
  const { locale } = await params;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Study Bridge</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 mb-6">
          At Study Bridge, we are dedicated to connecting international students with educational opportunities in China. 
          Our mission is to simplify the process of applying to Chinese universities, providing comprehensive guidance 
          and support throughout your educational journey.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
        <p className="text-lg text-gray-700 mb-6">
          Founded by a team of education professionals with extensive experience in international student mobility, 
          Study Bridge bridges the gap between students worldwide and China's prestigious educational institutions. 
          Our team includes former international students, education consultants, and university admission experts.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
          </div>
          <p className="text-gray-600">
            We've helped students from over 50 countries successfully enroll in Chinese universities.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Educational Expertise</h3>
          </div>
          <p className="text-gray-600">
            Our partnerships with over 100 Chinese universities ensure you find the right program for your needs.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Comprehensive Support</h3>
          </div>
          <p className="text-gray-600">
            From application to graduation, we provide ongoing assistance to ensure your success in China.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
        <p className="text-lg text-gray-700">
          We believe that education transcends borders. At Study Bridge, we're committed to making quality Chinese 
          education accessible to students worldwide, helping them achieve their academic and career goals 
          while fostering cross-cultural understanding and global connections.
        </p>
      </div>
    </div>
  );
} 