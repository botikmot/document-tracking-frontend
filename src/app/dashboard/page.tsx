import {
  FileText,
  Inbox,
  Send,
  Clock3,
  Archive,
  CheckCircle2,
  TrendingUp,
  Activity,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Progress,
} from '@/components/ui/progress';

export default function DashboardPage() {
  return (
      <main className="flex-1 overflow-hidden">
        {/* TOP HEADER */}
        <div className="border-b bg-white">
          <div className="flex flex-col gap-4 px-8 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor and manage document transactions in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="rounded-full bg-emerald-100 px-4 py-1 text-emerald-700 hover:bg-emerald-100">
                System Online
              </Badge>

              <Badge className="rounded-full bg-blue-100 px-4 py-1 text-blue-700 hover:bg-blue-100">
                Live Tracking Enabled
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-8">
          {/* STATS */}
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500">
                    Incoming Documents
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    148
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    +12% this week
                  </div>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Inbox className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500">
                    Outgoing Documents
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    92
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    +8% this week
                  </div>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                  <Send className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500">
                    Pending Approval
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    34
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                    <Clock3 className="h-4 w-4" />
                    Needs attention
                  </div>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                  <Clock3 className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500">
                    Archived Files
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    1,284
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <Archive className="h-4 w-4" />
                    Stored securely
                  </div>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200">
                  <Archive className="h-8 w-8 text-slate-700" />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECOND ROW */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* TRACKING OVERVIEW */}
            <Card className="rounded-3xl border-0 bg-white shadow-sm xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Recent Document Activity
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                {[
                  {
                    title:
                      'Budget Proposal 2026',
                    tracking:
                      'DOC-2026-00124',
                    status:
                      'Under Review',
                    color:
                      'bg-blue-100 text-blue-700',
                  },
                  {
                    title:
                      'HR Employment Records',
                    tracking:
                      'DOC-2026-00125',
                    status:
                      'Approved',
                    color:
                      'bg-emerald-100 text-emerald-700',
                  },
                  {
                    title:
                      'Procurement Request',
                    tracking:
                      'DOC-2026-00126',
                    status:
                      'Pending',
                    color:
                      'bg-amber-100 text-amber-700',
                  },
                  {
                    title:
                      'Infrastructure Report',
                    tracking:
                      'DOC-2026-00127',
                    status:
                      'Archived',
                    color:
                      'bg-slate-200 text-slate-700',
                  },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-5 transition hover:border-blue-200 hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <FileText className="h-6 w-6 text-slate-700" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {doc.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Tracking No: {doc.tracking}
                        </p>
                      </div>
                    </div>

                    <Badge
                      className={`rounded-full px-4 py-1 ${doc.color}`}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* PERFORMANCE */}
            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Office Performance
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Processing Efficiency
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      87%
                    </span>
                  </div>

                  <Progress value={87} />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Approval Completion
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      73%
                    </span>
                  </div>

                  <Progress value={73} />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Archived Records
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      94%
                    </span>
                  </div>

                  <Progress value={94} />
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Excellent Performance
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Your office processed documents faster than 82%
                        of departments this month.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
  );
}