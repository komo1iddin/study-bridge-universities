import { useState } from 'react';
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

interface PageParams {
  params: {
    locale: Locale;
  };
}

export default function ProgramsPage({ params }: PageParams) {
  const { locale } = params;
  
  // Mock programs data (would be fetched from API)
  const programs = [
    { 
      id: 1, 
      name: 'Computer Science', 
      university: 'Tsinghua University', 
      level: 'Masters', 
      duration: '2 years',
      language: 'English',
      applicationDeadline: '2023-05-15',
      active: true 
    },
    { 
      id: 2, 
      name: 'Electrical Engineering', 
      university: 'Peking University', 
      level: 'Masters', 
      duration: '2 years',
      language: 'English',
      applicationDeadline: '2023-04-30',
      active: true 
    },
    { 
      id: 3, 
      name: 'Data Science', 
      university: 'Fudan University', 
      level: 'Masters', 
      duration: '2 years',
      language: 'English',
      applicationDeadline: '2023-05-10',
      active: true 
    },
    { 
      id: 4, 
      name: 'Mechanical Engineering', 
      university: 'Shanghai Jiao Tong University', 
      level: 'Bachelor', 
      duration: '4 years',
      language: 'Chinese',
      applicationDeadline: '2023-06-15',
      active: true 
    },
    { 
      id: 5, 
      name: 'Business Administration', 
      university: 'Zhejiang University', 
      level: 'Masters', 
      duration: '2 years',
      language: 'English',
      applicationDeadline: '2023-05-20',
      active: false 
    },
  ];

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
                <TableHead>Application Deadline</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>{program.university}</TableCell>
                  <TableCell>{program.level}</TableCell>
                  <TableCell>{program.duration}</TableCell>
                  <TableCell>{program.language}</TableCell>
                  <TableCell>{program.applicationDeadline}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      program.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {program.active ? 'Active' : 'Inactive'}
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
              ))}
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