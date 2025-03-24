'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export function DataTablePagination({
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const t = useTranslations('admin');
  const totalPages = Math.ceil(totalItems / pageSize);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-gray-700">
        {t('pagination.showing')} {startItem}-{endItem} {t('pagination.of')} {totalItems}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t('pagination.rowsPerPage')}</p>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-gray-200 bg-white text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('pagination.page')} {pageIndex + 1} {t('pagination.of')} {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">{t('pagination.firstPage')}</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">{t('pagination.previousPage')}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">{t('pagination.nextPage')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">{t('pagination.lastPage')}</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 