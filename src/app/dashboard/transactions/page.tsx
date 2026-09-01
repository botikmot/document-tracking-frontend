'use client';

import {
  Printer,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

import {
  useState,
} from 'react';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import {
  useTransactionOfficeSummary,
  useTransactionTimeline,
} from '@/hooks/use-transactions';

import type {
  TransactionQuery,
  TransactionQuickFilter,
} from '@/types/transaction';

import { OfficeTransactionsTable } from '@/components/transactions/office-transactions-table';

import { TransactionsSummary } from '@/components/transactions/transactions-summary';

import { TransactionsFilter } from '@/components/transactions/transactions-filter';

import { toast } from 'sonner';

import { TransactionsDateRange } from '@/components/transactions/transactions-date-range';
import { getDefaultTransactionDateRange } from '@/lib/utils';

import { TransactionTimelineDrawer } from '@/components/transactions/transaction-timeline-drawer';

import { pdf } from '@react-pdf/renderer';

import { TransactionsReportPDF } from '@/components/transactions/transactions-report-pdf';

export default function TransactionsPage() {
  const [
    quickFilter,
    setQuickFilter,
  ] =
    useState<TransactionQuickFilter>(
      'ALL',
    );

  const [
    defaultDateRange,
  ] = useState(
    () =>
      getDefaultTransactionDateRange(),
  );

  const [
    dateFrom,
    setDateFrom,
  ] = useState(
    defaultDateRange.from,
  );

  const [
    dateTo,
    setDateTo,
  ] = useState(
    defaultDateRange.to,
  );

  const [
    generatingReport,
    setGeneratingReport,
  ] = useState(false);

  const [
    query,
    setQuery,
  ] =
    useState<TransactionQuery>(
      () => ({
        from:
          defaultDateRange.from,

        to:
          defaultDateRange.to,
      }),
    );

  const [
    openTimeline,
    setOpenTimeline,
  ] = useState(false);

  const {
    data,
    isLoading,
    error,
    refresh,
  } =
    useTransactionOfficeSummary(
      query,
    );

  const {
    data: timelineData,
    isLoading: timelineLoading,
    error: timelineError,
    load: loadTimeline,
    reset: resetTimeline,
  } = useTransactionTimeline();

  const handleDocumentClick =
    (
      documentId: string,
    ) => {
      /*
      * Open immediately so user
      * sees the loading state.
      */

      setOpenTimeline(true);

      void loadTimeline(
        documentId,
      );
    };

  const handleTimelineOpenChange =
    (
      open: boolean,
    ) => {
      setOpenTimeline(open);

      if (!open) {
        resetTimeline();
      }
    };


  const handleQuickFilterChange = (
    filter: TransactionQuickFilter,
  ) => {
    setQuickFilter(filter);

    setQuery(
      (current) => {
        const next: TransactionQuery = {
          ...current,

          sourceClass:
            undefined,

          monitoringCategory:
            undefined,
        };

        switch (filter) {
          case 'INTERNAL':
            next.sourceClass =
              'INTERNAL';
            break;

          case 'EXTERNAL':
            next.sourceClass =
              'EXTERNAL';
            break;

          case 'PERMIT':
            next.monitoringCategory =
              'PERMIT';
            break;

          case 'SURVEY_RETURN':
            next.monitoringCategory =
              'SURVEY_RETURN';
            break;

          case 'GENERAL':
            next.monitoringCategory =
              'GENERAL';
            break;

          case 'ALL':
          default:
            break;
        }

        return next;
      },
    );
  };

  const handleApplyDateRange =
    () => {
      /*
      * Both dates selected:
      * From must not be after To.
      */

      if (
        dateFrom &&
        dateTo &&
        dateFrom > dateTo
      ) {
        toast.error(
          'The From date cannot be later than the To date.',
        );

        return;
      }

      setQuery(
        (current) => ({
          ...current,

          from:
            dateFrom ||
            undefined,

          to:
            dateTo ||
            undefined,
        }),
      );
    };

  const handlePrintReport =
    async () => {
      if (!data) {
        toast.error(
          'No transaction data available to print.',
        );

        return;
      }

      try {
        setGeneratingReport(
          true,
        );

        /*
        * Public image URL.
        *
        * React PDF needs a resolvable
        * image source.
        */
        const logoUrl =
          `${window.location.origin}/images/denr_logov2.png`;

        const blob =
          await pdf(
            <TransactionsReportPDF
              data={data}
              query={query}
              logoUrl={logoUrl}
            />,
          ).toBlob();

        const url =
          URL.createObjectURL(
            blob,
          );

        const link =
          document.createElement(
            'a',
          );

        /*
        * Filename
        */

        const from =
          query.from ??
          'all';

        const to =
          query.to ??
          'dates';

        link.href =
          url;

        link.download =
          `eDATS-Transactions-${from}-to-${to}.pdf`;

        document.body.appendChild(
          link,
        );

        link.click();

        document.body.removeChild(
          link,
        );

        /*
        * Release object URL.
        */

        window.setTimeout(
          () => {
            URL.revokeObjectURL(
              url,
            );
          },
          1000,
        );

        toast.success(
          'Transaction report generated successfully.',
        );
      } catch (error) {
        console.error(
          'Failed to generate transaction report:',
          error,
        );

        toast.error(
          'Failed to generate transaction report.',
        );
      } finally {
        setGeneratingReport(
          false,
        );
      }
    };

  const handleResetDateRange =
    () => {
      const range =
        getDefaultTransactionDateRange();

      setDateFrom(
        range.from,
      );

      setDateTo(
        range.to,
      );

      setQuery(
        (current) => ({
          ...current,

          from:
            range.from,

          to:
            range.to,
        }),
      );
    };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* =========================================================
          HERO
      ========================================================= */}

      <Card
        className="
          overflow-hidden
          rounded-[32px]
          border-0
          bg-[#102418]
          text-white
          shadow-xl
        "
      >
        <CardContent className="relative p-7 md:p-9">
          <div
            className="
              absolute
              -right-20
              -top-24
              h-64
              w-64
              rounded-full
              bg-emerald-500/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className="
                    rounded-full
                    border
                    border-emerald-400/20
                    bg-emerald-500/10
                    px-3
                    py-1
                    text-emerald-300
                    hover:bg-emerald-500/10
                  "
                >
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />

                  Regional Monitoring
                </Badge>

                <Badge
                  variant="outline"
                  className="
                    rounded-full
                    border-white/10
                    text-slate-300
                  "
                >
                  Management Report
                </Badge>
              </div>

              <h1
                className="
                  mt-5
                  text-3xl
                  font-black
                  tracking-tight
                  md:text-4xl
                "
              >
                Transactions
              </h1>

              <p
                className="
                  mt-3
                  max-w-3xl
                  text-sm
                  leading-6
                  text-slate-300
                  md:text-base
                "
              >
                Monitor transaction
                volume, document status,
                overdue items, and office
                performance across the
                DENR Caraga Regional
                Office.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  void refresh()
                }
                disabled={
                  isLoading
                }
                className="
                  cursor-pointer
                  border-white/20
                  bg-white/5
                  text-white
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isLoading
                      ? 'animate-spin'
                      : ''
                  }`}
                />

                Refresh
              </Button>

              <Button
                variant="outline"
                disabled={
                  generatingReport ||
                  isLoading ||
                  !data
                }
                onClick={() =>
                  void handlePrintReport()
                }
                className="
                  cursor-pointer
                  border-white/20
                  bg-white/5
                  text-white
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <Printer
                  className={`mr-2 h-4 w-4 ${
                    generatingReport
                      ? 'animate-pulse'
                      : ''
                  }`}
                />

                {generatingReport
                  ? 'Generating...'
                  : 'Print Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================
          LOADING
      ========================================================= */}

      {isLoading &&
      !data ? (
        <Card
          className="
            rounded-[30px]
            border-slate-200
            dark:border-[#214234]
            dark:bg-[#102418]
          "
        >
          <CardContent className="p-16 text-center">
            <RefreshCw
              className="
                mx-auto
                h-7
                w-7
                animate-spin
                text-emerald-600
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-slate-500
                dark:text-[#A9C5B6]
              "
            >
              Loading Regional
              transactions...
            </p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card
          className="
            rounded-[30px]
            border-red-200
            dark:border-red-900
            dark:bg-[#102418]
          "
        >
          <CardContent className="p-12 text-center text-red-600 dark:text-red-400">
            {error}
          </CardContent>
        </Card>
      ) : data ? (
        <>
          {/* SUMMARY */}

          <TransactionsSummary
            summary={data.summary}
          />

          {/* QUICK FILTER */}

          <div>
            <p
              className="
                mb-2
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-slate-400
                dark:text-[#7FA18E]
              "
            >
              Transaction Filter
            </p>

            <TransactionsFilter
              value={quickFilter}
              onChange={
                handleQuickFilterChange
              }
            />

              <TransactionsDateRange
                from={dateFrom}
                to={dateTo}
                disabled={isLoading}
                onFromChange={
                  setDateFrom
                }
                onToChange={
                  setDateTo
                }
                onApply={
                  handleApplyDateRange
                }
                onClear={
                  handleResetDateRange
                }
              />

          </div>

          <OfficeTransactionsTable
            offices={data.offices}
            query={query}
            onDocumentClick={
              handleDocumentClick
            }
          />
        </>
      ) : null}

      <TransactionTimelineDrawer
        open={openTimeline}
        onOpenChange={
          handleTimelineOpenChange
        }
        data={timelineData}
        isLoading={
          timelineLoading
        }
        error={
          timelineError
        }
      />

    </div>
  );
}