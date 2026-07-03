'use client';

import { cn } from '@/lib/utils';
import { timeAgo } from '@/lib/date';
import type { CommunityMessage } from '@/types/community';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

type Props = {
  message: CommunityMessage;
  currentUserId?: string;
};

export function CommunityMessage({
  message,
  currentUserId,
}: Props) {

    const isMine = message.userId === currentUserId;
    const initials = `${message.user.firstName.charAt(0)}${message.user.lastName.charAt(0)}`;
    const office = message.user.offices?.[0]?.office?.officeName ?? 'DENR Caraga';

    //console.log('chat-message:',message)

  return (
    <div
      className={cn(
        'flex gap-4',
        isMine && 'justify-end',
      )}
    >
      {!isMine && (
        <Avatar className="h-11 w-11">
          <AvatarImage src={message.user.profileImageUrl ?? ''} />

          <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[75%]',
          isMine && 'order-first',
        )}
      >
        {!isMine && (
          <>
            <p className="font-semibold text-[#102418] dark:text-white">
              {message.user.firstName} {message.user.lastName}
            </p>

            <p className="mb-2 text-xs text-slate-500">
              {office}
            </p>
          </>
        )}

        <div
          className={cn(
            'rounded-3xl px-5 py-4 shadow',
            isMine
              ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white'
              : 'bg-white dark:bg-[#163122]',
          )}
        >
          <p className="leading-7">
            {message.message}
          </p>
        </div>

        <p
          className={cn(
            'mt-2 text-xs text-slate-500',
            isMine && 'text-right',
          )}
        >
          {timeAgo(message.createdAt)}
        </p>
      </div>

      {isMine && (
        <Avatar className="h-11 w-11">
          <AvatarImage src={message.user.profileImageUrl ?? ''} />

          <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}