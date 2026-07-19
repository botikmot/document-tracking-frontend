'use client';

import {
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  TrendingUp,
  Timer,
  ArrowDownToLine,
  ArrowUpRight,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

type DocumentSummary = {
  count: number;
  documents: {
    id: string;
    trackingNumber: string;
    title: string;
    documentType: string;
    status: string;
    office: string;
    classification: string | null;
    priority: string | null;
    createdAt: string;
    deadline: string | null;
  }[];
};

type ReportSummary = {
  totalDocuments: DocumentSummary;
  incomingDocuments: DocumentSummary;
  outgoingDocuments: DocumentSummary;
  completedDocuments: DocumentSummary;
  pendingDocuments: DocumentSummary;
  overdueDocuments: DocumentSummary;
  completionRate: number;
  processingEfficiency: number;
  averageProcessingHours: number;
};

type Props = {
  summary?: ReportSummary;
};

export function ReportCards({
  summary,
}: Props) {

  const emptyDocumentSummary = {
    count: 0,
    documents: [],
  };

  const data = summary ?? {
    totalDocuments: emptyDocumentSummary,
    incomingDocuments: emptyDocumentSummary,
    outgoingDocuments: emptyDocumentSummary,
    completedDocuments: emptyDocumentSummary,
    pendingDocuments: emptyDocumentSummary,
    overdueDocuments: emptyDocumentSummary,
    completionRate: 0,
    processingEfficiency: 0,
    averageProcessingHours: 0,
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* ===================================================== */}
      {/* TOTAL DOCUMENTS */}
      {/* ===================================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-blue-100/30">
        <CardContent className="relative p-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Documents
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {data.totalDocuments.count}
              </h2>

              <Badge className="mt-5 rounded-full bg-blue-100 px-4 py-1 text-blue-700">
                <TrendingUp className="mr-1 h-4 w-4" />
                Generated Report
              </Badge>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-xl">
              <FileText className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-cyan-100/30">
        <CardContent className="relative p-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Incoming
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {data.incomingDocuments.count}
              </h2>

              <Badge className="mt-5 rounded-full bg-cyan-100 px-4 py-1 text-cyan-700">
                Received Documents
              </Badge>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl">
              <ArrowDownToLine className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-indigo-100/30">
        <CardContent className="relative p-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Outgoing
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {data.outgoingDocuments.count}
              </h2>

              <Badge className="mt-5 rounded-full bg-indigo-100 px-4 py-1 text-indigo-700">
                Routed Documents
              </Badge>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl">
              <ArrowUpRight className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===================================================== */}
      {/* COMPLETED */}
      {/* ===================================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-green-100/30">
        <CardContent className="relative p-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Completed
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {data.completedDocuments.count}
              </h2>

              <Badge className="mt-5 rounded-full bg-emerald-100 px-4 py-1 text-emerald-700">
                {data.completionRate}%
                Completion
              </Badge>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===================================================== */}
      {/* PENDING */}
      {/* ===================================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-amber-100/30">
        <CardContent className="relative p-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Pending
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {data.pendingDocuments.count}
              </h2>

              <Badge className="mt-5 rounded-full bg-amber-100 px-4 py-1 text-amber-700">
                Awaiting Action
              </Badge>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
              <Clock3 className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===================================================== */}
      {/* OVERDUE */}
      {/* ===================================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-red-100/30">
        <CardContent className="relative p-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Overdue
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {data.overdueDocuments.count}
              </h2>

              <Badge className="mt-5 rounded-full bg-red-100 px-4 py-1 text-red-700">
                Immediate Attention
              </Badge>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-xl">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===================================================== */}
      {/* AVG PROCESSING */}
      {/* ===================================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-violet-100/30">
        <CardContent className="relative p-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Avg. Processing
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {data.averageProcessingHours}
              </h2>

              <Badge className="mt-5 rounded-full bg-violet-100 px-4 py-1 text-violet-700">
                Hours
              </Badge>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-xl">
              <Timer className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===================================================== */}
      {/* SUMMARY */}
      {/* ===================================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-[#07150d] via-[#0b1f14] to-[#102418] text-white shadow-2xl">
        <CardContent className="p-7">
          <h3 className="text-2xl font-black">
            Executive Summary
          </h3>

          <p className="mt-4 leading-7 text-green-100/80">
            This report summarizes document workflow
            performance for the selected reporting period.
            Completion efficiency currently stands at
            <span className="font-bold text-white">
              {' '}
              {data.processingEfficiency}%
            </span>
            .
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between text-sm">
              <span>Efficiency</span>

              <span className="font-bold">
                {data.processingEfficiency}%
              </span>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                style={{
                  width: `${Math.min(
                    data.processingEfficiency,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}