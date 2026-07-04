'use client';

import { useState } from 'react';

import {
  Paperclip,
  SendHorizonal,
  Smile,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { socket } from '@/lib/socket';
import { useCommunityStore } from '@/store/community.store';
import { useAuthStore } from '@/store/auth.store';

export function CommunityInput() {

  const selectedCommunity =
    useCommunityStore(
      (state) => state.selectedCommunity,
    );

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function sendMessage() {
  if (!message.trim()) return;

    setSending(true);

    socket.emit(
      'send-message',
      {
        userId: user?.userId,
        communityId:
          selectedCommunity?.id,
        message,
      },
      () => {
        setSending(false);
        setMessage('');
      },
    );
  }

  return (
    <div className="border-t border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#102418]">

      <div className="flex items-end gap-4">

        {/* <Button
          size="icon"
          variant="ghost"
          className="rounded-2xl"
        >
          <Smile className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-2xl"
        >
          <Paperclip className="h-5 w-5" />
        </Button> */}

        <Textarea
          disabled={!selectedCommunity}
          placeholder="Type your message..."
          value={message}
          rows={1}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey
            ) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="min-h-[52px] resize-none rounded-2xl"
        />

        <Button
          disabled={
            !selectedCommunity ||
            !message.trim()
          }
          onClick={sendMessage}
          className="h-12 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6"
        >
          <SendHorizonal className="mr-2 h-5 w-5" />
          Send
        </Button>

      </div>

    </div>
  );
}