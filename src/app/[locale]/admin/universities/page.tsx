'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n/config';
import { Link } from '@/i18n/utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getAdminUniversities } from '@/lib/admin-db';
import { University } from '@/types/database.types';

interface PageParams {
  params: {
    locale: Locale;
  };
}

interface UniversityWithProgramCount extends University {
  programCount?: number;
  programs?: {
    count: number;
  };
}

export default function UniversitiesPage({ params }: PageParams) {
  const { locale } = params;
  
  // State for universities data with loading and error states
  const [universities, setUniversities] = useState<UniversityWithProgramCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Search state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Fetch universities from API
  useEffect(() => {
    async function fetchUniversities() {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getAdminUniversities({ 
          page, 
          limit, 
          search: debouncedSearch 
        });
        
        setUniversities(result.universities);
        setTotal(result.total);
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Failed to load universities. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUniversities();
  }, [page, limit, debouncedSearch]);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      <AdminHeader 
        title="Universities Management" 
        breadcrumbs={[
          { name: 'Admin', href: '/admin' },
          { name: 'Universities' }
        ]}
      />
      
      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto flex gap-2">
            <Input
              type="text"
              placeholder="Search universities..."
              className="max-w-xs"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          
          <Link href="/admin/universities/new">
            <Button className="w-full sm:w-auto">
              Add University
            </Button>
          </Link>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && !error && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Universities Table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Programs</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No universities found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  universities.map((university) => (
                    <TableRow key={university.id}>
                      <TableCell className="font-medium">{university.name}</TableCell>
                      <TableCell>{university.city}, {university.province}</TableCell>
                      <TableCell className="text-center">{university.programs?.count || 0}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          university.has_english_programs 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {university.has_english_programs ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/universities/${university.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          <Link href={`/admin/universities/${university.id}/edit`}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </Link>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextPage}
                  disabled={page * limit >= total}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
                    <span className="font-medium">{total}</span> universities
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-l-md"
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    
                    {/* Generate page numbers */}
                    {Array.from({ length: Math.ceil(total / limit) }).slice(0, 5).map((_, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        className={page === index + 1 ? "bg-blue-50 text-blue-600 border-blue-500" : ""}
                        onClick={() => setPage(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-r-md"
                      onClick={handleNextPage}
                      disabled={page * limit >= total}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 