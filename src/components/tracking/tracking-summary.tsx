'use client';

import {
  Building2,
  CalendarClock,
  Flag,
  ShieldCheck,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any;
};

function statusColor(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-700';

    case 'IN_TRANSIT':
      return 'bg-blue-100 text-blue-700';

    case 'FOR_REVIEW':
      return 'bg-amber-100 text-amber-700';

    case 'RECEIVED':
      return 'bg-green-100 text-green-700';

    case 'ARCHIVED':
      return 'bg-violet-100 text-violet-700';

    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function priorityColor(priority: string) {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-700';

    case 'HIGH':
      return 'bg-orange-100 text-orange-700';

    case 'MEDIUM':
      return 'bg-amber-100 text-amber-700';

    default:
      return 'bg-green-100 text-green-700';
  }
}

export function TrackingSummary({
  document,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {/* STATUS */}

      <Card className="overflow-hidden rounded-[30px] border-0 shadow-xl">

        <CardContent className="relative p-7">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">

                Current Status

              </p>

              <Badge
                className={`mt-4 rounded-full px-4 py-2 ${statusColor(
                  document.currentStatus.name,
                )}`}
              >
                {document.currentStatus.name}
              </Badge>

            </div>

            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-4 text-white">

              <ShieldCheck className="h-8 w-8" />

            </div>

          </div>

        </CardContent>

      </Card>

      {/* CURRENT OFFICE */}

      <Card className="overflow-hidden rounded-[30px] border-0 shadow-xl">

        <CardContent className="relative p-7">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">

                Current Office

              </p>

              <h3 className="mt-4 text-xl font-black text-[#102418]">

                {document.currentOffice.officeName}

              </h3>

              <p className="mt-1 text-sm text-slate-500">

                {
                  document.currentOffice.organizationUnit
                    ?.name
                }

              </p>

            </div>

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 p-4 text-white">

              <Building2 className="h-8 w-8" />

            </div>

          </div>

        </CardContent>

      </Card>

      {/* PRIORITY */}

      <Card className="overflow-hidden rounded-[30px] border-0 shadow-xl">

        <CardContent className="relative p-7">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">

                Priority

              </p>

              <Badge
                className={`mt-4 rounded-full px-4 py-2 ${priorityColor(
                  document.priority,
                )}`}
              >
                {document.priority}
              </Badge>

            </div>

            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-4 text-white">

              <Flag className="h-8 w-8" />

            </div>

          </div>

        </CardContent>

      </Card>

      {/* DEADLINE */}

      <Card className="overflow-hidden rounded-[30px] border-0 shadow-xl">

        <CardContent className="relative p-7">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">

                Deadline

              </p>

              <h3 className="mt-4 text-xl font-black text-[#102418]">

                {document.deadline
                  ? new Date(
                      document.deadline,
                    ).toLocaleDateString()
                  : 'No Deadline'}

              </h3>

            </div>

            <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 p-4 text-white">

              <CalendarClock className="h-8 w-8" />

            </div>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}