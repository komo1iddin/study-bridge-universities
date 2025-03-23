'use client';

import { useState } from 'react';
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
}

interface ProgramsClientProps {
  translations: {
    programs?: Record<string, unknown>;
    common?: Record<string, unknown>;
  };
  programs: Program[];
  popularFilters: string[];
  locale: string;
}

export default function ProgramsClient({ translations, programs: initialPrograms, popularFilters, locale }: ProgramsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState<string | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<boolean | null>(null);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(initialPrograms);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    filterPrograms();
  };
  
  const filterPrograms = () => {
    let filtered = [...initialPrograms];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(program => 
        program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.universityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply degree level filter
    if (selectedDegreeLevel) {
      filtered = filtered.filter(program => program.degreeLevel === selectedDegreeLevel);
    }
    
    // Apply scholarship filter
    if (selectedScholarship !== null) {
      filtered = filtered.filter(program => program.scholarship === selectedScholarship);
    }
    
    setFilteredPrograms(filtered);
  };
  
  const handleFilterClick = (filter: string) => {
    if (filter === 'Scholarship Available') {
      setSelectedScholarship(true);
    } else if (filter === 'Bachelor' || filter === 'Master') {
      setSelectedDegreeLevel(filter);
    } else {
      setSearchTerm(filter);
    }
    
    // Apply filters immediately after setting state
    setTimeout(filterPrograms, 0);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('title') || 'Study Programs'}</h1>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-5">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex flex-wrap md:flex-nowrap gap-3 items-center">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder') || 'Search programs or universities...'}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>{t('filters.advancedFilters') || 'Filters'}</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 text-sm font-medium"
                >
                  {t('searchButton') || 'Search'}
                </button>
              </div>
            </div>
          </form>
          
          {/* Advanced Filters, shown conditionally */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('filters.degreeLevel') || 'Degree Level'}
                  </label>
                  <select
                    value={selectedDegreeLevel || ''}
                    onChange={(e) => setSelectedDegreeLevel(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="">{t('filters.all') || 'All'}</option>
                    <option value="Bachelor">{t('filters.bachelor') || 'Bachelor'}</option>
                    <option value="Master">{t('filters.master') || 'Master'}</option>
                    <option value="PhD">{t('filters.phd') || 'PhD'}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('filters.scholarship') || 'Scholarship'}
                  </label>
                  <select
                    value={selectedScholarship === null ? '' : selectedScholarship ? 'true' : 'false'}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedScholarship(value === '' ? null : value === 'true');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="">{t('filters.all') || 'All'}</option>
                    <option value="true">{t('filters.available') || 'Available'}</option>
                    <option value="false">{t('filters.notAvailable') || 'Not Available'}</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDegreeLevel(null);
                      setSelectedScholarship(null);
                      setFilteredPrograms(initialPrograms);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    {t('filters.reset') || 'Reset Filters'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Popular Filters/Keywords */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{t('popularFilters') || 'Popular Filters'}</h2>
        <div className="flex flex-wrap gap-2">
          {popularFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleFilterClick(filter)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors flex items-center"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Program Cards */}
      <div className="space-y-6">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-100">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{program.programName}</h2>
                    <p className="text-blue-600 font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {program.universityName}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {program.degreeLevel}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      program.status === 'Open' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 mb-4">
                  <div className="flex items-start gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{t('card.duration') || 'Duration'}</p>
                      <p className="text-sm">{program.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{t('card.languageRequirements') || 'Language'}</p>
                      <p className="text-sm">{program.languageRequirements}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{t('card.ageRequirements') || 'Age'}</p>
                      <p className="text-sm">{program.ageRequirements}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{t('card.availableSeats') || 'Seats'}</p>
                      <p className="text-sm">{program.availableSeats}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{t('card.annualTuition') || 'Tuition'}</p>
                      <p className="text-sm">{program.annualTuition}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{t('card.ranking') || 'Ranking'}</p>
                      <p className="text-sm">#{program.universityRanking} in China</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mr-1.5 ${program.scholarship ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs font-medium">{program.scholarship ? (t('card.scholarshipAvailable') || 'Scholarship Available') : (t('card.noScholarship') || 'No Scholarship')}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/${locale}/programs/${program.id}`}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    {t('card.detailsButton') || 'View Details'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">{t('noResults') || 'No programs found matching your criteria.'}</p>
          </div>
        )}
      </div>
    </div>
  );
} 