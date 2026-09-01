'use client';

import {
  FileText,
  FolderOpen,
  Globe2,
  Layers3,
  ShieldCheck,
  Stamp,
} from 'lucide-react';

import type {
  TransactionQuickFilter,
} from '@/types/transaction';

type TransactionsFilterProps = {
  value: TransactionQuickFilter;

  onChange: (
    value: TransactionQuickFilter,
  ) => void;
};

const filters: {
  value: TransactionQuickFilter;
  label: string;
  icon: typeof Layers3;
}[] = [
  {
    value: 'ALL',
    label: 'All',
    icon: Layers3,
  },
  {
    value: 'INTERNAL',
    label: 'Internal',
    icon: ShieldCheck,
  },
  {
    value: 'EXTERNAL',
    label: 'External',
    icon: Globe2,
  },
  {
    value: 'PERMIT',
    label: 'Permits',
    icon: Stamp,
  },
  {
    value: 'SURVEY_RETURN',
    label: 'Survey Returns',
    icon: FolderOpen,
  },
  {
    value: 'GENERAL',
    label: 'General',
    icon: FileText,
  },
];

export function TransactionsFilter({
  value,
  onChange,
}: TransactionsFilterProps) {
  return (
    <div
      className="
        flex
        flex-wrap
        gap-2
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-2
        mb-2
        shadow-sm
        dark:border-[#214234]
        dark:bg-[#102418]
      "
    >
      {filters.map(
        (filter) => {
          const Icon =
            filter.icon;

          const active =
            filter.value ===
            value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                onChange(
                  filter.value,
                )
              }
              className={`
                flex
                cursor-pointer
                items-center
                gap-2
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition-all

                ${
                  active
                    ? `
                      bg-[#102418]
                      text-white
                      shadow-sm
                      dark:bg-emerald-600
                    `
                    : `
                      text-slate-600
                      hover:bg-emerald-50
                      hover:text-emerald-700
                      dark:text-[#A9C5B6]
                      dark:hover:bg-[#173227]
                      dark:hover:text-emerald-300
                    `
                }
              `}
            >
              <Icon className="h-4 w-4" />

              {filter.label}
            </button>
          );
        },
      )}
    </div>
  );
}