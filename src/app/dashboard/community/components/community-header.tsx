'use client';

import {
  Globe2,
  MessageCircleMore,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { useCommunityStore } from '@/store/community.store';

export function CommunityHeader() {

  const {
    onlineUsers,
  } = useCommunityStore();

  return (
    <>
      {/* LEFT */}

      <div className="flex items-center gap-5">

        <div className="hidden h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl md:flex">

          <MessageCircleMore className="h-10 w-10" />

        </div>

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
            DENR eDATS
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418] dark:text-white">
            Discussion Hub
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            Connect, collaborate and communicate with
            DENR Caraga personnel in real time.
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex flex-wrap items-center gap-4">

        <Badge className="rounded-full border border-green-200 bg-green-100 px-5 py-2 text-green-700 hover:bg-green-100">

          <Users className="mr-2 h-4 w-4" />

          {onlineUsers.length} Online

        </Badge>

        <Badge className="rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-blue-700 hover:bg-blue-100">

          <Globe2 className="mr-2 h-4 w-4" />

          Regionwide Chat

        </Badge>

      </div>
    </>
  );
}