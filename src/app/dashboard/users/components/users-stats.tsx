import {
  Building2,
  Shield,
  Users,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

export function UsersStats({
  users,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const activeUsers =
    users.filter(
      (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: any,
      ) =>
        user.status ===
        'ACTIVE',
    ).length;

  return (
    <section className="grid gap-6 md:grid-cols-3">
      <Card className="rounded-3xl border-0 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-slate-500">
              Total Users
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {users.length}
            </h2>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-slate-500">
              Active Users
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {activeUsers}
            </h2>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <Shield className="h-8 w-8 text-emerald-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-slate-500">
              Offices Assigned
            </p>

            <h2 className="mt-2 text-4xl font-black">
              18
            </h2>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
            <Building2 className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}