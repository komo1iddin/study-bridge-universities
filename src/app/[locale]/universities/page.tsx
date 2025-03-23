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
    title: 'Chinese Universities - Study Bridge',
    description: 'Explore top Chinese universities for international students',
  };
}

export default async function UniversitiesPage({
  params
}: PageParams) {
  const { locale } = await params;
  
  const universities = [
    {
      id: 'tsinghua',
      name: 'Tsinghua University',
      location: 'Beijing',
      ranking: '1st in China, 16th Worldwide',
      description: 'One of China\'s most prestigious universities, known for excellence in engineering, computer science, and architecture.',
      foundedYear: 1911,
      studentCount: 'Over 36,000',
      internationalStudents: '3,000+',
      featuredPrograms: ['Computer Science', 'Mechanical Engineering', 'Architecture']
    },
    {
      id: 'peking',
      name: 'Peking University',
      location: 'Beijing',
      ranking: '2nd in China, 23rd Worldwide',
      description: 'Renowned for liberal arts, sciences and medicine, with a beautiful campus and rich history.',
      foundedYear: 1898,
      studentCount: 'Over 42,000',
      internationalStudents: '4,000+',
      featuredPrograms: ['Economics', 'International Relations', 'Chinese Literature']
    },
    {
      id: 'fudan',
      name: 'Fudan University',
      location: 'Shanghai',
      ranking: '3rd in China, 31st Worldwide',
      description: 'One of China\'s oldest and most selective universities, known for medicine, management and journalism.',
      foundedYear: 1905,
      studentCount: 'Over 33,000',
      internationalStudents: '3,500+',
      featuredPrograms: ['Medicine', 'Journalism', 'Business Administration']
    },
    {
      id: 'sjtu',
      name: 'Shanghai Jiao Tong University',
      location: 'Shanghai',
      ranking: '4th in China, 47th Worldwide',
      description: 'A leading research university with strengths in engineering, medicine, and management.',
      foundedYear: 1896,
      studentCount: 'Over 38,000',
      internationalStudents: '2,800+',
      featuredPrograms: ['Mechanical Engineering', 'Electronic Engineering', 'Naval Architecture']
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Top Chinese Universities</h1>
      <p className="text-lg text-gray-600 mb-10">
        Discover world-class institutions offering quality education for international students.
      </p>
      
      <div className="space-y-8 mb-12">
        {universities.map((university) => (
          <div key={university.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-blue-100 p-6 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-blue-800">{university.name}</h2>
                  <p className="text-blue-600">{university.location}</p>
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Ranking: {university.ranking}</span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Founded: {university.foundedYear}</span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{university.studentCount} Students</span>
                </div>
                
                <p className="text-gray-600 mb-4">{university.description}</p>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Featured Programs:</h3>
                  <div className="flex flex-wrap gap-2">
                    {university.featuredPrograms.map((program, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{program}</span>
                    ))}
                  </div>
                </div>
                
                <Link href={`/${locale}/universities/${university.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  View University
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Looking for a Specific University?</h2>
        <p className="text-gray-700 mb-4">
          We partner with over 100 Chinese universities. If you don't see what you're looking for, contact our team for information on additional institutions.
        </p>
        <Link href={`/${locale}/contact`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Get Personalized University Recommendations
        </Link>
      </div>
    </div>
  );
} 