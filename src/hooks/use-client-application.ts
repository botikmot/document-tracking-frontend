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
  ClientApplicationTrackingResponse,
} from '@/types/client-application';

export function useClientApplication(
  applicationId: string,
) {
  const accessToken =
    useClientAuthStore(
      (state) => state.accessToken,
    );

  const [
    application,
    setApplication,
  ] =
    useState<ClientApplication | null>(
      null,
    );

  const [
    tracking,
    setTracking,
  ] =
    useState<ClientApplicationTrackingResponse | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  /*
   * Initial load.
   *
   * Similar to our previous hook:
   * avoid synchronous setState at
   * the start of useEffect.
   */
  useEffect(() => {
    if (
      !accessToken ||
      !applicationId
    ) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const [
          applicationData,
          trackingData,
        ] = await Promise.all([
          clientApplicationsService.findOne(
            accessToken!,
            applicationId,
          ),

          clientApplicationsService.getTracking(
            accessToken!,
            applicationId,
          ),
        ]);

        if (cancelled) {
          return;
        }

        setApplication(
          applicationData,
        );

        setTracking(
          trackingData,
        );

        setError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load application.',
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
  }, [
    accessToken,
    applicationId,
  ]);

  /*
   * Manual refresh.
   */
  const refresh =
    useCallback(async () => {
      if (
        !accessToken ||
        !applicationId
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [
          applicationData,
          trackingData,
        ] = await Promise.all([
          clientApplicationsService.findOne(
            accessToken,
            applicationId,
          ),

          clientApplicationsService.getTracking(
            accessToken,
            applicationId,
          ),
        ]);

        setApplication(
          applicationData,
        );

        setTracking(
          trackingData,
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load application.',
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      accessToken,
      applicationId,
    ]);

  return {
    application,
    tracking,
    isLoading,
    error,
    refresh,
  };
}