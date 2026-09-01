'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getTransactionDocumentTimeline,
  getTransactionOfficeDocuments,
  getTransactionOfficeSummary,
} from '@/services/transactions.service';

import type {
  TransactionOfficeDocumentsQuery,
  TransactionOfficeDocumentsResponse,
  TransactionOfficeSummaryResponse,
  TransactionQuery,
  TransactionTimelineResponse,
} from '@/types/transaction';

/*
|--------------------------------------------------------------------------
| STABLE QUERY KEYS
|--------------------------------------------------------------------------
|
| We use JSON.stringify on primitive values only.
|
| This avoids unnecessary effect re-runs when
| the query object gets recreated by the parent.
|
*/

function useTransactionQueryKey(
  query?: TransactionQuery,
) {
  return useMemo(
    () =>
      JSON.stringify({
        from:
          query?.from ??
          null,

        to:
          query?.to ??
          null,

        search:
          query?.search ??
          null,

        officeId:
          query?.officeId ??
          null,

        sourceClass:
          query?.sourceClass ??
          null,

        monitoringCategory:
          query?.monitoringCategory ??
          null,

        status:
          query?.status ??
          null,
      }),
    [
      query?.from,
      query?.to,
      query?.search,
      query?.officeId,
      query?.sourceClass,
      query?.monitoringCategory,
      query?.status,
    ],
  );
}

function useOfficeDocumentsQueryKey(
  query?:
    TransactionOfficeDocumentsQuery,
) {
  return useMemo(
    () =>
      JSON.stringify({
        from:
          query?.from ??
          null,

        to:
          query?.to ??
          null,

        search:
          query?.search ??
          null,

        officeId:
          query?.officeId ??
          null,

        sourceClass:
          query?.sourceClass ??
          null,

        monitoringCategory:
          query?.monitoringCategory ??
          null,

        status:
          query?.status ??
          null,

        bucket:
          query?.bucket ??
          'ALL',

        page:
          query?.page ??
          1,

        limit:
          query?.limit ??
          20,
      }),
    [
      query?.from,
      query?.to,
      query?.search,
      query?.officeId,
      query?.sourceClass,
      query?.monitoringCategory,
      query?.status,
      query?.bucket,
      query?.page,
      query?.limit,
    ],
  );
}

/*
|--------------------------------------------------------------------------
| OFFICE SUMMARY
|--------------------------------------------------------------------------
*/

export function useTransactionOfficeSummary(
  query?: TransactionQuery,
) {
  const [
    data,
    setData,
  ] =
    useState<TransactionOfficeSummaryResponse | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const queryKey =
    useTransactionQueryKey(
      query,
    );

  /*
  |--------------------------------------------------------------------------
  | AUTO LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(
    () => {
      let cancelled = false;

      const fetchSummary =
        async () => {
          /*
           * Async boundary first.
           *
           * This prevents the effect
           * from synchronously triggering
           * React state updates.
           */
          await Promise.resolve();

          if (cancelled) {
            return;
          }

          try {
            setIsLoading(true);
            setError(null);

            const result =
              await getTransactionOfficeSummary(
                query,
              );

            if (cancelled) {
              return;
            }

            setData(result);
          } catch (error) {
            if (cancelled) {
              return;
            }

            console.error(
              'Failed to load transaction office summary:',
              error,
            );

            setError(
              'Unable to load transaction summary.',
            );
          } finally {
            if (!cancelled) {
              setIsLoading(
                false,
              );
            }
          }
        };

      void fetchSummary();

      return () => {
        cancelled = true;
      };
    },
    [
      queryKey,
    ],
  );

  /*
  |--------------------------------------------------------------------------
  | MANUAL REFRESH
  |--------------------------------------------------------------------------
  */

  const refresh =
    useCallback(
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const result =
            await getTransactionOfficeSummary(
              query,
            );

          setData(result);

          return result;
        } catch (error) {
          console.error(
            'Failed to refresh transaction office summary:',
            error,
          );

          setError(
            'Unable to load transaction summary.',
          );

          return null;
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [
        queryKey,
      ],
    );

  return {
    data,

    isLoading,

    error,

    refresh,

    setData,
  };
}

