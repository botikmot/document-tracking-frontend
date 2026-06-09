'use client';

import { useEffect, useState } from 'react';

import { api } from '@/lib/axios';

import { DocumentsTable } from '../documents/components/documents-table';

export default function PendingDocumentsPage() {
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        '/documents/pending',
      );

      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
        const load = async () => {
            await fetchPendingDocuments();
        };

        void load();
    }, []);

  return (
    <main className="flex-1 overflow-hidden">
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Pending Documents
          </h1>

          <p className="mt-2 text-slate-500">
            Documents awaiting processing,
            routing, approval, or review.
          </p>
        </div>

        <DocumentsTable
          documents={documents}
          loading={loading}
          onRefresh={fetchPendingDocuments}
        />
      </div>
    </main>
  );
}