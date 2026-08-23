'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  clientServiceTypesService,
} from '@/services/client-service-types.service';

import { useClientAuthStore } from '@/store/client-auth-store';

import type {
  ClientServiceType,
} from '@/types/client-service-type';

export function useClientServiceTypes() {
  const accessToken =
    useClientAuthStore(
      (state) =>
        state.accessToken,
    );

  const [
    serviceTypes,
    setServiceTypes,
  ] = useState<ClientServiceType[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const data =
          await clientServiceTypesService.findAll(
            accessToken!,
          );

        if (cancelled) {
          return;
        }

        setServiceTypes(
          Array.isArray(data)
            ? data
            : [],
        );

        setError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load services.',
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return {
    serviceTypes,
    isLoading,
    error,
  };
}