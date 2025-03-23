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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder') || 'Search programs or universities...'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('searchButton') || 'Search'}
            </button>
          </div>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filters.degreeLevel') || 'Degree Level'}
            </label>
            <select
              value={selectedDegreeLevel || ''}
              onChange={(e) => setSelectedDegreeLevel(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('filters.reset') || 'Reset Filters'}
            </button>
          </div>
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
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
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
            <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{program.programName}</h2>
                    <p className="text-blue-600 font-medium">{program.universityName}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {program.degreeLevel}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
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
                    <h3 className="text-sm font-medium text-gray-500">{t('card.ranking') || 'University Ranking'}</h3>
                    <p>#{program.universityRanking} in China</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${program.scholarship ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">{program.scholarship ? (t('card.scholarshipAvailable') || 'Scholarship Available') : (t('card.noScholarship') || 'No Scholarship')}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${program.status === 'Open' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm">{program.status}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link 
                    href={`/${locale}/programs/${program.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('card.detailsButton') || 'View Details'}
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