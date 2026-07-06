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
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Download,
  Eye,
  FileText,
  FileSpreadsheet,
  //FileImage,
  FileArchive,
} from 'lucide-react';

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

 const attachments = message.attachments ?? [];

  const formatFileSize = (
    bytes: number,
  ) => {
    if (bytes < 1024)
      return `${bytes} B`;

    if (bytes < 1024 * 1024)
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(1)} MB`;
  };

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

            {attachments.length > 0 && (

              <div className="mt-4 space-y-3">

                {attachments.map((attachment) => {

                  const isImage =
                    attachment.mimeType.startsWith('image/');

                  const isPdf =
                    attachment.mimeType ===
                    'application/pdf';

                  const isExcel =
                    attachment.mimeType.includes(
                      'spreadsheet',
                    ) ||
                    attachment.mimeType.includes(
                      'excel',
                    );

                  const isWord =
                    attachment.mimeType.includes(
                      'word',
                    );

                  const fileUrl = `${process.env.NEXT_PUBLIC_URL}${attachment.path}`;

                  return (

                    <div
                      key={attachment.id}
                    >

                      {/* IMAGE */}

                      {isImage ? (

                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >

                          <img
                            src={fileUrl}
                            alt={attachment.originalName}
                            className="
                              max-h-80
                              rounded-2xl
                              border
                              shadow-lg
                              transition
                              hover:scale-[1.02]
                              hover:shadow-xl
                            "
                          />

                        </a>

                      ) : (

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white/80
                            p-4
                            dark:border-[#2D4A39]
                            dark:bg-[#163122]
                          "
                        >

                          <div className="flex items-center gap-4">

                            <div
                              className="
                                rounded-xl
                                bg-green-100
                                p-3
                                dark:bg-[#21432F]
                              "
                            >

                              {isPdf ? (

                                <FileText className="h-7 w-7 text-red-500" />

                              ) : isExcel ? (

                                <FileSpreadsheet className="h-7 w-7 text-green-600" />

                              ) : isWord ? (

                                <FileText className="h-7 w-7 text-blue-600" />

                              ) : (

                                <FileArchive className="h-7 w-7 text-slate-500" />

                              )}

                            </div>

                            <div>

                              <p
                                className="
                                  max-w-[220px]
                                  truncate
                                  font-semibold
                                "
                              >
                                {attachment.originalName}
                              </p>

                              <p className="text-xs text-slate-500">

                                {formatFileSize(
                                  attachment.fileSize,
                                )}

                              </p>

                            </div>

                          </div>

                          <div className="flex gap-2">

                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                            >

                              <a
                                href={fileUrl}
                                target="_blank"
                              >

                                <Eye className="h-4 w-4" />

                              </a>

                            </Button>

                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                            >

                              <a
                                href={fileUrl}
                                download
                              >

                                <Download className="h-4 w-4" />

                              </a>

                            </Button>

                          </div>

                        </div>

                      )}

                    </div>

                  );

                })}

              </div>

            )}

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