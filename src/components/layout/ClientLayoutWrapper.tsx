// components/layout/ClientLayoutWrapper.tsx - Wrapper qui utilise useAuth
"use client";

import { ClientLayout } from './ClientLayout';
import { useAuth } from '@/contexts/AuthContext';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const { user, isAuthenticated, signOut, isLoading } = useAuth();

  return (
    <ClientLayout
      user={user}
      isAuthenticated={isAuthenticated}
      onSignOut={signOut}
      isLoading={isLoading}
    >
      {children}
    </ClientLayout>
  );
}