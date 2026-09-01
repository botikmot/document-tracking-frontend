import {
  Activity,
  CircleCheckBig,
  Clock3,
  FileText,
  FolderOpen,
  Globe2,
  ShieldCheck,
  Stamp,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import type {
  TransactionRegionalSummary,
} from '@/types/transaction';

type TransactionsSummaryProps = {
  summary:
    TransactionRegionalSummary;
};

export function TransactionsSummary({
  summary,
}: TransactionsSummaryProps) {
  const cards = [
    {
      label:
        'Total Transactions',

      value:
        summary.totalDocuments,

      description:
        'Unique Regional transactions',

      icon:
        FileText,

      iconClass:
        `
          bg-slate-100
          text-slate-700
          dark:bg-[#173227]
          dark:text-[#F3F8F3]
        `,
    },

    {
      label:
        'Internal',

      value:
        summary.internal,

      description:
        'DENR-originated documents',

      icon:
        ShieldCheck,

      iconClass:
        `
          bg-blue-100
          text-blue-700
          dark:bg-blue-950/40
          dark:text-blue-300
        `,
    },

    {
      label:
        'External',

      value:
        summary.external,

      description:
        'External transactions',

      icon:
        Globe2,

      iconClass:
        `
          bg-violet-100
          text-violet-700
          dark:bg-violet-950/40
          dark:text-violet-300
        `,
    },

    {
      label:
        'Permits',

      value:
        summary.permits,

      description:
        'Permit transactions',

      icon:
        Stamp,

      iconClass:
        `
          bg-amber-100
          text-amber-700
          dark:bg-amber-950/40
          dark:text-amber-300
        `,
    },

    {
      label:
        'Survey Returns',

      value:
        summary.surveyReturns,

      description:
        'Survey return transactions',

      icon:
        FolderOpen,

      iconClass:
        `
          bg-cyan-100
          text-cyan-700
          dark:bg-cyan-950/40
          dark:text-cyan-300
        `,
    },

    {
      label:
        'Active',

      value:
        summary.active,

      description:
        'Currently active documents',

      icon:
        Activity,

      iconClass:
        `
          bg-sky-100
          text-sky-700
          dark:bg-sky-950/40
          dark:text-sky-300
        `,
    },

    {
      label:
        'Overdue',

      value:
        summary.overdue,

      description:
        'Past due and still active',

      icon:
        Clock3,

      iconClass:
        `
          bg-red-100
          text-red-700
          dark:bg-red-950/40
          dark:text-red-300
        `,
    },

    {
      label:
        'Completed',

      value:
        summary.completed,

      description:
        'Completed transactions',

      icon:
        CircleCheckBig,

      iconClass:
        `
          bg-emerald-100
          text-emerald-700
          dark:bg-emerald-950/40
          dark:text-emerald-300
        `,
    },
  ];

  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-4
        2xl:grid-cols-8
      "
    >
      {cards.map(
        (card) => {
          const Icon =
            card.icon;

          return (
            <Card
              key={
                card.label
              }
              className="
                rounded-3xl
                border-slate-200
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
                dark:border-[#214234]
                dark:bg-[#102418]
              "
            >
              <CardContent className="p-5">
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    ${card.iconClass}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div
                  className="
                    mt-5
                    text-3xl
                    font-black
                    text-[#102418]
                    dark:text-[#F3F8F3]
                  "
                >
                  {card.value}
                </div>

                <p
                  className="
                    mt-1
                    text-sm
                    font-bold
                    text-slate-700
                    dark:text-[#F3F8F3]
                  "
                >
                  {card.label}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500
                    dark:text-[#A9C5B6]
                  "
                >
                  {
                    card.description
                  }
                </p>
              </CardContent>
            </Card>
          );
        },
      )}
    </div>
  );
}