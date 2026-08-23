'use client';

import {
  ReactNode,
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  Loader2,
} from 'lucide-react';

import {
  ClientHeader,
} from './client-header';

import {
  ClientSidebar,
} from './client-sidebar';

import { useClientAuthStore } from '@/store/client-auth-store';

interface ClientPortalShellProps {
  children: ReactNode;
}

export function ClientPortalShell({
  children,
}: ClientPortalShellProps) {
  const router =
    useRouter();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const {
    accessToken,

    hasHydrated,

    loadProfile,
  } = useClientAuthStore();

  /*
   * ------------------------------------------------------------
   * AUTH GUARD
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!accessToken) {
      router.replace(
        '/client/login',
      );

      return;
    }

    /*
     * Validate token and refresh
     * current client details.
     */
    void loadProfile();
  }, [
    accessToken,
    hasHydrated,
    loadProfile,
    router,
  ]);

  /*
   * ------------------------------------------------------------
   * WAIT FOR ZUSTAND HYDRATION
   * ------------------------------------------------------------
   */
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          Loading portal...
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * NOT AUTHENTICATED
   * ------------------------------------------------------------
   */
  if (!accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <ClientSidebar
        mobileOpen={
          mobileOpen
        }
        onMobileClose={() =>
          setMobileOpen(false)
        }
      />

      <div className="md:pl-64">
        <ClientHeader
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}