'use client';

import { Locale } from '@/i18n/config';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { QueryProvider } from '@/providers';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminRootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 1.02,
  },
};

const pageTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export default function AdminRootLayout({
  children,
  params: { locale },
}: AdminRootLayoutProps) {
  return (
    <QueryProvider>
      <AdminLayout locale={locale}>
        <AnimatePresence mode="wait">
          <motion.div
            key={locale}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </AdminLayout>
    </QueryProvider>
  );
} 