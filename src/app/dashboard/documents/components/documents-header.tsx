'use client';

import { FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import CreateDocumentDialog from './create-document-dialog';

export function DocumentsHeader({
  onCreated,
}: {
  onCreated: () => void;
}) {
  return (
    <div className="border-b bg-white">
      <div className="flex flex-col gap-5 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Documents
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track, route, and manage documents region-wide.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="rounded-full bg-blue-100 px-4 py-1 text-blue-700">
            Live Tracking
          </Badge>

          <CreateDocumentDialog
            
          />
        </div>
      </div>
    </div>
  );
}