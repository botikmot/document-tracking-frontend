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
            const currentLocation =
              getCurrentLocationLabel(
                doc,
                false,
              ).toLowerCase();

            const responsibleParty =
              getResponsibleParty(
                doc,
              ).toLowerCase();

            const officeStatus =
              officeStatusLabel(
                doc.officeStatus,
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
              currentLocation.includes(
                normalizedSearch,
              ) ||
              responsibleParty.includes(
                normalizedSearch,
              ) ||
              officeStatus.includes(
                normalizedSearch,
              )
            );
          },
        );

      rows = [...rows].sort(
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
              min-w-[1500px]
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
                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Tracking
                </th>

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Subject
                </th>

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Type
                </th>

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Classification
                </th>

                {/* RD #2 — ASA SIYA KARON */}

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Current Location
                </th>

                {/* RD #3 — UNSA IYANG STATUS */}

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Office Status
                </th>

                {/* RD #4 — KINSA RESPONSIBLE */}

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Responsible Office / Person
                </th>

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Allotted Time
                </th>

                {/* RD #5 — PILA NA KADUGAY */}

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Time in Office
                </th>

                {/* RD #6 — OVERDUE BA */}

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Deadline Status
                </th>

                <th className="px-5 py-4 text-left font-bold text-slate-700 dark:text-[#D7E8DD]">
                  Deadline
                </th>
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>
              {rows.map(
                (doc) => (
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
                    {/* TRACKING */}

                    <td
                      className="
                        px-5
                        py-4
                        font-semibold
                        text-[#102418]
                        dark:text-[#F3F8F3]
                      "
                    >
                      {doc.trackingNumber}
                    </td>

                    {/* SUBJECT */}

                    <td className="px-5 py-4">
                      <div className="max-w-[230px]">
                        <p className="font-medium">
                          {doc.title}
                        </p>
                      </div>
                    </td>

                    {/* DOCUMENT TYPE */}

                    <td className="px-5 py-4">
                      {doc.documentType}
                    </td>

                    {/* CLASSIFICATION */}

                    <td className="px-5 py-4">
                      {doc.classification ===
                      'TECHNICAL'
                        ? 'HIGHLY TECHNICAL'
                        : doc.classification ??
                          '—'}
                    </td>

                    {/* CURRENT LOCATION */}

                    <td className="px-5 py-4">
                      <div className="max-w-[220px]">
                        {doc.currentLocation
                          ?.isInTransit && (
                          <p
                            className="
                              mb-1
                              text-xs
                              font-semibold
                              text-amber-600
                              dark:text-amber-400
                            "
                          >
                            In Transit →
                          </p>
                        )}

                        <p className="font-medium">
                          {getCurrentLocationLabel(
                            doc,
                          )}
                        </p>
                      </div>
                    </td>

                    {/* OFFICE STATUS */}

                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={
                          statusBadge(
                            doc.officeStatus,
                          )
                        }
                      >
                        {officeStatusLabel(
                          doc.officeStatus,
                        )}
                      </Badge>
                    </td>

                    {/* RESPONSIBLE PARTY */}

                    <td className="px-5 py-4">
                      <div className="max-w-[230px]">
                        <p className="font-medium">
                          {getResponsibleParty(
                            doc,
                          )}
                        </p>

                        {doc.responsibleOffice
                          ?.officeName && (
                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-slate-500
                              dark:text-[#7FA18E]
                            "
                          >
                            Responsible Office
                          </p>
                        )}

                        {!doc
                          .responsibleOffice
                          ?.officeName &&
                          doc.responsiblePerson && (
                            <p
                              className="
                                mt-0.5
                                text-xs
                                text-slate-500
                                dark:text-[#7FA18E]
                              "
                            >
                              Responsible Person
                            </p>
                          )}
                      </div>
                    </td>

                    {/* ALLOTTED TIME */}

                    <td className="px-5 py-4">
                      {doc.allottedTimeMs
                        ? formatDuration(
                            doc.allottedTimeMs,
                          )
                        : '—'}
                    </td>

                    {/* TIME IN OFFICE */}

                    <td className="px-5 py-4">
                      {isAwaitingReceipt(
                        doc.officeStatus,
                      )
                        ? (
                            <span className="text-slate-500">
                              Not Received
                            </span>
                          )
                        : formatDuration(
                            doc.timeInOfficeMs,
                            {
                              showSeconds:
                                true,
                            },
                          )}
                    </td>

                    {/* DEADLINE STATUS */}

                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={
                          deadlineStatusBadge(
                            doc.deadlineStatus,
                          )
                        }
                      >
                        {deadlineStatusLabel(
                          doc.deadlineStatus,
                        )}
                      </Badge>
                    </td>

                    {/* DEADLINE */}

                    <td className="px-5 py-4">
                      {doc.deadline
                        ? new Date(
                            doc.deadline,
                          ).toLocaleDateString(
                            undefined,
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )
                        : '—'}
                    </td>
                  </tr>
                ),
              )}

              {/* EMPTY STATE */}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
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
| Current Location
|--------------------------------------------------------------------------
*/

function getCurrentLocationLabel(
  doc: ReportDocument,
  showTransitPrefix = false,
) {
  const officeName =
    doc.currentLocation
      ?.officeName ??
    doc.office ??
    '—';

  if (
    showTransitPrefix &&
    doc.currentLocation
      ?.isInTransit
  ) {
    return `In Transit → ${officeName}`;
  }

  return officeName;
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
| Office Status
|--------------------------------------------------------------------------
*/

function officeStatusLabel(
  status?: string | null,
) {
  switch (status) {
    case 'AWAITING_RECEIPT':
    case 'PENDING':
      return 'Awaiting Receipt';

    case 'IN_CUSTODY':
    case 'RECEIVED':
      return 'In Custody';

    case 'FORWARDED':
      return 'Forwarded';

    case 'COMPLETED':
      return 'Completed';

    case 'RETURNED':
      return 'Returned';

    case 'UNKNOWN':
      return 'Unknown';

    default:
      return '—';
  }
}

/*
|--------------------------------------------------------------------------
| Office Status Badge
|--------------------------------------------------------------------------
*/

function statusBadge(
  status?: string | null,
) {
  switch (status) {
    case 'COMPLETED':
      return `
        border-emerald-200
        bg-emerald-100
        text-emerald-700
        dark:border-emerald-800
        dark:bg-emerald-950/50
        dark:text-emerald-300
      `;

    case 'FORWARDED':
      return `
        border-violet-200
        bg-violet-100
        text-violet-700
        dark:border-violet-800
        dark:bg-violet-950/50
        dark:text-violet-300
      `;

    case 'IN_CUSTODY':
    case 'RECEIVED':
      return `
        border-blue-200
        bg-blue-100
        text-blue-700
        dark:border-blue-800
        dark:bg-blue-950/50
        dark:text-blue-300
      `;

    case 'AWAITING_RECEIPT':
    case 'PENDING':
      return `
        border-amber-200
        bg-amber-100
        text-amber-700
        dark:border-amber-800
        dark:bg-amber-950/50
        dark:text-amber-300
      `;

    case 'RETURNED':
      return `
        border-red-200
        bg-red-100
        text-red-700
        dark:border-red-800
        dark:bg-red-950/50
        dark:text-red-300
      `;

    default:
      return `
        border-slate-200
        bg-slate-100
        text-slate-600
        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-300
      `;
  }
}

/*
|--------------------------------------------------------------------------
| Awaiting Receipt
|--------------------------------------------------------------------------
*/

function isAwaitingReceipt(
  status?: string | null,
) {
  return (
    status ===
      'AWAITING_RECEIPT' ||
    status === 'PENDING'
  );
}

/*
|--------------------------------------------------------------------------
| Deadline Status
|--------------------------------------------------------------------------
*/

function deadlineStatusLabel(
  status?: string | null,
) {
  switch (status) {
    case 'OVERDUE':
      return 'Overdue';

    case 'ON_TIME':
      return 'On Time';

    case 'AWAITING_RECEIPT':
      return 'Awaiting Receipt';

    case 'NO_DEADLINE':
      return 'No Deadline';

    default:
      return '—';
  }
}

function deadlineStatusBadge(
  status?: string | null,
) {
  switch (status) {
    case 'OVERDUE':
      return `
        border-red-200
        bg-red-100
        text-red-700
        dark:border-red-800
        dark:bg-red-950/50
        dark:text-red-300
      `;

    case 'ON_TIME':
      return `
        border-emerald-200
        bg-emerald-100
        text-emerald-700
        dark:border-emerald-800
        dark:bg-emerald-950/50
        dark:text-emerald-300
      `;

    case 'AWAITING_RECEIPT':
      return `
        border-amber-200
        bg-amber-100
        text-amber-700
        dark:border-amber-800
        dark:bg-amber-950/50
        dark:text-amber-300
      `;

    default:
      return `
        border-slate-200
        bg-slate-100
        text-slate-600
        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-300
      `;
  }
}