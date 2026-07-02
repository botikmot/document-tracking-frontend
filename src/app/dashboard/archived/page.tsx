'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Archive,
  ShieldCheck,
  Database,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { api } from '@/lib/axios';

import { DocumentsTable } from '../documents/components/documents-table';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

export default function ArchivedDocumentsPage() {
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

  const fetchArchivedDocuments =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await api.get(
              '/documents/archived',
              {
                params: {
                  page,
                  limit: 5,

                  search:
                    debouncedSearch,
                },
              },
            );
          console.log('archived:', response.data)
          setDocuments(
            response.data.data,
          );
          setStats(response.data.stats);
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
        await fetchArchivedDocuments();
      };

    void load();
  }, [fetchArchivedDocuments]);

  const secureStorageRate =
    stats?.totalDocuments > 0
      ? Math.round((stats?.archivedCount / stats?.totalDocuments) * 100)
      : 0;

  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2] transition-colors dark:bg-[#07150D]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-slate-500/5 blur-3xl dark:bg-green-400/10" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-zinc-500/5 blur-3xl dark:bg-emerald-400/10" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-[#0B1F14]/90">
          <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex justify-end lg:hidden">
                  <MobileSidebar />
            </div>

            <div className="flex items-center gap-5">
              <div className="hidden md:flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-2xl">
                <Archive className="h-10 w-10" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-700 dark:text-slate-400">
                  DENR eDATS
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418] dark:text-white">
                  Archived Documents
                </h1>

                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Securely store and manage completed and archived
                  official records and documents.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-slate-700 hover:bg-slate-100">
                Secure Archive
              </Badge>

              <Badge className="rounded-full border border-zinc-200 bg-zinc-100 px-5 py-2 text-zinc-700 hover:bg-zinc-100">
                Audit Ready
              </Badge>
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="grid gap-6 p-8 md:grid-cols-3">
          <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-xl shadow-slate-100/30">
            <CardContent className="relative p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-slate-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Archived Records
                  </p>

                  <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                    {
                      documents.length
                    }
                  </h2>

                  <Badge className="mt-5 rounded-full bg-slate-100 px-4 py-1 text-slate-700">
                    Historical records
                  </Badge>
                  <p className="mt-3 text-xs text-slate-400">
                    Completed documents stored for historical reference and compliance.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-xl">
                  <Archive className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-xl shadow-zinc-100/30">
            <CardContent className="relative p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-zinc-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Secure Storage
                  </p>

                  <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                    {secureStorageRate}%
                  </h2>

                  <Badge className="mt-5 rounded-full bg-zinc-100 px-4 py-1 text-zinc-700">
                    Vault protected
                  </Badge>
                  <p className="mt-3 text-xs text-slate-400">
                    Percentage of archived documents securely stored and protected in the system.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-zinc-700 to-black text-white shadow-xl">
                  <ShieldCheck className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-[#0f1115] via-[#171a21] to-[#1f2430] text-white shadow-2xl">
            <CardContent className="p-7">
              <h3 className="text-2xl font-black">
                Archive Integrity
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-300">
                Archived records remain protected and accessible for
                audit, legal compliance, and historical reference.
              </p>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                <Database className="h-5 w-5 text-slate-300" />

                Secure storage system operational
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLE */}
        <div className="px-8 pb-8">
          <DocumentsTable
            documents={
              documents
            }
            type="archived"
            loading={
              loading
            }
            onRefresh={
              fetchArchivedDocuments
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