'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Search,
  Crown,
  Plus,
  X,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

import { useCommunityStore } from '@/store/community.store';
import { useAuthStore } from '@/store/auth.store';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ManageMembersDialog({
  open,
  onOpenChange,
}: Props) {
  const user = useAuthStore(
    (state) => state.user,
  );

  const {
    selectedCommunity,
    chatUsers,
    onlineUsers,
    addMembers,
    removeMember,
  } = useCommunityStore();

  const [search, setSearch] = useState('');

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  /* useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIds([]);
    }
  }, [open]); */

  const onlineIds = useMemo(
    () =>
      new Set(
        onlineUsers.map(
          (u) => u.userId,
        ),
      ),
    [onlineUsers],
  );

  const memberIds = useMemo(
    () =>
      new Set(
        selectedCommunity?.members.map(
          (m) => m.userId,
        ) ?? [],
      ),
    [selectedCommunity],
  );

  const availableUsers = useMemo(() => {
    return chatUsers
      .filter(
        (u) =>
          u.id !== user?.userId &&
          !memberIds.has(u.id),
      )
      .filter((u) => {
        const keyword =
          search.toLowerCase();

        const office =
          u.offices?.[0]?.office
            ?.officeName ?? '';

        return (
          `${u.firstName} ${u.lastName}`
            .toLowerCase()
            .includes(keyword) ||
          office
            .toLowerCase()
            .includes(keyword)
        );
      });
  }, [
    chatUsers,
    memberIds,
    search,
    user,
  ]);

  const toggleUser = (
    id: string,
  ) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (x) => x !== id,
          )
        : [...prev, id],
    );
  };

  const handleSave =
    async () => {
      if (
        !selectedCommunity ||
        !selectedIds.length
      )
        return;

      setLoading(true);

      try {
        await addMembers(
          selectedCommunity.id,
          selectedIds,
        );

        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

  const handleRemove =
    async (memberId: string) => {
      if (!selectedCommunity)
        return;

      await removeMember(
        selectedCommunity.id,
        memberId,
      );
    };

     return (
    <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
            if (!nextOpen) {
            setSearch('');
            setSelectedIds([]);
            }

            onOpenChange(nextOpen);
        }}
    >
      <DialogContent className="max-w-2xl rounded-3xl border-0 bg-white p-0 shadow-2xl dark:bg-[#102418]">
        <DialogHeader className="border-b border-slate-200 p-6 dark:border-[#1d3a29]">
          <DialogTitle className="text-2xl font-black text-[#102418] dark:text-white">
            Manage Members
          </DialogTitle>

          <p className="mt-1 text-sm text-slate-500">
            Add or remove members from this channel.
          </p>
        </DialogHeader>

        <div className="space-y-5 p-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />

            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-2xl pl-11"
            />
          </div>

          {/* Current Members */}
          <div>
            <h3 className="mb-3 font-bold text-[#102418] dark:text-white">
              Current Members
            </h3>

            <ScrollArea className="h-[220px] rounded-2xl border dark:border-[#21442f]">
              <div className="space-y-2 p-3">
                {selectedCommunity?.members.map(
                  (member) => {
                    const profile =
                      member.user;

                    const office =
                      profile.offices?.[0]
                        ?.office?.officeName ??
                      'No Office Assigned';

                    const isOwner =
                      member.role ===
                      'OWNER';

                    const isOnline =
                      onlineIds.has(
                        profile.id,
                      );

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-2xl border p-3 dark:border-[#21442f]"
                      >
                        <div className="flex items-center gap-3">
                          {profile.profileImageUrl ? (
                            <img
                              src={
                                profile.profileImageUrl
                              }
                              className="h-11 w-11 rounded-full object-cover"
                              alt=""
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 font-bold text-white">
                              {
                                profile.firstName[0]
                              }
                              {
                                profile.lastName[0]
                              }
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#102418] dark:text-white">
                                {profile.firstName}{' '}
                                {
                                  profile.lastName
                                }
                              </p>

                              {isOwner && (
                                <Badge className="rounded-full bg-yellow-500 text-white">
                                  <Crown className="mr-1 h-3 w-3" />
                                  Owner
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                  isOnline
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
                                }`}
                              />

                              <span>
                                {office}
                              </span>
                            </div>
                          </div>
                        </div>

                        {!isOwner && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                            onClick={() =>
                              handleRemove(
                                member.userId,
                              )
                            }
                          >
                            <X className="mr-1 h-4 w-4" />

                            Remove
                          </Button>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Available Users */}
          <div>
            <h3 className="mb-3 font-bold text-[#102418] dark:text-white">
              Add Members
            </h3>

            <ScrollArea className="h-[250px] rounded-2xl border dark:border-[#21442f]">
              <div className="space-y-2 p-3">
                {availableUsers.map(
                  (employee) => {
                    const office =
                      employee.offices?.[0]
                        ?.office
                        ?.officeName ??
                      'No Office Assigned';

                    const selected =
                      selectedIds.includes(
                        employee.id,
                      );

                    const isOnline =
                      onlineIds.has(
                        employee.id,
                      );

                    return (
                      <div
                        key={employee.id}
                        onClick={() =>
                          toggleUser(
                            employee.id,
                          )
                        }
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition-all ${
                          selected
                            ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                            : 'hover:bg-slate-50 dark:hover:bg-[#163122]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {employee.profileImageUrl ? (
                            <img
                              src={
                                employee.profileImageUrl
                              }
                              className="h-11 w-11 rounded-full object-cover"
                              alt=""
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 font-bold text-white">
                              {
                                employee.firstName[0]
                              }
                              {
                                employee.lastName[0]
                              }
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-[#102418] dark:text-white">
                              {
                                employee.firstName
                              }{' '}
                              {
                                employee.lastName
                              }
                            </p>

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                  isOnline
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
                                }`}
                              />

                              <span>
                                {office}
                              </span>
                            </div>
                          </div>
                        </div>

                        {selected ? (
                          <Badge className="rounded-full bg-green-600">
                            Selected
                          </Badge>
                        ) : (
                          <Plus className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    );
                  },
                )}

                {availableUsers.length ===
                  0 && (
                  <div className="py-8 text-center text-sm text-slate-500">
                    No users found.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-5 dark:border-[#21442f]">
            <Button
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={
                loading ||
                selectedIds.length ===
                  0
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {loading
                ? 'Saving...'
                : `Add ${selectedIds.length} Member${
                    selectedIds.length ===
                    1
                      ? ''
                      : 's'
                  }`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}