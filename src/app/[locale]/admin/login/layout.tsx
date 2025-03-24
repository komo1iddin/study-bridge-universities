import { ReactNode } from 'react';

interface AdminLoginLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default function AdminLoginLayout({ children }: AdminLoginLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 