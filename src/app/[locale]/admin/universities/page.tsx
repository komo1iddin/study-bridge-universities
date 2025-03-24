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

export default function UniversitiesPage({ params }: PageParams) {
  const { locale } = params;
  
  // Mock universities data (would be fetched from API)
  const universities = [
    { id: 1, name: 'Tsinghua University', location: 'Beijing, China', programCount: 42, active: true },
    { id: 2, name: 'Peking University', location: 'Beijing, China', programCount: 38, active: true },
    { id: 3, name: 'Fudan University', location: 'Shanghai, China', programCount: 29, active: true },
    { id: 4, name: 'Shanghai Jiao Tong University', location: 'Shanghai, China', programCount: 31, active: true },
    { id: 5, name: 'Zhejiang University', location: 'Hangzhou, China', programCount: 27, active: true },
    { id: 6, name: 'University of Science and Technology of China', location: 'Hefei, China', programCount: 24, active: false },
    { id: 7, name: 'Nanjing University', location: 'Nanjing, China', programCount: 22, active: true },
    { id: 8, name: 'Wuhan University', location: 'Wuhan, China', programCount: 19, active: true },
  ];

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
            />
          </div>
          
          <Link href="/admin/universities/new">
            <Button className="w-full sm:w-auto">
              Add University
            </Button>
          </Link>
        </div>
        
        {/* Universities Table */}
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
              {universities.map((university) => (
                <TableRow key={university.id}>
                  <TableCell className="font-medium">{university.name}</TableCell>
                  <TableCell>{university.location}</TableCell>
                  <TableCell className="text-center">{university.programCount}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      university.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {university.active ? 'Active' : 'Inactive'}
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                  <span className="font-medium">32</span> universities
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