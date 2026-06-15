'use client';

import {
  Building2,
  Clock3,
  FileText,
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
      <Card className="rounded-[32px] border-0 bg-white shadow-xl">
        <CardContent className="p-16 text-center text-slate-500">
          Loading documents...
        </CardContent>
      </Card>
    );
  }

  const getStatusStyle =
    (
      status: string,
    ) => {
      switch (status) {
        case 'APPROVED':
          return 'bg-emerald-100 text-emerald-700';

        case 'REJECTED':
          return 'bg-red-100 text-red-700';

        case 'COMPLETED':
          return 'bg-slate-200 text-slate-700';

        case 'IN_REVIEW':
          return 'bg-blue-100 text-blue-700';

        default:
          return 'bg-amber-100 text-amber-700';
      }
    };

  return (
    <>
      <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-green-100/30">
        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}
        <CardHeader className="border-b border-slate-100 pb-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <CardTitle className="text-3xl font-black text-[#102418]">
                Documents Registry
              </CardTitle>

              <p className="mt-2 text-slate-500">
                Monitor all active and archived documents across
                offices and departments.
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full xl:w-[360px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search documents..."
                className="h-14 rounded-2xl border-0 bg-slate-100 pl-12 shadow-sm focus-visible:ring-2 focus-visible:ring-green-500"
              />
            </div>
          </div>
        </CardHeader>

        {/* ====================================== */}
        {/* CONTENT */}
        {/* ====================================== */}
        <CardContent className="space-y-5 p-6">
          {documents.map((doc) => {
            const canRoute = type !== 'outgoing' && [
              'DRAFT',
              'PENDING',
              'REJECTED',
            ].includes(
              doc.currentStatus
                ?.name,
            );

            return (
              <div
                key={doc.id}
                className="group rounded-[30px] border border-slate-100 bg-slate-50/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:bg-white hover:shadow-xl"
              >
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  {/* LEFT */}
                  <div className="flex items-start gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl">
                      <FileText className="h-10 w-10" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black text-[#102418]">
                          {
                            doc.title
                          }
                        </h3>

                        <Badge className="rounded-full bg-blue-100 px-4 py-1 text-blue-700">
                          {
                            doc
                              .documentType
                              ?.name
                          }
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                        <div className="rounded-full bg-slate-200 px-4 py-1 font-medium text-slate-700">
                          {
                            doc.trackingNumber
                          }
                        </div>

                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />

                          {
                            doc
                              .currentOffice
                              ?.officeName
                          }
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />

                          Last updated recently
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      className={`rounded-full px-5 py-2 text-sm font-semibold ${getStatusStyle(
                        doc
                          .currentStatus
                          ?.name,
                      )}`}
                    >
                      {
                        doc
                          .currentStatus
                          ?.name
                      }
                    </Badge>

                    {doc.route
                      ?.toOffice && (
                      <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                        Routed to:
                        {' '}
                        <span className="font-bold text-slate-900">
                          {
                            doc
                              .route
                              .toOffice
                              .officeName
                          }
                        </span>
                      </div>
                    )}

                    {canRoute && (
                      <div
                        onClick={(
                          e,
                        ) => {
                          e.stopPropagation();
                        }}
                      >
                        <RouteDocumentDialog
                          documentId={
                            doc.id
                          }
                          onSuccess={
                            onRefresh
                          }
                        />
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="h-11 rounded-2xl border-slate-200 bg-white px-5"
                      onClick={(
                        e,
                      ) => {
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
                    </Button>

                    <Button
                      className="h-11 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 text-white hover:from-green-700 hover:to-emerald-700"
                      onClick={(
                        e,
                      ) => {
                        e.stopPropagation();

                        setSelectedDocument(
                          doc,
                        );

                        setOpenTimeline(
                          true,
                        );
                      }}
                    >
                      Timeline
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <DocumentTimelineDrawer
        open={openTimeline}
        onOpenChange={
          setOpenTimeline
        }
        document={
          selectedDocument
        }
      />

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