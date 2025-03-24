import { ReactNode } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ClientAuthWrapper from '@/components/auth/ClientAuthWrapper';

export const metadata = {
  title: 'Admin Dashboard | Study Bridge',
  description: 'Admin Dashboard for Study Bridge University Portal',
};

interface AdminPageLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default async function AdminPageLayout({ children, params }: AdminPageLayoutProps) {
  // In Next.js 15, we need to ensure params is fully resolved
  const resolvedParams = await Promise.resolve(params);
  
  return (
    <ClientAuthWrapper>
      <AdminLayout>{children}</AdminLayout>
    </ClientAuthWrapper>
  );
} 