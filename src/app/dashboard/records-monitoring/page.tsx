'use client';

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  History,
  Inbox,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { toast } from 'sonner';

import { api } from '@/lib/axios';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/store/auth.store';

/*
|--------------------------------------------------------------------------
| Adjust these paths if needed
|--------------------------------------------------------------------------
*/

import { DocumentDetailsDrawer } from '../documents/components/document-details-drawer';
import { DocumentTimelineDrawer } from '../documents/components/document-timeline-drawer';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type RecordsMonitoringStatus =
  | 'AWAITING_RECEIPT'
  | 'IN_CUSTODY'
  | 'COMPLETED'
  | 'RETURNED'
  | 'UNKNOWN';

interface OfficeInfo {
  id: string;
  officeCode: string;
  officeName: string;
}

interface RecordsMonitoringInfo {
  recordsOffice: OfficeInfo;

  status: RecordsMonitoringStatus;

  currentlyInRecords: boolean;

  isOverdue: boolean;

  allottedTimeMs: number | null;

  timeInRecordsMs: number | null;

  receivedAt: string | null;

  completedAt: string | null;

  lastRoutedFrom: string | null;

  lastRoutedTo: string | null;

  routedFromRecordsAt: string | null;

  transactionCount: number;

  lastTransactionAt: string;
}

interface RecordsMonitoringDocument {
  id: string;

  trackingNumber: string;

  title: string;

  description?: string | null;

  referenceNumber?: string | null;

  addressee?: string | null;

  senderType?: string | null;

  senderName?: string | null;

  senderOrganization?: string | null;

  senderContact?: string | null;

  priority?: string | null;

  classification?: string | null;

  confidentialityLevel?: string | null;

  deadline?: string | null;

  createdAt: string;

  updatedAt: string;

  documentType?: {
    id: string;
    name: string;
  } | null;

  currentStatus?: {
    id: string;
    name: string;
  } | null;

  currentOffice?: OfficeInfo | null;

  senderOffice?: OfficeInfo | null;

  routes: unknown[];

  recordsMonitoring: RecordsMonitoringInfo;
}

interface RecordsMonitoringResponse {
  recordsOffice: OfficeInfo;

