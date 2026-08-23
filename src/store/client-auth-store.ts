'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { clientAuthService } from '@/services/client-auth.service';

import type {
  ClientLoginDto,
  ClientUser,
} from '@/types/client-auth';

interface ClientAuthState {
  client: ClientUser | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  hasHydrated: boolean;

  login: (
    dto: ClientLoginDto,
  ) => Promise<void>;

  loadProfile: () => Promise<void>;

  logout: () => void;

  setHasHydrated: (
    value: boolean,
  ) => void;
}

export const useClientAuthStore =
  create<ClientAuthState>()(
    persist(
      (set, get) => ({
        client: null,

        accessToken: null,

        isAuthenticated: false,

        isLoading: false,

        hasHydrated: false,

        login: async (dto) => {
          set({
            isLoading: true,
          });

          try {
            const response =
              await clientAuthService.login(
                dto,
              );

            set({
              client:
                response.client,

              accessToken:
                response.accessToken,

              isAuthenticated:
                true,
            });
          } finally {
            set({
              isLoading: false,
            });
          }
        },

        loadProfile: async () => {
          const token =
            get().accessToken;

          if (!token) {
            return;
          }

          try {
            const client =
              await clientAuthService.me(
                token,
              );

            set({
              client,
              isAuthenticated: true,
            });
          } catch {
            set({
              client: null,
              accessToken: null,
              isAuthenticated: false,
            });
          }
        },

        logout: () => {
          set({
            client: null,
            accessToken: null,
            isAuthenticated: false,
          });
        },

        setHasHydrated: (
          value,
        ) => {
          set({
            hasHydrated: value,
          });
        },
      }),

      {
        name:
          'edats-client-auth',

        partialize: (state) => ({
          client:
            state.client,

          accessToken:
            state.accessToken,

          isAuthenticated:
            state.isAuthenticated,
        }),

        onRehydrateStorage:
          () => (state) => {
            state?.setHasHydrated(
              true,
            );
          },
      },
    ),
  );