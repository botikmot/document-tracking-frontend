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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentStatusBadge } from '@/components/common/status-badge';

type TimelineProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any | null;
};

type DrawerProps = TimelineProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Reusable timeline content. The Document Workspace embeds this component
 * inside its Timeline tab; the legacy drawer wrapper remains available for
 * any other page that still needs the standalone timeline view.
 */
export function DocumentTimelineContent({ document }: TimelineProps) {
  if (!document) return null;

  const STUCK_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000;
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const routes = Array.isArray(document.routes)
    ? document.routes
    : Array.isArray(document.routingHistory)
      ? document.routingHistory
      : [];

  const enrichedRoutes = routes.map((route) => {
    const receivedAt = route.receivedAt
      ? new Date(route.receivedAt).getTime()
      : null;
    const completedAt = route.completedAt
      ? new Date(route.completedAt).getTime()
      : null;
    const durationMs = receivedAt !== null
      ? Math.max((completedAt ?? now) - receivedAt, 0)
      : null;
    const isStuck = durationMs !== null
      && route.status !== 'COMPLETED'
      && durationMs > STUCK_THRESHOLD_MS;

    return { ...route, durationMs, isStuck };
  });

  const createdBy = [document.createdBy?.firstName, document.createdBy?.lastName]
    .filter(Boolean)
    .join(' ') || 'N/A';

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* CURRENT STATUS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#214234] dark:bg-[#102418]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">Current Status</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-[#F3F8F3]">
              {document.currentStatus?.name?.replaceAll('_', ' ') ?? 'N/A'}
            </h3>
          </div>
          {document.currentStatus?.name && (
            <DocumentStatusBadge status={document.currentStatus.name} />
          )}
        </div>
      </section>

      {/* DOCUMENT DETAILS */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-[#F3F8F3]">Document Details</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
            Key dates and the office currently responsible for this document.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#214234] dark:bg-[#102418]">
            <Building2 className="h-5 w-5 shrink-0 text-slate-500 dark:text-[#A9C5B6]" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">Current Office</p>
              <p className="mt-1 break-words font-semibold text-slate-900 dark:text-[#F3F8F3]">
                {document.currentOffice?.officeName ?? 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#214234] dark:bg-[#102418]">
            <User className="h-5 w-5 shrink-0 text-slate-500 dark:text-[#A9C5B6]" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">Created By</p>
              <p className="mt-1 break-words font-semibold text-slate-900 dark:text-[#F3F8F3]">{createdBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#214234] dark:bg-[#102418]">
            <Calendar className="h-5 w-5 shrink-0 text-slate-500 dark:text-[#A9C5B6]" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">Created Date</p>
              <p className="mt-1 break-words font-semibold text-slate-900 dark:text-[#F3F8F3]">
                {document.createdAt && !Number.isNaN(new Date(document.createdAt).getTime())
                  ? new Date(document.createdAt).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROUTING TIMELINE */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-[#F3F8F3]">Routing Timeline</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
              Follow the document's movement between offices.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-600 dark:border-[#214234] dark:bg-[#102418] dark:text-[#A9C5B6]">
            {enrichedRoutes.length} {enrichedRoutes.length === 1 ? 'routing event' : 'routing events'}
          </Badge>
        </div>

        <div className="relative space-y-5 border-l-2 border-slate-200 pl-6 dark:border-[#214234]">
          {/* DOCUMENT CREATED */}
          <div className="relative">
            <div className="absolute -left-[34px] flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 ring-4 ring-[#F8FAF6] dark:bg-blue-900/40 dark:ring-[#07150D]">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#214234] dark:bg-[#102418]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">Document Created</h4>
                <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">CREATED</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-[#A9C5B6]">Created by {createdBy}</p>
              {document.createdAt && !Number.isNaN(new Date(document.createdAt).getTime()) && (
                <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {new Date(document.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {enrichedRoutes.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm text-slate-500 dark:border-[#315844] dark:bg-[#102418]/70 dark:text-[#A9C5B6]">
              No routing activity has been recorded yet. Routing events will appear here as the document moves between offices.
            </div>
          )}

          {enrichedRoutes.map((route, index: number) => (
            <div key={route.id ?? `${route.sentAt ?? 'route'}-${index}`} className="relative">
              <div className="absolute -left-[34px] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-[#F8FAF6] dark:bg-emerald-900/40 dark:ring-[#07150D]">
                {route.status === 'RETURNED' ? (
                  <RotateCcw className="h-4 w-4 text-amber-600" />
                ) : route.status === 'RECEIVED' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Send className="h-4 w-4 text-blue-600" />
                )}
              </div>

              <div className={`rounded-2xl border bg-white p-4 shadow-sm dark:border-[#214234] dark:bg-[#102418] ${route.isStuck ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' : 'border-slate-200'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {route.fromOffice?.officeName ?? 'Unknown office'} → {route.toOffice?.officeName ?? 'Unknown office'}
                  </h4>
                  <DocumentStatusBadge status={route.documentStatus ?? 'ON_PROCESS'} />
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-500 dark:text-[#A9C5B6]">
                  <p>
                    Sent by: {[route.sentBy?.firstName, route.sentBy?.lastName].filter(Boolean).join(' ') || 'N/A'}
                  </p>
                  {route.receivedBy && (
                    <p>
                      Received by: {[route.receivedBy.firstName, route.receivedBy.lastName].filter(Boolean).join(' ') || 'N/A'}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <p className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {route.sentAt && !Number.isNaN(new Date(route.sentAt).getTime())
                        ? new Date(route.sentAt).toLocaleString()
                        : 'Date not available'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      Stayed in office: <span className="font-semibold text-slate-700 dark:text-[#F3F8F3]">{formatDuration(route.durationMs)}</span>
                    </p>
                  </div>
                  {route.remarks && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-slate-700 dark:bg-[#173227] dark:text-[#D7E8DD]">
                      {route.remarks}
                    </div>
                  )}
                  {route.isStuck && (
                    <p className="text-right text-xs font-semibold text-red-600 dark:text-red-400">
                      ⚠ Pending for more than 3 days
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Legacy standalone timeline drawer. Kept for backward compatibility. */
export function DocumentTimelineDrawer({ open, onOpenChange, document }: DrawerProps) {
  if (!document) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden border-0 bg-[#F8FAF6] transition-colors dark:bg-[#07150D] sm:!max-w-3xl">
        <SheetHeader className="border-b border-slate-200 pb-5 text-left transition-colors dark:border-[#214234]">
          <SheetTitle className="flex items-center gap-3 text-2xl font-black text-[#102418] dark:text-[#F3F8F3]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <span>{document.title}</span>
              <p className="mt-1 text-sm font-normal text-slate-500 dark:text-[#A9C5B6]">{document.trackingNumber}</p>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 dark:[&_[data-radix-scroll-area-thumb]]:bg-[#214234]">
          <div className="px-2 py-6">
            <DocumentTimelineContent document={document} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function formatDuration(ms: number | null) {
  if (ms === null || !Number.isFinite(ms)) return 'N/A';
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}
