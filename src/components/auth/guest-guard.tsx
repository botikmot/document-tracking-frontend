'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  useAuthStore,
} from '@/store/auth.store';


export default function GuestGuard({
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


  const hydrate =
    useAuthStore(
      (state) => state.hydrate,
    );


  const verifyAuth =
    useAuthStore(
      (state) => state.verifyAuth,
    );


  const [checking, setChecking] =
    useState(true);



  useEffect(() => {

    hydrate();

  }, [
    hydrate,
  ]);



  useEffect(() => {

    async function checkAuth() {

      if (!hydrated) {
        return;
      }


      await verifyAuth();


      setChecking(false);

    }


    checkAuth();


  }, [
    hydrated,
    verifyAuth,
  ]);



  useEffect(() => {

    if (
      !checking &&
      user
    ) {
      router.replace(
        '/dashboard',
      );
    }

  }, [
    checking,
    user,
    router,
  ]);



  if (
    !hydrated ||
    checking
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );

  }


  if (user) {
    return null;
  }


  return children;
}