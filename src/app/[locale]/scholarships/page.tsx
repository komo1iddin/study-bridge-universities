import { getTranslations } from '@/i18n/utils';
import { Metadata } from 'next';
import { Locale } from '@/i18n/config';
import Link from 'next/link';

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
    title: 'Scholarships for International Students - Study Bridge',
    description: 'Explore scholarships for studying in China as an international student',
  };
}

export default async function ScholarshipsPage({
  params
}: PageParams) {
  const { locale } = await params;
  
  const scholarships = [
    {
      id: 'csc',
      name: 'Chinese Government Scholarship (CSC)',
      provider: 'China Scholarship Council',
      award: 'Full tuition + living allowance + accommodation + health insurance',
      eligibility: 'International students under 35 years for master\'s and under 40 for doctoral programs',
      deadline: 'January-April each year (varies by country)',
      description: 'The most prestigious and comprehensive scholarship for international students, covering all expenses for studying in China.'
    },
    {
      id: 'confucius',
      name: 'Confucius Institute Scholarship',
      provider: 'Hanban/Confucius Institute Headquarters',
      award: 'Full or partial coverage of tuition, accommodation, and living allowance',
      eligibility: 'Non-Chinese citizens between 16-35 years, primarily for Chinese language studies',
      deadline: 'May each year',
      description: 'Specifically for students pursuing Chinese language and cultural studies, with various categories available.'
    },
    {
      id: 'belt-road',
      name: 'Belt and Road Initiative Scholarship',
      provider: 'Chinese Government',
      award: 'Full tuition + accommodation + monthly stipend',
      eligibility: 'Students from countries participating in the Belt and Road Initiative',
      deadline: 'March each year',
      description: 'Designed to strengthen educational cooperation between China and countries along the Belt and Road routes.'
    },
    {
      id: 'university',
      name: 'University-Specific Scholarships',
      provider: 'Individual Chinese Universities',
      award: 'Varies by university (partial to full tuition waivers)',
      eligibility: 'Academic merit-based, varies by institution',
      deadline: 'Varies by university',
      description: 'Many Chinese universities offer their own scholarships to international students based on academic performance.'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Scholarships for International Students</h1>
      <p className="text-lg text-gray-600 mb-10">
        Discover financial aid opportunities to support your education in China.
      </p>
      
      <div className="space-y-8 mb-12">
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{scholarship.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold text-gray-700">Provider:</p>
                <p className="text-gray-600">{scholarship.provider}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Application Deadline:</p>
                <p className="text-gray-600">{scholarship.deadline}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Award:</p>
                <p className="text-gray-600">{scholarship.award}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Eligibility:</p>
                <p className="text-gray-600">{scholarship.eligibility}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{scholarship.description}</p>
            <Link href={`/${locale}/scholarships/${scholarship.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              View Details
            </Link>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Scholarship Application Support</h2>
        <p className="text-gray-700 mb-4">
          Need help with your scholarship application? Our advisors can guide you through the process, review your application materials, 
          and increase your chances of securing financial support for your studies in China.
        </p>
        <Link href={`/${locale}/contact`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Get Scholarship Assistance
        </Link>
      </div>
    </div>
  );
} 