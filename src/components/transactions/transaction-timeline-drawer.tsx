'use client';

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileCheck2,
  FileText,
  Inbox,
  Loader2,
  MessageSquareText,
  Route,
  Send,
  UserRound,
} from 'lucide-react';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Separator,
} from '@/components/ui/separator';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import type {
  TransactionTimelineEvent,
  TransactionTimelineResponse,
} from '@/types/transaction';

import { formatMonitoringCategory, formatTransactionDate, formatTransactionDuration } from '@/lib/utils';

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

type TransactionTimelineDrawerProps = {
  open: boolean;

  onOpenChange:
    (open: boolean) => void;

  data:
    | TransactionTimelineResponse
    | null;

  isLoading?: boolean;

  error?:
    | string
    | null;
};

/*
|--------------------------------------------------------------------------
| STATUS LABEL
|--------------------------------------------------------------------------
*/

function formatStatus(
  value?: string | null,
) {
  if (!value) {
    return 'Unknown';
  }

  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

/*
|--------------------------------------------------------------------------
| STATUS CLASS
|--------------------------------------------------------------------------
*/

function getStatusClass(
  status?: string | null,
) {
  switch (status) {
    case 'COMPLETED':
    case 'END_TRANSACTION':
      return `
        border-emerald-200
        bg-emerald-50
        text-emerald-700
        dark:border-emerald-900
        dark:bg-emerald-950/30
        dark:text-emerald-300
      `;

    case 'FOR_APPROVAL':
      return `
        border-violet-200
        bg-violet-50
        text-violet-700
        dark:border-violet-900
        dark:bg-violet-950/30
        dark:text-violet-300
      `;

    case 'FOR_REVIEW':
      return `
        border-amber-200
        bg-amber-50
        text-amber-700
        dark:border-amber-900
        dark:bg-amber-950/30
        dark:text-amber-300
      `;

    case 'ON_PROCESS':
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
        dark:border-blue-900
        dark:bg-blue-950/30
        dark:text-blue-300
      `;

    case 'PENDING':
    case 'IN_TRANSIT':
      return `
        border-cyan-200
        bg-cyan-50
        text-cyan-700
        dark:border-cyan-900
        dark:bg-cyan-950/30
        dark:text-cyan-300
      `;

    case 'REJECTED':
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
        text-slate-700
        dark:border-[#315943]
        dark:bg-[#173227]
        dark:text-[#F3F8F3]
      `;
  }
}

/*
|--------------------------------------------------------------------------
| EVENT APPEARANCE
|--------------------------------------------------------------------------
*/

function getTimelineEventAppearance(
  event:
    TransactionTimelineEvent,
) {
  switch (event.type) {
    case 'REGISTERED':
      return {
        icon: FileText,

        className:
          `
            bg-emerald-100
            text-emerald-700
            dark:bg-emerald-950/50
            dark:text-emerald-300
          `,
      };

    case 'ROUTED':
      return {
        icon: Send,

        className:
          `
            bg-blue-100
            text-blue-700
            dark:bg-blue-950/50
            dark:text-blue-300
          `,
      };

    case 'RECEIVED':
      return {
        icon: Inbox,

        className:
          `
            bg-cyan-100
            text-cyan-700
            dark:bg-cyan-950/50
            dark:text-cyan-300
          `,
      };

    case 'ROUTE_COMPLETED':
      return {
        icon: CheckCircle2,

        className:
          `
            bg-emerald-100
            text-emerald-700
            dark:bg-emerald-950/50
            dark:text-emerald-300
          `,
      };

    case 'ACTION':
      return {
        icon: MessageSquareText,

        className:
          `
            bg-amber-100
            text-amber-700
            dark:bg-amber-950/50
            dark:text-amber-300
          `,
      };

    case 'STATUS_UPDATED':
      return {
        icon: CircleDot,

        className:
          `
            bg-violet-100
            text-violet-700
            dark:bg-violet-950/50
            dark:text-violet-300
          `,
      };
  }
}

/*
|--------------------------------------------------------------------------
| EVENT ITEM
|--------------------------------------------------------------------------
*/

function TimelineEventItem({
  event,
  isLast,
}: {
  event:
    TransactionTimelineEvent;

  isLast: boolean;
}) {
  const appearance =
    getTimelineEventAppearance(
      event,
    );

  const Icon =
    appearance.icon;

  return (
    <div className="relative flex gap-4">
      {/* TIMELINE LINE */}

      {!isLast && (
        <div
          className="
            absolute
            left-[19px]
            top-10
            bottom-[-18px]
            w-px
            bg-slate-200
            dark:bg-[#315943]
          "
        />
      )}

      {/* ICON */}

      <div
        className={`
          relative
          z-10
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-2xl
          ${appearance.className}
        `}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1 pb-7">
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            dark:border-[#214234]
            dark:bg-[#102418]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  font-bold
                  text-[#102418]
                  dark:text-[#F3F8F3]
                "
              >
                {event.title}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                  dark:text-[#A9C5B6]
                "
              >
                {formatTransactionDate(
                  event.occurredAt,
                )}
              </p>
            </div>

            {event.documentStatus && (
              <Badge
                variant="outline"
                className={`rounded-full ${getStatusClass(
                  event.documentStatus,
                )}`}
              >
                {formatStatus(
                  event.documentStatus,
                )}
              </Badge>
            )}
          </div>

          {/* ROUTING */}

          {event.fromOffice &&
            event.toOffice && (
              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  rounded-xl
                  bg-slate-50
                  px-3
                  py-2.5
                  text-sm
                  dark:bg-[#173227]
                "
              >
                <span
                  className="
                    font-semibold
                    text-slate-700
                    dark:text-[#F3F8F3]
                  "
                >
                  {
                    event.fromOffice
                      .officeCode
                  }
                </span>

                <ArrowRight
                  className="
                    h-4
                    w-4
                    text-emerald-600
                  "
                />

                <span
                  className="
                    font-semibold
                    text-slate-700
                    dark:text-[#F3F8F3]
                  "
                >
                  {
                    event.toOffice
                      .officeCode
                  }
                </span>
              </div>
            )}

          {/* DESCRIPTION */}

          {event.description && (
            <p
              className="
                mt-3
                text-sm
                leading-6
                text-slate-600
                dark:text-[#A9C5B6]
              "
            >
              {event.description}
            </p>
          )}

          {/* DETAILS */}

          <div
            className="
              mt-4
              grid
              gap-3
              sm:grid-cols-2
            "
          >
            {/* OFFICE */}

            {event.office && (
              <div>
                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-400
                    dark:text-[#7FA18E]
                  "
                >
                  Office
                </p>

                <p
                  className="
                    mt-1
                    flex
                    items-start
                    gap-1.5
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-[#F3F8F3]
                  "
                >
                  <Building2
                    className="
                      mt-0.5
                      h-3.5
                      w-3.5
                      shrink-0
                      text-emerald-600
                    "
                  />

                  {
                    event.office
                      .officeName
                  }
                </p>
              </div>
            )}

            {/* ACTOR */}

            {event.actor?.name && (
              <div>
                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-400
                    dark:text-[#7FA18E]
                  "
                >
                  Action By
                </p>

                <p
                  className="
                    mt-1
                    flex
                    items-center
                    gap-1.5
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-[#F3F8F3]
                  "
                >
                  <UserRound
                    className="
                      h-3.5
                      w-3.5
                      text-emerald-600
                    "
                  />

                  {
                    event.actor
                      .name
                  }
                </p>
              </div>
            )}

            {/* ROUTE STATUS */}

            {event.routeStatus && (
              <div>
                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-400
                    dark:text-[#7FA18E]
                  "
                >
                  Route Status
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-[#F3F8F3]
                  "
                >
                  {formatStatus(
                    event.routeStatus,
                  )}
                </p>
              </div>
            )}

            {/* TIME HELD */}

            {event.timeHeldMs !==
              undefined &&
              event.timeHeldMs !==
                null && (
                <div>
                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-400
                      dark:text-[#7FA18E]
                    "
                  >
                    Time Held
                  </p>

                  <p
                    className="
                      mt-1
                      flex
                      items-center
                      gap-1.5
                      text-sm
                      font-bold
                      text-slate-700
                      dark:text-[#F3F8F3]
                    "
                  >
                    <Clock3
                      className="
                        h-3.5
                        w-3.5
                        text-emerald-600
                      "
                    />

                    {formatTransactionDuration(
                      event.timeHeldMs,
                    )}
                  </p>
                </div>
              )}
          </div>

          {/* REMARKS */}

          {event.remarks &&
            event.remarks !==
              event.description && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50
                  p-3
                  dark:border-amber-900
                  dark:bg-amber-950/20
                "
              >
                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-amber-700
                    dark:text-amber-300
                  "
                >
                  Remarks
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-amber-900
                    dark:text-amber-100
                  "
                >
                  {event.remarks}
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| DRAWER
|--------------------------------------------------------------------------
*/

export function TransactionTimelineDrawer({
  open,
  onOpenChange,
  data,
  isLoading = false,
  error = null,
}: TransactionTimelineDrawerProps) {
  const document =
    data?.document;

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        side="right"
        className="
          w-full
          overflow-y-auto
          border-l
          border-slate-200
          bg-slate-50
          p-0
          sm:max-w-2xl!
          lg:max-w-3xl!
          dark:border-[#214234]
          dark:bg-[#0D1F15]
        "
      >
        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            z-30
            border-b
            border-white/10
            bg-[#102418]
            px-6
            py-6
            text-white
            shadow-sm
          "
        >
          <SheetHeader>
            <div className="flex items-center gap-2">
              <Badge
                className="
                  rounded-full
                  border
                  border-emerald-400/20
                  bg-emerald-500/10
                  text-emerald-300
                "
              >
                <Route className="mr-1.5 h-3.5 w-3.5" />

                Transaction Timeline
              </Badge>
            </div>

            <SheetTitle
              className="
                pt-2
                text-left
                text-2xl
                font-black
                text-white
              "
            >
              {document
                ? document.trackingNumber
                : 'Transaction Timeline'}
            </SheetTitle>

            <SheetDescription
              className="
                text-left
                text-slate-300
              "
            >
              {document
                ? document.subject
                : 'Complete document transaction history.'}
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* LOADING */}

        {isLoading ? (
          <div className="px-6 py-24 text-center">
            <Loader2
              className="
                mx-auto
                h-8
                w-8
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
              Loading transaction
              timeline...
            </p>
          </div>
        ) : error ? (
          <div className="px-6 py-20">
            <div
              className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-6
                text-center
                text-sm
                text-red-700
                dark:border-red-900
                dark:bg-red-950/20
                dark:text-red-300
              "
            >
              {error}
            </div>
          </div>
        ) : data &&
          document ? (
          <div className="space-y-6 p-5 md:p-6">
            {/* DOCUMENT OVERVIEW */}

            <div
              className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                dark:border-[#214234]
                dark:bg-[#102418]
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-400
                      dark:text-[#7FA18E]
                    "
                  >
                    Current Status
                  </p>

                  <Badge
                    variant="outline"
                    className={`mt-2 rounded-full ${getStatusClass(
                      document.status,
                    )}`}
                  >
                    {formatStatus(
                      document.status,
                    )}
                  </Badge>
                </div>

                {document.isOverdue && (
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
                    <Clock3 className="mr-1.5 h-3.5 w-3.5" />

                    Overdue{' '}
                    {formatTransactionDuration(
                      document.overdueByMs,
                    )}
                  </Badge>
                )}
              </div>

              <Separator
                className="
                  my-5
                  dark:bg-[#214234]
                "
              />

              <div
                className="
                  grid
                  gap-x-6
                  gap-y-5
                  sm:grid-cols-2
                "
              >
                <div>
                  <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                    Current Office
                  </p>

                  <p
                    className="
                      mt-1
                      flex
                      items-start
                      gap-1.5
                      text-sm
                      font-bold
                      text-slate-700
                      dark:text-[#F3F8F3]
                    "
                  >
                    <Building2 className="mt-0.5 h-3.5 w-3.5 text-emerald-600" />

                    {
                      document
                        .currentOffice
                        .officeName
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                    Received
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-[#F3F8F3]
                    "
                  >
                    {formatTransactionDate(
                      document.receivedAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                    Origin
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-[#F3F8F3]
                    "
                  >
                    {document.sourceClass ??
                      'Uncategorized'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                    Category
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-[#F3F8F3]
                    "
                  >
                    {formatMonitoringCategory(
                      document.monitoringCategory,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                    Document Type
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-[#F3F8F3]
                    "
                  >
                    {
                      document.documentType
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                    Deadline
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-[#F3F8F3]
                    "
                  >
                    {document.deadline
                      ? formatTransactionDate(
                          document.deadline,
                        )
                      : 'No due date'}
                  </p>
                </div>

                {document
                  .responsiblePerson && (
                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                      Responsible Person
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-700
                        dark:text-[#F3F8F3]
                      "
                    >
                      {
                        document
                          .responsiblePerson
                      }
                    </p>
                  </div>
                )}

                {document
                  .responsibleOffice && (
                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#7FA18E]">
                      Responsible Office
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-700
                        dark:text-[#F3F8F3]
                      "
                    >
                      {
                        document
                          .responsibleOffice
                          .officeName
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* LATEST REMARKS */}

              {document.latestRemarks && (
                <div
                  className="
                    mt-5
                    rounded-2xl
                    bg-amber-50
                    p-4
                    dark:bg-amber-950/20
                  "
                >
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-amber-700
                      dark:text-amber-300
                    "
                  >
                    Latest Remarks
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-amber-900
                      dark:text-amber-100
                    "
                  >
                    {
                      document
                        .latestRemarks
                        .text
                    }
                  </p>
                </div>
              )}
            </div>

            {/* TIMELINE HEADER */}

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h3
                  className="
                    text-lg
                    font-black
                    text-[#102418]
                    dark:text-[#F3F8F3]
                  "
                >
                  Transaction History
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                    dark:text-[#A9C5B6]
                  "
                >
                  Chronological document
                  movement and actions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full dark:border-[#315943] dark:text-[#A9C5B6]"
                >
                  <Route className="mr-1.5 h-3.5 w-3.5" />

                  {data.summary.routeCount}{' '}
                  Routes
                </Badge>

                <Badge
                  variant="outline"
                  className="rounded-full dark:border-[#315943] dark:text-[#A9C5B6]"
                >
                  <FileCheck2 className="mr-1.5 h-3.5 w-3.5" />

                  {data.summary.actionCount}{' '}
                  Actions
                </Badge>
              </div>
            </div>

            {/* TIMELINE */}

            {data.timeline.length ===
            0 ? (
              <div
                className="
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  py-16
                  text-center
                  dark:border-[#214234]
                  dark:bg-[#102418]
                "
              >
                <Route className="mx-auto h-7 w-7 text-slate-300 dark:text-[#7FA18E]" />

                <p className="mt-3 text-sm text-slate-500 dark:text-[#A9C5B6]">
                  No transaction history
                  available.
                </p>
              </div>
            ) : (
              <div className="px-1">
                {data.timeline.map(
                  (
                    event,
                    index,
                  ) => (
                    <TimelineEventItem
                      key={event.id}
                      event={event}
                      isLast={
                        index ===
                        data.timeline
                          .length -
                          1
                      }
                    />
                  ),
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Route className="mx-auto h-8 w-8 text-slate-300 dark:text-[#7FA18E]" />

            <p className="mt-3 text-sm text-slate-500 dark:text-[#A9C5B6]">
              Select a document to view
              its transaction history.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}