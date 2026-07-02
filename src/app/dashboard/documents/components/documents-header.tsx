'use client';

import {
  FileText,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

//import CreateDocumentDialog from './create-document-dialog';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import DocumentDialog from './document-dialog';

export function DocumentsHeader({
  onCreated,
}: {
  onCreated: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-[#0B1F14]/90">
      <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
        {/* LEFT */}
        <div className="flex justify-end lg:hidden">
              <MobileSidebar />
        </div>
        

        <div className="flex items-center gap-5">
          <div className="hidden md:flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-2xl">
            <FileText className="h-10 w-10" />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
              DENR eDATS
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418] dark:text-white">
              Documents Registry
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Track, route, monitor, and manage official documents
              across departments and offices.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge className="rounded-full border border-emerald-200 bg-emerald-100 px-5 py-2 text-emerald-700 hover:bg-emerald-100">
            Live Tracking
          </Badge>

          <Badge className="rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-blue-700 hover:bg-blue-100">
            System Active
          </Badge>

          <div className="rounded-2xl">
            {/* <CreateDocumentDialog onCreated={onCreated}/> */}
            <DocumentDialog mode="create" onSuccess={onCreated}/>
          </div>
        </div>
      </div>
    </header>
  );
}