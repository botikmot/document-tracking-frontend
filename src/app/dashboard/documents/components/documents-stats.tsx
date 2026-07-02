
import {
  Archive,
  CheckCircle2,
  Clock3,
  FileText,
  TrendingUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

export function DocumentsStats({
  stats,
}: {
  stats: {
    total: number;
    pending: number;
    approved: number;
    archived: number;
  };
}) {
  
  const statsData = [
    {
      label:
        'Total Documents',
      value: stats?.total,
      icon: FileText,
      color:
        'from-blue-500 to-cyan-500',
      badge:
        '+12% this month',
      badgeStyle:
        'bg-blue-100 text-blue-700',
    },
    {
      label:
        'Pending',
      value: stats?.pending,
      icon: Clock3,
      color:
        'from-amber-500 to-orange-500',
      badge:
        'Needs attention',
      badgeStyle:
        'bg-amber-100 text-amber-700',
    },
    {
      label:
        'Approved',
      value: stats?.approved,
      icon: CheckCircle2,
      color:
        'from-emerald-500 to-green-500',
      badge:
        'Workflow stable',
      badgeStyle:
        'bg-emerald-100 text-emerald-700',
    },
    {
      label:
        'Completed',
      value: stats?.archived,
      icon: Archive,
      color:
        'from-slate-700 to-slate-900',
      badge:
        'Archived securely',
      badgeStyle:
        'bg-slate-200 text-slate-700',
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {statsData.map(
        (stat) => {
          const Icon =
            stat.icon;

          return (
            <Card
              key={
                stat.label
              }
              className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-xl shadow-green-100/30 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="relative p-7">
                <div
                  className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-3xl`}
                />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {
                        stat.label
                      }
                    </p>

                    <h2 className="mt-3 text-5xl font-black tracking-tight text-[#102418] dark:text-white">
                      {
                        stat.value
                      }
                    </h2>

                    <Badge
                      className={`mt-5 rounded-full px-4 py-1 ${stat.badgeStyle}`}
                    >
                      <TrendingUp className="mr-1 h-4 w-4" />

                      {
                        stat.badge
                      }
                    </Badge>
                  </div>

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${stat.color} text-white shadow-xl`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        },
      )}
    </section>
  );
}