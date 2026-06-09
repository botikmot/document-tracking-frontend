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
  if (!document) {
    return null;
  }

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent className="w-full overflow-hidden border-0 sm:max-w-2xl">
        <SheetHeader className="border-b pb-5">
          <SheetTitle className="flex items-center gap-3 text-2xl font-black">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h2>
                {
                  document.title
                }
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                {
                  document.trackingNumber
                }
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-8 py-6 px-6">
            {/* STATUS */}
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Current Status
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900">
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
              <h3 className="text-lg font-black text-slate-900">
                Document Details
              </h3>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 rounded-2xl border p-4">
                  <Building2 className="h-5 w-5 text-slate-500" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Current Office
                    </p>

                    <p className="font-semibold">
                      {
                        document
                          .currentOffice
                          ?.officeName
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border p-4">
                  <User className="h-5 w-5 text-slate-500" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Created By
                    </p>

                    <p className="font-semibold">
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
                  <Calendar className="h-5 w-5 text-slate-500" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Created Date
                    </p>

                    <p className="font-semibold">
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
              <h3 className="mb-6 text-lg font-black text-slate-900">
                Routing Timeline
              </h3>

              <div className="relative space-y-8 border-l-2 border-slate-200 pl-6">
                {/* CREATED */}
                <div className="relative">
                  <div className="absolute -left-[34px] flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>

                  <div className="rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">
                        Document Created
                      </h4>

                      <Badge className="rounded-full bg-blue-100 text-blue-700">
                        CREATED
                      </Badge>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
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
                {document.routes?.map(
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

                      <div className="rounded-2xl border bg-white p-4 shadow-sm">
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

                          <Badge className="rounded-full bg-slate-100 text-slate-700">
                            {
                              route.status
                            }
                          </Badge>
                        </div>

                        <div className="mt-3 space-y-1 text-sm text-slate-500">
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

                          <p className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4" />

                            {new Date(
                              route.sentAt,
                            ).toLocaleString()}
                          </p>

                          {route.remarks && (
                            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-slate-700">
                              {
                                route.remarks
                              }
                            </div>
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