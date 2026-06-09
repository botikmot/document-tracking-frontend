'use client';

import {
  ReactNode,
  useEffect,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  ShieldX,
} from 'lucide-react';

import {
  useAuthStore,
} from '@/store/auth.store';

interface Props {
  children: ReactNode;

  allowedRoles: string[];
}

export function RoleGuard({
  children,
  allowedRoles,
}: Props) {
  const router = useRouter();

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const hydrated =
    useAuthStore(
      (state) => state.hydrated,
    );

  useEffect(() => {
    if (!hydrated || !user) {
      return;
    }

    const hasAccess =
      user.roles?.some(
        (role: string) =>
          allowedRoles.includes(
            role,
          ),
      );

    if (!hasAccess) {
      router.replace(
        '/dashboard',
      );
    }
  }, [
    hydrated,
    user,
    allowedRoles,
    router,
  ]);

  if (!hydrated || !user) {
    return null;
  }

  const hasAccess =
    user.roles?.some(
      (role: string) =>
        allowedRoles.includes(
          role,
        ),
    );

  if (!hasAccess) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <ShieldX className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900">
            Access Denied
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}