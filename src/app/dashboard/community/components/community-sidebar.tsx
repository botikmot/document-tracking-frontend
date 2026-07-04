'use client';

import { useState } from 'react';

import {
  Hash,
  Plus,
  Search,
  //Users,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCommunityStore } from '@/store/community.store';
import { useAuthStore } from '@/store/auth.store';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { CreateChannelDialog } from './create-channel-dialog';

export function CommunitySidebar() {
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const {
      communities,
      onlineUsers,
      chatUsers,
      selectedCommunity,
      selectCommunity,
      startDirectConversation,
    } = useCommunityStore();

  const onlineUserIds = new Set(
    onlineUsers.map((u) => u.userId),
  );

  const sortedUsers = chatUsers
    .filter(
      (member) => member.id !== user?.userId,
    )
    .sort((a, b) => {
      const aOnline =
        onlineUserIds.has(a.id);

      const bOnline =
        onlineUserIds.has(b.id);

      // Online users first
      if (aOnline !== bOnline) {
        return aOnline ? -1 : 1;
      }

      // Then sort alphabetically
      return (
        a.firstName.localeCompare(
          b.firstName,
        ) ||
        a.lastName.localeCompare(
          b.lastName,
        )
      );
    });
  
  return (
    <>
    <Card className="rounded-[32px] border-0 bg-white shadow-xl dark:bg-[#102418]">

      <div className="p-6">

        {/* Header */}

        <div className="mb-6">

          <h2 className="text-xl font-black text-[#102418] dark:text-white">
            Community
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Collaborate with your team
          </p>

        </div>

        <Tabs
          defaultValue="channels"
          className="w-full"
        >

          <TabsList className="grid w-full grid-cols-2 rounded-2xl">

            <TabsTrigger value="channels">

              Channels

              <Badge className="ml-2">
                {communities.length}
              </Badge>

            </TabsTrigger>

            <TabsTrigger value="dm">

              Direct

              <Badge className="ml-2">
                {sortedUsers.length}
              </Badge>

            </TabsTrigger>

          </TabsList>

          {/* CHANNEL TAB */}

          <TabsContent value="channels">

            {/* Search */}

            <div className="relative mt-6">

              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />

              <Input
                placeholder="Search channels..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="rounded-2xl pl-11"
              />

            </div>

            {/* List */}

            <div className="mt-6 h-[340px] space-y-2 overflow-y-auto">

              {communities
                .filter((community) =>
                  community.name
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map((community) => (
                  <button
                    key={community.id}
                    onClick={() =>
                      selectCommunity(
                        community,
                      )
                    }
                    className={`w-full rounded-2xl p-4 text-left transition-all cursor-pointer ${
                      selectedCommunity?.id ===
                      community.id
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
                              selectedCommunity?.id ===
                              community.id
                                ? 'text-green-100'
                                : 'text-slate-500'
                            }`}
                          >
                            {community._count?.members} members
                          </p>

                        </div>

                      </div>

                    </div>

                  </button>
                ))}

            </div>

            <Button 
              onClick={() =>
                setOpenCreate(true)
              }
              className="mt-6 h-12 w-full cursor-pointer rounded-2xl"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Channel
            </Button>

          </TabsContent>

          {/* DIRECT MESSAGE TAB */}

          <TabsContent value="dm">

            <div className="relative mt-6">

              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />

              <Input
                placeholder="Search people..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="rounded-2xl pl-11"
              />

            </div>

            <div className="mt-6 h-[410px] space-y-3 overflow-y-auto pr-2">

              {sortedUsers
                .filter((member) =>
                  `${member.firstName} ${member.lastName}`
                    .toLowerCase()
                    .includes(
                      search.toLowerCase(),
                    ),
                )
                .map((member) => {

                  const isOnline =
                    onlineUserIds.has(
                      member.id,
                    );

                  const office =
                    member.offices?.[0]
                      ?.office?.officeName ??
                    'No Office Assigned';

                  return (

                    <button
                      key={member.id}
                      onClick={() =>
                        startDirectConversation(
                          member.id,
                        )
                      }
                      className="flex w-full items-center rounded-2xl p-3 transition hover:bg-slate-100 dark:hover:bg-[#163122]"
                    >

                      <div className="relative">

                        {member.profileImageUrl ? (

                          <img
                            src={
                              member.profileImageUrl
                            }
                            className="h-10 w-10 rounded-full object-cover"
                          />

                        ) : (

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-bold text-white">

                            {member.firstName[0]}
                            {member.lastName[0]}

                          </div>

                        )}

                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-[#102418] ${
                            isOnline
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }`}
                        />

                      </div>

                      <div className="ml-3 text-left">

                        <p className="font-semibold text-[#102418] dark:text-white">

                          {member.firstName}{' '}
                          {member.lastName}

                        </p>

                        <p className="text-xs text-slate-500">

                          {office}

                        </p>

                      </div>

                    </button>

                  );
                })}

            </div>

          </TabsContent>

        </Tabs>

      </div>
    </Card>

    <CreateChannelDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
      />
    
    </>

  );
}