import {
  FileText,
  Clock3,
  CheckCircle2,
  Archive,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

export function DocumentsStats({
  documents,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[];
}) {
  const total =
    documents.length;

  const pending =
    documents.filter(
      (doc) =>
        doc.currentStatus
          ?.name ===
        'PENDING',
    ).length;

  const approved =
    documents.filter(
      (doc) =>
        doc.currentStatus
          ?.name ===
        'APPROVED',
    ).length;

  const completed =
    documents.filter(
      (doc) =>
        doc.currentStatus
          ?.name ===
        'COMPLETED',
    ).length;

  const stats = [
    {
      label:
        'Total Documents',
      value: total,
      icon: FileText,
    },
    {
      label:
        'Pending',
      value: pending,
      icon: Clock3,
    },
    {
      label:
        'Approved',
      value: approved,
      icon: CheckCircle2,
    },
    {
      label:
        'Completed',
      value: completed,
      icon: Archive,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map(
        (stat) => {
          const Icon =
            stat.icon;

          return (
            <Card
              key={
                stat.label
              }
              className="rounded-3xl border-0 bg-white shadow-sm"
            >
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500">
                    {
                      stat.label
                    }
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    {
                      stat.value
                    }
                  </h2>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          );
        },
      )}
    </section>
  );
}