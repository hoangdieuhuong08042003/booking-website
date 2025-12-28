import type React from 'react';
import type { Metadata } from 'next';
import AdminLayout from './_component/admin-layout';
import HeaderAdmin from './_component/header-admin';

export const metadata: Metadata = {
  title: 'Ex Gallery | Management',
  description: 'Ex Gallery の管理画面',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout metadata={metadata}>
      <HeaderAdmin />
      {children}
    </AdminLayout>
  );
}
