import {
  Badge,
} from '@/components/ui/badge';

import type {
  ClientApplicationStatus,
} from '@/types/client-application';

interface ApplicationStatusBadgeProps {
  status: ClientApplicationStatus;
}

const labels: Record<
  ClientApplicationStatus,
  string
> = {
  DRAFT:
    'Draft',

  SUBMITTED:
    'Submitted',

  UNDER_REVIEW:
    'Under Review',

  ADDITIONAL_REQUIREMENTS:
    'Action Needed',

  RESUBMITTED:
    'Resubmitted',

  ACCEPTED:
    'Accepted',

  REJECTED:
    'Not Accepted',

  PROCESSING:
    'Processing',

  COMPLETED:
    'Completed',

  CANCELLED:
    'Cancelled',
};

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  if (
    status ===
    'ADDITIONAL_REQUIREMENTS'
  ) {
    return (
      <Badge variant="outline">
        {labels[status]}
      </Badge>
    );
  }

  if (
    status === 'REJECTED' ||
    status === 'CANCELLED'
  ) {
    return (
      <Badge variant="destructive">
        {labels[status]}
      </Badge>
    );
  }

  if (
    status === 'ACCEPTED' ||
    status === 'COMPLETED'
  ) {
    return (
      <Badge>
        {labels[status]}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      {labels[status]}
    </Badge>
  );
}