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
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() =>
            setActiveTab(tab)
          }
          className={cn(
            'rounded-2xl px-5 py-2 text-sm font-semibold transition-all',
            activeTab === tab
              ? 'bg-slate-900 text-white shadow-lg'
              : 'bg-white text-slate-600 hover:bg-slate-100',
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