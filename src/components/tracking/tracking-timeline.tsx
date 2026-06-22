'use client';

import {
  Building2,
  CheckCircle2,
  Clock3,
  Truck,
  User,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: any[];
};

function getStatusColor(status: string) {
  switch (status) {
    case 'COMPLETED':
      return {
        dot: 'bg-green-600',
        badge:
          'bg-green-100 text-green-700',
        icon: CheckCircle2,
      };

    case 'RECEIVED':
      return {
        dot: 'bg-emerald-600',
        badge:
          'bg-emerald-100 text-emerald-700',
        icon: CheckCircle2,
      };

    case 'IN_TRANSIT':
      return {
        dot: 'bg-blue-600',
        badge:
          'bg-blue-100 text-blue-700',
        icon: Truck,
      };

    default:
      return {
        dot: 'bg-slate-400',
        badge:
          'bg-slate-100 text-slate-700',
        icon: Clock3,
      };
  }
}

export function TrackingTimeline({
  routes,
}: Props) {
  return (
    <Card className="rounded-[32px] border-0 shadow-xl">

      <CardContent className="p-8">

        <div className="mb-8">

          <h2 className="text-2xl font-black text-[#102418]">

            Tracking Timeline

          </h2>

          <p className="mt-2 text-slate-500">

            Follow your document&apos;s movement between offices.

          </p>

        </div>

        <div className="relative">

          {routes.map(
            (
              route,
              index,
            ) => {
              const style =
                getStatusColor(
                  route.status,
                );

              const Icon =
                style.icon;

              return (
                <div
                  key={
                    route.id
                  }
                  className="relative flex gap-6 pb-12"
                >

                  {/* Timeline */}

                  <div className="relative flex w-10 flex-col items-center">

                    <div
                      className={`z-10 flex h-10 w-10 items-center justify-center rounded-full ${style.dot} text-white shadow-lg`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {index !==
                      routes.length -
                        1 && (
                      <div className="mt-2 h-full w-[3px] rounded-full bg-slate-200" />
                    )}

                  </div>

                  {/* Card */}

                  <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

                    {/* Header */}

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <Badge
                        className={`rounded-full px-4 py-2 ${style.badge}`}
                      >
                        {
                          route.status
                        }
                      </Badge>

                      <span className="text-sm text-slate-500">

                        {new Date(
                          route.sentAt,
                        ).toLocaleString()}

                      </span>

                    </div>

                    {/* Offices */}

                    <div className="mt-6 grid gap-5 md:grid-cols-2">

                      <div className="rounded-2xl bg-slate-50 p-5">

                        <div className="flex items-center gap-2 text-slate-500">

                          <Building2 className="h-4 w-4" />

                          <span className="text-sm">

                            From Office

                          </span>

                        </div>

                        <h3 className="mt-2 text-lg font-black text-[#102418]">

                          {
                            route
                              .fromOffice
                              .officeName
                          }

                        </h3>

                        <p className="text-sm text-slate-500">

                          {
                            route
                              .fromOffice
                              .organizationUnit
                              ?.name
                          }

                        </p>

                      </div>

                      <div className="rounded-2xl bg-green-50 p-5">

                        <div className="flex items-center gap-2 text-green-700">

                          <Building2 className="h-4 w-4" />

                          <span className="text-sm">

                            To Office

                          </span>

                        </div>

                        <h3 className="mt-2 text-lg font-black text-[#102418]">

                          {
                            route
                              .toOffice
                              .officeName
                          }

                        </h3>

                        <p className="text-sm text-slate-500">

                          {
                            route
                              .toOffice
                              .organizationUnit
                              ?.name
                          }

                        </p>

                      </div>

                    </div>

                    {/* Users */}

                    <div className="mt-6 grid gap-5 md:grid-cols-2">

                      <div>

                        <div className="flex items-center gap-2 text-slate-500">

                          <User className="h-4 w-4" />

                          Sent By

                        </div>

                        <p className="mt-1 font-semibold">

                          {route.sentBy
                            ? `${route.sentBy.firstName} ${route.sentBy.lastName}`
                            : '-'}

                        </p>

                      </div>

                      <div>

                        <div className="flex items-center gap-2 text-slate-500">

                          <User className="h-4 w-4" />

                          Received By

                        </div>

                        <p className="mt-1 font-semibold">

                          {route.receivedBy
                            ? `${route.receivedBy.firstName} ${route.receivedBy.lastName}`
                            : 'Waiting'}

                        </p>

                      </div>

                    </div>

                    {/* Dates */}

                    <div className="mt-6 grid gap-4 md:grid-cols-2">

                      <div>

                        <p className="text-xs uppercase tracking-wider text-slate-400">

                          Sent

                        </p>

                        <p className="font-medium">

                          {new Date(
                            route.sentAt,
                          ).toLocaleString()}

                        </p>

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wider text-slate-400">

                          Received

                        </p>

                        <p className="font-medium">

                          {route.receivedAt
                            ? new Date(
                                route.receivedAt,
                              ).toLocaleString()
                            : 'Pending'}

                        </p>

                      </div>

                    </div>

                    {/* Remarks */}

                    {route.remarks && (
                      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                        <p className="text-xs uppercase text-blue-700">

                          Remarks

                        </p>

                        <p className="mt-2 text-sm leading-7 text-slate-700">

                          {
                            route.remarks
                          }

                        </p>

                      </div>
                    )}

                  </div>

                </div>
              );
            },
          )}

        </div>

      </CardContent>

    </Card>
  );
}