'use client';

import { useState } from 'react';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const setAuth =
    useAuthStore(
      (state) => state.setAuth,
    );

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const data = await login(
        username,
        password,
      );

      setAuth(
        data.user,
        data.accessToken,
      );

      router.replace('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Document Tracking System
        </h1>

        <div className="space-y-4">
          <input
            className="w-full rounded border p-2"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value,
              )
            }
          />

          <input
            type="password"
            className="w-full rounded border p-2"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
          />

          <button
            onClick={handleLogin}
            className="w-full rounded bg-black p-2 text-white"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}