/*
|--------------------------------------------------------------------------
| OFFICE DOCUMENTS
|--------------------------------------------------------------------------
|
| Used when an office row is expanded.
|
| Example:
|
| PMD
| ↓
| show documents handled by PMD
|
*/

export function useTransactionOfficeDocuments(
  officeId:
    | string
    | null,

  query?:
    TransactionOfficeDocumentsQuery,

  enabled = true,
) {
  const [
    data,
    setData,
  ] =
    useState<TransactionOfficeDocumentsResponse | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const queryKey =
    useOfficeDocumentsQueryKey(
      query,
    );

  /*
  |--------------------------------------------------------------------------
  | AUTO LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(
    () => {
      if (
        !enabled ||
        !officeId
      ) {
        return;
      }

      let cancelled = false;

      const fetchDocuments =
        async () => {
          /*
           * Async boundary.
           */
          await Promise.resolve();

          if (cancelled) {
            return;
          }

          try {
            setIsLoading(true);
            setError(null);

            const result =
              await getTransactionOfficeDocuments(
                officeId,
                query,
              );

            if (cancelled) {
              return;
            }

            setData(result);
          } catch (error) {
            if (cancelled) {
              return;
            }

            console.error(
              'Failed to load office transaction documents:',
              error,
            );

            setError(
              'Unable to load office documents.',
            );
          } finally {
            if (!cancelled) {
              setIsLoading(
                false,
              );
            }
          }
        };

      void fetchDocuments();

      return () => {
        cancelled = true;
      };
    },
    [
      enabled,
      officeId,
      queryKey,
    ],
  );

  /*
  |--------------------------------------------------------------------------
  | MANUAL REFRESH
  |--------------------------------------------------------------------------
  */

  const refresh =
    useCallback(
      async () => {
        if (!officeId) {
          return null;
        }

        try {
          setIsLoading(true);
          setError(null);

          const result =
            await getTransactionOfficeDocuments(
              officeId,
              query,
            );

          setData(result);

          return result;
        } catch (error) {
          console.error(
            'Failed to refresh office transaction documents:',
            error,
          );

          setError(
            'Unable to load office documents.',
          );

          return null;
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [
        officeId,
        queryKey,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const reset =
    useCallback(
      () => {
        setData(null);
        setError(null);
        setIsLoading(
          false,
        );
      },
      [],
    );

  return {
    data,

    isLoading,

    error,

    refresh,

    reset,

    setData,
  };
}

/*
|--------------------------------------------------------------------------
| DOCUMENT TIMELINE
|--------------------------------------------------------------------------
|
| Explicit load only.
|
| We intentionally do not use useEffect here
| because the timeline should load only when
| the user clicks a document row.
|
*/

export function useTransactionTimeline() {
  const [
    data,
    setData,
  ] =
    useState<TransactionTimelineResponse | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  /*
  |--------------------------------------------------------------------------
  | LOAD TIMELINE
  |--------------------------------------------------------------------------
  */

  const load =
    useCallback(
      async (
        documentId:
          string,
      ) => {
        if (!documentId) {
          return null;
        }

        try {
          setIsLoading(true);
          setError(null);

          /*
           * Clear previous document
           * before showing the new one.
           */
          setData(null);

          const result =
            await getTransactionDocumentTimeline(
              documentId,
            );

          setData(result);

          return result;
        } catch (error) {
          console.error(
            'Failed to load document transaction timeline:',
            error,
          );

          setError(
            'Unable to load transaction timeline.',
          );

          return null;
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [],
    );

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const reset =
    useCallback(
      () => {
        setData(null);

        setError(null);

        setIsLoading(
          false,
        );
      },
      [],
    );

  return {
    data,

    isLoading,

    error,

    load,

    reset,

    setData,
  };
}