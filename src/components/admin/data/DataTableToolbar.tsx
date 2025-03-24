'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  searchKey: keyof TData;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters?: {
    key: keyof TData;
    label: string;
    options: { label: string; value: string }[];
    value: string[];
    onChange: (value: string[]) => void;
  }[];
}

export function DataTableToolbar<TData>({
  searchKey,
  searchValue,
  onSearchChange,
  placeholder,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const t = useTranslations('admin');
  const hasFilters = filters.some((filter) => filter.value.length > 0);
  const hasSearch = searchValue.length > 0;

  return (
    <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={placeholder || t('search.placeholder')}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-8"
          />
          {hasSearch && (
            <Button
              variant="ghost"
              onClick={() => onSearchChange('')}
              className="absolute right-0 top-0 h-full px-2 py-2 hover:bg-transparent"
            >
              <X className="h-4 w-4 text-gray-500" />
              <span className="sr-only">{t('search.clear')}</span>
            </Button>
          )}
        </div>
        {filters.map((filter) => (
          <div key={String(filter.key)} className="flex items-center space-x-2">
            <select
              value={filter.value[0] || ''}
              onChange={(e) => filter.onChange([e.target.value])}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {hasFilters && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              filters.forEach((filter) => filter.onChange([]));
              onSearchChange('');
            }}
            className="h-8 px-2 lg:px-3"
          >
            {t('filters.reset')}
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 