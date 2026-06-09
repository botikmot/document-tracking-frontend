'use client';

import { useEffect, useState } from 'react';

import { api } from '@/lib/axios';

import { IncomingDocumentsTable } from './components/incoming-documents-table';

import { Inbox } from 'lucide-react';

export default function IncomingPage() {
  const [documents, setDocuments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchDocuments =
    async () => {
      try {
        const response =
          await api.get(
            '/documents/incoming',
          );

        console.log('incoming:', response)
        setDocuments(
          response.data,
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
        const load = async () => {
            await fetchDocuments();
        };

        void load();
    }, []);

  return (
    <main className="flex-1 overflow-hidden">
      {/* HEADER */}
      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
              <Inbox className="h-8 w-8 text-blue-600" />

              Incoming Documents
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Documents routed to your office.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8">
        <IncomingDocumentsTable
            routes={documents}
            loading={loading}
            onRefresh={fetchDocuments}
        />
      </div>
    </main>
  );
}