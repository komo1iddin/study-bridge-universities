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
    title: 'Study Programs - Study Bridge',
    description: 'Explore our range of study programs in China for international students',
  };
}

export default async function ProgramsPage({
  params
}: PageParams) {
  const { locale } = await params;
  
  const programs = [
    {
      id: 'bachelor',
      title: 'Bachelor Degree Programs',
      description: 'Four-year undergraduate programs in various fields including Business, Engineering, Medicine, and more.',
      image: '/images/placeholder.png',
      features: ['4-year duration', 'English or Chinese instruction', 'Globally recognized degrees', 'Scholarships available']
    },
    {
      id: 'master',
      title: 'Master Degree Programs',
      description: 'Two to three-year postgraduate programs designed for students looking to specialize in their field.',
      image: '/images/placeholder.png',
      features: ['2-3 year duration', 'Research opportunities', 'Industry connections', 'Career advancement']
    },
    {
      id: 'doctoral',
      title: 'Doctoral Programs',
      description: 'Advanced research-based programs for students seeking the highest level of academic achievement.',
      image: '/images/placeholder.png',
      features: ['3-5 year duration', 'Research focus', 'Publication opportunities', 'Academic career preparation']
    },
    {
      id: 'language',
      title: 'Chinese Language Programs',
      description: 'Intensive Mandarin Chinese courses for beginners to advanced learners.',
      image: '/images/placeholder.png',
      features: ['Flexible duration', 'All proficiency levels', 'Cultural immersion', 'HSK test preparation']
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Study Programs in China</h1>
      <p className="text-lg text-gray-600 mb-10">
        Explore a wide range of academic programs offered by Chinese universities for international students.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">Program Image Placeholder</span>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-3">{program.title}</h2>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <h3 className="font-medium mb-2">Key Features:</h3>
              <ul className="list-disc pl-5 mb-4">
                {program.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
              <Link href={`/${locale}/programs/${program.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Need Help Choosing a Program?</h2>
        <p className="text-gray-700 mb-4">
          Our education consultants can help you find the perfect program that matches your academic background, 
          career goals, and personal interests.
        </p>
        <Link href={`/${locale}/contact`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Contact Us for Guidance
        </Link>
      </div>
    </div>
  );
} 