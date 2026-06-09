'use client';

import {
  Building2,
  FileText,
  Search,
  //Send,
} from 'lucide-react';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Input,
} from '@/components/ui/input';

import { RouteDocumentDialog } from './route-document-dialog';
import { DocumentTimelineDrawer } from './document-timeline-drawer';
import { DocumentDetailsDrawer } from './document-details-drawer';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';

export function DocumentsTable({
  documents,
  loading,
  onRefresh,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[];
  loading: boolean;
  onRefresh: () => void;
}) {

  const [
    selectedDocument,
    setSelectedDocument,
  ] = useState(null);

  const [
    openTimeline,
    setOpenTimeline,
  ] = useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);



  if (loading) {
    return (
      <Card className="rounded-3xl border-0 bg-white shadow-sm">
        <CardContent className="p-10 text-center text-slate-500">
          Loading documents...
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="rounded-3xl border-0 bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-2xl font-black">
          Documents Registry
        </CardTitle>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search document..."
            className="h-11 rounded-2xl pl-11"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => {
            const canRoute = [
              'DRAFT',
              'PENDING',
              'REJECTED',
            ].includes(
              doc.currentStatus?.name,
            );

            return (
              <div
                key={doc.id}
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
                        {
                          doc.title
                        }
                      </h3>

                      <Badge className="rounded-full bg-blue-100 text-blue-700">
                        {
                          doc
                            .documentType
                            ?.name
                        }
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                      <div>
                        {
                          doc.trackingNumber
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />

                        {
                          doc
                            .currentOffice
                            ?.officeName
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                    {doc.currentStatus?.name}
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

                  {doc.route?.toOffice && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      Routed to:
                      <span className="font-semibold">
                        {doc.route.toOffice.officeName}
                      </span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedDocument(doc);
                      setOpenDetails(true);
                    }}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedDocument(doc);
                      setOpenTimeline(true);
                    }}
                  >
                    Timeline
                  </Button>

                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <DocumentTimelineDrawer
        open={openTimeline}
        onOpenChange={
          setOpenTimeline
        }
        document={
          selectedDocument
        }
      />

      <DocumentDetailsDrawer
        open={openDetails}
        onOpenChange={
          setOpenDetails
        }
        document={
          selectedDocument
        }
      />

    </Card>
  );
}