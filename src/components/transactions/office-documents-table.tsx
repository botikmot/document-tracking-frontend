import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Route,
} from 'lucide-react';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import { DocumentStatusBadge } from '../common/status-badge';

import type {
  TransactionOfficeDocumentsResponse,
} from '@/types/transaction';

import { formatMonitoringCategory, formatTransactionDuration, formatTransactionShortDate, } from '@/lib/utils';


type OfficeDocumentsTableProps = {
  data:
    TransactionOfficeDocumentsResponse;

  isLoading?: boolean;

  onDocumentClick:
    (
      documentId: string,
    ) => void;

  onPageChange:
    (page: number) => void;
};

export function OfficeDocumentsTable({
  data,
  isLoading = false,
  onDocumentClick,
  onPageChange,
}: OfficeDocumentsTableProps) {
  const {
    documents,
    pagination,
  } = data;

  if (
    isLoading
  ) {
    return (
      <div className="py-12 text-center">
        <Clock3
          className="
            mx-auto
            h-6
            w-6
            animate-spin
            text-emerald-600
          "
        />

        <p
          className="
            mt-3
            text-sm
            text-slate-500
            dark:text-[#A9C5B6]
          "
        >
          Loading documents...
        </p>
      </div>
    );
  }

  if (
    documents.length === 0
  ) {
    return (
      <div className="py-12 text-center">
        <FileText
          className="
            mx-auto
            h-7
            w-7
            text-slate-300
            dark:text-[#7FA18E]
          "
        />

        <p
          className="
            mt-3
            text-sm
            font-medium
            text-slate-500
            dark:text-[#A9C5B6]
          "
        >
          No documents found
          for this category.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table
          className="
            min-w-[1450px]
            w-full
            text-left
          "
        >
          <thead>
            <tr
              className="
                border-b
                border-slate-200
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-500
                dark:border-[#214234]
                dark:text-[#7FA18E]
              "
            >
              <th className="px-4 py-3">
                Tracking
              </th>

              <th className="px-4 py-3">
                Subject
              </th>

              <th className="px-4 py-3">
                Origin
              </th>

              <th className="px-4 py-3">
                Category
              </th>

              <th className="px-4 py-3">
                Received
              </th>

              <th className="px-4 py-3">
                Status
              </th>

              <th className="px-4 py-3">
                Current Office
              </th>

              <th className="px-4 py-3">
                Last Movement
              </th>

              <th className="px-4 py-3">
                Deadline
              </th>

              <th className="px-4 py-3">
                Remarks
              </th>

              <th className="px-4 py-3 text-right">
                View
              </th>
            </tr>
          </thead>

          <tbody>
            {documents.map(
              (document) => (
                <tr
                  key={
                    document.id
                  }
                  className="
                    border-b
                    border-slate-100
                    transition-colors
                    hover:bg-emerald-50/40
                    dark:border-[#214234]
                    dark:hover:bg-[#173227]
                  "
                >
                  {/* TRACKING */}

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        onDocumentClick(
                          document.id,
                        )
                      }
                      className="
                        cursor-pointer
                        font-bold
                        text-emerald-700
                        hover:underline
                        dark:text-emerald-300
                      "
                    >
                      {
                        document.trackingNumber
                      }
                    </button>
                  </td>

                  {/* SUBJECT */}

                  <td className="px-4 py-4">
                    <div className="max-w-[260px]">
                      <p
                        className="
                          font-semibold
                          text-slate-800
                          dark:text-[#F3F8F3]
                        "
                      >
                        {
                          document.subject
                        }
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-500
                          dark:text-[#A9C5B6]
                        "
                      >
                        {
                          document.documentType
                        }
                      </p>
                    </div>
                  </td>

                  {/* ORIGIN */}

                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className="
                        rounded-full
                        dark:border-[#315943]
                        dark:bg-[#173227]
                        dark:text-[#F3F8F3]
                      "
                    >
                      {
                        document.sourceClass ??
                        'UNCATEGORIZED'
                      }
                    </Badge>
                  </td>

                  {/* CATEGORY */}

                  <td className="px-4 py-4">
                    <span
                      className="
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-[#F3F8F3]
                      "
                    >
                      {formatMonitoringCategory(
                        document.monitoringCategory,
                      )}
                    </span>
                  </td>

                  {/* RECEIVED */}

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                      text-slate-600
                      dark:text-[#A9C5B6]
                    "
                  >
                    {formatTransactionShortDate(
                      document.receivedAt,
                    )}
                  </td>

                  {/* STATUS */}

                  <td className="px-4 py-4">
                    <DocumentStatusBadge
                      status={
                        document.status
                      }
                    />
                  </td>

                  {/* CURRENT OFFICE */}

                  <td className="px-4 py-4">
                    <div className="max-w-[210px]">
                      <p
                        className="
                          text-sm
                          font-semibold
                          text-slate-700
                          dark:text-[#F3F8F3]
                        "
                      >
                        {
                          document.currentOffice
                            .officeName
                        }
                      </p>

                      {document
                        .isCurrentlyAtOffice && (
                        <p
                          className="
                            mt-1
                            text-xs
                            font-medium
                            text-emerald-600
                            dark:text-emerald-400
                          "
                        >
                          Current custody
                        </p>
                      )}
                    </div>
                  </td>

                  {/* LAST MOVEMENT */}

                  <td className="px-4 py-4">
                    {document.lastMovement ? (
                      <div>
                        <p
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-sm
                            font-semibold
                            text-slate-700
                            dark:text-[#F3F8F3]
                          "
                        >
                          <Route className="h-3.5 w-3.5 text-emerald-600" />

                          {
                            document
                              .lastMovement
                              .label
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                            dark:text-[#A9C5B6]
                          "
                        >
                          {formatTransactionShortDate(
                            document
                              .lastMovement
                              .sentAt,
                          )}
                        </p>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* DEADLINE */}

                  <td className="px-4 py-4">
                    {!document.deadline ? (
                      <span
                        className="
                          text-sm
                          text-slate-400
                          dark:text-[#7FA18E]
                        "
                      >
                        No due date
                      </span>
                    ) : document.isOverdue ? (
                      <div>
                        <Badge
                          variant="outline"
                          className="
                            rounded-full
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

                        <p
                          className="
                            mt-1.5
                            text-xs
                            font-semibold
                            text-red-600
                            dark:text-red-400
                          "
                        >
                          {formatTransactionDuration(
                            document.overdueByMs,
                          )}{' '}
                          late
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Badge
                          variant="outline"
                          className="
                            rounded-full
                            border-emerald-200
                            bg-emerald-50
                            text-emerald-700
                            dark:border-emerald-900
                            dark:bg-emerald-950/30
                            dark:text-emerald-300
                          "
                        >
                          On Time
                        </Badge>

                        <p
                          className="
                            mt-1.5
                            text-xs
                            text-slate-500
                            dark:text-[#A9C5B6]
                          "
                        >
                          {formatTransactionDuration(
                            document.remainingMs,
                          )}{' '}
                          remaining
                        </p>
                      </div>
                    )}
                  </td>

                  {/* REMARKS */}

                  <td className="px-4 py-4">
                    <p
                      className="
                        max-w-[260px]
                        text-sm
                        leading-6
                        text-slate-600
                        dark:text-[#A9C5B6]
                      "
                    >
                      {document
                        .latestRemarks
                        ?.text ??
                        '—'}
                    </p>
                  </td>

                  {/* VIEW */}

                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onDocumentClick(
                          document.id,
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
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />

                      Timeline
                    </Button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      {pagination.total >
        0 && (
        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-slate-100
            px-4
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-[#214234]
          "
        >
          <p
            className="
              text-sm
              text-slate-500
              dark:text-[#A9C5B6]
            "
          >
            Page{' '}
            <strong>
              {
                pagination.page
              }
            </strong>{' '}
            of{' '}
            <strong>
              {
                pagination.totalPages ||
                1
              }
            </strong>
            {' · '}
            {
              pagination.total
            }{' '}
            document
            {
              pagination.total !==
              1
                ? 's'
                : ''
            }
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                onPageChange(
                  pagination.page -
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
              <ChevronLeft className="mr-1 h-4 w-4" />

              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                onPageChange(
                  pagination.page +
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
    </div>
  );
}