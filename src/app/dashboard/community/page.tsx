'use client';

import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { CommunityHeader } from './components/community-header';
//import { CommunityStats } from './components/community-stats';
import { CommunitySidebar } from './components/community-sidebar';
import { CommunityChat } from './components/community-chat';
import { useCommunityStore } from '@/store/community.store';
import { useEffect } from 'react';

export default function CommunityPage() {

    const fetchCommunities =
        useCommunityStore(
            (state) => state.fetchCommunities,
        );

    const fetchChatUsers =
        useCommunityStore(
            (state) => state.fetchChatUsers,
        );

  useEffect(() => {
    fetchCommunities();
    fetchChatUsers();
  }, [fetchCommunities, fetchChatUsers]);

  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2] transition-colors dark:bg-[#07150D]">
      {/* ================================= */}
      {/* BACKGROUND */}
      {/* ================================= */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl" />

      </div>

      <div className="relative z-10">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0B1F14]/90">

          <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex justify-end lg:hidden">
              <MobileSidebar />
            </div>

            <CommunityHeader />

          </div>

        </header>

        {/* ================================= */}
        {/* STATS */}
        {/* ================================= */}

        {/* <div className="p-8">

          <CommunityStats />

        </div> */}

        {/* ================================= */}
        {/* CHAT LAYOUT */}
        {/* ================================= */}

        <div className="px-8 py-8">

          <div className="grid grid-cols-12 gap-6">

            {/* Sidebar */}

            <div className="col-span-12 lg:col-span-4 xl:col-span-3">

              <CommunitySidebar />

            </div>

            {/* Chat */}

            <div className="col-span-12 lg:col-span-8 xl:col-span-9">

              <CommunityChat />

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}