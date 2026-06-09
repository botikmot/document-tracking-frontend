'use client';

import { useEffect, useState } from 'react';

import { api } from '@/lib/axios';

import { DocumentsTable } from '../documents/components/documents-table';

export default function OutgoingDocumentsPage() {
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchOutgoingDocuments =
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            '/documents/outgoing',
          );

        /*
         |--------------------------------------------------------
         | Normalize route -> document
         |--------------------------------------------------------
         */

        const normalized =
          response.data.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (route: any) => ({
              ...route.document,

              route,
            }),
          );

        setDocuments(normalized);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
        const load = async () => {
            await fetchOutgoingDocuments();
        };

        void load();
    }, []);

  return (
    <main className="flex-1 overflow-hidden">
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Outgoing Documents
          </h1>

          <p className="mt-2 text-slate-500">
            Documents routed to other offices.
          </p>
        </div>

        <DocumentsTable
          documents={documents}
          loading={loading}
          onRefresh={
            fetchOutgoingDocuments
          }
        />
      </div>
    </main>
  );
}