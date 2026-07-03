'use client';

import {
  useEffect,
  useRef,
} from 'react';

import {
  Hash,
  Users,
  Wifi,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { CommunityInput } from './community-input';
import { CommunityMessage } from './community-message';

import { useAuthStore } from '@/store/auth.store';
import { useCommunityStore } from '@/store/community.store';

export function CommunityChat() {
  const bottomRef =
    useRef<HTMLDivElement>(null);

  const viewportRef =
    useRef<HTMLDivElement>(null);

  const previousHeight =
    useRef(0);

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const {
    selectedCommunity,
    messages,
    onlineUsers,
    loadOlderMessages,
    loadingMessages,
  } = useCommunityStore();

  
  /**
   * ---------------------------------------
   * Auto scroll when new message arrives
   * ---------------------------------------
   */

  const shouldScrollToBottom =
  useCommunityStore(
    (s) => s.shouldScrollToBottom,
  );

const resetScrollFlag =
  useCommunityStore(
    (s) => s.resetScrollFlag,
  );

useEffect(() => {
  if (!shouldScrollToBottom) {
    return;
  }

  requestAnimationFrame(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });

    resetScrollFlag();
  });
}, [
  shouldScrollToBottom,
  resetScrollFlag,
]);

  /**
   * ---------------------------------------
   * Infinite scroll
   * ---------------------------------------
   */

  useEffect(() => {
    async function handleScroll() {
      const viewport = viewportRef.current;

      if (
        !viewport ||
        viewport.scrollTop > 50 ||
        !selectedCommunity ||
        loadingMessages
      ) {
        return;
      }

      previousHeight.current =
        viewport.scrollHeight;

      await loadOlderMessages(
        selectedCommunity.id,
      );

      requestAnimationFrame(() => {
        const viewport = viewportRef.current;

        if (!viewport) return;

        const newHeight =
          viewport.scrollHeight;

        viewport.scrollTop =
          newHeight -
          previousHeight.current;
      });
    }

    const viewport = viewportRef.current;

    if (!viewport) return;

    viewport.addEventListener(
      'scroll',
      handleScroll,
    );

    return () => {
      viewport.removeEventListener(
        'scroll',
        handleScroll,
      );
    };
  }, [
    selectedCommunity,
    loadOlderMessages,
    loadingMessages,
  ]);

  return (
    <Card className="flex h-[calc(100vh-240px)] flex-col overflow-hidden rounded-[32px] border-0 bg-white shadow-xl dark:bg-[#102418]">

      {/* Header */}

      <div className="border-b border-slate-200 px-8 py-6 dark:border-slate-800">

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-3">

              <Hash className="h-6 w-6 text-green-600" />

              <h2 className="text-2xl font-black text-[#102418] dark:text-white">
                {selectedCommunity?.name}
              </h2>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              {selectedCommunity?.description}
            </p>

          </div>

          <div className="flex gap-3">

            <div className="rounded-2xl bg-green-100 px-4 py-3 text-green-700">

              <div className="flex items-center gap-2">

                <Users className="h-4 w-4" />

                <span className="font-semibold">
                  {selectedCommunity?._count?.members ?? 0} Members
                </span>

              </div>

            </div>

            <div className="rounded-2xl bg-blue-100 px-4 py-3 text-blue-700">

              <div className="flex items-center gap-2">

                <Wifi className="h-4 w-4" />

                <span className="font-semibold">
                  {onlineUsers.length} Online
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Messages */}

      <ScrollArea
        className="flex-1 bg-[#F8FAF7] dark:bg-[#0B1F14]"
        viewportRef={viewportRef}
      >
        <div className="px-8 py-6">

          <div className="mb-8 flex justify-center">

            <div className="rounded-full bg-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              Today
            </div>

          </div>

          <div className="space-y-5">

            {messages.map((message) => (
              <CommunityMessage
                key={message.id}
                message={message}
                currentUserId={user?.userId}
              />
            ))}

            <div ref={bottomRef} />

          </div>

        </div>

      </ScrollArea>

      <CommunityInput />

    </Card>
  );
}