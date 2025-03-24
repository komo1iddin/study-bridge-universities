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
import { getAdminPrograms } from '@/lib/admin-db';
import { Program } from '@/types/database.types';

interface PageParams {
  params: {
    locale: Locale;
  };
}

interface ProgramWithUniversity extends Program {
  university?: {
    name: string;
  };
}

export default function ProgramsPage({ params }: PageParams) {
  const { locale } = params;
  
  // State for programs data with loading and error states
  const [programs, setPrograms] = useState<ProgramWithUniversity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Search state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Fetch programs from API
  useEffect(() => {
    async function fetchPrograms() {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getAdminPrograms({ 
          page, 
          limit, 
          search: debouncedSearch 
        });
        
        setPrograms(result.programs);
        setTotal(result.total);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPrograms();
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

  // Format duration for display
  const formatDuration = (years: number) => {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  };

  return (
    <div>
      <AdminHeader 
        title="Programs Management" 
        breadcrumbs={[
          { name: 'Admin', href: '/admin' },
          { name: 'Programs' }
        ]}
      />
      
      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto flex gap-2">
            <Input
              type="text"
              placeholder="Search programs..."
              className="max-w-xs"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          
          <Link href="/admin/programs/new">
            <Button className="w-full sm:w-auto">
              Add Program
            </Button>
          </Link>
        </div>
        
        {/* Programs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Language</TableHead>
                <TableHead className="text-center">Format</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No programs found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.university ? program.university.name : 'Unknown'}</TableCell>
                    <TableCell className="capitalize">{program.education_level}</TableCell>
                    <TableCell>{formatDuration(program.duration || 0)}</TableCell>
                    <TableCell className="capitalize">{program.language}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        program.format === 'fulltime' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {program.format === 'fulltime' ? 'Full-time' : 'Part-time'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/programs/${program.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link href={`/admin/programs/${program.id}/edit`}>
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
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                  <span className="font-medium">124</span> programs
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button variant="outline" size="sm" className="rounded-l-md">Previous</Button>
                  <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-500">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm" className="rounded-r-md">Next</Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 