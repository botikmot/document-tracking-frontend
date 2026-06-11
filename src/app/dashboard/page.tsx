import {
  Archive,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FileSearch,
  FileText,
  Inbox,
  Search,
  Send,
  TrendingUp,
  User2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2]">
      {/* ====================================== */}
      {/* BACKGROUND GLOW */}
      {/* ====================================== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-green-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* ====================================== */}
      {/* TOP NAVBAR */}
      {/* ====================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
              DENR eDATS
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418]">
              Good Morning, Secretary 👋
            </h1>

            <p className="mt-2 text-slate-600">
              Here’s today’s document workflow summary and
              operational overview.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* SEARCH */}
            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search documents..."
                className="h-12 rounded-2xl border-0 bg-white pl-12 shadow-sm focus-visible:ring-2 focus-visible:ring-green-500"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-2xl border-slate-200 bg-white"
              >
                <Bell className="h-5 w-5 text-slate-700" />
              </Button>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                  <User2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#102418]">
                    Secretary
                  </p>

                  <p className="text-xs text-slate-500">
                    DENR Personnel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================== */}
      {/* CONTENT */}
      {/* ====================================== */}
      <div className="relative z-10 space-y-8 p-8">
        
        {/* ====================================== */}
        {/* STATS */}
        {/* ====================================== */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title:
                'Incoming Documents',
              value: '148',
              icon: Inbox,
              color:
                'from-blue-500 to-cyan-500',
              badge:
                '+12% this week',
              badgeStyle:
                'bg-blue-100 text-blue-700',
            },
            {
              title:
                'Outgoing Documents',
              value: '92',
              icon: Send,
              color:
                'from-emerald-500 to-green-500',
              badge:
                '+8% this week',
              badgeStyle:
                'bg-emerald-100 text-emerald-700',
            },
            {
              title:
                'Pending Approval',
              value: '34',
              icon: Clock3,
              color:
                'from-orange-500 to-amber-500',
              badge:
                'Needs Attention',
              badgeStyle:
                'bg-amber-100 text-amber-700',
            },
            {
              title:
                'Archived Files',
              value: '1,284',
              icon: Archive,
              color:
                'from-slate-700 to-slate-900',
              badge:
                'Stored Securely',
              badgeStyle:
                'bg-slate-200 text-slate-700',
            },
          ].map((item, i) => {
            const Icon =
              item.icon;

            return (
              <Card
                key={i}
                className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-green-100/30 transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="relative p-7">
                  {/* GLOW */}
                  <div
                    className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-3xl`}
                  />

                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {item.title}
                      </p>

                      <h2 className="mt-3 text-5xl font-black tracking-tight text-[#102418]">
                        {item.value}
                      </h2>

                      <Badge
                        className={`mt-5 rounded-full px-4 py-1 ${item.badgeStyle}`}
                      >
                        <TrendingUp className="mr-1 h-4 w-4" />

                        {item.badge}
                      </Badge>
                    </div>

                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-white shadow-xl`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* ====================================== */}
        {/* MAIN GRID */}
        {/* ====================================== */}
        <section className="grid gap-8 xl:grid-cols-3">
          {/* ====================================== */}
          {/* RECENT ACTIVITY */}
          {/* ====================================== */}
          <Card className="rounded-[32px] border-0 bg-white shadow-xl shadow-green-100/30 xl:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-black text-[#102418]">
                  Recent Activity
                </CardTitle>

                <Button
                  variant="ghost"
                  className="rounded-2xl text-green-700 hover:bg-green-50"
                >
                  View All
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {[
                {
                  title:
                    'Budget Proposal 2026',
                  tracking:
                    'EDATS-2026-00124',
                  status:
                    'Under Review',
                  color:
                    'bg-blue-100 text-blue-700',
                },
                {
                  title:
                    'HR Employment Records',
                  tracking:
                    'EDATS-2026-00125',
                  status:
                    'Approved',
                  color:
                    'bg-emerald-100 text-emerald-700',
                },
                {
                  title:
                    'Procurement Request',
                  tracking:
                    'EDATS-2026-00126',
                  status:
                    'Pending',
                  color:
                    'bg-amber-100 text-amber-700',
                },
                {
                  title:
                    'Infrastructure Report',
                  tracking:
                    'EDATS-2026-00127',
                  status:
                    'Archived',
                  color:
                    'bg-slate-200 text-slate-700',
                },
              ].map((doc, i) => (
                <div
                  key={i}
                  className="group flex flex-col gap-5 rounded-3xl border border-slate-100 bg-slate-50/70 p-5 transition-all duration-300 hover:border-green-200 hover:bg-white md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg">
                      <FileText className="h-8 w-8" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#102418]">
                        {doc.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Tracking No:
                        {' '}
                        {doc.tracking}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`rounded-full px-5 py-2 ${doc.color}`}
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ====================================== */}
          {/* PERFORMANCE */}
          {/* ====================================== */}
          <Card className="overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-[#07150d] via-[#0b1f14] to-[#102418] text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-black">
                Office Performance
              </CardTitle>

              <p className="text-green-100/70">
                Monthly operational metrics overview
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {[
                {
                  label:
                    'Processing Efficiency',
                  value: 87,
                },
                {
                  label:
                    'Approval Completion',
                  value: 73,
                },
                {
                  label:
                    'Archived Records',
                  value: 94,
                },
              ].map((item, i) => (
                <div key={i}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-green-50">
                      {item.label}
                    </span>

                    <span className="text-sm font-black text-white">
                      {item.value}%
                    </span>
                  </div>

                  <Progress
                    value={
                      item.value
                    }
                    className="h-3 bg-white/10"
                  />
                </div>
              ))}

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/20">
                    <CheckCircle2 className="h-7 w-7 text-emerald-300" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">
                      Excellent Performance
                    </h4>

                    <p className="mt-3 text-sm leading-7 text-green-100/70">
                      Your office processed documents faster than
                      82% of departments this month.
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