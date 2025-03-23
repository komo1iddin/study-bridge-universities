'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

type ClientAuthWrapperProps = {
  children: ReactNode;
};

export default function ClientAuthWrapper({ children }: ClientAuthWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
} 