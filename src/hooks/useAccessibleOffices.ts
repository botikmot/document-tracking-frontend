'use client';

import {
  useEffect,
  useState,
} from 'react';

import { api } from '@/lib/axios';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type AccessibleOffice = {
  id: string;
  officeCode: string;
  officeName: string;
};

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useAccessibleOffices() {
  const [
    offices,
    setOffices,
  ] = useState<
    AccessibleOffice[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOffices =
      async () => {
        try {
          setLoading(true);

          const response =
            await api.get(
              '/offices/accessible',
            );

          const officeList:
            AccessibleOffice[] =
            response.data ?? [];

          /*
          |--------------------------------------------------------------------------
          | Remove Duplicates
          |--------------------------------------------------------------------------
          */

          const uniqueOffices =
            Array.from(
              new Map(
                officeList.map(
                  (office) => [
                    office.id,
                    office,
                  ],
                ),
              ).values(),
            );

          if (!cancelled) {
            setOffices(
              uniqueOffices,
            );
          }
        } catch (error) {
          console.error(
            'Failed to load accessible offices:',
            error,
          );

          if (!cancelled) {
            setOffices([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void loadOffices();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    offices,
    loading,
  };
}