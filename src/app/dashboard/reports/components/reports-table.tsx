'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

import {
  Badge,
} from '@/components/ui/badge';

import {
  formatDuration,
} from '@/lib/format-duration';

import type {
  ReportDocument,
} from '@/types/report';

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

type Props = {
  loading: boolean;

  documents: ReportDocument[];
};

const PAGE_SIZE = 10;

/*
|--------------------------------------------------------------------------
| Reports Table
|--------------------------------------------------------------------------
*/

export function ReportsTable({
  documents,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    sortAsc,
    setSortAsc,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Filter + Sort
  |--------------------------------------------------------------------------
  */

  const filtered =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      let rows =
        documents.filter(
          (doc) => {
            const responsibleParty =
              getResponsibleParty(
                doc,
              ).toLowerCase();

            const pendingOffice =
              getPendingOffice(
                doc,
              ).toLowerCase();

            const performanceStatus =
              getReportStatus(
                doc,
              ).label.toLowerCase();

            const remarks =
              (
                doc.latestRemarks ??
                ''
              ).toLowerCase();

            return (
              doc.title
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              doc.trackingNumber
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              doc.documentType
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              (
                doc.classification ??
                ''
              )
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              responsibleParty.includes(
                normalizedSearch,
              ) ||
              pendingOffice.includes(
                normalizedSearch,
              ) ||
              performanceStatus.includes(
                normalizedSearch,
              ) ||
              remarks.includes(
                normalizedSearch,
              )
            );
          },
        );

      rows =
        [...rows].sort(
          (a, b) => {
            const first =
              new Date(
                a.createdAt,
              ).getTime();

            const second =
              new Date(
                b.createdAt,
              ).getTime();

            return sortAsc
              ? first - second
              : second - first;
          },
        );

      return rows;
    }, [
      documents,
      search,
      sortAsc,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages =
    Math.ceil(
      filtered.length /
        PAGE_SIZE,
    );

  const rows =
    filtered.slice(
      (page - 1) *
        PAGE_SIZE,

      page *
        PAGE_SIZE,
    );

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <Card
      className="
        rounded-[32px]
        border-0
        shadow-xl
        transition-colors
        dark:bg-[#102418]
        dark:shadow-[0_0_35px_rgba(34,197,94,0.12)]
      "
    >
      {/* =========================================================
          HEADER
      ========================================================= */}

      <CardHeader
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <CardTitle
            className="
              text-2xl
              font-black
              text-[#102418]
              dark:text-[#F3F8F3]
            "
          >
            Summary Documents
          </CardTitle>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-[#7FA18E]
            "
          >
            Current location,
            office status,
            responsibility,
            processing time and
            deadline monitoring.
          </p>
        </div>

        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          {/* SEARCH */}

          <div className="relative">
            <Search
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <Input
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value,
                );

                setPage(1);
              }}
              placeholder="Search documents..."
              className="
                w-full
                rounded-xl
                border-slate-200
                bg-white
                pl-9
                transition-colors
                sm:w-72
                dark:border-[#214234]
                dark:bg-[#173227]
                dark:text-[#F3F8F3]
                dark:placeholder:text-[#7FA18E]
              "
            />
          </div>

          {/* DATE SORT */}

          <Button
            variant="outline"
            className="
              cursor-pointer
              dark:border-[#214234]
              dark:bg-[#173227]
              dark:text-[#F3F8F3]
              dark:hover:bg-[#214234]
            "
            onClick={() => {
              setSortAsc(
                !sortAsc,
              );

              setPage(1);
            }}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />

            Date
          </Button>
        </div>
      </CardHeader>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <CardContent>
        <div
          className="
            overflow-x-auto
            rounded-2xl
            border
            border-slate-200
            bg-white
            transition-colors
            dark:border-[#214234]
            dark:bg-[#173227]
          "
        >
          <table
            className="
              w-full
              min-w-[1450px]
              text-slate-900
              dark:text-[#F3F8F3]
            "
          >
            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead
              className="
                bg-slate-50
                transition-colors
                dark:bg-[#102418]
              "
            >
              <tr>
                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Tracking No.
                </th>

                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Subject
                </th>

                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Responsible Office / Person
                </th>

                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Classification
                </th>

                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Due Date / Total Processing Time
                </th>

                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Received Date
                </th>

                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Status
                </th>

                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Pending Office
                </th>

                <th className="px-4 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Remarks
                </th>
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>
              {rows.map(
                (doc) => {
                  const reportStatus =
                    getReportStatus(
                      doc,
                    );

                  return (
                    <tr
                      key={doc.id}
                      className="
                        border-t
                        border-slate-200
                        transition-colors
                        hover:bg-slate-50
                        dark:border-[#214234]
                        dark:hover:bg-[#102418]
                      "
                    >
                      {/* ===================================== */}
                      {/* TRACKING NUMBER */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#102418] dark:text-[#F3F8F3]">
                          {doc.trackingNumber}
                        </p>
                      </td>

                      {/* ===================================== */}
                      {/* SUBJECT */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <div className="max-w-[240px]">
                          <p className="font-medium">
                            {doc.title}
                          </p>
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* RESPONSIBLE OFFICE / PERSON */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <div className="max-w-[220px]">
                          <p className="font-medium">
                            {getResponsibleParty(
                              doc,
                            )}
                          </p>

                          {doc.responsibleOffice
                            ?.officeName && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-[#7FA18E]">
                              Responsible Office
                            </p>
                          )}

                          {!doc
                            .responsibleOffice
                            ?.officeName &&
                            doc.responsiblePerson && (
                              <p className="mt-1 text-xs text-slate-500 dark:text-[#7FA18E]">
                                Responsible Person
                              </p>
                            )}
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* CLASSIFICATION */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <span className="text-sm font-medium">
                          {doc.classification ===
                          'TECHNICAL'
                            ? 'HIGHLY TECHNICAL'
                            : doc.classification ??
                              '—'}
                        </span>
                      </td>

                      {/* ===================================== */}
                      {/* DUE DATE / TOTAL PROCESSING TIME */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <div className="min-w-[170px]">
                          <p className="font-medium">
                            {formatReportDate(
                              doc.deadline,
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500 dark:text-[#7FA18E]">
                            {formatTotalProcessingTime(
                              doc.allottedTimeMs,
                            )}
                          </p>
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* RECEIVED DATE */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <div className="min-w-[145px]">
                          {doc.receivedAt ? (
                            <>
                              <p className="text-sm font-medium">
                                {formatReceivedDate(
                                  doc.receivedAt,
                                )}
                              </p>
                            </>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Not received
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* PERFORMANCE / DEADLINE STATUS */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <div className="min-w-[190px]">
                          <Badge
                            variant="outline"
                            className={
                              reportStatus.className
                            }
                          >
                            {reportStatus.label}
                          </Badge>

                          {isDocumentCompleted(
                            doc,
                          ) &&
                            doc.completedAt && (
                              <p className="mt-1.5 text-xs font-medium text-slate-600 dark:text-[#A9C5B6]">
                                {formatReceivedDate(
                                  doc.completedAt,
                                )}
                              </p>
                            )}

                          {reportStatus.detail && (
                            <p
                              className={`
                                mt-1
                                text-xs
                                ${
                                  reportStatus.type ===
                                  'late'
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-slate-500 dark:text-[#7FA18E]'
                                }
                              `}
                            >
                              {reportStatus.detail}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* PENDING OFFICE */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <div className="max-w-[220px]">
                          {doc.currentLocation
                            ?.isInTransit &&
                            !isDocumentCompleted(
                              doc,
                            ) && (
                              <p className="mb-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                In Transit
                              </p>
                            )}

                          <p className="font-medium">
                            {getPendingOffice(
                              doc,
                            )}
                          </p>
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* REMARKS */}
                      {/* ===================================== */}

                      <td className="px-4 py-4">
                        <div className="max-w-[260px]">
                          <p className="text-sm leading-6 text-slate-600 dark:text-[#A9C5B6]">
                            {doc.latestRemarks
                              ?.trim() ||
                              '—'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}

              {/* EMPTY STATE */}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="
                      py-16
                      text-center
                      text-slate-500
                      dark:text-[#7FA18E]
                    "
                  >
                    No documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
          "
        >
          <p className="text-sm text-slate-500 dark:text-[#7FA18E]">
            Showing{' '}
            {rows.length}{' '}
            of{' '}
            {filtered.length}
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={
                page === 1
              }
              className="
                cursor-pointer
                dark:border-[#214234]
                dark:bg-[#173227]
                dark:text-[#F3F8F3]
              "
              onClick={() =>
                setPage(
                  page - 1,
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span
              className="
                flex
                items-center
                px-4
                text-sm
                font-semibold
              "
            >
              {page} /{' '}
              {totalPages || 1}
            </span>

            <Button
              variant="outline"
              disabled={
                page >=
                totalPages
              }
              className="
                cursor-pointer
                dark:border-[#214234]
                dark:bg-[#173227]
                dark:text-[#F3F8F3]
              "
              onClick={() =>
                setPage(
                  page + 1,
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


/*
|--------------------------------------------------------------------------
| Responsible Party
|--------------------------------------------------------------------------
|
| Priority:
| 1. Responsible Office
| 2. Responsible Person
| 3. None
|
*/

function getResponsibleParty(
  doc: ReportDocument,
) {
  if (
    doc.responsibleOffice
      ?.officeName
  ) {
    return doc
      .responsibleOffice
      .officeName;
  }

  if (
    doc.responsiblePerson
      ?.trim()
  ) {
    return doc.responsiblePerson;
  }

  return '—';
}

/*
|--------------------------------------------------------------------------
| DOCUMENT COMPLETION
|--------------------------------------------------------------------------
*/

function isDocumentCompleted(
  doc: ReportDocument,
) {
  return (
    doc.status ===
      'COMPLETED' ||
    doc.status ===
      'END_TRANSACTION' ||
    doc.officeStatus ===
      'COMPLETED' ||
    Boolean(doc.acted)
  );
}

/*
|--------------------------------------------------------------------------
| REPORT DATE
|--------------------------------------------------------------------------
*/

function formatReportDate(
  value?: string | null,
) {
  if (!value) {
    return 'No due date';
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

  return date.toLocaleDateString(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );
}

/*
|--------------------------------------------------------------------------
| RECEIVED DATE
|--------------------------------------------------------------------------
*/

function formatReceivedDate(
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

  return date.toLocaleString(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',

      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
  );
}

/*
|--------------------------------------------------------------------------
| TOTAL PROCESSING TIME
|--------------------------------------------------------------------------
|
| Report requirement:
| show total allotted processing time
| in hours.
|
| Example:
| 72 hours
|--------------------------------------------------------------------------
*/

function formatTotalProcessingTime(
  milliseconds?:
    | number
    | null,
) {
  if (
    milliseconds === null ||
    milliseconds === undefined
  ) {
    return 'No processing time';
  }

  const hours =
    Math.round(
      milliseconds /
        (1000 * 60 * 60),
    );

  if (hours <= 0) {
    return '< 1 hour';
  }

  return `${hours} hour${
    hours === 1
      ? ''
      : 's'
  }`;
}

/*
|--------------------------------------------------------------------------
| RELATIVE DURATION
|--------------------------------------------------------------------------
*/

function formatRelativeDuration(
  milliseconds: number,
) {
  const safeMilliseconds =
    Math.abs(milliseconds);

  if (
    safeMilliseconds <
    60 * 1000
  ) {
    return '<1m';
  }

  const totalMinutes =
    Math.floor(
      safeMilliseconds /
        (1000 * 60),
    );

  const days =
    Math.floor(
      totalMinutes /
        1440,
    );

  const hours =
    Math.floor(
      (totalMinutes %
        1440) /
        60,
    );

  const minutes =
    totalMinutes %
    60;

  const parts: string[] =
    [];

  if (days > 0) {
    parts.push(
      `${days}d`,
    );
  }

  if (hours > 0) {
    parts.push(
      `${hours}h`,
    );
  }

  /*
   * Show minutes when duration
   * is below one day.
   */
  if (
    days === 0 &&
    minutes > 0
  ) {
    parts.push(
      `${minutes}m`,
    );
  }

  return (
    parts.join(' ') ||
    '<1m'
  );
}

/*
|--------------------------------------------------------------------------
| REPORT PERFORMANCE STATUS
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| REPORT PERFORMANCE STATUS
|--------------------------------------------------------------------------
|
| Main label:
| → Always use actual document status
|
| Detail:
| → Deadline / processing performance
|
*/

function getReportStatus(
  doc: ReportDocument,
) {
  const completed =
    doc.status === 'COMPLETED' ||
    doc.status === 'END_TRANSACTION';

  /*
  |--------------------------------------------------------------------------
  | DISPLAY STATUS
  |--------------------------------------------------------------------------
  */

  const statusLabel =
    doc.status;

  /*
  |--------------------------------------------------------------------------
  | NO DEADLINE
  |--------------------------------------------------------------------------
  */

  if (!doc.deadline) {
    return {
      label: statusLabel,

      detail: 'No Due Date',

      type: completed
        ? 'completed'
        : 'neutral',

      className: completed
        ? `
          border-emerald-200
          bg-emerald-100
          text-emerald-700
          dark:border-emerald-800
          dark:bg-emerald-950/50
          dark:text-emerald-300
        `
        : `
          border-slate-200
          bg-slate-100
          text-slate-600
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-slate-300
        `,
    };
  }

  const deadline =
    new Date(
      doc.deadline,
    ).getTime();

  /*
  |--------------------------------------------------------------------------
  | INVALID DEADLINE
  |--------------------------------------------------------------------------
  */

  if (
    Number.isNaN(
      deadline,
    )
  ) {
    return {
      label: statusLabel,
      detail: undefined,
      type: 'neutral',

      className: `
        border-slate-200
        bg-slate-100
        text-slate-600
        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-300
      `,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | COMPLETED / END TRANSACTION
  |--------------------------------------------------------------------------
  */

  if (completed) {
    /*
     * No completion timestamp.
     */

    if (!doc.completedAt) {
      return {
        label: statusLabel,

        detail: undefined,

        type: 'completed',

        className: `
          border-emerald-200
          bg-emerald-100
          text-emerald-700
          dark:border-emerald-800
          dark:bg-emerald-950/50
          dark:text-emerald-300
        `,
      };
    }

    const completedAt =
      new Date(
        doc.completedAt,
      ).getTime();

    if (
      Number.isNaN(
        completedAt,
      )
    ) {
      return {
        label: statusLabel,

        detail: undefined,

        type: 'completed',

        className: `
          border-emerald-200
          bg-emerald-100
          text-emerald-700
          dark:border-emerald-800
          dark:bg-emerald-950/50
          dark:text-emerald-300
        `,
      };
    }

    /*
     * Positive:
     * completed BEFORE deadline
     *
     * Negative:
     * completed AFTER deadline
     */

    const difference =
      deadline -
      completedAt;

    /*
    |--------------------------------------------------------------------------
    | COMPLETED BEFORE / ON DEADLINE
    |--------------------------------------------------------------------------
    */

    if (difference >= 0) {
      return {
        label: statusLabel,

        detail:
          `${formatRelativeDuration(
            difference,
          )} remaining`,

        type: 'completed',

        className: `
          border-emerald-200
          bg-emerald-100
          text-emerald-700
          dark:border-emerald-800
          dark:bg-emerald-950/50
          dark:text-emerald-300
        `,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | COMPLETED AFTER DEADLINE
    |--------------------------------------------------------------------------
    */

    return {
      label: statusLabel,

      detail:
        `${formatRelativeDuration(
          Math.abs(
            difference,
          ),
        )} late`,

      type: 'late',

      className: `
        border-orange-200
        bg-orange-100
        text-orange-700
        dark:border-orange-800
        dark:bg-orange-950/50
        dark:text-orange-300
      `,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ACTIVE DOCUMENT
  |--------------------------------------------------------------------------
  */

  const difference =
    deadline -
    Date.now();

  /*
  |--------------------------------------------------------------------------
  | ACTIVE + WITHIN DEADLINE
  |--------------------------------------------------------------------------
  */

  if (difference >= 0) {
    return {
      label: statusLabel,

      detail:
        `${formatRelativeDuration(
          difference,
        )} remaining`,

      type: 'ontime',

      className: `
        border-blue-200
        bg-blue-100
        text-blue-700
        dark:border-blue-800
        dark:bg-blue-950/50
        dark:text-blue-300
      `,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ACTIVE + OVERDUE
  |--------------------------------------------------------------------------
  */

  return {
    label: statusLabel,

    detail:
      `Overdue by ${formatRelativeDuration(
        Math.abs(
          difference,
        ),
      )}`,

    type: 'overdue',

    className: `
      border-red-200
      bg-red-100
      text-red-700
      dark:border-red-800
      dark:bg-red-950/50
      dark:text-red-300
    `,
  };
}

/*
|--------------------------------------------------------------------------
| PENDING OFFICE
|--------------------------------------------------------------------------
*/

function getPendingOffice(
  doc: ReportDocument,
) {
  /*
   * Completed/end transaction documents
   * are no longer pending anywhere.
   */

  if (
    isDocumentCompleted(
      doc,
    )
  ) {
    return '—';
  }

  return (
    doc.currentLocation
      ?.officeName ??
    doc.office ??
    '—'
  );
}