  data: RecordsMonitoringDocument[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(date);
}

function formatDuration(
  milliseconds?: number | null,
) {
  if (
    milliseconds === null ||
    milliseconds === undefined
  ) {
    return 'Not available';
  }

  if (
    milliseconds > 0 &&
    milliseconds < 1000
  ) {
    return '<1s';
  }

  const totalSeconds =
    Math.floor(
      milliseconds / 1000,
    );

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const totalMinutes =
    Math.floor(
      totalSeconds / 60,
    );

  const seconds =
    totalSeconds % 60;

  if (totalMinutes < 60) {
    return `${totalMinutes}m ${seconds}s`;
  }

  const totalHours =
    Math.floor(
      totalMinutes / 60,
    );

  const minutes =
    totalMinutes % 60;

  if (totalHours < 24) {
    return `${totalHours}h ${minutes}m`;
  }

  const days =
    Math.floor(
      totalHours / 24,
    );

  const hours =
    totalHours % 24;

  return `${days}d ${hours}h ${minutes}m`;
}

function getStatusLabel(
  status: RecordsMonitoringStatus,
) {
  switch (status) {
    case 'AWAITING_RECEIPT':
      return 'Awaiting Receipt';

    case 'IN_CUSTODY':
      return 'In Records';

    case 'COMPLETED':
      return 'Completed';

    case 'RETURNED':
      return 'Returned';

    default:
      return 'Unknown';
  }
}

function getStatusClass(
  status: RecordsMonitoringStatus,
) {
  switch (status) {
    case 'AWAITING_RECEIPT':
      return `
        border-amber-200
        bg-amber-50
        text-amber-700
        dark:border-amber-900
        dark:bg-amber-950/30
        dark:text-amber-300
      `;

    case 'IN_CUSTODY':
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
        dark:border-blue-900
        dark:bg-blue-950/30
        dark:text-blue-300
      `;

    case 'COMPLETED':
      return `
        border-emerald-200
        bg-emerald-50
        text-emerald-700
        dark:border-emerald-900
        dark:bg-emerald-950/30
        dark:text-emerald-300
      `;

    case 'RETURNED':
      return `
        border-red-200
        bg-red-50
        text-red-700
        dark:border-red-900
        dark:bg-red-950/30
        dark:text-red-300
      `;

    default:
      return `
        border-slate-200
        bg-slate-50
        text-slate-600
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-300
      `;
  }
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function RecordsMonitoringPage() {
  const user =
    useAuthStore(
      (state) =>
        state.user,
    );

  /*
  |--------------------------------------------------------------------------
  | Permission
  |--------------------------------------------------------------------------
  */

  const isOrdUser =
    user?.offices?.some(
      (item) =>
        item.office
          ?.officeCode ===
          'ORD' ||
        item.officeCode ===
          'ORD',
    ) ?? false;

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [
    documents,
    setDocuments,
  ] = useState<
    RecordsMonitoringDocument[]
  >([]);

  const [
    recordsOffice,
    setRecordsOffice,
  ] =
    useState<OfficeInfo | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    meta,
    setMeta,
  ] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [
    selectedDocument,
    setSelectedDocument,
  ] =
    useState<RecordsMonitoringDocument | null>(
      null,
    );

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [
    openTimeline,
    setOpenTimeline,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch Records Monitoring
  |--------------------------------------------------------------------------
  */

  const loadRecordsMonitoring =
    useCallback(
      async (
        showRefresh = false,
      ) => {
        try {
          if (showRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          const response =
            await api.get<RecordsMonitoringResponse>(
              '/documents/records-monitoring',
              {
                params: {
                  page,
                  limit: 10,
                  search:
                    search.trim() ||
                    undefined,
                },
              },
            );

          setDocuments(
            response.data.data,
          );

          setRecordsOffice(
            response.data
              .recordsOffice,
          );

          setMeta(
            response.data.meta,
          );
        } catch (error: unknown) {
          console.error(
            'Failed to load Records Monitoring:',
            error,
          );

          toast.error(
            'Failed to load Records Monitoring',
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [
        page,
        search,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | Initial Load / Search / Pagination
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    /*
     * Small debounce so we do not hit
     * the API on every keystroke.
     */

    const timer =
      window.setTimeout(
        () => {
          void loadRecordsMonitoring();
        },
        search ? 400 : 0,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    loadRecordsMonitoring,
    search,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Page-level Visible Counts
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | These status counts are only for the currently loaded page.
  | The global total comes from backend meta.total.
  |
  */

  const visibleInRecords =
    documents.filter(
      (document) =>
        document.recordsMonitoring
          .status ===
        'IN_CUSTODY',
    ).length;

  const visibleAwaiting =
    documents.filter(
      (document) =>
        document.recordsMonitoring
          .status ===
        'AWAITING_RECEIPT',
    ).length;

  const visibleCompleted =
    documents.filter(
      (document) =>
        document.recordsMonitoring
          .status ===
        'COMPLETED',
    ).length;

  const visibleOverdue =
    documents.filter(
      (document) =>
        document.recordsMonitoring
          .isOverdue,
    ).length;

  /*
  |--------------------------------------------------------------------------
  | Loading User
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return (
      <div className="p-6">
        <Card className="rounded-[30px] border-slate-200 dark:border-[#214234] dark:bg-[#102418]">
          <CardContent className="p-16 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-emerald-600" />

            <p className="mt-4 text-sm text-slate-500 dark:text-[#A9C5B6]">
              Loading account...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Frontend ORD Guard
  |--------------------------------------------------------------------------
  |
  | Backend remains the real security guard.
  |
  */

  if (!isOrdUser) {
    return (
      <div className="p-6">
        <Card
          className="
            mx-auto
            max-w-2xl
            rounded-[32px]
            border
            border-amber-200
            bg-white
            shadow-sm
            dark:border-amber-900
            dark:bg-[#102418]
          "
        >
          <CardContent className="p-12 text-center">
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-amber-100
                text-amber-700
                dark:bg-amber-950/40
                dark:text-amber-300
              "
            >
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-[#102418] dark:text-[#F3F8F3]">
              Restricted Access
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-[#A9C5B6]">
              Records Monitoring is
              available only to
              authorized users from
              the Office of the
              Regional Director.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

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

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
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

                  ORD Monitoring
                </Badge>

                <Badge
                  variant="outline"
                  className="
                    rounded-full
                    border-white/10
                    text-slate-300
                  "
                >
                  Read Only
                </Badge>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">
                Records Monitoring
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Monitor documents and
                transactions handled
                by{' '}
                <span className="font-bold text-white">
                  {recordsOffice
                    ?.officeName ??
                    'Records Office'}
                </span>
                , including documents
                that have already
                moved to another
                office.
              </p>
            </div>

            <Button
              variant="outline"
              disabled={
                refreshing
              }
              onClick={() =>
                void loadRecordsMonitoring(
                  true,
                )
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
                  refreshing
                    ? 'animate-spin'
                    : ''
                }`}
              />

              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================
          SUMMARY
      ========================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {/* TOTAL */}

        <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-[#214234] dark:bg-[#102418]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-700
                  dark:bg-[#173227]
                  dark:text-[#F3F8F3]
                "
              >
                <FileText className="h-5 w-5" />
              </div>

              <Badge variant="outline">
                All
              </Badge>
            </div>

            <div className="mt-5 text-3xl font-black text-[#102418] dark:text-[#F3F8F3]">
              {meta.total}
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-[#A9C5B6]">
              Total Records
              transactions
            </p>
          </CardContent>
        </Card>

        {/* IN RECORDS */}

        <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-[#214234] dark:bg-[#102418]">
          <CardContent className="p-5">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-blue-100
                text-blue-700
                dark:bg-blue-950/40
                dark:text-blue-300
              "
            >
              <Inbox className="h-5 w-5" />
            </div>

            <div className="mt-5 text-3xl font-black text-[#102418] dark:text-[#F3F8F3]">
              {visibleInRecords}
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-[#A9C5B6]">
              In Records · current
              page
            </p>
          </CardContent>
        </Card>

        {/* AWAITING */}

        <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-[#214234] dark:bg-[#102418]">
          <CardContent className="p-5">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-amber-100
                text-amber-700
                dark:bg-amber-950/40
                dark:text-amber-300
              "
            >
              <Clock3 className="h-5 w-5" />
            </div>

            <div className="mt-5 text-3xl font-black text-[#102418] dark:text-[#F3F8F3]">
              {visibleAwaiting}
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-[#A9C5B6]">
              Awaiting receipt ·
              current page
            </p>
          </CardContent>
        </Card>

        {/* COMPLETED */}

        <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-[#214234] dark:bg-[#102418]">
          <CardContent className="p-5">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-emerald-100
                text-emerald-700
                dark:bg-emerald-950/40
                dark:text-emerald-300
              "
            >
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="mt-5 text-3xl font-black text-[#102418] dark:text-[#F3F8F3]">
              {visibleCompleted}
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-[#A9C5B6]">
              Completed · current
              page
            </p>
          </CardContent>
        </Card>

        {/* OVERDUE */}

        <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-[#214234] dark:bg-[#102418]">
          <CardContent className="p-5">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-red-100
                text-red-700
                dark:bg-red-950/40
                dark:text-red-300
              "
            >
              <Clock3 className="h-5 w-5" />
            </div>

            <div className="mt-5 text-3xl font-black text-[#102418] dark:text-[#F3F8F3]">
              {visibleOverdue}
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-[#A9C5B6]">
              Overdue · current page
            </p>
          </CardContent>
        </Card>
      </div>

      {/* =========================================================
          DOCUMENTS
      ========================================================= */}

      <Card className="overflow-hidden rounded-[30px] border-slate-200 shadow-sm dark:border-[#214234] dark:bg-[#102418]">
        <CardHeader className="border-b border-slate-100 dark:border-[#214234]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-[#102418] dark:text-[#F3F8F3]">
                Records Transactions
              </CardTitle>

              <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                Historical and active
                documents monitored
                from Records.
              </p>
            </div>

            <div className="relative w-full lg:w-[360px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target
                      .value,
                  );

                  setPage(1);
                }}
                placeholder="Search tracking no., title, sender..."
                className="
                  h-11
                  rounded-xl
                  pl-10
                  dark:border-[#214234]
                  dark:bg-[#173227]
                  dark:text-[#F3F8F3]
                "
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* LOADING */}

          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="mx-auto h-7 w-7 animate-spin text-emerald-600" />

              <p className="mt-4 text-sm text-slate-500 dark:text-[#A9C5B6]">
                Loading Records
                transactions...
              </p>
            </div>
          ) : documents.length ===
            0 ? (
            /* EMPTY */

            <div className="py-20 text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-3xl
                  bg-slate-100
                  text-slate-400
                  dark:bg-[#173227]
                  dark:text-[#7FA18E]
                "
              >
                <Inbox className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-bold text-[#102418] dark:text-[#F3F8F3]">
                No Records
                transactions found
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-[#A9C5B6]">
                {search
                  ? 'Try another search term.'
                  : 'No documents have been recorded for monitoring yet.'}
              </p>
            </div>
          ) : (
            /* DOCUMENT LIST */

            <div className="space-y-3">
              {documents.map(
                (document) => (
                  <div
                    key={
                      document.id
                    }
                    className="
                      rounded-3xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      transition-all
                      hover:border-emerald-200
                      hover:shadow-md
                      dark:border-[#214234]
                      dark:bg-[#102418]
                      dark:hover:border-emerald-800
                      dark:hover:bg-[#173227]
                    "
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      {/* LEFT */}

                      <div className="flex min-w-0 flex-1 gap-4">
                        <div
                          className="
                            flex
                            h-14
                            w-14
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-green-600
                            to-emerald-600
                            text-white
                            shadow-md
                          "
                        >
                          <FileText className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="max-w-xl truncate text-lg font-bold text-[#102418] dark:text-[#F3F8F3]">
                              {
                                document.title
                              }
                            </h3>

                            {document
                              .recordsMonitoring
                              .isOverdue && (
                              <Badge
                                className="
                                  rounded-full
                                  border
                                  border-red-200
                                  bg-red-50
                                  text-red-700
                                  dark:border-red-900
                                  dark:bg-red-950/30
                                  dark:text-red-300
                                "
                              >
                                Overdue
                              </Badge>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-bold text-slate-700 dark:text-[#F3F8F3]">
                              {
                                document.trackingNumber
                              }
                            </span>

                            <span className="text-slate-300">
                              •
                            </span>

                            <span className="text-slate-500 dark:text-[#A9C5B6]">
                              {document
                                .documentType
                                ?.name ??
                                'Unknown type'}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                            {/* RECORDS STATUS */}

                            <div>
                              <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                                Records
                                Status
                              </p>

                              <Badge
                                variant="outline"
                                className={`mt-1 rounded-full ${getStatusClass(
                                  document
                                    .recordsMonitoring
                                    .status,
                                )}`}
                              >
                                {getStatusLabel(
                                  document
                                    .recordsMonitoring
                                    .status,
                                )}
                              </Badge>
                            </div>

                            {/* CURRENT OFFICE */}

                            <div>
                              <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                                Current
                                Office
                              </p>

                              <p className="mt-1 flex items-center gap-1.5 font-medium text-slate-700 dark:text-[#F3F8F3]">
                                <Building2 className="h-3.5 w-3.5 text-slate-400" />

                                {document
                                  .currentOffice
                                  ?.officeName ??
                                  '—'}
                              </p>
                            </div>

                            {/* ROUTED TO */}

                            <div>
                              <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                                Last Routed
                                To
                              </p>

                              <p className="mt-1 font-medium text-slate-700 dark:text-[#F3F8F3]">
                                {document
                                  .recordsMonitoring
                                  .lastRoutedTo ??
                                  '—'}
                              </p>
                            </div>

                            {/* TIME */}

                            <div>
                              <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                                Time in
                                Records
                              </p>

                              <p className="mt-1 flex items-center gap-1.5 font-bold text-slate-700 dark:text-[#F3F8F3]">
                                <Clock3 className="h-3.5 w-3.5 text-emerald-600" />

                                {formatDuration(
                                  document
                                    .recordsMonitoring
                                    .timeInRecordsMs,
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-[#A9C5B6]">
                            <span>
                              Received:{' '}
                              <strong>
                                {formatDate(
                                  document
                                    .recordsMonitoring
                                    .receivedAt,
                                )}
                              </strong>
                            </span>

                            <span>
                              Records
                              Completed:{' '}
                              <strong>
                                {formatDate(
                                  document
                                    .recordsMonitoring
                                    .completedAt,
                                )}
                              </strong>
                            </span>

                            <span>
                              Transactions:{' '}
                              <strong>
                                {
                                  document
                                    .recordsMonitoring
                                    .transactionCount
                                }
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="
                            cursor-pointer
                            rounded-xl
                            dark:border-[#214234]
                            dark:bg-[#173227]
                            dark:text-[#F3F8F3]
                          "
                          onClick={() => {
                            setSelectedDocument(
                              document,
                            );

                            setOpenDetails(
                              true,
                            );
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />

                          Details
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="
                            cursor-pointer
                            rounded-xl
                            dark:border-[#214234]
                            dark:bg-[#173227]
                            dark:text-[#F3F8F3]
                          "
                          onClick={() => {
                            setSelectedDocument(
                              document,
                            );

                            setOpenTimeline(
                              true,
                            );
                          }}
                        >
                          <History className="mr-2 h-4 w-4" />

                          Timeline
                        </Button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>

        {/* =======================================================
            PAGINATION
        ======================================================= */}

        {!loading &&
          meta.total > 0 && (
            <div
              className="
                flex
                flex-col
                gap-4
                border-t
                border-slate-100
                px-6
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                dark:border-[#214234]
              "
            >
              <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                Page{' '}
                <strong>
                  {meta.page}
                </strong>{' '}
                of{' '}
                <strong>
                  {meta.totalPages ||
                    1}
                </strong>
                {' · '}
                {meta.total}{' '}
                transaction
                {meta.total !== 1
                  ? 's'
                  : ''}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={
                    page <= 1
                  }
                  onClick={() =>
                    setPage(
                      (
                        previous,
                      ) =>
                        Math.max(
                          previous -
                            1,
                          1,
                        ),
                    )
                  }
                  className="
                    cursor-pointer
                    rounded-xl
                    dark:border-[#214234]
                    dark:bg-[#173227]
                    dark:text-[#F3F8F3]
                  "
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />

                  Previous
                </Button>

                <Button
                  variant="outline"
                  disabled={
                    page >=
                    meta.totalPages
                  }
                  onClick={() =>
                    setPage(
                      (
                        previous,
                      ) =>
                        previous +
                        1,
                    )
                  }
                  className="
                    cursor-pointer
                    rounded-xl
                    dark:border-[#214234]
                    dark:bg-[#173227]
                    dark:text-[#F3F8F3]
                  "
                >
                  Next

                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
      </Card>

      {/* =========================================================
          READ-ONLY DETAILS
      ========================================================= */}

      <DocumentDetailsDrawer
        open={openDetails}
        onOpenChange={
          setOpenDetails
        }
        document={
          selectedDocument
        }
      />

      {/* =========================================================
          TIMELINE
      ========================================================= */}

      <DocumentTimelineDrawer
        open={openTimeline}
        onOpenChange={
          setOpenTimeline
        }
        document={
          selectedDocument
        }
      />
    </div>
  );
}