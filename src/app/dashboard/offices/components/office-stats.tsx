import {
  Building2,
  Network,
  Layers3,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

export function OfficeStats({
  offices,
  organizationUnits,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      <Card className="rounded-3xl border-0 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-slate-500">
              Total Offices
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {
                offices.length
              }
            </h2>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-slate-500">
              Organizations
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {
                organizationUnits.length
              }
            </h2>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
            <Network className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-slate-500">
              Hierarchy Levels
            </p>

            <h2 className="mt-2 text-4xl font-black">
              5
            </h2>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <Layers3 className="h-8 w-8 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}