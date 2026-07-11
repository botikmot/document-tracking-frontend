'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const {
    accessToken,
    hydrated,
    hydrate,
  } = useAuthStore();


  useEffect(() => {
    hydrate();
  }, []);


  useEffect(() => {

    if (
      hydrated &&
      !accessToken
    ) {
      router.replace('/login');
    }

  }, [
    hydrated,
    accessToken,
  ]);


  if (!hydrated) {
    return (
      <div>
        Loading...
      </div>
    );
  }


  if (!accessToken) {
    return null;
  }


  return children;
}