'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Clock3,
  AlertTriangle,
  TimerReset,
  Activity,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { api } from '@/lib/axios';

import { DocumentsTable } from '../documents/components/documents-table';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

export default function PendingDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [meta, setMeta] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setDebouncedSearch(
          search,
        );
      }, 500);

    return () =>
      clearTimeout(timer);
  }, [search]);

  const fetchPendingDocuments =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await api.get(
              '/documents/pending',
              {
                params: {
                  page,
                  limit: 5,
                  search:
                    debouncedSearch,
                },
              },
            );

          setDocuments(
            response.data.data,
          );
          console.log('pending:', response.data.data)

          setMeta(
            response.data.meta,
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
        [
          page,
          debouncedSearch,
        ],
      );

  useEffect(() => {
    const load =
      async () => {
        await fetchPendingDocuments();
      };

    void load();
  }, [fetchPendingDocuments]);


  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/documents/stats');
      console.log('pending stats:', res.data)
      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2]">
      {/* ====================================== */}
      {/* BACKGROUND GLOW */}
      {/* ====================================== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-amber-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
            {/* LEFT */}
            <div className="flex justify-end lg:hidden">
                  <MobileSidebar />
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden md:flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-2xl">
                <Clock3 className="h-10 w-10" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-700">
                  DENR eDATS
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418]">
                  Pending Documents
                </h1>

                <p className="mt-2 text-slate-600">
                  Monitor documents awaiting approval, routing,
                  review, and operational action.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="rounded-full border border-amber-200 bg-amber-100 px-5 py-2 text-amber-700 hover:bg-amber-100">
                Action Queue Active
              </Badge>

              <Badge className="rounded-full border border-orange-200 bg-orange-100 px-5 py-2 text-orange-700 hover:bg-orange-100">
                Pending Workflow
              </Badge>
            </div>
          </div>
        </header>

        {/* ====================================== */}
        {/* STATS */}
        {/* ====================================== */}
        <div className="grid gap-6 p-8 md:grid-cols-3">
          {/* TOTAL */}
          <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-amber-100/30">
            <CardContent className="relative p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending Queue
                  </p>

                  <h2 className="mt-3 text-5xl font-black text-[#102418]">
                    {
                      stats?.pending ?? 0
                    }
                  </h2>

                  <Badge className="mt-5 rounded-full bg-amber-100 px-4 py-1 text-amber-700">
                    <TimerReset className="mr-1 h-4 w-4" />

                    Awaiting action
                  </Badge>
                  <p className="mt-3 text-xs text-slate-400">
                    Documents waiting for action such as review, approval, or forwarding.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
                  <Clock3 className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PRIORITY */}
          <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-red-100/30">
            <CardContent className="relative p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Urgent Workload
                  </p>

                  <h2 className="mt-3 text-5xl font-black text-[#102418]">
                    {stats?.urgent ?? 0}
                  </h2>

                  <Badge className="mt-5 rounded-full bg-red-100 px-4 py-1 text-red-700">
                    High priority queue
                  </Badge>
                  <p className="mt-3 text-xs text-slate-400">
                    High-priority documents that require immediate attention or processing.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-xl">
                  <AlertTriangle className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STATUS */}
          <Card className="overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-[#1b1205] via-[#2a1907] to-[#3a2208] text-white shadow-2xl">
            <CardContent className="p-7">
              <h3 className="text-2xl font-black">
                Workflow Monitoring
              </h3>

              <p className="mt-2 text-sm leading-7 text-orange-100/70">
                Pending workflows and approval operations are
                actively monitored across connected offices.
              </p>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-orange-100">
                <Activity className="h-5 w-5 text-amber-300" />

                Workflow queue currently active
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================== */}
        {/* DOCUMENTS TABLE */}
        {/* ====================================== */}
        <div className="px-8 pb-8">
          <DocumentsTable
            documents={
              documents
            }
            type="pending"
            loading={
              loading
            }
            onRefresh={
              fetchPendingDocuments
            }
            page={page}
            setPage={setPage}
            meta={meta}
            search={search}
            setSearch={setSearch}
          />
        </div>
      </div>
    </main>
  );
}