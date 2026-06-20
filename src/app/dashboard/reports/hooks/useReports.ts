'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import type { Report, ReportFilters } from '@/types/report';
import { useAuthStore } from '@/store/auth.store';

export function useReports() {
  const currentYear =
    new Date().getFullYear();

  const currentMonth =
    new Date().getMonth() + 1;

  const [loading, setLoading] =
    useState(false);

  const [filters, setFilters] =
    useState<ReportFilters>({
      type: 'monthly',
      month: currentMonth,
      quarter: 1,
      year: currentYear,
    });

  const emptyReport: Report = {
    reportPeriod: {
        type: 'monthly',
        startDate: '',
        endDate: '',
    },

    summary: {
        totalDocuments: 0,
        incomingDocuments: 0,
        outgoingDocuments: 0,
        pendingDocuments: 0,
        completedDocuments: 0,
        overdueDocuments: 0,
        completionRate: 0,
        averageProcessingHours: 0,
    },
    statusBreakdown: [],
    documentTypeBreakdown: [],
    byPriority: [],
    monthlyTrend: [],
    analytics: {
        averageProcessingHours: 0,
    },
    documents: [],
    generatedAt: '',
  };

  const [report, setReport] =
    useState<Report>(emptyReport);

  /*
  |------------------------------------------------------------
  | GENERATE
  |------------------------------------------------------------
  */

  const generateReport = useCallback(async () => {
    try {
        setLoading(true);

        const user = useAuthStore.getState().user;

        console.log('filters', filters);
        console.log('params', {
        ...filters,
        officeIds:
            user?.offices?.map(
            (office) => office.officeId,
            ) ?? [],
        });

        const response = await api.get('/reports', {
            params: {
                ...filters,
                officeIds: user?.offices?.[0]?.officeId,
            },
        });
        console.log('reports::', response)

        setReport(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
    }, [filters]);

  /*
  |------------------------------------------------------------
  | INITIAL LOAD
  |------------------------------------------------------------
  */

  useEffect(() => {
    const load = async () => {
        await generateReport();
    };

    void load();
  }, [generateReport]);

  return {
    loading,
    filters,
    setFilters,
    report,
    generateReport,
  };
}