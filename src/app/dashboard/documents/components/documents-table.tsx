'use client';

import {
  Building2,
  Clock3,
  FileText,
  MoreVertical,
  Search,
} from 'lucide-react';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Input } from '@/components/ui/input';

import { RouteDocumentDialog } from './route-document-dialog';

import { DocumentTimelineDrawer } from './document-timeline-drawer';

import { DocumentDetailsDrawer } from './document-details-drawer';

export function DocumentsTable({
  documents,
  type,
  loading,
  onRefresh,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[];
  type: string;
  loading: boolean;
  onRefresh: () => void;
}) {
  const [
    selectedDocument,
    setSelectedDocument,
  ] = useState(null);

  const [
    openTimeline,
    setOpenTimeline,
  ] = useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  if (loading) {
    return (
      <Card className="rounded-[28px] border-0 bg-white shadow-sm">
        <CardContent className="p-16 text-center text-slate-500">
          Loading documents...
        </CardContent>
      </Card>
    );
  }

  const getStatusStyle = (
    status: string,
  ) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';

      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';

      case 'COMPLETED':
        return 'bg-slate-200 text-slate-700 border-slate-300';

      case 'IN_REVIEW':
        return 'bg-blue-100 text-blue-700 border-blue-200';

      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getDeadlineInfo = (
    deadline: string,
  ) => {
    if (!deadline) {
      return null;
    }

    const now = new Date();

    const deadlineDate =
      new Date(deadline);

    const diffMs =
      deadlineDate.getTime() -
      now.getTime();

    if (diffMs <= 0) {
      return {
        text: 'Overdue',
        className:
          'bg-red-100 text-red-700 border-red-200',
      };
    }

    const diffHours = Math.floor(
      diffMs /
        (1000 * 60 * 60),
    );

    const diffDays = Math.floor(
      diffHours / 24,
    );

    if (diffHours < 24) {
      return {
        text: `${diffHours} hour${
          diffHours > 1
            ? 's'
            : ''
        } remaining`,
        className:
          'bg-orange-100 text-orange-700 border-orange-200 animate-pulse',
      };
    }

    if (diffDays <= 3) {
      return {
        text: `${diffDays} day${
          diffDays > 1
            ? 's'
            : ''
        } remaining`,
        className:
          'bg-amber-100 text-amber-700 border-amber-200',
      };
    }

    return {
      text: `${diffDays} days remaining`,
      className:
        'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
  };

  return (
    <>
      <Card className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        {/* HEADER */}
        <CardHeader className="border-b border-slate-100 bg-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-3xl font-black text-[#102418]">
                Documents Registry
              </CardTitle>

              <p className="mt-2 text-sm text-slate-500">
                Monitor and manage all incoming and outgoing documents.
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full lg:w-[320px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search documents..."
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 focus-visible:ring-green-500"
              />
            </div>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-3 p-4">
          {documents.map((doc) => {
            const canRoute = type !== 'outgoing' && [
              'DRAFT',
              'PENDING',
              'REJECTED',
            ].includes(
              doc.currentStatus
                ?.name,
            );

            const deadlineInfo =
              getDeadlineInfo(
                doc.deadline,
              );

            return (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDocument(
                    doc,
                  );

                  setOpenDetails(
                    true,
                  );
                }}
                className={`group cursor-pointer rounded-3xl border p-5 transition-all duration-300 hover:border-green-200 hover:bg-slate-50 hover:shadow-md ${
                  deadlineInfo?.text ===
                  'Overdue'
                    ? 'border-red-200 bg-red-50/30'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* LEFT */}
                  <div className="flex min-w-0 items-start gap-4">
                    {/* ICON */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg">
                      <FileText className="h-8 w-8" />
                    </div>

                    {/* INFO */}
                    <div className="min-w-0">
                      {/* TITLE */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-xl font-bold text-[#102418]">
                          {
                            doc.title
                          }
                        </h3>

                        <span className="text-sm text-slate-400">
                          •
                        </span>

                        <span className="text-sm font-medium text-slate-500">
                          {
                            doc
                              .documentType
                              ?.name
                          }
                        </span>
                      </div>

                      {/* META */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="font-medium text-slate-700">
                          {
                            doc.trackingNumber
                          }
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4" />

                          {
                            doc
                              .currentOffice
                              ?.officeName
                          }
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock3 className="h-4 w-4" />

                          Recently updated
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">
                    {/* STATUS */}
                    <Badge
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusStyle(
                        doc.currentStatus
                          ?.name,
                      )}`}
                    >
                      {
                        doc
                          .currentStatus
                          ?.name
                      }
                    </Badge>

                    {/* DEADLINE */}
                    {deadlineInfo && (
                      <div
                        className={`rounded-full border px-4 py-2 text-sm font-bold ${deadlineInfo.className}`}
                      >
                        {
                          deadlineInfo.text
                        }
                      </div>
                    )}

                    {/* ACTIONS */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(
                          e,
                        ) =>
                          e.stopPropagation()
                        }
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl cursor-pointer"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-52 rounded-2xl"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        {/* VIEW DETAILS */}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();

                            setSelectedDocument(
                              doc,
                            );

                            setOpenDetails(
                              true,
                            );
                          }}
                        >
                          View Details
                        </DropdownMenuItem>

                        {/* TIMELINE */}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();

                            setSelectedDocument(
                              doc,
                            );

                            setOpenTimeline(
                              true,
                            );
                          }}
                        >
                          View Timeline
                        </DropdownMenuItem>

                        {/* ROUTE */}
                        {canRoute && (
                          <div
                            className="px-2 py-1"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          >
                            <RouteDocumentDialog
                              documentId={doc.id}
                              onSuccess={
                                onRefresh
                              }
                            />
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <DocumentTimelineDrawer
        open={openTimeline}
        onOpenChange={
          setOpenTimeline
        }
        document={
          selectedDocument
        }
      />

      {/* DETAILS */}
      <DocumentDetailsDrawer
        open={openDetails}
        onOpenChange={
          setOpenDetails
        }
        document={
          selectedDocument
        }
      />
    </>
  );
}