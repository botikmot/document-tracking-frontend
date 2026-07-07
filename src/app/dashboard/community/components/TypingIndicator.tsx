'use client';

//import { cn } from '@/lib/utils';
import { useCommunityStore } from '@/store/community.store';

export function TypingIndicator() {

  const typingUsers =
    useCommunityStore(
      (state) => state.typingUsers,
    );

  if (typingUsers.length === 0) {
    return null;
  }

  let text = '';

  if (typingUsers.length === 1) {

    text =
      `${typingUsers[0].firstName} is typing...`;

  } else if (typingUsers.length === 2) {

    text =
      `${typingUsers[0].firstName} and ${typingUsers[1].firstName} are typing...`;

  } else {

   text = `${typingUsers[0].firstName}, ${typingUsers[1].firstName} and ${typingUsers.length - 2} others are typing...`;

  }

  return (

    <div
      className="
        flex
        items-center
        gap-3
        border-t
        border-slate-200
        bg-white
        px-6
        py-2
        dark:border-slate-800
        dark:bg-[#102418]
      "
    >

      <div className="flex gap-1">

        <span className="typing-dot" />

        <span className="typing-dot animation-delay-150" />

        <span className="typing-dot animation-delay-300" />

      </div>

      <span className="text-sm text-slate-500 dark:text-slate-400">

        {text}

      </span>

    </div>

  );

}