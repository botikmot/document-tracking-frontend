'use client';

import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  User2,
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

function statusBadge(status: string) {
  switch (status) {
    case 'COMPLETED':
      return (
        <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Completed
        </Badge>
      );

    case 'RECEIVED':
      return (
        <Badge className="rounded-full bg-green-100 text-green-700 hover:bg-green-100">
          Received
        </Badge>
      );

    case 'IN_TRANSIT':
      return (
        <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">
          In Transit
        </Badge>
      );

    case 'FOR_REVIEW':
      return (
        <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">
          For Review
        </Badge>
      );

    default:
      return (
        <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">
          {status}
        </Badge>
      );
  }
}

function getDuration(sentAt: string, receivedAt?: string) {
  if (!receivedAt) return 'Still in transit';

  const diff = new Date(receivedAt).getTime() - new Date(sentAt).getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day(s)`;
  if (hours > 0) return `${hours} hr ${minutes % 60} min`;

  return `${minutes} min`;
}

export function TrackingRouteHistory({
  routes,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-[32px] border-0 shadow-xl">

      <CardContent className="p-8">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">

              Audit Trail

            </p>

            <h2 className="mt-2 text-3xl font-black text-[#102418]">

              Route History

            </h2>

            <p className="mt-2 text-slate-500">

              Complete routing history of this document.

            </p>

          </div>

          <Badge className="rounded-full bg-green-100 px-5 py-2 text-green-700 hover:bg-green-100">

            {routes.length} Route
            {routes.length > 1
              ? 's'
              : ''}

          </Badge>

        </div>

        {/* DESKTOP */}

        <div className="hidden overflow-x-auto xl:block">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left text-sm text-slate-500">

                <th className="pb-4">
                  #
                </th>

                <th className="pb-4">
                  Route
                </th>

                <th className="pb-4">
                  Routed By
                </th>

                <th className="pb-4">
                  Received By
                </th>

                <th className="pb-4">
                  Sent
                </th>

                <th className="pb-4">
                  Received
                </th>

                <th className="pb-4">
                  Duration
                </th>

                <th className="pb-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {routes.map(
                (
                  route,
                  index,
                ) => (
                  <tr
                    key={
                      route.id
                    }
                    className="border-b transition hover:bg-slate-50"
                  >

                    <td className="py-6 font-bold">

                      {index + 1}

                    </td>

                    <td className="py-6">

                      <div className="flex items-center gap-3">

                        <Building2 className="h-5 w-5 text-green-600" />

                        <div>

                          <div className="font-semibold">

                            {
                              route
                                .fromOffice
                                .officeName
                            }

                          </div>

                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                            <ArrowRight className="h-4 w-4" />

                            {
                              route
                                .toOffice
                                .officeName
                            }

                          </div>

                        </div>

                      </div>

                    </td>

                    <td className="py-6">

                      {route.sentBy
                        ? `${route.sentBy.firstName} ${route.sentBy.lastName}`
                        : '-'}

                    </td>

                    <td className="py-6">

                      {route.receivedBy
                        ? `${route.receivedBy.firstName} ${route.receivedBy.lastName}`
                        : 'Waiting'}

                    </td>

                    <td className="py-6 text-sm">

                      {new Date(
                        route.sentAt,
                      ).toLocaleString()}

                    </td>

                    <td className="py-6 text-sm">

                      {route.receivedAt
                        ? new Date(
                            route.receivedAt,
                          ).toLocaleString()
                        : '-'}

                    </td>

                    <td className="py-6">

                      {getDuration(
                        route.sentAt,
                        route.receivedAt,
                      )}

                    </td>

                    <td className="py-6">

                      {statusBadge(
                        route.status,
                      )}

                    </td>

                  </tr>
                ),
              )}

            </tbody>

          </table>

        </div>

        {/* MOBILE */}

        <div className="space-y-5 xl:hidden">

          {routes.map(
            (
              route,
              index,
            ) => (
              <Card
                key={
                  route.id
                }
                className="rounded-3xl shadow"
              >

                <CardContent className="space-y-5 p-6">

                  <div className="flex items-center justify-between">

                    <h3 className="font-black">

                      Route #{index + 1}

                    </h3>

                    {statusBadge(
                      route.status,
                    )}

                  </div>

                  <div className="space-y-4">

                    <Info
                      icon={
                        <Building2 className="h-4 w-4" />
                      }
                      label="Route"
                      value={`${route.fromOffice.officeName} → ${route.toOffice.officeName}`}
                    />

                    <Info
                      icon={
                        <User2 className="h-4 w-4" />
                      }
                      label="Routed By"
                      value={
                        route.sentBy
                          ? `${route.sentBy.firstName} ${route.sentBy.lastName}`
                          : '-'
                      }
                    />

                    <Info
                      icon={
                        <User2 className="h-4 w-4" />
                      }
                      label="Received By"
                      value={
                        route.receivedBy
                          ? `${route.receivedBy.firstName} ${route.receivedBy.lastName}`
                          : 'Waiting'
                      }
                    />

                    <Info
                      icon={
                        <CalendarClock className="h-4 w-4" />
                      }
                      label="Sent"
                      value={new Date(
                        route.sentAt,
                      ).toLocaleString()}
                    />

                    <Info
                      icon={
                        <Clock3 className="h-4 w-4" />
                      }
                      label="Duration"
                      value={getDuration(
                        route.sentAt,
                        route.receivedAt,
                      )}
                    />

                  </div>

                  {route.remarks && (
                    <div className="rounded-2xl bg-slate-50 p-4">

                      <p className="text-xs uppercase text-slate-400">

                        Remarks

                      </p>

                      <p className="mt-2 text-sm leading-7">

                        {route.remarks}

                      </p>

                    </div>
                  )}

                </CardContent>

              </Card>
            ),
          )}

        </div>

      </CardContent>

    </Card>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="rounded-xl bg-green-100 p-2 text-green-700">

        {icon}

      </div>

      <div>

        <p className="text-xs uppercase text-slate-400">

          {label}

        </p>

        <p className="font-medium text-slate-700">

          {value}

        </p>

      </div>

    </div>
  );
}