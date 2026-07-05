'use client';

import { useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import { cn } from '@/lib/utils';

import { timeAgo } from '@/lib/date';

import { MessageActions } from './message-actions';
import { EditMessageDialog } from './edit-message-dialog';
import { DeleteMessageDialog } from './delete-message-dialog';
import type { CommunityMessage } from '@/types/community';
import { useCommunityStore } from '@/store/community.store';
import { CommunityEmojiPicker } from '@/components/ui/emoji-picker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  message: CommunityMessage;
  currentUserId?: string;
};

export function CommunityMessage({
  message,
  currentUserId,
}: Props) {

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const isMine =
    message.userId === currentUserId;

  const initials =
    `${message.user.firstName.charAt(0)}${message.user.lastName.charAt(0)}`;

  const office =
    message.user.offices?.[0]?.office
      ?.officeName ??
    'DENR Caraga';

  const toggleReaction =
    useCommunityStore(
        s => s.toggleReactionApi,
    );

  //console.log('message:', message)

  const groupedReactions = Object.values(
      message.reactions.reduce(
        (acc, reaction) => {
          if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = {
              emoji: reaction.emoji,
              count: 0,
              users: [],
            };
          }

          acc[reaction.emoji].count++;

          acc[reaction.emoji].users.push(
            reaction.user,
          );

          return acc;
        },
        {} as Record<
          string,
          {
            emoji: string;
            count: number;
            users: {
              id: string;
              firstName: string;
              lastName: string;
            }[];
          }
        >,
      ),
    );

  return (
    <>

      <div
        className={cn(
          'group flex gap-4',
          isMine &&
            'justify-end',
        )}
      >

        {!isMine && (
          <Avatar className="h-11 w-11">

            <AvatarImage
              src={
                message.user.profileImageUrl ??
                ''
              }
            />

            <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-600 font-bold text-white">

              {initials}

            </AvatarFallback>

          </Avatar>
        )}

        <div
          className={cn(
            'relative max-w-[75%]',
            isMine &&
              'order-first',
          )}
        >

          {!isMine && (
            <>
              <p className="font-semibold text-[#102418] dark:text-white">

                {message.user.firstName}{' '}
                {message.user.lastName}

              </p>

              <p className="mb-2 text-xs text-slate-500">

                {office}

              </p>
            </>
          )}

          {isMine &&
            !message.isDeleted && (

              <div
                className="
                  absolute
                  -right-2
                  -top-2
                  opacity-0
                  transition-opacity
                  group-hover:opacity-100
                "
              >

                <MessageActions
                  onEdit={() =>
                    setEditOpen(
                      true,
                    )
                  }
                  onDelete={() =>
                    setDeleteOpen(
                      true,
                    )
                  }
                />

              </div>

            )}

          <div
            className={cn(
              'rounded-3xl px-5 py-4 shadow relative',

              message.isDeleted
                ? 'bg-slate-100 italic text-slate-500 dark:bg-[#1B2D22] dark:text-slate-400'

                : isMine

                  ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white'

                  : 'bg-white dark:bg-[#163122]',
            )}
          >

            <p className="leading-7">

              {message.message}

            </p>

            {!isMine && (
              <div
              className={cn(
                `
                mt-2
                absolute
                right-0
                -top-5
                flex
                opacity-0
                transition-all
                duration-200
                group-hover:opacity-100
                `,
                isMine
                  ? 'justify-end'
                  : 'justify-start',
              )}
            >

              <CommunityEmojiPicker
                onSelect={(emoji) =>
                  toggleReaction(
                    message.id,
                    emoji,
                  )
                }
              />

            </div>
            )}
            
            <TooltipProvider>

              <div className="flex flex-nowrap items-center absolute left-1 -bottom-2">

                {groupedReactions.map((reaction) => {

                  const reactedByMe =
                    reaction.users.some(
                      (u) => u.id === currentUserId,
                    );

                  return (

                    <Tooltip
                      key={reaction.emoji}
                    >

                      <TooltipTrigger asChild>

                        <button
                          onClick={() =>
                            toggleReaction(
                              message.id,
                              reaction.emoji,
                            )
                          }
                          className={cn(
                            `
                            flex
                            items-center
                            gap-1
                            rounded
                            px-1
                            text-xs
                            transition-all
                            duration-200
                            hover:scale-105
                            active:scale-95
                           
                              `,
                          )}
                        >
                          <span className="text-base">

                            {reaction.emoji}

                          </span>

                          <span className="font-semibold">

                            {reaction.count}

                          </span>

                        </button>

                      </TooltipTrigger>

                      <TooltipContent>

                        <div className="space-y-1">

                          <p className="font-semibold">

                            {reaction.emoji} reacted by

                          </p>

                          {reaction.users.map((user) => (

                            <p key={user.id}>

                              {user.firstName} {user.lastName}

                            </p>

                          ))}

                        </div>

                      </TooltipContent>

                    </Tooltip>

                  );

                })}

              </div>

            </TooltipProvider>

          </div>

          <div
            className={cn(
              'mt-2 flex items-center gap-2 text-xs text-slate-500',

              isMine &&
                'justify-end',
            )}
          >

            <span>

              {timeAgo(
                message.createdAt,
              )}

            </span>

            {message.editedAt &&
              !message.isDeleted && (

                <span className="italic">

                  edited

                </span>

              )}

          </div>

        </div>

        {isMine && (
          <Avatar className="h-11 w-11">

            <AvatarImage
              src={
                message.user.profileImageUrl ??
                ''
              }
            />

            <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-600 font-bold text-white">

              {initials}

            </AvatarFallback>

          </Avatar>
        )}

      </div>

      <EditMessageDialog
        key={message.id + String(editOpen)}
        open={editOpen}
        onOpenChange={
          setEditOpen
        }
        message={message}
      />

      <DeleteMessageDialog
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
        message={message}
      />

    </>
  );
}