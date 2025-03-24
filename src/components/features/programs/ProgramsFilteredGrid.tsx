'use client';

import { useState, useEffect } from 'react';
import { ProgramCard } from '@/components/cards/ProgramCard';
import { ProgramCardList } from '@/components/cards/ProgramCardList';
import { Program } from '@/types/database.types';
import { Locale } from '@/i18n/config';
import { Link } from '@/i18n/utils';

interface ProgramsFilteredGridProps {
  programs: Program[];
  universityMap: Record<string, string>;
  locale: Locale;
  translations: Record<string, string>;
  popularFilters: string[];
}

export default function ProgramsFilteredGrid({ 
  programs, 
  universityMap, 
  locale, 
  translations, 
  popularFilters 
}: ProgramsFilteredGridProps) {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedPrograms, setDisplayedPrograms] = useState<Program[]>(programs);
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [showScholarshipOnly, setShowScholarshipOnly] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Effect to count active filters
  useEffect(() => {
    let count = 0;
    if (selectedDegreeLevel) count++;
    if (selectedLanguage) count++;
    if (selectedFormat) count++;
    if (showScholarshipOnly) count++;
    setActiveFiltersCount(count);
  }, [selectedDegreeLevel, selectedLanguage, selectedFormat, showScholarshipOnly]);

  // Effect to filter programs when any filter changes
  useEffect(() => {
    filterPrograms();
  }, [searchTerm, selectedDegreeLevel, selectedLanguage, selectedFormat, showScholarshipOnly]);

  // Function to open modal with animation
  const openFilterModal = () => {
    setIsModalAnimating(true);
    setShowFilterModal(true);
  };

  // Function to close modal with animation
  const closeFilterModal = () => {
    setIsModalAnimating(true);
    setTimeout(() => {
      setShowFilterModal(false);
      setIsModalAnimating(false);
    }, 300);
  };

  // Function to filter programs based on all active filters
  const filterPrograms = () => {
    let filtered = [...programs];

    // Filter by search term (program name, university name, or specialization)
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(program => {
        const universityName = universityMap[program.university_id]?.toLowerCase() || '';
        const programName = program.name.toLowerCase();
        const specialization = program.specialization?.toLowerCase() || '';
        
        return programName.includes(lowercaseSearch) || 
               universityName.includes(lowercaseSearch) || 
               specialization.includes(lowercaseSearch);
      });
    }

    // Filter by degree level
    if (selectedDegreeLevel) {
      filtered = filtered.filter(program => program.education_level === selectedDegreeLevel);
    }

    // Filter by language
    if (selectedLanguage) {
      filtered = filtered.filter(program => program.language === selectedLanguage);
    }

    // Filter by format
    if (selectedFormat) {
      filtered = filtered.filter(program => program.format === selectedFormat);
    }

    // Filter by scholarship
    if (showScholarshipOnly) {
      filtered = filtered.filter(program => program.tuition_usd !== undefined || 
        (program.description && program.description.toLowerCase().includes('scholarship')));
    }

    setDisplayedPrograms(filtered);
  };

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    filterPrograms();
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedDegreeLevel(null);
    setSelectedLanguage(null);
    setSelectedFormat(null);
    setShowScholarshipOnly(false);
  };

  // Handle popular filter click
  const handlePopularFilterClick = (filter: string) => {
    setSearchTerm(filter);
    handleSearch();
  };

  return (
    <div>
      {/* Centered Modern Search Bar */}
      <div className="mb-12">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={translations.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                aria-label="Search programs"
              />
            </div>
            
            <div className="flex gap-2">
              {/* Apply Search Button */}
              <button 
                type="submit"
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{translations.applyFilters || 'Apply Search'}</span>
              </button>
              
              {/* Filter Button */}
              <button
                type="button"
                onClick={openFilterModal}
                className="relative px-5 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium flex items-center gap-2"
              >
                <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                <span>{translations.filterTitle || 'Filters'}</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Redesigned Popular Filters with enhanced visual appeal */}
      <div className="mb-12 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-center">{translations.popularFilters || 'Popular Keywords'}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {popularFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handlePopularFilterClick(filter)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow border border-blue-100"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List
            </span>
          </button>
        </div>
      </div>

      {/* Improved Modal with backdrop blur */}
      {showFilterModal && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
            isModalAnimating ? 'animate-fadeIn' : ''
          }`}
          onClick={closeFilterModal}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Modal content */}
          <div 
            className={`relative bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[85vh] overflow-auto ${
              isModalAnimating ? 'animate-scaleIn' : ''
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {translations.filterTitle || 'Filters'}
                </h3>
                <button 
                  onClick={closeFilterModal}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal body */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Degree Level Filter */}
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    {translations.degreeLevel || 'Degree Level'}
                  </label>
                  <select
                    value={selectedDegreeLevel || ''}
                    onChange={(e) => setSelectedDegreeLevel(e.target.value || null)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="master">Master</option>
                    <option value="doctorate">Doctorate</option>
                    <option value="language">Language</option>
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    {translations.language || 'Language'}
                  </label>
                  <select
                    value={selectedLanguage || ''}
                    onChange={(e) => setSelectedLanguage(e.target.value || null)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="english">English</option>
                    <option value="chinese">Chinese</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Format Filter */}
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    {translations.format || 'Format'}
                  </label>
                  <select
                    value={selectedFormat || ''}
                    onChange={(e) => setSelectedFormat(e.target.value || null)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="fulltime">Full-time</option>
                    <option value="online">Online</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Scholarship Filter */}
                <div className="flex items-center h-full pt-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showScholarshipOnly}
                      onChange={(e) => setShowScholarshipOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {translations.scholarshipAvailable || 'Scholarship Available'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {translations.resetFilters || 'Reset Filters'}
                </button>
                <button
                  onClick={() => {
                    filterPrograms();
                    closeFilterModal();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {translations.applyFilters || 'Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Programs Display */}
      {displayedPrograms.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayedPrograms.map((program) => (
              <div key={program.id} className="bg-white rounded-xl shadow-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 overflow-hidden">
                <ProgramCard
                  program={program}
                  universityName={universityMap[program.university_id] || `University ${program.university_id}`}
                  locale={locale}
                  translations={translations}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden divide-y divide-gray-200">
            <ProgramCardList
              program={{} as Program}
              universityName=""
              locale={locale}
              translations={translations}
              isHeader={true}
            />
            {displayedPrograms.map((program) => (
              <ProgramCardList
                key={program.id}
                program={program}
                universityName={universityMap[program.university_id] || `University ${program.university_id}`}
                locale={locale}
                translations={translations}
              />
            ))}
          </div>
        )
      ) : (
        <div className="py-16 text-center bg-white rounded-xl shadow-sm">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">{translations.noResults || 'No programs found'}</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">Try adjusting your filters or search criteria</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                resetFilters();
                setDisplayedPrograms(programs);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {translations.resetFilters || 'Reset Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 