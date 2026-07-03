'use client';

import { useState } from 'react';

import {
  Hash,
  Plus,
  Search,
  Users,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCommunityStore } from '@/store/community.store';
import { useAuthStore } from '@/store/auth.store';

export function CommunitySidebar() {
  const [search, setSearch] = useState('');

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const {
      communities,
      onlineUsers,
      selectedCommunity,
      selectCommunity,
      startDirectConversation,
    } = useCommunityStore();

  
  return (
    <div className="space-y-6">

      {/* ===================================== */}
      {/* COMMUNITIES */}
      {/* ===================================== */}

      <Card className="rounded-[32px] border-0 bg-white shadow-xl dark:bg-[#102418]">

        <div className="p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-black text-[#102418] dark:text-white">
                Channels
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Join conversations
              </p>

            </div>

            <Badge>
              {communities.length}
            </Badge>

          </div>

          <div className="relative mt-6">

            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />

            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-2xl pl-11"
            />

          </div>

          <div className="mt-6 space-y-2">

            {communities
              .filter((community) =>
                community.name
                  .toLowerCase()
                  .includes(
                    search.toLowerCase(),
                  ),
              )
              .map((community) => (
                <button
                  key={community.id}
                  onClick={() => selectCommunity(community)}
                  className={`w-full rounded-2xl p-4 text-left transition-all cursor-pointer

                  ${
                    selectedCommunity?.id === community.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'hover:bg-slate-100 dark:hover:bg-[#163122]'
                  }`}
                >
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Hash className="h-5 w-5" />

                      <div>

                        <p className="font-semibold">
                          {community.name}
                        </p>

                        <p
                          className={`text-xs ${
                            selectedCommunity?.id === community.id
                              ? 'text-green-100'
                              : 'text-slate-500'
                          }`}
                        >
                          {community._count?.members} members
                        </p>

                      </div>

                    </div>

                    {selectedCommunity?.id === community.id && (
                      <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                    )}

                  </div>
                </button>
              ))}

          </div>

          <Button
            className="mt-6 h-12 w-full rounded-2xl"
          >
            <Plus className="mr-2 h-5 w-5" />

            Create Channel

          </Button>

        </div>

      </Card>

      {/* ===================================== */}
      {/* ONLINE USERS */}
      {/* ===================================== */}

      <Card className="rounded-[32px] border-0 bg-white shadow-xl dark:bg-[#102418]">

        <div className="p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-black text-[#102418] dark:text-white">
                Direct Messages
              </h2>

              <p className="text-sm text-slate-500">
                Start a conversation
              </p>

            </div>

            <Users className="text-green-600" />

          </div>

          <div className="mt-6 space-y-3">

            {onlineUsers.filter(
                (u) =>
                  u.userId !== user?.userId,
              )
            .map((user) => (
              <button
                key={user.userId}
                onClick={() =>
                  startDirectConversation(
                    user.userId,
                  )
                }
                className="flex items-center w-full cursor-pointer justify-between rounded-2xl p-3 transition hover:bg-slate-100 dark:hover:bg-[#163122]"
              >
                <div className="flex items-center gap-3">

                  <div className="relative">

                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        className="h-10 w-10 rounded-full object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-bold text-white">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                    )}

                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-[#102418]" />

                  </div>

                  <div>

                    <p className="font-semibold text-[#102418] dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="text-xs text-slate-500">
                      Online
                    </p>

                  </div>

                </div>

              </button>
            ))}

          </div>

        </div>

      </Card>

    </div>
  );
}