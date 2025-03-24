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

export default function UsersPage({ params }: PageParams) {
  const { locale } = params;
  
  // Mock users data (would be fetched from API)
  const users = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@example.com',
      role: 'Admin',
      lastLogin: '2023-03-15 14:30',
      joined: '2022-11-10',
      active: true 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com',
      role: 'User',
      lastLogin: '2023-03-14 09:45',
      joined: '2022-12-05',
      active: true 
    },
    { 
      id: 3, 
      name: 'Michael Johnson', 
      email: 'michael.johnson@example.com',
      role: 'User',
      lastLogin: '2023-03-10 16:20',
      joined: '2023-01-12',
      active: true 
    },
    { 
      id: 4, 
      name: 'Emily Brown', 
      email: 'emily.brown@example.com',
      role: 'Editor',
      lastLogin: '2023-03-12 11:15',
      joined: '2022-10-25',
      active: true 
    },
    { 
      id: 5, 
      name: 'David Wilson', 
      email: 'david.wilson@example.com',
      role: 'User',
      lastLogin: '2023-02-28 08:30',
      joined: '2023-02-01',
      active: false 
    },
    { 
      id: 6, 
      name: 'Sarah Martinez', 
      email: 'sarah.martinez@example.com',
      role: 'User',
      lastLogin: '2023-03-13 10:05',
      joined: '2023-01-20',
      active: true 
    },
    { 
      id: 7, 
      name: 'Robert Taylor', 
      email: 'robert.taylor@example.com',
      role: 'Editor',
      lastLogin: '2023-03-14 13:45',
      joined: '2022-12-15',
      active: true 
    },
  ];

  return (
    <div>
      <AdminHeader 
        title="Users Management" 
        breadcrumbs={[
          { name: 'Admin', href: '/admin' },
          { name: 'Users' }
        ]}
      />
      
      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto flex gap-2">
            <Input
              type="text"
              placeholder="Search users..."
              className="max-w-xs"
            />
            <select className="h-10 rounded-md border border-input px-3 py-2 text-sm">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <Link href="/admin/users/new">
            <Button className="w-full sm:w-auto">
              Add User
            </Button>
          </Link>
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'Editor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/admin/users/${user.id}/edit`}>
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">7</span> of{' '}
                  <span className="font-medium">215</span> users
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