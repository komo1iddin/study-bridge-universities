import { useState, useCallback, useMemo } from 'react';

interface UseDataTableProps<TData> {
  data: TData[];
  searchKey: keyof TData;
}

interface UseDataTableFilters {
  key: string;
  value: string[];
}

export function useDataTable<TData>({ data, searchKey }: UseDataTableProps<TData>) {
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<UseDataTableFilters[]>([]);
  const [sorting, setSorting] = useState<{ key: keyof TData; direction: 'asc' | 'desc' } | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: string[]) => {
    setFilters(prev => {
      const existing = prev.find(f => f.key === key);
      if (existing) {
        return prev.map(f => f.key === key ? { ...f, value } : f);
      }
      return [...prev, { key, value }];
    });
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(item => {
        const value = String(item[searchKey]).toLowerCase();
        return value.includes(searchLower);
      });
    }

    // Apply filters
    filters.forEach(filter => {
      if (filter.value.length > 0) {
        result = result.filter(item => {
          const itemValue = String(item[filter.key as keyof TData]);
          return filter.value.includes(itemValue);
        });
      }
    });

    // Apply sorting
    if (sorting) {
      result.sort((a, b) => {
        const aValue = String(a[sorting.key]);
        const bValue = String(b[sorting.key]);
        const comparison = aValue.localeCompare(bValue);
        return sorting.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchValue, filters, sorting, searchKey]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  return {
    searchValue,
    filters,
    sorting,
    pagination,
    filteredData,
    paginatedData,
    totalItems: filteredData.length,
    handleSearch,
    handleFilterChange,
    setSorting,
    setPagination,
  };
} 