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
  verifyAuth: () => Promise<void>;
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

    verifyAuth: async () => {

      const token =
        localStorage.getItem(
          'accessToken',
        );


      if (!token) {
        set({
          user: null,
          accessToken: null,
        });

        return;
      }


      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );


        if (!response.ok) {
          throw new Error(
            'Unauthorized',
          );
        }


        const data =
          await response.json();

        const user: AuthUser = {
          userId: data.userId,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,

          profileImageUrl:
            data.profileImageUrl,

          roles:
            data.roles,


          officeIds:
            data.officeUsers?.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (item: any) =>
                item.officeId,
            ) ?? [],


          offices:
            data.officeUsers?.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (item: any) => ({
                officeId:
                  item.officeId,

                officeName:
                  item.office?.officeName,
              }),
            ) ?? [],
        };

        localStorage.setItem('user', JSON.stringify(user));
        
        set({
          user,
          accessToken: token,
        });


      } catch(error) {

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
      }
    },

  }));