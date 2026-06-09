'use client';

import { create } from 'zustand';

import type {
  AuthUser,
} from '@/types/auth';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  hydrated: boolean;
  setAuth: (
    user: AuthUser,
    token: string,
  ) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    hydrated: false,

    setAuth: (user, token) => {
      
        console.log('user:', user)
        
      localStorage.setItem(
        'accessToken',
        token,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(user),
      );

      set({
        user,
        accessToken: token,
      });
    },

    logout: () => {
      localStorage.removeItem(
        'accessToken',
      );

      localStorage.removeItem(
        'user',
      );

      set({
        user: null,
        accessToken: null,
      });
    },

    hydrate: () => {
        const token =
            localStorage.getItem(
            'accessToken',
            );

        const storedUser =
            localStorage.getItem('user');

        let parsedUser: AuthUser | null =
            null;

        try {
            if (
            storedUser &&
            storedUser !== 'undefined'
            ) {
            parsedUser = JSON.parse(
                storedUser,
            ) as AuthUser;
            }
        } catch (error) {
            console.error(
            'Failed to parse user:',
            error,
            );

            localStorage.removeItem(
            'user',
            );
        }

        set({
            accessToken: token,
            user: parsedUser,
            hydrated: true,
        });
    },
  }));