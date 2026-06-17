'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Send,
  ArrowUpRight,
  Workflow,
  CheckCircle2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { api } from '@/lib/axios';

import { DocumentsTable } from '../documents/components/documents-table';

export default function OutgoingDocumentsPage() {
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

  const fetchOutgoingDocuments =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await api.get(
              '/documents/outgoing',
              {
                params: {
                  page,
                  limit: 5,
                  search:
                    debouncedSearch,
                },
              },
            );

          /*
          |--------------------------------------------------------
          | Normalize route -> document
          |--------------------------------------------------------
          */

          const normalized =
            response.data.data.map(
              (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                route: any,
              ) => ({
                ...route.document,
                route,
              }),
            );

          setDocuments(
            normalized,
          );
          console.log('outgoing:', response.data)
          //setStats(response.data.stats);
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
        await fetchOutgoingDocuments();
      };

    void load();
  }, [fetchOutgoingDocuments]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/documents/stats');
      console.log('outgoing stats:', res.data)
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
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-600 to-green-600 text-white shadow-2xl">
                <Send className="h-10 w-10" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
                  DENR eDATS
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418]">
                  Outgoing Documents
                </h1>

                <p className="mt-2 text-slate-600">
                  Monitor transmitted and routed documents sent to
                  external offices and departments.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="rounded-full border border-emerald-200 bg-emerald-100 px-5 py-2 text-emerald-700 hover:bg-emerald-100">
                Dispatch Center Active
              </Badge>

              <Badge className="rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-blue-700 hover:bg-blue-100">
                Live Transmission
              </Badge>
            </div>
          </div>
        </header>

        {/* ====================================== */}
        {/* STATS */}
        {/* ====================================== */}
        <div className="grid gap-6 p-8 md:grid-cols-3">
          {/* TOTAL */}
          <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-emerald-100/30">
            <CardContent className="relative p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Outgoing Documents
                  </p>

                  <h2 className="mt-3 text-5xl font-black text-[#102418]">
                    {
                      stats?.outgoing ?? 0
                    }
                  </h2>

                  <Badge className="mt-5 rounded-full bg-emerald-100 px-4 py-1 text-emerald-700">
                    <ArrowUpRight className="mr-1 h-4 w-4" />

                    Active dispatches
                  </Badge>
                  <p className="mt-3 text-xs text-slate-400">
                    Documents that have been dispatched and are currently leaving the system or office.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-green-600 text-white shadow-xl">
                  <Send className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROUTING */}
          <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-cyan-100/30">
            <CardContent className="relative p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Routing Activity
                  </p>

                  <h2 className="mt-3 text-5xl font-black text-[#102418]">
                    {stats?.outgoingActiveRoute ?? 0}
                  </h2>

                  <Badge className="mt-5 rounded-full bg-cyan-100 px-4 py-1 text-cyan-700">
                    Workflow processing
                  </Badge>
                  <p className="mt-3 text-xs text-slate-400">
                    Ongoing workflow processes showing how many documents are currently being routed.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-xl">
                  <Workflow className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STATUS */}
          <Card className="overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-[#07150d] via-[#0b1f14] to-[#102418] text-white shadow-2xl">
            <CardContent className="p-7">
              <h3 className="text-2xl font-black">
                Dispatch Status
              </h3>

              <p className="mt-2 text-sm leading-7 text-green-100/70">
                All outgoing document transmission services are
                operating normally across connected offices.
              </p>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-green-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                Transmission stable across all routes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================== */}
        {/* DOCUMENTS TABLE */}
        {/* ====================================== */}
        <div className="px-8 pb-8">
          <DocumentsTable
            documents={documents}
            type="outgoing"
            loading={loading}
            onRefresh={
              fetchOutgoingDocuments
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