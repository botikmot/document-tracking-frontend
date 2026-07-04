'use client';

import { useMemo, useState } from 'react';

import {
  Search,
  Users,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useCommunityStore } from '@/store/community.store';

type Props = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
};

export function CreateChannelDialog({
  open,
  onOpenChange,
}: Props) {
  const {
    chatUsers,
    createCommunity,
  } = useCommunityStore();

  const [name, setName] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [search, setSearch] =
    useState('');

  const [
    selectedUsers,
    setSelectedUsers,
  ] = useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const filteredUsers =
    useMemo(() => {
      return chatUsers.filter(
        (user) => {
          const fullName =
            `${user.firstName} ${user.lastName}`.toLowerCase();

          const office =
            user.offices?.[0]?.office
              ?.officeName?.toLowerCase() ??
            '';

          const term =
            search.toLowerCase();

          return (
            fullName.includes(
              term,
            ) ||
            office.includes(
              term,
            )
          );
        },
      );
    }, [
      chatUsers,
      search,
    ]);

  const toggleUser = (
    userId: string,
  ) => {
    setSelectedUsers(
      (prev) => {
        if (
          prev.includes(
            userId,
          )
        ) {
          return prev.filter(
            (id) =>
              id !== userId,
          );
        }

        return [
          ...prev,
          userId,
        ];
      },
    );
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSearch('');
    setSelectedUsers([]);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleCreate =
    async () => {
      if (!name.trim())
        return;

      try {
        setLoading(true);

        await createCommunity(
          {
            name:
              name.trim(),

            description:
              description.trim(),

            isPrivate: false,

            memberIds:
              selectedUsers,
          },
        );

        handleClose();
      } catch (error) {
        console.error(
          error,
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-2xl rounded-[32px] border-0 bg-white p-0 shadow-2xl dark:bg-[#102418]">

        {/* HEADER */}

        <div className="rounded-t-[32px] bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white">

          <DialogHeader>

            <DialogTitle className="flex items-center gap-2 text-2xl font-black">

              <Plus className="h-6 w-6" />

              Create Channel

            </DialogTitle>

            <DialogDescription className="text-green-100">

              Create a new discussion
              channel for your team.

            </DialogDescription>

          </DialogHeader>

        </div>

        {/* BODY */}

        <div className="space-y-6 p-6">

          {/* CHANNEL NAME */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-[#102418] dark:text-white">

              Channel Name *

            </label>

            <Input
              placeholder="ICT Team"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value,
                )
              }
              className="rounded-2xl"
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-[#102418] dark:text-white">

              Description

            </label>

            <Textarea
              placeholder="Describe the purpose of this channel..."
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              className="min-h-[100px] rounded-2xl resize-none"
            />

          </div>

          {/* MEMBERS */}

          <div>

            <div className="mb-3 flex items-center justify-between">

              <label className="text-sm font-semibold text-[#102418] dark:text-white">

                Members

              </label>

              <Badge>

                {
                  selectedUsers.length
                }{' '}
                selected

              </Badge>

            </div>

            {/* SEARCH */}

            <div className="relative mb-4">

              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />

              <Input
                placeholder="Search employee..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                className="rounded-2xl pl-11"
              />

            </div>

            {/* USERS */}

            <ScrollArea className="h-[250px] rounded-2xl border border-slate-200 dark:border-slate-800">

              <div className="p-2">

                {filteredUsers.map(
                  (
                    user,
                  ) => {
                    const office =
                      user
                        .offices?.[0]
                        ?.office
                        ?.officeName ??
                      'No Office Assigned';

                    const checked =
                      selectedUsers.includes(
                        user.id,
                      );

                    return (
                        <div
                            key={user.id}
                            onClick={() => toggleUser(user.id)}
                            className={`cursor-pointer rounded-2xl border p-3 transition

                            ${
                                checked
                                    ? "border-green-600 bg-green-50 dark:bg-green-950"
                                    : "border-transparent hover:bg-slate-100 dark:hover:bg-[#163122]"
                            }`}
                        >

                        <div className="flex-1">

                          <p className="font-semibold text-[#102418] dark:text-white">

                            {
                              user.firstName
                            }{' '}
                            {
                              user.lastName
                            }

                          </p>

                          <p className="text-xs text-slate-500">

                            {
                              office
                            }

                          </p>

                        </div>

                      </div>
                    );
                  },
                )}

              </div>

            </ScrollArea>

          </div>

          {/* SELECTED USERS */}

          {selectedUsers.length >
            0 && (
            <div>

              <p className="mb-2 text-sm font-semibold text-[#102418] dark:text-white">

                Selected Members

              </p>

              <div className="flex flex-wrap gap-2">

                {selectedUsers.map(
                  (
                    id,
                  ) => {
                    const user =
                      chatUsers.find(
                        (
                          u,
                        ) =>
                          u.id ===
                          id,
                      );

                    if (
                      !user
                    )
                      return null;

                    return (
                      <Badge
                        key={
                          id
                        }
                        className="rounded-full bg-green-600 hover:bg-green-600"
                      >

                        {
                          user.firstName
                        }{' '}
                        {
                          user.lastName
                        }

                      </Badge>
                    );
                  },
                )}

              </div>

            </div>
          )}

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 pt-2">

            <Button
              type="button"
              variant="outline"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              className="rounded-xl cursor-pointer"
            >

              Cancel

            </Button>

            <Button
              type="button"
              onClick={
                handleCreate
              }
              disabled={
                loading ||
                !name.trim()
              }
              className="rounded-xl cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >

              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Create Channel
                </>
              )}

            </Button>

          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
}