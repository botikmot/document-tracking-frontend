'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  clientApplicationsService,
} from '@/services/client-applications.service';

import { useClientAuthStore } from '@/store/client-auth-store';

import type {
  ClientApplication,
} from '@/types/client-application';

export function useClientApplications() {
  const accessToken =
    useClientAuthStore(
      (state) =>
        state.accessToken,
    );

  const [
    applications,
    setApplications,
  ] = useState<ClientApplication[]>([]);

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

  /*
   * ------------------------------------------------------------
   * INITIAL LOAD
   * ------------------------------------------------------------
   *
   * We intentionally do not call setState synchronously
   * at the beginning of this effect.
   *
   * State updates happen only after the async request
   * finishes.
   */
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function fetchApplications() {
      try {
        const data =
          await clientApplicationsService.findAll(
            accessToken!,
          );

        if (cancelled) {
          return;
        }

        setApplications(
          Array.isArray(data)
            ? data
            : [],
        );

        setError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setApplications([]);

        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load applications.',
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchApplications();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  /*
   * ------------------------------------------------------------
   * MANUAL REFRESH
   * ------------------------------------------------------------
   *
   * This can immediately set loading because it is called
   * from a user action such as clicking "Try Again".
   */
  const refresh =
    useCallback(async () => {
      if (!accessToken) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data =
          await clientApplicationsService.findAll(
            accessToken,
          );

        setApplications(
          Array.isArray(data)
            ? data
            : [],
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load applications.',
        );
      } finally {
        setIsLoading(false);
      }
    }, [accessToken]);

  return {
    applications,

    isLoading,

    error,

    refresh,
  };
}