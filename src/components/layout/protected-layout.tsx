'use client';

import { SocketProvider } from '../providers/socket-provider';
import { NotificationListener } from '../providers/notification-listener';
import {
  useEffect,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  Sidebar,
} from '@/components/layout/sidebar';

import {
  useAuthStore,
} from '@/store/auth.store';

export function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const hydrated =
    useAuthStore(
      (state) => state.hydrated,
    );

  /*
   |--------------------------------------------------------------------------
   | Wait for hydration first
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!user) {
      router.replace('/login');
    }
  }, [
    hydrated,
    user,
    router,
  ]);

  /*
   |--------------------------------------------------------------------------
   | Prevent flashing
   |--------------------------------------------------------------------------
   */

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white px-6 py-4 shadow">
          Loading...
        </div>
      </div>
    );
  }

  /*
   |--------------------------------------------------------------------------
   | If hydrated but no user
   |--------------------------------------------------------------------------
   */

  if (!user) {
    return null;
  }

  return (
    <>
    <SocketProvider userId={user.userId} />
     <NotificationListener />
    <div className="flex min-h-screen bg-[#F5F7F2]">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
    </>
  );
}