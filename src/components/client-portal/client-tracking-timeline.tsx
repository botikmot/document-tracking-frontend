import {
  CheckCircle2,
  Circle,
  Clock3,
} from 'lucide-react';

import {
  formatDate,
} from '@/lib/format-date';

import type {
  ClientApplicationTrackingResponse,
} from '@/types/client-application';

interface ClientTrackingTimelineProps {
  tracking:
    ClientApplicationTrackingResponse;
}

export function ClientTrackingTimeline({
  tracking,
}: ClientTrackingTimelineProps) {
  const timeline =
    tracking.timeline ?? [];

  return (
    <div className="space-y-6">
      {/* SUBMITTED */}
      <TimelineItem
        title="Application Submitted"
        description={
          tracking.applicationReference
        }
        date={
          tracking.submittedAt
        }
        completed={
          Boolean(
            tracking.submittedAt,
          )
        }
      />

      {tracking.applicationStatus ===
          'UNDER_REVIEW' && (
          <TimelineItem
            title="Under Review by Records"
            description="Your submitted requirements are currently being reviewed."
            active
          />
        )}

        {tracking.applicationStatus ===
          'ADDITIONAL_REQUIREMENTS' && (
          <TimelineItem
            title="Additional Requirements Needed"
            description="Please review the Records Office remarks and submit the requested documents."
            active
          />
        )}

        {tracking.applicationStatus ===
          'RESUBMITTED' && (
          <TimelineItem
            title="Additional Requirements Resubmitted"
            description="Your additional documents have been submitted for review."
            active
          />
        )}

      {tracking.acceptedAt && (
        <TimelineItem
          title="Accepted by Records"
          description={
            tracking.document
              ?.trackingNumber
              ? `Official Tracking Number: ${tracking.document.trackingNumber}`
              : undefined
          }
          date={tracking.acceptedAt}
          completed
        />
      )}

      {/* ROUTES */}
      {timeline.map(
        (route) => {
          const fromName =
            route.fromOffice
              ?.officeName ??
            'Office';

          const toName =
            route.toOffice
              ?.officeName ??
            'Office';

          return (
            <div
              key={route.id}
              className="space-y-6"
            >
              <TimelineItem
                title={`Forwarded to ${toName}`}
                description={`From ${fromName}`}
                date={
                  route.sentAt
                }
                completed={
                  Boolean(
                    route.sentAt,
                  )
                }
              />

              {route.receivedAt && (
                <TimelineItem
                  title={`Received by ${toName}`}
                  date={
                    route.receivedAt
                  }
                  completed
                />
              )}

              {route.completedAt && (
                <TimelineItem
                  title={`Completed by ${toName}`}
                  date={
                    route.completedAt
                  }
                  completed
                />
              )}
            </div>
          );
        },
      )}

      {/* CURRENT PROCESSING */}
      {tracking.document &&
        tracking.document.status !==
          'COMPLETED' && (
          <TimelineItem
            title={
              tracking.document
                .displayStatus ??
              tracking.document
                .status ??
              'Processing'
            }
            description={
              tracking.document
                .currentOffice
                ?.officeName
                ? `Currently with ${tracking.document.currentOffice.officeName}`
                : undefined
            }
            active
          />
        )}

      {/* COMPLETED */}
      {tracking.document
        ?.status ===
        'COMPLETED' && (
        <TimelineItem
          title="Transaction Completed"
          completed
        />
      )}
    </div>
  );
}

interface TimelineItemProps {
  title: string;

  description?: string;

  date?: string | null;

  completed?: boolean;

  active?: boolean;
}

function TimelineItem({
  title,
  description,
  date,
  completed = false,
  active = false,
}: TimelineItemProps) {
  return (
    <div className="relative flex gap-4">
      <div className="relative z-10 mt-0.5 bg-background">
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : active ? (
          <Clock3 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 pb-1">
        <p className="text-sm font-medium">
          {title}
        </p>

        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {date && (
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(date)}
          </p>
        )}
      </div>
    </div>
  );
}