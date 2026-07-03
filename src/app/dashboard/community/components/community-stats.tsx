'use client';

import {
  Activity,
  MessageSquare,
  Users,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { useCommunityStore } from '@/store/community.store';

export function CommunityStats() {

  const {
    onlineUsers,
    communities,
  } = useCommunityStore();

  return (
    <div className="grid gap-6 md:grid-cols-3">

      {/* ====================================== */}
      {/* ONLINE USERS */}
      {/* ====================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-green-100/30 dark:bg-[#102418]">

        <CardContent className="relative p-7">

          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Online Personnel
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {onlineUsers.length}
              </h2>

              <Badge className="mt-5 rounded-full bg-green-100 px-4 py-1 text-green-700 hover:bg-green-100">
                Currently Active
              </Badge>

              <p className="mt-3 text-xs text-slate-400">
                Personnel currently connected to the community.
              </p>

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl">

              <Users className="h-8 w-8" />

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ====================================== */}
      {/* COMMUNITIES */}
      {/* ====================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl shadow-blue-100/30 dark:bg-[#102418]">

        <CardContent className="relative p-7">

          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Channels
              </p>

              <h2 className="mt-3 text-5xl font-black text-[#102418] dark:text-white">
                {communities.length}
              </h2>

              <Badge className="mt-5 rounded-full bg-blue-100 px-4 py-1 text-blue-700 hover:bg-blue-100">
                Public & Private
              </Badge>

              <p className="mt-3 text-xs text-slate-400">
                Official and user-created discussion groups.
              </p>

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-xl">

              <MessageSquare className="h-8 w-8" />

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ====================================== */}
      {/* STATUS */}
      {/* ====================================== */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-[#07150d] via-[#0b1f14] to-[#102418] text-white shadow-2xl">

        <CardContent className="p-7">

          <h3 className="text-2xl font-black">

            Community Status

          </h3>

          <p className="mt-2 text-sm leading-7 text-green-100/70">

            Real-time communication services are operating
            normally across all DENR Caraga offices.

          </p>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-green-100">

            <Activity className="h-5 w-5" />

            Live Collaboration Enabled

          </div>

        </CardContent>

      </Card>

    </div>
  );
}