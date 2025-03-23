'use client'

import { FC } from 'react'
import Link from 'next/link'
import { Program } from '@/types/database.types'
import { Locale } from '@/i18n/config'

// Icons
const GlobeIcon = () => (
  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3C14.5013 5.73835 15.9228 9.29203 16 13C15.9228 16.708 14.5013 20.2616 12 23C9.49872 20.2616 8.07725 16.708 8 13C8.07725 9.29203 9.49872 5.73835 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CurrencyIcon = () => (
  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
    <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="currentColor"/>
    <path d="M13 7H11V14H13V7Z" fill="currentColor"/>
  </svg>
)

interface ProgramCardProps {
  program: Program
  universityName: string
  locale: Locale
  translations?: {
    top50?: string
    openEnrollment?: string
    scholarship?: string
    bachelor?: string
    years?: string
    languageRequirements?: string
    age?: string
    seats?: string
    tuition?: string
    perYear?: string
    otherPrograms?: string
    moreDetails?: string
  }
}

export const ProgramCard: FC<ProgramCardProps> = ({
  program,
  universityName,
  locale,
  translations = {}
}) => {
  // Default translations if not provided
  const t = {
    top50: translations.top50 || 'Top 50',
    openEnrollment: translations.openEnrollment || 'Enrollment Open',
    scholarship: translations.scholarship || 'Scholarship Available',
    bachelor: translations.bachelor || 'Bachelor',
    years: translations.years || 'years',
    languageRequirements: translations.languageRequirements || 'Language Requirements',
    age: translations.age || 'Age',
    seats: translations.seats || 'Available Seats',
    tuition: translations.tuition || 'Tuition',
    perYear: translations.perYear || '/year',
    otherPrograms: translations.otherPrograms || 'Other Programs',
    moreDetails: translations.moreDetails || 'More Details'
  }

  // Get education level display text
  const getEducationLevelDisplay = (level?: string | null) => {
    if (!level) return t.bachelor;
    
    switch(level) {
      case 'bachelor': return t.bachelor;
      case 'master': return locale === 'ru' ? 'Магистратура' : locale === 'uz' ? 'Magistratura' : 'Master';
      case 'doctorate': return locale === 'ru' ? 'Докторантура' : locale === 'uz' ? 'Doktorantura' : 'Doctorate';
      case 'language': return locale === 'ru' ? 'Языковые курсы' : locale === 'uz' ? 'Til kurslari' : 'Language Courses';
      default: return t.bachelor;
    }
  }

  // Get language requirements display
  const getLanguageRequirements = () => {
    if (program.requirements?.language?.english) {
      return program.requirements.language.english;
    } else if (program.requirements?.language?.chinese) {
      return program.requirements.language.chinese;
    }
    
    // Default values based on program.language
    if (program.language === 'english') {
      return 'IELTS 6.0';
    } else if (program.language === 'chinese') {
      return 'HSK 4';
    } else if (program.language === 'mixed') {
      return 'HSK 4 / IELTS 6.0';
    }
    
    return 'HSK 4 / IELTS 6.0';
  }

  // Get university acronym from name
  const getUniversityAcronym = (name: string) => {
    // Try to extract initials from words
    const words = name.split(' ');
    if (words.length >= 2) {
      return words
        .filter(word => word.length > 0 && /[A-Za-z]/.test(word[0]))
        .slice(0, 3)
        .map(word => word[0].toUpperCase())
        .join('');
    }
    
    // If we can't get good initials, just return the first 3 chars
    return name.substring(0, 3).toUpperCase();
  }
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* University header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-medium text-gray-800">{universityName}</h3>
            <div className="flex space-x-2 mt-1">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {t.top50}
              </span>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {t.openEnrollment}
              </span>
            </div>
          </div>
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">{getUniversityAcronym(universityName)}</span>
          </div>
        </div>
      </div>

      {/* Program details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{program.name}</h2>
            <div className="mt-2">
              <span className="inline-block bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-sm font-medium">
                {getEducationLevelDisplay(program.education_level)}
              </span>
              {program.tuition && (
                <span className="inline-flex items-center ml-2 text-green-600 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t.scholarship}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center text-gray-700">
              <ClockIcon />
              <span className="ml-1.5">{program.duration || 4} {t.years}</span>
            </span>
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-start">
            <GlobeIcon />
            <div className="ml-2.5">
              <p className="text-xs text-gray-500 font-medium">{t.languageRequirements}</p>
              <p className="text-sm font-medium">{getLanguageRequirements()}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <UsersIcon />
            <div className="ml-2.5">
              <p className="text-xs text-gray-500 font-medium">{t.age}</p>
              <p className="text-sm font-medium">
                {locale === 'ru' ? '18-25 лет' : locale === 'uz' ? '18-25 yosh' : '18-25 years'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <UsersIcon />
            <div className="ml-2.5">
              <p className="text-xs text-gray-500 font-medium">{t.seats}</p>
              <p className="text-sm font-medium">
                {locale === 'ru' ? '50 мест' : locale === 'uz' ? '50 o\'rin' : '50 seats'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CurrencyIcon />
            <div className="ml-2.5">
              <p className="text-xs text-gray-500 font-medium">{t.tuition}</p>
              <p className="text-sm font-medium">{program.tuition ? `${program.tuition.toLocaleString()} ¥` : '25,000 ¥'}{t.perYear}</p>
            </div>
          </div>
        </div>

        {/* Other programs and CTA */}
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <div>
            <Link 
              href={`/${locale}/universities/${program.university_id}`}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t.otherPrograms}
            </Link>
          </div>
          <Link 
            href={`/${locale}/programs/${program.id}`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {t.moreDetails}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
} 