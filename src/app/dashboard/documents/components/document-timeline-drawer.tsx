'use client';

import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  RotateCcw,
  Send,
  User,
} from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import {
  Badge,
} from '@/components/ui/badge';

import {
  ScrollArea,
} from '@/components/ui/scroll-area';
import { useState } from 'react';

type Props = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any | null;
};

export function DocumentTimelineDrawer({
  open,
  onOpenChange,
  document,
}: Props) {
  console.log('timeline:',document)
  
  if (!document) {
    return null;
  }

  const STUCK_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enrichedRoutes = document.routes?.map((route: any, index: number) => {
    const nextRoute = document.routes?.[index + 1];

    const start = new Date(route.sentAt).getTime();
    const end = nextRoute
      ? new Date(nextRoute.sentAt).getTime()
      : now;

    const durationMs = end - start;

    const isStuck =
      document.currentStatus.name !== 'COMPLETED' && durationMs > STUCK_THRESHOLD_MS;

    return {
      ...route,
      durationMs,
      isStuck,
    };
  });

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent className="w-full overflow-hidden border-0 bg-[#F8FAF6] transition-colors dark:bg-[#07150D] sm:!max-w-xl">
        <SheetHeader className="border-b border-slate-200 pb-5 transition-colors dark:border-[#214234]">
          <SheetTitle className="flex items-center gap-3 text-2xl font-black text-[#102418] dark:text-[#F3F8F3]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h2>
                {
                  document.title
                }
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500 dark:text-[#A9C5B6]">
                {
                  document.trackingNumber
                }
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 dark:[&_[data-radix-scroll-area-thumb]]:bg-[#214234]">
          <div className="space-y-8 py-6 px-6">
            {/* STATUS */}
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 transition-colors dark:border-[#214234] dark:bg-[#102418] dark:shadow-[0_0_20px_rgba(34,197,94,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Current Status
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {
                      document
                        .currentStatus
                        ?.name
                    }
                  </h3>
                </div>

                <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                  Active
                </Badge>
              </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-[#F3F8F3]">
                Document Details
              </h3>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors dark:border-[#214234] dark:bg-[#102418]">
                  <Building2 className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                      Current Office
                    </p>

                    <p className="font-semibold text-slate-900 dark:text-[#F3F8F3]">
                      {
                        document
                          .currentOffice
                          ?.officeName
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border p-4">
                  <User className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                      Created By
                    </p>

                    <p className="font-semibold text-slate-900 dark:text-[#F3F8F3]">
                      {
                        document
                          .createdBy
                          ?.firstName
                      }{' '}
                      {
                        document
                          .createdBy
                          ?.lastName
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border p-4">
                  <Calendar className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                      Created Date
                    </p>

                    <p className="font-semibold text-slate-900 dark:text-[#F3F8F3]">
                      {new Date(
                        document.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            <div>
              <h3 className="mb-6 text-lg font-black text-slate-900 dark:text-[#F3F8F3]">
                Routing Timeline
              </h3>

              <div className="relative space-y-8 border-l-2 border-slate-200 pl-6 dark:border-[#214234]">
                {/* CREATED */}
                <div className="relative">
                  <div className="absolute -left-[34px] flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-[#214234] dark:bg-[#102418]">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">
                        Document Created
                      </h4>

                      <Badge className="rounded-full bg-blue-100 text-blue-700">
                        CREATED
                      </Badge>
                    </div>

                    <p className="mt-2 text-sm text-slate-500 dark:text-[#A9C5B6]">
                      Created by{' '}
                      {
                        document
                          .createdBy
                          ?.firstName
                      }{' '}
                      {
                        document
                          .createdBy
                          ?.lastName
                      }
                    </p>
                  </div>
                </div>

                {/* ROUTES */}
                {enrichedRoutes?.map(
                  (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    route: any,
                  ) => (
                    <div
                      key={route.id}
                      className="relative"
                    >
                      <div className="absolute -left-[34px] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                        {route.status ===
                        'RETURNED' ? (
                          <RotateCcw className="h-4 w-4 text-amber-600" />
                        ) : route.status ===
                          'RECEIVED' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Send className="h-4 w-4 text-blue-600" />
                        )}
                      </div>

                      <div 
                        className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors dark:border-[#214234] dark:bg-[#102418] ${
                          route.isStuck ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold">
                            {
                              route
                                .fromOffice
                                ?.officeName
                            }{' '}
                            →{' '}
                            {
                              route
                                .toOffice
                                ?.officeName
                            }
                          </h4>

                          <Badge className="rounded-full bg-slate-100 text-slate-700 dark:bg-[#173227] dark:text-[#D7E8DD]">
                            {
                              route.status
                            }
                          </Badge>
                        </div>

                        <div className="mt-3 space-y-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                          <p>
                            Sent by:{' '}
                            {
                              route
                                .sentBy
                                ?.firstName
                            }{' '}
                            {
                              route
                                .sentBy
                                ?.lastName
                            }
                          </p>

                          {route.receivedBy && (
                            <p>
                              Received by:{' '}
                              {
                                route
                                  .receivedBy
                                  ?.firstName
                              }{' '}
                              {
                                route
                                  .receivedBy
                                  ?.lastName
                              }
                            </p>
                          )}

                          <div className="flex justify-between items-center">
                            <p className="flex items-center gap-2">
                              <Clock3 className="h-4 w-4" />

                              {new Date(
                                route.sentAt,
                              ).toLocaleString()}
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                              <Clock3 className="h-4 w-4" />
                              Stayed in office:{" "}
                              <span className="font-semibold text-slate-700 dark:text-[#F3F8F3]">
                                {formatDuration(route.durationMs)}
                              </span>
                            </p>
                          </div>

                          {route.remarks && (
                            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-slate-700 transition-colors dark:bg-[#173227] dark:text-[#D7E8DD]">
                              {
                                route.remarks
                              }
                            </div>
                          )}
                          {route.isStuck && (
                            <p className="mt-2 text-right text-xs font-semibold text-red-600 dark:text-red-400">
                              ⚠ Pending for more than 3 days
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}