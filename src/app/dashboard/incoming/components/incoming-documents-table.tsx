'use client';

import { useState } from 'react';

import {
  ArrowRight,
  Building2,
  Clock3,
  FileText,
  Search,
} from 'lucide-react';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Input,
} from '@/components/ui/input';

import { api } from '@/lib/axios';
import { RouteDocumentDialog } from '../../documents/components/route-document-dialog';
import { useNotificationStore } from '@/store/notification.store';

export function IncomingDocumentsTable({
  routes,
  loading,
  onRefresh,
  page,
  setPage,
  meta,
  search,
  setSearch,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: any[];
  loading: boolean;
  onRefresh: () => void;
  page: number;
  setPage: (
    page: number,
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: any;
  search: string;
  setSearch: (
    value: string,
  ) => void;
}) {
  const [
    receivingId,
    setReceivingId,
  ] = useState<
    string | null
  >(null);


  const { markAsRead, notifications } = useNotificationStore();




  if (loading) {
    return (
      <Card className="rounded-[32px] border-0 bg-white shadow-xl">
        <CardContent className="p-16 text-center text-slate-500">
          Loading incoming documents...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-green-100/30">
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}
      <CardHeader className="border-b border-slate-100 pb-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle className="text-3xl font-black text-[#102418]">
              Incoming Registry
            </CardTitle>

            <p className="mt-2 text-slate-500">
              Receive, monitor, and manage routed documents from
              connected offices.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full xl:w-[360px]">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Search incoming documents..."
              className="h-14 rounded-2xl border-0 bg-slate-100 pl-12 shadow-sm focus-visible:ring-2 focus-visible:ring-green-500"
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value,
                );

                setPage(1);
              }}
            />
          </div>
        </div>
      </CardHeader>

      {/* ====================================== */}
      {/* CONTENT */}
      {/* ====================================== */}
      <CardContent className="space-y-5 p-6">
        {routes.map((route) => {
          const doc =
            route.document;

          const canRoute = [
            'DRAFT',
            'PENDING',
            'REJECTED',
          ].includes(
            doc.currentStatus
              ?.name,
          );

          const canReceive =
            doc.currentStatus
              ?.name ===
            'IN_TRANSIT';

          return (
            <div
              key={route.id}
              className="group rounded-[30px] border border-slate-100 bg-slate-50/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
            >
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                {/* LEFT */}
                <div className="flex items-start gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-xl">
                    <FileText className="h-10 w-10" />
                  </div>

                  <div>
                    {/* TITLE */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black text-[#102418]">
                        {doc.title}
                      </h3>

                      <Badge className="rounded-full bg-blue-100 px-4 py-1 text-blue-700">
                        {
                          doc
                            .documentType
                            ?.name
                        }
                      </Badge>
                    </div>

                    {/* META */}
                    <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                      <div className="rounded-full bg-slate-200 px-4 py-1 font-medium text-slate-700">
                        {
                          doc.trackingNumber
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />

                        {
                          route
                            .fromOffice
                            ?.officeName
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />

                        {
                          route
                            .toOffice
                            ?.officeName
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />

                        Awaiting receiving
                      </div>
                    </div>

                    {/* REMARKS */}
                    {route.remarks && (
                      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-slate-700">
                        <span className="font-bold text-blue-700">
                          Remarks:
                        </span>
                        {' '}
                        {
                          route.remarks
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full bg-amber-100 px-5 py-2 text-sm font-semibold text-amber-700">
                    FOR RECEIVING
                  </Badge>

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

                  {canReceive && (
                    <Button
                      disabled={
                        receivingId ===
                        route.documentId
                      }
                      className="h-12 rounded-2xl cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 px-6 text-white shadow-lg hover:from-green-700 hover:to-emerald-700"
                      onClick={async () => {
                        try {
                          setReceivingId(
                            route.documentId,
                          );

                          await api.post(
                            `/documents/${route.documentId}/receive`,
                          );

                          const notification = notifications.find(n => n.documentId === route.documentId);
                          if(notification) {
                            await api.patch(
                              `/notifications/${notification.id}/read`,
                            );
                            markAsRead(notification.id);
                          }
                          
                          onRefresh();
                        } catch (
                          error
                        ) {
                          console.error(
                            error,
                          );
                        } finally {
                          setReceivingId(
                            null,
                          );
                        }
                      }}
                    >
                      {receivingId ===
                      route.documentId
                        ? 'Receiving...'
                        : 'Receive Document'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>

      {/* PAGINATION */}
      <div className="flex items-center justify-between border-t border-slate-100 p-6">
        <p className="text-sm text-slate-500">
          Page {meta?.page ?? 1} of{' '}
          {meta?.totalPages ?? 1}
        </p>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={
              page <= 1
            }
            onClick={() =>
              setPage(page - 1)
            }
          >
            Previous
          </Button>

          <Button
            variant="outline"
            disabled={
              page >=
              (meta?.totalPages ??
                1)
            }
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}