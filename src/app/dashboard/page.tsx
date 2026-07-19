'use client';

import {
  Archive,
  CheckCircle2,
  Clock3,
  FileText,
  Inbox,
  Search,
  Send,
  TrendingUp,
  User2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
//import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/auth.store';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [stats, setStats] = useState({
    incomingDocuments: 0,
    outgoingDocuments: 0,
    pendingDocuments: 0,
    archivedDocuments: 0,
    incomingPercentage: 0,
    outgoingPercentage: 0,
    recentActivities: [],

    performance: {
      processingEfficiency: 0,
      approvalCompletion: 0,
      archivedRecords: 0,
    },
  });

  const user = useAuthStore((state) => state.user);

  console.log('auth:', user)

  const fetchDashboardStats =
    async () => {
      try {
        const response = await api.get(
          '/documents/dashboard/stats',
        );
        console.log('dashboard stats:', response.data)
        setStats(response.data);
      } catch (error) {
        console.error(
          'Failed to fetch dashboard stats',
          error,
        );
      }
    };

  useEffect(() => {
      const load =
        async () => {
          await fetchDashboardStats();
        };
  
      void load();
    }, []);

  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(`/documents/search?q=${encodeURIComponent(query)}`);
        console.log('search results:', res)
        setResults(res.data);
        setOpen(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);


  const getStatusColor = (
    status: string,
  ) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-700';

      case 'PENDING':
        return 'bg-amber-100 text-amber-700';

      case 'IN_REVIEW':
        return 'bg-blue-100 text-blue-700';

      case 'COMPLETED':
        return 'bg-slate-200 text-slate-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPerformanceData = (
      efficiency: number,
    ) => {
      if (efficiency >= 90) {
        return {
          title: 'Outstanding Performance',
          message:
            'Your office is operating at exceptional efficiency this month.',
          iconBg:
            'bg-emerald-500/20',
          iconColor:
            'text-emerald-300',
        };
      }

      if (efficiency >= 75) {
        return {
          title: 'Excellent Performance',
          message:
            'Your office achieved strong processing efficiency this month.',
          iconBg:
            'bg-green-500/20',
          iconColor:
            'text-green-300',
        };
      }

      if (efficiency >= 50) {
        return {
          title: 'Good Performance',
          message:
            'Your office is maintaining stable document processing performance.',
          iconBg:
            'bg-amber-500/20',
          iconColor:
            'text-amber-300',
        };
      }

      return {
        title:
          'Performance Needs Improvement',
        message:
          'Document processing efficiency is below target this month.',
        iconBg:
          'bg-red-500/20',
        iconColor:
          'text-red-300',
      };
    };

  const performanceData =
    getPerformanceData(
      stats.performance
        .processingEfficiency,
    );

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    }

    if (hour < 18) {
      return 'Good Afternoon';
    }

    return 'Good Evening';
  };


  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2] transition-colors dark:bg-[#07150D]">
      {/* ====================================== */}
      {/* BACKGROUND GLOW */}
      {/* ====================================== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-green-500/5 blur-3xl dark:bg-green-400/10" />

        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-400/10" />
      </div>

      {/* ====================================== */}
      {/* TOP NAVBAR */}
      {/* ====================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-[#0B1F14]/90">
        <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}

          <div className="flex justify-end lg:hidden">
              <MobileSidebar />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
              DENR eDATS
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418] dark:text-white">
              {getGreeting()}, {user?.firstName ?? 'Employee'}
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 rounded-2xl border-0 bg-white pl-12 shadow-sm focus-visible:ring-2 focus-visible:ring-green-500 dark:bg-[#07150D] dark:text-white dark:placeholder:text-slate-400"
              />

              {open && results.length > 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border overflow-hidden dark:bg-[#07150D]">
                  {results.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        router.push(
                          `/track?tracking=${encodeURIComponent(doc.trackingNumber)}`
                        );
                        setOpen(false);
                        setQuery('');
                      }}
                      className="cursor-pointer px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-xs text-slate-500">
                        {doc.trackingNumber}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <NotificationBell />

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-700 dark:bg-[#07150D]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                  <User2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold capitalize text-[#102418] dark:text-white">
                    {user?.offices[0]?.officeName ?? 'Secretary'}
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
              value: stats.incomingDocuments,
              icon: Inbox,
              color:
                'from-blue-500 to-cyan-500',
              badge: `${
                  stats.incomingPercentage >= 0
                    ? '+'
                    : ''
                }${stats.incomingPercentage}% this week`,
              badgeStyle:
                'bg-blue-100 text-blue-700',
            },
            {
              title:
                'Outgoing Documents',
              value: stats.outgoingDocuments,
              icon: Send,
              color:
                'from-emerald-500 to-green-500',
              badge: `${
                stats.outgoingPercentage >= 0
                  ? '+'
                  : ''
              }${stats.outgoingPercentage}% this week`,
              badgeStyle:
                'bg-emerald-100 text-emerald-700',
            },
            {
              title:
                'Pending Documents',
              value: stats.pendingDocuments,
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
                'Archived',
              value: stats.archivedDocuments,
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
                className="overflow-hidden rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-xl shadow-green-100/30 transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="relative p-7">
                  {/* GLOW */}
                  <div
                    className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-3xl`}
                  />

                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {item.title}
                      </p>

                      <h2 className="mt-3 text-5xl font-black tracking-tight text-[#102418] dark:text-white">
                        {item.value.toLocaleString()}
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
          <Card className="rounded-[32px] border-0 bg-white dark:bg-[#102418] shadow-xl shadow-green-100/30 xl:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-black text-[#102418] dark:text-[#F3F8F3]">
                  Recent Activity
                </CardTitle>

                {/* <Button
                  variant="ghost"
                  className="rounded-2xl text-green-700 hover:bg-green-50"
                >
                  View All
                </Button> */}
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
            {stats.recentActivities.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (doc: any, i: number) => {
                return (
                  <div
                    key={i}
                    className="group flex flex-col gap-5 rounded-3xl border border-slate-100 bg-slate-50/70 transition-colors dark:border-[#214234] dark:bg-[#173227] p-5 transition-all duration-300 hover:border-green-200 hover:bg-white dark:hover:bg-slate-800 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg">
                        <FileText className="h-8 w-8" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#102418] dark:text-[#F3F8F3]">
                          {doc.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                          Tracking No:{' '}
                          {doc.trackingNumber}
                        </p>
                      </div>
                    </div>

                    <Badge
                      className={`rounded-full px-5 py-2 ${getStatusColor(
                        doc.status,
                      )}`}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                );
              },
            )}
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
                Overall operational metrics overview
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {[
                {
                  label:
                    'Processing Efficiency',
                  value:
                    stats.performance
                      .processingEfficiency,
                },

                /* {
                  label:
                    'Approval Completion',
                  value:
                    stats.performance
                      .approvalCompletion,
                }, */

                {
                  label:
                    'Archived Records',
                  value:
                    stats.performance
                      .archivedRecords,
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
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-3xl ${performanceData.iconBg}`}
                  >
                    <CheckCircle2
                      className={`h-7 w-7 ${performanceData.iconColor}`}
                    />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {performanceData.title}
                    </h4>

                    <p className="mt-3 text-sm leading-7 text-green-100/70">
                      {performanceData.message}

                      <span className="ml-1 font-bold text-white">
                        (
                        {
                          stats.performance
                            .processingEfficiency
                        }
                        % efficiency)
                      </span>
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