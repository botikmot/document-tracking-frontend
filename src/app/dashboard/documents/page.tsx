'use client';

import { useEffect, useState } from 'react';

import { api } from '@/lib/axios';

import { DocumentsHeader } from './components/documents-header';
import { DocumentsStats } from './components/documents-stats';
import { DocumentsTabs } from './components/documents-tabs';
import { DocumentsTable } from './components/documents-table';

export default function DocumentsPage() {
  const [documents, setDocuments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState('ALL');

  const fetchDocuments =
    async () => {
      try {
        const response =
          await api.get(
            '/documents',
          );

        console.log('documents:', response.data)
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

  const filteredDocuments =
    documents.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc: any) => {
        if (
          activeTab === 'ALL'
        ) {
          return true;
        }

        return (
          doc.currentStatus
            ?.name === activeTab
        );
      },
    );

  return (
    <main className="flex-1 overflow-hidden">
      <DocumentsHeader
        onCreated={
          fetchDocuments
        }
      />

      <div className="space-y-8 p-8">
        <DocumentsStats
          documents={documents}
        />

        <DocumentsTabs
          activeTab={
            activeTab
          }
          setActiveTab={
            setActiveTab
          }
        />

        <DocumentsTable
          documents={
            filteredDocuments
          }
          loading={loading}
          onRefresh={fetchDocuments}
        />
      </div>
    </main>
  );
}