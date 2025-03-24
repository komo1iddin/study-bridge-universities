import { FC } from 'react'
import { Link } from '@/i18n/utils'
import { Program } from '@/types/database.types'
import { Locale } from '@/i18n/config'

interface ProgramCardListProps {
  program: Program
  universityName: string
  locale: Locale
  translations?: {
    moreDetails?: string
    apply?: string
    id?: string
    program?: string
    degree?: string
    language?: string
    intake?: string
    scholarship?: string
    deadline?: string
  }
  isHeader?: boolean
}

export const ProgramCardList: FC<ProgramCardListProps> = ({
  program,
  universityName,
  locale,
  translations = {},
  isHeader = false
}) => {
  // Default translations
  const t = {
    moreDetails: translations.moreDetails || 'More Details',
    apply: translations.apply || 'Apply Now',
    id: translations.id || 'ID',
    program: translations.program || 'Program',
    degree: translations.degree || 'Degree',
    language: translations.language || 'Language',
    intake: translations.intake || 'Intake',
    scholarship: translations.scholarship || 'Scholarship',
    deadline: translations.deadline || 'Deadline',
  }

  // Get shortened ID
  const getShortenedId = (id: string) => {
    const parts = id.split('-');
    if (parts.length > 1) {
      // Return all parts except the last one
      return parts[0];
    }
    return id;
  }

  // Get education level display text
  const getEducationLevelDisplay = (level?: string | null) => {
    if (!level) return 'Bachelor';
    
    switch(level) {
      case 'bachelor': return 'Bachelor';
      case 'master': return locale === 'ru' ? 'Магистратура' : locale === 'uz' ? 'Magistratura' : 'Master';
      case 'doctorate': return locale === 'ru' ? 'Докторантура' : locale === 'uz' ? 'Doktorantura' : 'Doctorate';
      case 'language': return locale === 'ru' ? 'Языковые курсы' : locale === 'uz' ? 'Til kurslari' : 'Language Courses';
      default: return 'Bachelor';
    }
  }

  // Extract city from address
  const getCity = () => {
    // Since location is not in Program type, we'll use university city if available
    if (program.university_id) {
      // For now return a placeholder - this should be updated to use university data
      return 'City';
    }
    return '';
  }

  // Get intake date
  const getIntake = () => {
    if (program.start_dates && program.start_dates.length > 0) {
      return program.start_dates[0];
    }
    return 'Sept 2024';
  }

  // Get deadline
  const getDeadline = () => {
    // Since deadline is not in Program type, return a default value
    // This should be updated based on business logic
    return '2024-08-31';
  }

  if (isHeader) {
    return (
      <div className="bg-white sticky top-0 z-10 border-t border-gray-200">
        <div className="bg-gray-100 py-4 px-6">
          <div className="flex-1 min-w-0 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 items-center">
            {/* ID */}
            <div className="hidden lg:block lg:col-span-1">
              <span className="text-sm font-semibold text-gray-900">{t.id}</span>
            </div>
            {/* City */}
            <div className="col-span-1 lg:col-span-1">
              <span className="text-sm font-semibold text-gray-900">City</span>
            </div>
            {/* Degree */}
            <div className="col-span-1 lg:col-span-2">
              <span className="text-sm font-semibold text-gray-900">{t.degree}</span>
            </div>
            {/* Language */}
            <div className="col-span-1 lg:col-span-2">
              <span className="text-sm font-semibold text-gray-900">{t.language}</span>
            </div>
            {/* Intake */}
            <div className="hidden md:block md:col-span-2 lg:col-span-2">
              <span className="text-sm font-semibold text-gray-900">{t.intake}</span>
            </div>
            {/* Scholarship */}
            <div className="hidden md:block md:col-span-2 lg:col-span-2">
              <span className="text-sm font-semibold text-gray-900">{t.scholarship}</span>
            </div>
            {/* Deadline */}
            <div className="col-span-1 lg:col-span-1">
              <span className="text-sm font-semibold text-gray-900">{t.deadline}</span>
            </div>
            {/* Empty column for View Details */}
            <div className="hidden lg:block lg:col-span-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors overflow-x-auto border-b border-gray-100">
      <div className="flex-1 min-w-0 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 items-center">
        {/* ID */}
        <div className="hidden lg:block lg:col-span-1">
          <span className="text-sm text-gray-600">{getShortenedId(program.id)}</span>
        </div>

        {/* City */}
        <div className="col-span-1 lg:col-span-1">
          <span className="text-sm text-gray-600">{getCity()}</span>
        </div>

        {/* Degree */}
        <div className="col-span-1 lg:col-span-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {getEducationLevelDisplay(program.education_level)}
          </span>
        </div>

        {/* Language */}
        <div className="col-span-1 lg:col-span-2">
          <span className="text-sm text-gray-600 capitalize">{program.language || 'N/A'}</span>
        </div>

        {/* Intake */}
        <div className="hidden md:block md:col-span-2 lg:col-span-2">
          <span className="text-sm text-gray-600">{getIntake()}</span>
        </div>

        {/* Scholarship */}
        <div className="hidden md:block md:col-span-2 lg:col-span-2">
          {program.tuition_usd && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Available
            </span>
          )}
        </div>

        {/* Deadline */}
        <div className="col-span-1 lg:col-span-1">
          <span className="text-sm text-gray-600">{getDeadline()}</span>
        </div>

        {/* View Details */}
        <div className="hidden lg:block lg:col-span-1">
          <Link
            href={`/programs/${program.id}`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            {t.moreDetails}
          </Link>
        </div>
      </div>
      
      {/* Mobile View Details Button */}
      <div className="lg:hidden ml-4">
        <Link
          href={`/programs/${program.id}`}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
        >
          {t.moreDetails}
        </Link>
      </div>
    </div>
  )
} 