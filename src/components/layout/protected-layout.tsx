'use client';

import { SocketProvider } from '../providers/socket-provider';
import { NotificationListener } from '../providers/notification-listener';
import {
  useEffect,
  useState,
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

  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const router = useRouter();

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const hydrated =
    useAuthStore(
      (state) => state.hydrated,
    );

  const verifyAuth =
    useAuthStore(
      (state) => state.verifyAuth,
    );

  /*
   |--------------------------------------------------------------------------
   | Wait for hydration first
   |--------------------------------------------------------------------------
   */

  useEffect(() => {

      async function checkAuth() {
        if (!hydrated) {
          return;
        }
        await verifyAuth();
        setCheckingAuth(false);
      }

      checkAuth();

    }, [
      hydrated,
      verifyAuth,
  ]);

  useEffect(() => {

    if (
      !checkingAuth &&
      !user
    ) {
      router.replace('/login');
    }

  }, [
    checkingAuth,
    user,
    router,
  ]);

  /*
   |--------------------------------------------------------------------------
   | Prevent flashing
   |--------------------------------------------------------------------------
   */

  if (!hydrated || checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7F2] transition-colors dark:bg-[#07130C]">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-xl transition-colors dark:border-[#1F4D36] dark:bg-[#102418] dark:shadow-[0_0_35px_rgba(34,197,94,0.12)]">
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-green-200 border-t-green-600 dark:border-[#1F4D36] dark:border-t-green-500" />

            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Loading...
            </span>
          </div>
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
    <div className="flex min-h-screen bg-[#F5F7F2] transition-colors dark:bg-[#07130C]">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
    </>
  );
}