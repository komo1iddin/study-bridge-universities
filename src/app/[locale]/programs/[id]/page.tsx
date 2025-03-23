import { getTranslations } from '@/i18n/utils';
import { Metadata } from 'next';
import ProgramDetailClient from '@/components/programs/ProgramDetailClient';
import { Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';

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
  
  // In a real application, you would fetch the program data from an API or database
  const program = getMockProgram(id);
  
  if (!program) {
    return {
      title: 'Program Not Found - Study Bridge',
      description: 'The requested program could not be found',
    };
  }
  
  const translations = await getTranslations(locale, ['programs']);
  
  return {
    title: `${program.programName} - ${program.universityName} | Study Bridge`,
    description: `Learn about the ${program.degreeLevel} program in ${program.programName} at ${program.universityName}, including tuition, requirements, and more.`,
  };
}

export default async function ProgramDetailPage({
  params
}: PageParams) {
  const { locale, id } = await params;
  
  const translations = await getTranslations(locale, ['programs', 'common']);
  
  // In a real application, you would fetch the program data from an API or database
  const program = getMockProgram(id);
  
  if (!program) {
    notFound();
  }
  
  return <ProgramDetailClient 
    translations={translations} 
    program={program}
    locale={locale}
  />;
}

// This is a mock function to simulate fetching program data
// In a real application, this would be a database or API call
function getMockProgram(id: string) {
  const programs = [
    {
      id: '1',
      universityName: 'Tsinghua University',
      programName: 'Computer Science and Technology',
      degreeLevel: 'Bachelor',
      duration: '4 years',
      languageRequirements: 'HSK 5 or IELTS 6.5',
      ageRequirements: '18-25',
      availableSeats: 50,
      annualTuition: '30,000 CNY',
      scholarship: true,
      status: 'Open',
      universityRanking: 1,
      description: 'The Computer Science and Technology program at Tsinghua University is designed to provide students with a solid foundation in computer science theory and practical skills. The curriculum covers algorithms, data structures, programming languages, software engineering, artificial intelligence, and more.',
      admissionRequirements: [
        'High school diploma or equivalent',
        'HSK 5 or IELTS 6.5',
        'Mathematics and Physics background',
        'Recommendation letters (2)',
        'Personal statement'
      ],
      curriculum: [
        'Introduction to Computer Science',
        'Data Structures and Algorithms',
        'Computer Architecture',
        'Operating Systems',
        'Database Systems',
        'Software Engineering',
        'Artificial Intelligence',
        'Computer Networks',
        'Machine Learning',
        'Final Year Project'
      ],
      careerProspects: [
        'Software Developer',
        'Systems Analyst',
        'Database Administrator',
        'IT Consultant',
        'Research & Development'
      ],
      applicationDeadline: '2024-04-30',
      startDate: '2024-09-01',
      contactInfo: {
        email: 'admissions@tsinghua.edu.cn',
        phone: '+86 10 6278 xxxx',
        website: 'https://www.tsinghua.edu.cn'
      }
    },
    {
      id: '2',
      universityName: 'Peking University',
      programName: 'International Business',
      degreeLevel: 'Master',
      duration: '2 years',
      languageRequirements: 'HSK 4 or IELTS 6.0',
      ageRequirements: '22-35',
      availableSeats: 30,
      annualTuition: '40,000 CNY',
      scholarship: true,
      status: 'Open',
      universityRanking: 2,
      description: 'The International Business program at Peking University provides a comprehensive education in global business practices, international trade, and cross-cultural management. Students develop skills in business analysis, strategic planning, and international negotiations.',
      admissionRequirements: [
        'Bachelor\'s degree in Business or related field',
        'HSK 4 or IELTS 6.0',
        'Work experience preferred but not required',
        'Recommendation letters (2)',
        'Statement of purpose'
      ],
      curriculum: [
        'Global Business Environment',
        'International Marketing',
        'Cross-Cultural Management',
        'International Finance',
        'Global Supply Chain Management',
        'Business Strategy',
        'Research Methods',
        'Electives in specialization areas',
        'Thesis or Business Project'
      ],
      careerProspects: [
        'International Business Manager',
        'Marketing Manager',
        'Business Consultant',
        'Trade Specialist',
        'Entrepreneur'
      ],
      applicationDeadline: '2024-05-15',
      startDate: '2024-09-01',
      contactInfo: {
        email: 'business@pku.edu.cn',
        phone: '+86 10 6275 xxxx',
        website: 'https://www.pku.edu.cn'
      }
    },
    {
      id: '3',
      universityName: 'Fudan University',
      programName: 'Medicine',
      degreeLevel: 'Bachelor',
      duration: '5 years',
      languageRequirements: 'HSK 5 or IELTS 6.5',
      ageRequirements: '18-25',
      availableSeats: 20,
      annualTuition: '45,000 CNY',
      scholarship: false,
      status: 'Open',
      universityRanking: 3,
      description: 'The Medicine program at Fudan University offers comprehensive medical education with a focus on clinical practice, medical research, and healthcare management. Students receive training in basic medical sciences, clinical medicine, and modern medical technologies.',
      admissionRequirements: [
        'High school diploma with strong science background',
        'HSK 5 or IELTS 6.5',
        'Biology and Chemistry background',
        'Recommendation letters (3)',
        'Personal statement',
        'Interview (for shortlisted candidates)'
      ],
      curriculum: [
        'Human Anatomy',
        'Physiology',
        'Biochemistry',
        'Pathology',
        'Pharmacology',
        'Internal Medicine',
        'Surgery',
        'Pediatrics',
        'Obstetrics and Gynecology',
        'Preventive Medicine',
        'Clinical Rotations',
        'Clinical Internship'
      ],
      careerProspects: [
        'Physician',
        'Medical Researcher',
        'Healthcare Administrator',
        'Public Health Specialist',
        'Medical Educator'
      ],
      applicationDeadline: '2024-04-15',
      startDate: '2024-09-01',
      contactInfo: {
        email: 'medicine@fudan.edu.cn',
        phone: '+86 21 6564 xxxx',
        website: 'https://www.fudan.edu.cn'
      }
    },
    {
      id: '4',
      universityName: 'Shanghai Jiao Tong University',
      programName: 'Mechanical Engineering',
      degreeLevel: 'Master',
      duration: '3 years',
      languageRequirements: 'HSK 4 or IELTS 6.0',
      ageRequirements: '22-35',
      availableSeats: 40,
      annualTuition: '38,000 CNY',
      scholarship: true,
      status: 'Open',
      universityRanking: 4,
      description: 'The Mechanical Engineering program at Shanghai Jiao Tong University focuses on advanced engineering principles, design methodologies, and manufacturing technologies. Students develop expertise in mechanical systems, thermal engineering, and mechatronics.',
      admissionRequirements: [
        'Bachelor\'s degree in Engineering or related field',
        'HSK 4 or IELTS 6.0',
        'Strong background in mathematics and physics',
        'Recommendation letters (2)',
        'Research proposal'
      ],
      curriculum: [
        'Advanced Engineering Mathematics',
        'Mechanical Design',
        'Manufacturing Processes',
        'Thermodynamics',
        'Fluid Mechanics',
        'Robotics and Automation',
        'CAD/CAM Systems',
        'Materials Science',
        'Research Methodology',
        'Thesis Research'
      ],
      careerProspects: [
        'Mechanical Engineer',
        'Product Designer',
        'Manufacturing Engineer',
        'R&D Specialist',
        'Project Manager'
      ],
      applicationDeadline: '2024-05-30',
      startDate: '2024-09-01',
      contactInfo: {
        email: 'engineering@sjtu.edu.cn',
        phone: '+86 21 3420 xxxx',
        website: 'https://www.sjtu.edu.cn'
      }
    },
    {
      id: '5',
      universityName: 'Zhejiang University',
      programName: 'Economics',
      degreeLevel: 'Bachelor',
      duration: '4 years',
      languageRequirements: 'HSK 4 or IELTS 6.0',
      ageRequirements: '18-25',
      availableSeats: 35,
      annualTuition: '32,000 CNY',
      scholarship: true,
      status: 'Closing Soon',
      universityRanking: 5,
      description: 'The Economics program at Zhejiang University provides students with a solid foundation in economic theory, quantitative methods, and policy analysis. Students learn to analyze economic systems, market dynamics, and financial structures.',
      admissionRequirements: [
        'High school diploma or equivalent',
        'HSK 4 or IELTS 6.0',
        'Strong mathematics background',
        'Recommendation letters (2)',
        'Personal statement'
      ],
      curriculum: [
        'Microeconomics',
        'Macroeconomics',
        'Econometrics',
        'Statistics for Economics',
        'International Economics',
        'Financial Economics',
        'Development Economics',
        'Public Economics',
        'Labor Economics',
        'Research Methods',
        'Thesis'
      ],
      careerProspects: [
        'Economist',
        'Financial Analyst',
        'Policy Advisor',
        'Market Researcher',
        'Banking Professional'
      ],
      applicationDeadline: '2024-04-10',
      startDate: '2024-09-01',
      contactInfo: {
        email: 'economics@zju.edu.cn',
        phone: '+86 571 8795 xxxx',
        website: 'https://www.zju.edu.cn'
      }
    }
  ];
  
  return programs.find(program => program.id === id);
} 