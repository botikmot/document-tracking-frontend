'use client';

import { cn } from '@/lib/utils';

const tabs = [
  'ALL',
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
];

export function DocumentsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;

  setActiveTab: (
    value: string,
  ) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 rounded-[30px] border border-white/60 bg-white/70 p-3 shadow-lg backdrop-blur-xl">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() =>
            setActiveTab(tab)
          }
          className={cn(
            'rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-300',
            activeTab === tab
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl'
              : 'text-slate-600 hover:bg-slate-100',
          )}
        >
          {tab.replaceAll(
            '_',
            ' ',
          )}
        </button>
      ))}
    </div>
  );
}