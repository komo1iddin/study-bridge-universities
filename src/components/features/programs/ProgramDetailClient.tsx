'use client';

import React from 'react';
import { Link } from '@/i18n/utils';

interface Program {
  id: string;
  universityName: string;
  programName: string;
  degreeLevel: string;
  duration: string;
  languageRequirements: string;
  ageRequirements: string;
  availableSeats: number;
  annualTuition: string;
  scholarship: boolean;
  status: string;
  universityRanking: number;
  description: string;
  admissionRequirements: string[];
  curriculum: string[];
  careerProspects: string[];
  applicationDeadline: string;
  startDate: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
}

interface ProgramDetailClientProps {
  translations: {
    programs?: Record<string, unknown>;
    common?: Record<string, unknown>;
  };
  program: Program;
  locale: string;
}

export default function ProgramDetailClient({ translations, program, locale }: ProgramDetailClientProps) {
  const t = (key: string): string => {
    const parts = key.split('.');
    let result: Record<string, unknown> | string = translations.programs || {};
    
    for (const part of parts) {
      if (result && typeof result === 'object') {
        result = result[part] as Record<string, unknown> | string;
      } else {
        return key; // Fallback to the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/programs" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('detail.backToPrograms') || 'Back to Programs'}
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{program.programName}</h1>
              <p className="text-blue-600 font-medium text-lg">{program.universityName}</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {program.degreeLevel}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">{t('detail.overview') || 'Program Overview'}</h2>
              <p className="text-gray-700 mb-6">{program.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('card.duration') || 'Duration'}</h3>
                  <p>{program.duration}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('card.languageRequirements') || 'Language Requirements'}</h3>
                  <p>{program.languageRequirements}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('card.ageRequirements') || 'Age Requirements'}</h3>
                  <p>{program.ageRequirements}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('card.availableSeats') || 'Available Seats'}</h3>
                  <p>{program.availableSeats}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('card.annualTuition') || 'Annual Tuition'}</h3>
                  <p>{program.annualTuition}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('detail.applicationDeadline') || 'Application Deadline'}</h3>
                  <p>{formatDate(program.applicationDeadline)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('detail.startDate') || 'Start Date'}</h3>
                  <p>{formatDate(program.startDate)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('card.ranking') || 'University Ranking'}</h3>
                  <p>#{program.universityRanking} in China</p>
                </div>
              </div>
              
              <div className="mb-6 flex items-center gap-6">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${program.scholarship ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">{program.scholarship ? (t('card.scholarshipAvailable') || 'Scholarship Available') : (t('card.noScholarship') || 'No Scholarship')}</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${program.status === 'Open' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm">{program.status}</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">{t('detail.contactInformation') || 'Contact Information'}</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('detail.email') || 'Email'}</h3>
                    <a href={`mailto:${program.contactInfo.email}`} className="text-blue-600 hover:text-blue-800">
                      {program.contactInfo.email}
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('detail.phone') || 'Phone'}</h3>
                    <p>{program.contactInfo.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('detail.website') || 'Website'}</h3>
                    <a href={program.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {program.contactInfo.website}
                    </a>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {t('detail.applyNow') || 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('detail.admissionRequirements') || 'Admission Requirements'}</h2>
              <ul className="list-disc pl-5 space-y-2">
                {program.admissionRequirements.map((requirement, index) => (
                  <li key={index} className="text-gray-700">{requirement}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('detail.careerProspects') || 'Career Prospects'}</h2>
              <ul className="list-disc pl-5 space-y-2">
                {program.careerProspects.map((career, index) => (
                  <li key={index} className="text-gray-700">{career}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('detail.curriculum') || 'Curriculum'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {program.curriculum.map((course, index) => (
                <div key={index} className="border p-3 rounded-lg">
                  <p>{course}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 