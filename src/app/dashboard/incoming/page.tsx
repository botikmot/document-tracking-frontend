'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Inbox,
  TrendingDown,
  Workflow,
} from 'lucide-react';

import { toast } from 'sonner';

import { api } from '@/lib/axios';

import { socket } from '@/lib/socket';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { IncomingDocumentsTable } from './components/incoming-documents-table';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

type IncomingDocument = {
  id: string;
  status: string;
  remarks?: string;
  sentAt: string;
  receivedAt?: string | null;
  documentId: string;
  document: {
    id: string;
    title: string;
    trackingNumber: string;
    deadline?: string;
    currentStatus?: {
      name: string;
    };

    currentOffice?: {
      officeName: string;
    };
    documentType?: {
      name: string;
    };
  };
  fromOffice?: {
    officeName: string;
  };
  toOffice?: {
    officeName: string;
  };
  sentBy?: {
    firstName: string;
    lastName: string;
  };
};

export default function IncomingPage() {
  const [
    documents,
    setDocuments,
  ] = useState<
    IncomingDocument[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [meta, setMeta] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
  /*
   |-------------------------------------------------------------
   | FETCH DOCUMENTS
   |-------------------------------------------------------------
   */

  const fetchDocuments =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await api.get(
              '/documents/incoming',
              {
                params: {
                  page,
                  limit: 5,

                  search:
                    debouncedSearch,
                },
              },
            );
            console.log('incoming:',response.data)
          setDocuments(
            response.data.data,
          );

          setMeta(
            response.data.meta,
          );
          setStats(response.data.stats)
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

  /*
   |-------------------------------------------------------------
   | INITIAL LOAD
   |-------------------------------------------------------------
   */

  useEffect(() => {
    const load =
      async () => {
        await fetchDocuments();
      };

    void load();
  }, [fetchDocuments]);

  /*
   |-------------------------------------------------------------
   | REAL-TIME INCOMING
   |-------------------------------------------------------------
   */

  useEffect(() => {
    socket.on(
      'incoming-document',
      (
        data: IncomingDocument,
      ) => {
        console.log(
          'NEW INCOMING:',
          data,
        );

        /*
         |-------------------------------------------------------
         | PREVENT DUPLICATES
         |-------------------------------------------------------
         */

        setDocuments(
          (prev) => {

            const newDocument = {
              ...data,

              documentId:
                data.document.id,
            };

            const exists =
              prev.some(
                (doc) =>
                  doc.id ===
                  newDocument.id,
              );

            if (exists) {
              return prev;
            }

            return [
              newDocument,
              ...prev,
            ];
          },
        );

        toast.success(
          'New Incoming Document',
          {
            description:
              data.document
                .title,
          },
        );
      },
    );

    /*
     |-----------------------------------------------------------
     | REMOVE RECEIVED DOCUMENT REAL-TIME
     |-----------------------------------------------------------
     */

    socket.on(
      'document-received',
      (
        data: {
          routeId: string;
        },
      ) => {
        setDocuments(
          (prev) =>
            prev.filter(
              (doc) =>
                doc.id !==
                data.routeId,
            ),
        );
      },
    );

    return () => {
      socket.off(
        'incoming-document',
      );

      socket.off(
        'document-received',
      );
    };
  }, []);

  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2] transition-colors dark:bg-[#07150D]">
      {/* ====================================== */}
      {/* BACKGROUND GLOW */}
      {/* ====================================== */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-500/5 blur-3xl dark:bg-green-400/10" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-green-500/5 blur-3xl dark:bg-emerald-400/10" />
      </div>

      <div className="relative z-10">
        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-[#0B1F14]/90">
          <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
            {/* LEFT */}

            <div className="flex justify-end lg:hidden">
                  <MobileSidebar />
            </div>

            <div className="flex items-center gap-5">
              <div className="hidden md:flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-2xl">
                <Inbox className="h-10 w-10" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
                  DENR eDATS
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418] dark:text-white">
                  Incoming Documents
                </h1>

                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Monitor and receive routed
                  documents from offices and
                  departments.
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-blue-700 hover:bg-blue-100">
                Receiving Queue Active
              </Badge>

              <Badge className="rounded-full border border-emerald-200 bg-emerald-100 px-5 py-2 text-emerald-700 hover:bg-emerald-100">
                Workflow Online
              </Badge>
            </div>
          </div>
        </header>

        {/* ====================================== */}
        {/* STATS */}
        {/* ====================================== */}

        <div className="grid gap-6 p-8 md:grid-cols-3">
          {/* INCOMING */}

          <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-xl shadow-blue-100/30">
            <CardContent className="relative p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Incoming Queue
                  </p>

                  <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                    {meta?.total ?? 0}
                  </h2>

                  <Badge className="mt-5 rounded-full bg-blue-100 px-4 py-1 text-blue-700">
                    <TrendingDown className="mr-1 h-4 w-4" />
                    Active receiving
                  </Badge>
                  <p className="mt-3 text-xs text-slate-400">
                    Documents currently being received and queued for processing within the system.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-xl">
                  <Inbox className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROUTING */}

          <Card className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-xl shadow-green-100/30">
            <CardContent className="relative p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Active Routing
                  </p>

                  <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                    {stats?.pending ?? 0}
                  </h2>

                  <Badge className="mt-5 rounded-full bg-emerald-100 px-4 py-1 text-emerald-700">
                    Live office routing
                  </Badge>
                  <p className="mt-3 text-xs text-slate-400">
                    Documents actively moving between offices and undergoing workflow routing.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl">
                  <Workflow className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STATUS */}

          <Card className="overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-[#07150d] via-[#0b1f14] to-[#102418] text-white shadow-2xl">
            <CardContent className="p-7">
              <h3 className="text-2xl font-black">
                Workflow Status
              </h3>

              <p className="mt-2 text-sm leading-7 text-green-100/70">
                Incoming document routing and
                receiving operations are
                functioning normally across all
                connected offices.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-green-100">
                🟢 All systems operational
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================== */}
        {/* TABLE */}
        {/* ====================================== */}

        <div className="px-8 pb-8">
          <IncomingDocumentsTable
            routes={documents}
            loading={loading}
            onRefresh={
              fetchDocuments
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