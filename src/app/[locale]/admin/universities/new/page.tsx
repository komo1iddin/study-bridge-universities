'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/utils';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createUniversity } from '@/lib/admin-db';
import { Locale } from '@/i18n/config';

interface PageParams {
  params: {
    locale: Locale;
  };
}

export default function NewUniversityPage({ params }: PageParams) {
  const { locale } = params;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    chinese_name: '',
    province: '',
    city: '',
    type: 'government' as 'government' | 'private',
    ranking: 0,
    has_english_programs: true,
    has_dormitory: true,
    tuition_min: 0,
    tuition_max: 0,
    description: '',
    website_url: '',
  });
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Handle number input change
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create university in the database
      await createUniversity(formData);
      
      // Redirect to universities list
      router.push(`/${locale}/admin/universities`);
    } catch (err) {
      console.error('Error creating university:', err);
      setError('Failed to create university. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <AdminHeader 
        title="Add University" 
        breadcrumbs={[
          { name: 'Admin', href: '/admin' },
          { name: 'Universities', href: '/admin/universities' },
          { name: 'Add University' }
        ]}
      />
      
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  University Name (English)*
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Tsinghua University"
                />
              </div>
              
              {/* Chinese Name */}
              <div>
                <label htmlFor="chinese_name" className="block text-sm font-medium text-gray-700 mb-1">
                  University Name (Chinese)
                </label>
                <Input
                  id="chinese_name"
                  name="chinese_name"
                  value={formData.chinese_name}
                  onChange={handleChange}
                  placeholder="e.g., 清华大学"
                />
              </div>
              
              {/* Province */}
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                  Province*
                </label>
                <Input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Beijing"
                />
              </div>
              
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Beijing"
                />
              </div>
              
              {/* University Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  University Type*
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="government">Government</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              {/* Ranking */}
              <div>
                <label htmlFor="ranking" className="block text-sm font-medium text-gray-700 mb-1">
                  Ranking
                </label>
                <Input
                  id="ranking"
                  name="ranking"
                  type="number"
                  min="0"
                  value={formData.ranking}
                  onChange={handleNumberChange}
                  placeholder="e.g., 10"
                />
              </div>
              
              {/* Tuition Min */}
              <div>
                <label htmlFor="tuition_min" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Tuition (CNY/year)
                </label>
                <Input
                  id="tuition_min"
                  name="tuition_min"
                  type="number"
                  min="0"
                  value={formData.tuition_min}
                  onChange={handleNumberChange}
                  placeholder="e.g., 20000"
                />
              </div>
              
              {/* Tuition Max */}
              <div>
                <label htmlFor="tuition_max" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Tuition (CNY/year)
                </label>
                <Input
                  id="tuition_max"
                  name="tuition_max"
                  type="number"
                  min="0"
                  value={formData.tuition_max}
                  onChange={handleNumberChange}
                  placeholder="e.g., 40000"
                />
              </div>
              
              {/* Website URL */}
              <div>
                <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <Input
                  id="website_url"
                  name="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="e.g., https://www.tsinghua.edu.cn/en/"
                />
              </div>
              
              {/* Has English Programs */}
              <div className="flex items-center">
                <input
                  id="has_english_programs"
                  name="has_english_programs"
                  type="checkbox"
                  checked={formData.has_english_programs}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="has_english_programs" className="ml-2 text-sm font-medium text-gray-700">
                  Has English Programs
                </label>
              </div>
              
              {/* Has Dormitory */}
              <div className="flex items-center">
                <input
                  id="has_dormitory"
                  name="has_dormitory"
                  type="checkbox"
                  checked={formData.has_dormitory}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="has_dormitory" className="ml-2 text-sm font-medium text-gray-700">
                  Has Dormitory
                </label>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter university description..."
                rows={5}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}/admin/universities`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create University'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 