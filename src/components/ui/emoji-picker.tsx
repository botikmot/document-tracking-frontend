'use client';

import EmojiPicker, {
  Theme,
} from 'emoji-picker-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { SmilePlus } from 'lucide-react';

type Props = {
  onSelect: (emoji: string) => void;
};

export function CommunityEmojiPicker({
  onSelect,
}: Props) {
  return (
    <Popover>

      <PopoverTrigger asChild>

        <button
          className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-[#163122]"
        >
          <SmilePlus className="h-5 w-5" />
        </button>

      </PopoverTrigger>

      <PopoverContent
        className="w-auto border-none p-0"
        align="start"
      >

        <EmojiPicker
          theme={Theme.AUTO}
          onEmojiClick={(emoji) =>
            onSelect(
              emoji.emoji,
            )
          }
        />

      </PopoverContent>

    </Popover>
  );
}