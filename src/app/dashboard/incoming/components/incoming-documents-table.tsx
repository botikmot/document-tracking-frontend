'use client';

import { useState } from 'react';

import {
  FileText,
  Building2,
  ArrowRight,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import { api } from '@/lib/axios';
import { RouteDocumentDialog } from '../../documents/components/route-document-dialog';

export function IncomingDocumentsTable({
  routes,
  loading,
  onRefresh,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: any[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [receivingId, setReceivingId] =
    useState<string | null>(null);

  if (loading) {
    return (
      <Card className="rounded-3xl border-0 bg-white shadow-sm">
        <CardContent className="p-10 text-center text-slate-500">
          Loading incoming documents...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-0 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black">
          Incoming Documents
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {routes.map((route) => {
            const doc =
              route.document;

              const canRoute = [
                    'DRAFT',
                    'PENDING',
                    'REJECTED',
                    ].includes(
                    doc.currentStatus?.name,
                );

              const canReceive = doc.currentStatus?.name === 'IN_TRANSIT';

            return (
              <div
                key={route.id}
                className="flex flex-col gap-5 rounded-3xl border border-slate-100 p-6 transition hover:border-blue-200 hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
              >
                {/* LEFT */}
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <FileText className="h-8 w-8 text-slate-700" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {doc.title}
                      </h3>

                      <Badge className="rounded-full bg-blue-100 text-blue-700">
                        {doc.documentType?.name}
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                      <div>
                        {doc.trackingNumber}
                      </div>

                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />

                        {route.fromOffice?.officeName}
                      </div>

                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />

                        {route.toOffice?.officeName}
                      </div>
                    </div>

                    {route.remarks && (
                      <p className="mt-3 text-sm text-slate-600">
                        Remarks: {route.remarks}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full bg-amber-100 text-amber-700">
                    FOR RECEIVING
                  </Badge>

                  {canRoute && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <RouteDocumentDialog
                        documentId={doc.id}
                        onSuccess={onRefresh}
                      />
                    </div>
                  )}

                  {canReceive && (
                    <Button
                        disabled={
                        receivingId === route.documentId
                        }
                        className="rounded-xl"
                        onClick={async () => {
                        try {
                            setReceivingId(route.documentId);

                            await api.post(
                            `/documents/${route.documentId}/receive`,
                            );

                            onRefresh();
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setReceivingId(null);
                        }
                        }}
                    >
                        Receive Document
                    </Button>
                 )}

                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}