'use client';

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

export default function ScholarshipsPage({ params }: PageParams) {
  const { locale } = params;
  
  // Mock scholarships data (would be fetched from API)
  const scholarships = [
    { 
      id: 1, 
      name: 'Chinese Government Scholarship (CGS)', 
      provider: 'Chinese Scholarship Council',
      coverage: 'Full Tuition, Accommodation, Stipend',
      deadline: '2023-01-15',
      eligibility: 'International Students',
      amount: '$15,000/year',
      active: true 
    },
    { 
      id: 2, 
      name: 'Tsinghua University Presidential Scholarship', 
      provider: 'Tsinghua University',
      coverage: 'Full Tuition, Partial Living Expenses',
      deadline: '2023-02-28',
      eligibility: 'International Students with Excellent Academic Records',
      amount: '$10,000/year',
      active: true 
    },
    { 
      id: 3, 
      name: 'Peking University Fellowship', 
      provider: 'Peking University',
      coverage: 'Tuition Waiver, Monthly Stipend',
      deadline: '2023-03-15',
      eligibility: 'Graduate Students with Research Potential',
      amount: '$8,000/year',
      active: true 
    },
    { 
      id: 4, 
      name: 'Shanghai Government Scholarship', 
      provider: 'Shanghai Municipal Education Commission',
      coverage: 'Tuition, Insurance, Living Allowance',
      deadline: '2023-04-10',
      eligibility: 'International Students Studying in Shanghai',
      amount: '$12,000/year',
      active: true 
    },
    { 
      id: 5, 
      name: 'Confucius Institute Scholarship', 
      provider: 'Hanban / Confucius Institute Headquarters',
      coverage: 'Tuition, Accommodation, Living Allowance, Insurance',
      deadline: '2023-03-01',
      eligibility: 'Non-Chinese Citizens',
      amount: 'Varies',
      active: false 
    },
  ];

  return (
    <div>
      <AdminHeader 
        title="Scholarships Management" 
        breadcrumbs={[
          { name: 'Admin', href: '/admin' },
          { name: 'Scholarships' }
        ]}
      />
      
      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto flex gap-2">
            <Input
              type="text"
              placeholder="Search scholarships..."
              className="max-w-xs"
            />
          </div>
          
          <Link href="/admin/scholarships/new">
            <Button className="w-full sm:w-auto">
              Add Scholarship
            </Button>
          </Link>
        </div>
        
        {/* Scholarships Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scholarship Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scholarships.map((scholarship) => (
                <TableRow key={scholarship.id}>
                  <TableCell className="font-medium">{scholarship.name}</TableCell>
                  <TableCell>{scholarship.provider}</TableCell>
                  <TableCell>{scholarship.coverage}</TableCell>
                  <TableCell>{scholarship.amount}</TableCell>
                  <TableCell>{scholarship.deadline}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      scholarship.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {scholarship.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/scholarships/${scholarship.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/admin/scholarships/${scholarship.id}/edit`}>
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
                  <span className="font-medium">18</span> scholarships
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