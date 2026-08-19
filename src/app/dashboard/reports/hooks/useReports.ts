'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { api } from '@/lib/axios';

import {
  useAuthStore,
} from '@/store/auth.store';

import type {
  Report,
  ReportFilters,
} from '@/types/report';

export function useReports() {
  const currentYear =
    new Date().getFullYear();

  const currentMonth =
    new Date().getMonth() + 1;

  /*
  |--------------------------------------------------------------------------
  | Current User
  |--------------------------------------------------------------------------
  */

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const defaultOfficeId =
    user?.offices?.[0]
      ?.officeId;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  |
  | officeIds starts as undefined because the auth store may still be
  | hydrating after a page refresh.
  |
  */

  const [
    filters,
    setFilters,
  ] = useState<ReportFilters>({
    type: 'monthly',

    month:
      currentMonth,

    quarter: 1,

    year:
      currentYear,

    documentTypeId:
      undefined,

    status:
      undefined,

    officeIds:
      undefined,
  });

  /*
  |--------------------------------------------------------------------------
  | Default Office
  |--------------------------------------------------------------------------
  |
  | Once the logged-in user becomes available, automatically use their
  | first office as the default reporting office.
  |
  | IMPORTANT:
  | Only initialize when officeIds is undefined.
  |
  | [] means the user intentionally selected "All Offices".
  |
  */

  /*
  |--------------------------------------------------------------------------
  | Empty Report
  |--------------------------------------------------------------------------
  */

  const emptyDocumentSummary = {
    count: 0,
    documents: [],
  };

  const emptyReport: Report = {
    reportPeriod: {
      type: 'monthly',
      startDate: '',
      endDate: '',
    },

    summary: {
      totalDocuments:
        emptyDocumentSummary,

      incomingDocuments:
        emptyDocumentSummary,

      outgoingDocuments:
        emptyDocumentSummary,

      pendingDocuments:
        emptyDocumentSummary,

      completedDocuments:
        emptyDocumentSummary,

      overdueDocuments:
        emptyDocumentSummary,

      completionRate: 0,

      averageProcessingHours:
        0,

      processingEfficiency:
        0,
    },

    statusBreakdown: [],

    documentTypeBreakdown: [],

    byPriority: [],

    monthlyTrend: [],

    analytics: {
      averageProcessingHours:
        0,
    },

    documents: [],

    generatedAt: '',
  };

  const [
    report,
    setReport,
  ] = useState<Report>(
    emptyReport,
  );

  /*
  |--------------------------------------------------------------------------
  | Generate Report
  |--------------------------------------------------------------------------
  */

  const generateReport =
    useCallback(async () => {
      try {
        setLoading(true);

        const {
          officeIds,
          ...restFilters
        } = filters;

        /*
        * undefined = use user's default office
        * []        = all offices
        * [id]      = selected office
        */
        const selectedOfficeId =
          officeIds === undefined
            ? defaultOfficeId
            : officeIds[0];

        const params = {
          ...restFilters,

          ...(selectedOfficeId
            ? {
                officeIds:
                  selectedOfficeId,
              }
            : {}),
        };

        console.log(
          'Report filters:',
          filters,
        );

        console.log(
          'Report params:',
          params,
        );

        const response =
          await api.get<Report>(
            '/reports',
            {
              params,
            },
          );

        setReport(
          response.data,
        );
      } catch (error) {
        console.error(
          'Failed to generate report:',
          error,
        );
      } finally {
        setLoading(false);
      }
    }, [
      filters,
      defaultOfficeId,
    ]);


    useEffect(() => {
      /*
      * Wait until auth store has restored
      * the user's default office.
      */
      if (
        filters.officeIds ===
          undefined &&
        !defaultOfficeId
      ) {
        return;
      }

      let cancelled = false;

      const loadReport =
        async () => {
          try {
            const {
              officeIds,
              ...restFilters
            } = filters;

            /*
            * undefined = default office
            * []        = all offices
            * [id]      = selected office
            */
            const selectedOfficeId =
              officeIds === undefined
                ? defaultOfficeId
                : officeIds[0];

            const params = {
              ...restFilters,

              ...(selectedOfficeId
                ? {
                    officeIds:
                      selectedOfficeId,
                  }
                : {}),
            };

            console.log(
              'Auto report params:',
              params,
            );

            const response =
              await api.get<Report>(
                '/reports',
                {
                  params,
                },
              );

            if (cancelled) {
              return;
            }

            setReport(
              response.data,
            );
          } catch (error) {
            if (cancelled) {
              return;
            }

            console.error(
              'Failed to load report:',
              error,
            );
          }
        };

      void loadReport();

      return () => {
        cancelled = true;
      };
    }, [
      filters,
      defaultOfficeId,
    ]);
  /*
  |--------------------------------------------------------------------------
  | Return
  |--------------------------------------------------------------------------
  */

  return {
    loading,

    filters,
    setFilters,

    report,

    generateReport,
  };
}