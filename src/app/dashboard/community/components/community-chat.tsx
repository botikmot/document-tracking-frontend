'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Hash,
  Users,
  Wifi,
  //UserCircle,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { CommunityInput } from './community-input';
import { CommunityMessage } from './community-message';

import { useAuthStore } from '@/store/auth.store';
import { useCommunityStore } from '@/store/community.store';
import { CommunityMenu } from './community-menu';
import { ManageMembersDialog } from './manage-members-dialog';
import { EditChannelDialog } from './edit-channel-dialog';
import { DeleteChannelDialog } from './delete-channel-dialog';

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

  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  
  const otherMember =
    selectedCommunity?.members
      ?.find(
        m => m.userId !== user?.userId
      );

  const isDirect =
    selectedCommunity?.type ===
    'DIRECT';

  const myMember = selectedCommunity?.members.find(
    (m) => m.userId === user?.userId,
  );

  const isOwner = myMember?.role === 'OWNER';

  //console.log('selectedCommunity::',selectedCommunity)

  const onlineUserIds = new Set(
      onlineUsers.map((u) => u.userId),
    );

  const isOnline = otherMember ? onlineUserIds.has(otherMember.userId) : false;

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
    <Card className="flex h-[calc(100vh-240px)] gap-0 flex-col overflow-hidden rounded-[32px] border-0 bg-white shadow-xl dark:bg-[#102418]">

      {/* Header */}

      <div className="border-b border-slate-200 px-8 py-6 dark:border-slate-800">

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-3">

              {
                isDirect ?
                <>
                  {otherMember?.user.profileImageUrl ? (
                    <img
                      src={otherMember?.user.profileImageUrl}
                      className="h-10 w-10 rounded-full object-cover"
                      alt={otherMember?.user.firstName}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center uppercase justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-bold text-white">
                      {otherMember?.user.firstName[0]}
                      {otherMember?.user.lastName[0]}
                    </div>
                  )}
                </>
                :
                <Hash className="h-6 w-6 text-green-600"/>
              }

              <h2 className="text-2xl capitalize font-black text-[#102418] dark:text-white">
                {
                  isDirect
                  ?
                  `${otherMember?.user.firstName}
                  ${otherMember?.user.lastName}`
                  :
                  selectedCommunity?.name
                }
              </h2>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              {
                isDirect
                ?
                otherMember?.user?.offices?.[0]?.office?.officeName

                ??
                "DENR Caraga"
                :
                selectedCommunity?.description
              }
            </p>

          </div>

          <div className="flex gap-3">    
                  {
                    !isDirect && (
                    <>
                      <div className="rounded-2xl bg-green-100 px-4 py-3 text-green-700">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="font-semibold">
                              {selectedCommunity?._count?.members ?? 0} Members
                            </span>
                        </div>
                      </div>
                      </>
                    )
                  }
                
                  {
                    !isDirect && (
                    <>
                      <div className="rounded-2xl bg-blue-100 px-4 py-3 text-blue-700">
                        <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4" />
                            <span className="font-semibold">
                            {onlineUsers.length} Online
                            </span>
                        </div>
                      </div>

                      {isOwner && selectedCommunity && (
                        <CommunityMenu
                          isGeneral={selectedCommunity?.isGeneral}
                          onEdit={() => setEditOpen(true)}
                          onMembers={() => setMembersOpen(true)}
                          onDelete={() => setDeleteOpen(true)}
                        />
                      )}

                    </>
                    )
                  }

                  {
                    isDirect && (
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isOnline
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600 dark:bg-[#163122] dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              isOnline
                                ? 'bg-green-500'
                                : 'bg-slate-400'
                            }`}
                          />

                          <span>
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    )
                  }

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

      <ManageMembersDialog
        open={membersOpen}
        onOpenChange={setMembersOpen}
      />

      <EditChannelDialog open={editOpen} onOpenChange={setEditOpen} />

      <DeleteChannelDialog open={deleteOpen} onOpenChange={setDeleteOpen} />

    </Card>
  );
}