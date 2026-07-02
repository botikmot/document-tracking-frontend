'use client';

import {
  BarChart3,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

export function ReportHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-[#0B1F14]/90">
      <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
        {/* LEFT */}
        <div className="flex justify-end lg:hidden">
              <MobileSidebar />
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-2xl">
            <BarChart3 className="h-10 w-10" />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-700">
              DENR eDATS
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418] dark:text-white">
              Reports & Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
              Generate monthly, quarterly and annual reports.
              Analyze workflow performance, office productivity,
              processing efficiency and document trends.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge className="rounded-full border border-indigo-200 bg-indigo-100 px-5 py-2 text-indigo-700 hover:bg-indigo-100">
            <Sparkles className="mr-2 h-4 w-4" />
            Executive Analytics
          </Badge>

          <Badge className="rounded-full border border-emerald-200 bg-emerald-100 px-5 py-2 text-emerald-700 hover:bg-emerald-100">
            <CalendarDays className="mr-2 h-4 w-4" />
            Real-time Reporting
          </Badge>
        </div>
      </div>
    </header>
  );
}