'use client';

import {
  CalendarClock,
  FileBadge2,
  FileText,
  //Flag,
  FolderOpen,
  Hash,
  Layers3,
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

function statusColor(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-700';

    case 'RECEIVED':
      return 'bg-green-100 text-green-700';

    case 'IN_TRANSIT':
      return 'bg-blue-100 text-blue-700';

    case 'FOR_REVIEW':
      return 'bg-amber-100 text-amber-700';

    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function TrackingDetails({
  document,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-[32px] border-0 shadow-xl">

      <CardContent className="relative p-8">

        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-green-500/5 blur-3xl" />

        {/* HEADER */}

        <div className="relative mb-10 flex items-center gap-5">

          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl">

            <FileText className="h-10 w-10" />

          </div>

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">

              Document Details

            </p>

            <h2 className="mt-2 text-3xl font-black text-[#102418]">

              {document.title}

            </h2>

            <p className="mt-2 text-slate-500">

              Tracking Number

            </p>

            <p className="font-mono text-lg font-bold text-green-700">

              {document.trackingNumber}

            </p>

          </div>

        </div>

        {/* GRID */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* LEFT */}

          <div className="space-y-5">

            <InfoRow
              icon={<Hash className="h-5 w-5" />}
              label="Reference Number"
              value={document.referenceNumber}
            />

            <InfoRow
              icon={<FolderOpen className="h-5 w-5" />}
              label="Document Type"
              value={document.documentType.name}
            />

            <InfoRow
              icon={<Layers3 className="h-5 w-5" />}
              label="Classification"
              value={document.classification}
            />

            <InfoRow
              icon={<FileBadge2 className="h-5 w-5" />}
              label="Current Office"
              value={document.currentOffice.officeName}
            />

          </div>

          {/* RIGHT */}

          <div className="space-y-5">

            <InfoRow
              icon={<CalendarClock className="h-5 w-5" />}
              label="Created"
              value={new Date(
                document.createdAt,
              ).toLocaleString()}
            />

            <InfoRow
              icon={<CalendarClock className="h-5 w-5" />}
              label="Deadline"
              value={
                document.deadline
                  ? new Date(
                      document.deadline,
                    ).toLocaleDateString()
                  : 'No Deadline'
              }
            />

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-sm font-semibold text-slate-500">

                Priority

              </p>

              <Badge
                className={`mt-3 rounded-full px-4 py-2 ${priorityColor(
                  document.priority,
                )}`}
              >
                {document.priority}
              </Badge>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-sm font-semibold text-slate-500">

                Current Status

              </p>

              <Badge
                className={`mt-3 rounded-full px-4 py-2 ${statusColor(
                  document.currentStatus.name,
                )}`}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />

                {document.currentStatus.name}

              </Badge>

            </div>

          </div>

        </div>

        {/* DESCRIPTION */}

        <div className="mt-8 rounded-[28px] border border-green-100 bg-green-50 p-6">

          <h3 className="font-bold text-green-700">

            Description

          </h3>

          <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-700">

            {document.description || 'No description provided.'}

          </p>

        </div>

      </CardContent>

    </Card>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-white p-3 text-green-700 shadow">

          {icon}

        </div>

        <div>

          <p className="text-sm text-slate-500">

            {label}

          </p>

          <p className="mt-1 font-bold text-[#102418]">

            {value}

          </p>

        </div>

      </div>

    </div>
  );
}