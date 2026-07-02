'use client';

import { useEffect, useState, useCallback } from 'react';

import { api } from '@/lib/axios';

import { DocumentsHeader } from './components/documents-header';
import { DocumentsStats } from './components/documents-stats';
import { DocumentsTabs } from './components/documents-tabs';
import { DocumentsTable } from './components/documents-table';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
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

  const fetchDocuments =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await api.get(
              '/documents',
              {
                params: {
                  page,
                  limit: 5,
                  status:
                    activeTab,
                  search: debouncedSearch,
                },
              },
            );

          setDocuments(
            response.data.data,
          );

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
        activeTab,
        debouncedSearch,
      ],
    );

  useEffect(() => {
    const load =
      async () => {
        await fetchDocuments();
      };

    void load();
  }, [fetchDocuments]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/documents/stats');
      
      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2] transition-colors dark:bg-[#07150D]">
      {/* ====================================== */}
      {/* BACKGROUND GLOW */}
      {/* ====================================== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-green-500/5 blur-3xl dark:bg-green-400/10" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-400/10" />
      </div>

      <div className="relative z-10">
        <DocumentsHeader
          onCreated={
            fetchDocuments
          }
        />

        <div className="space-y-8 p-8">
          <DocumentsStats
            stats={stats}
          />

          <DocumentsTabs
            activeTab={
              activeTab
            }
            setActiveTab={
              setActiveTab
            }
            setPage={setPage}
          />

          <DocumentsTable
            documents={documents}
            type="documents"
            loading={loading}
            onRefresh={fetchDocuments}
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