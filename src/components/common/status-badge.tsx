'use client';

import {
  CheckCircle2,
} from 'lucide-react';

import {
  Badge,
} from '@/components/ui/badge';

type DocumentStatusBadgeProps = {
  status?: string | null;
  className?: string;
};

export function DocumentStatusBadge({
  status,
  className = '',
}: DocumentStatusBadgeProps) {
  const normalizedStatus =
    status
      ?.trim()
      .toUpperCase();

  switch (normalizedStatus) {
    case 'APPROVED':
      return (
        <Badge
          className={`rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100 ${className}`}
        >
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Approved
        </Badge>
      );

    case 'FOR_APPROVAL':
      return (
        <Badge
          className={`rounded-full bg-violet-100 text-violet-700 hover:bg-violet-100 ${className}`}
        >
          For Approval
        </Badge>
      );

    case 'FOR_REVIEW':
      return (
        <Badge
          className={`rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100 ${className}`}
        >
          For Review
        </Badge>
      );

    case 'ON_PROCESS':
      return (
        <Badge
          className={`rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100 ${className}`}
        >
          On Process
        </Badge>
      );

    case 'PENDING':
      return (
        <Badge
          className={`rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-100 ${className}`}
        >
          Pending
        </Badge>
      );

    case 'REJECTED':
      return (
        <Badge
          className={`rounded-full bg-red-100 text-red-700 hover:bg-red-100 ${className}`}
        >
          Rejected
        </Badge>
      );

    case 'COMPLETED':
      return (
        <Badge
          className={`rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100 ${className}`}
        >
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Completed
        </Badge>
      );

    case 'END_TRANSACTION':
      return (
        <Badge
          className={`rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100 ${className}`}
        >
          <CheckCircle2 className="mr-1 h-4 w-4" />
          End Transaction
        </Badge>
      );

    case 'DRAFT':
      return (
        <Badge
          className={`rounded-full bg-slate-100 text-slate-600 hover:bg-slate-100 ${className}`}
        >
          Draft
        </Badge>
      );

    case 'IN_TRANSIT':
      return (
        <Badge
          className={`rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-100 ${className}`}
        >
          In Transit
        </Badge>
      );

    case 'FOR_RELEASE':
      return (
        <Badge
          className={`rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-100 ${className}`}
        >
          For Release
        </Badge>
      );

    default:
      return (
        <Badge
          className={`rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100 ${className}`}
        >
          {normalizedStatus
            ?.replaceAll(
              '_',
              ' ',
            ) ?? '-'}
        </Badge>
      );
  }
}