'use client';

import { useState, useRef, useEffect } from 'react';
import { socket } from '@/lib/socket';

import {
  Paperclip,
  SendHorizonal,
  Smile,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCommunityStore } from '@/store/community.store';
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthStore } from '@/store/auth.store';

export function CommunityInput() {

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const selectedCommunity =
    useCommunityStore(
      (state) => state.selectedCommunity,
    );

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isTypingRef = useRef(false);

  const sendMessageStore =
    useCommunityStore(
      (state) => state.sendMessage,
    );

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleTyping = () => {

    if (!selectedCommunity || !user) {
      return;
    }

    // Send typing-start only once
    if (!isTypingRef.current) {

      isTypingRef.current = true;

      socket.emit(
        'typing-start',
        {
          communityId:
            selectedCommunity.id,
          userId:
            user.userId,
          firstName:
            user.firstName,
          lastName:
            user.lastName,
        },
      );

    }

    // Reset timer
    if (typingTimeoutRef.current) {
      clearTimeout(
        typingTimeoutRef.current,
      );
    }

    typingTimeoutRef.current =
      setTimeout(() => {

        socket.emit(
          'typing-stop',
          {
            communityId:
              selectedCommunity.id,
            userId:
              user.userId,
          },
        );

        isTypingRef.current = false;

      }, 1000);

  };


  async function sendMessage() {
    if (
      !selectedCommunity ||
      (!message.trim() && !attachment)
    ) {
      return;
    }

    try {
      setSending(true);

      const formData =
        new FormData();

      formData.append(
        'message',
        message,
      );

      if (attachment) {
        formData.append(
          'file',
          attachment,
        );
      }

      if (
            isTypingRef.current &&
            selectedCommunity
          ) {

            socket.emit(
              'typing-stop',
              {
                communityId:
                  selectedCommunity.id,
                userId:
                  user?.userId,
              },
            );

            isTypingRef.current = false;

          }


      await sendMessageStore(
        formData,
      );

      setMessage('');

      setAttachment(null);

      // allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value =
          '';
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  }

  const handlePaste = (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {

    const items =
      e.clipboardData.items;

    for (const item of items) {

      if (
        item.type.startsWith('image/')
      ) {

        const file =
          item.getAsFile();

        if (!file) return;

        setAttachment(file);

        e.preventDefault();

        return;
      }
    }
  };

  useEffect(() => {

    return () => {

      if (
        isTypingRef.current &&
        selectedCommunity
      ) {

        socket.emit(
          'typing-stop',
          {
            communityId:
              selectedCommunity.id,
            userId:
              user?.userId,
          },
        );

      }

    };

  }, [
    selectedCommunity,
    user,
  ]);

  return (
    <div className="border-t border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#102418]">

      {attachment && (

          <div
            className="
              mb-3
              flex
              items-center
              justify-between
              rounded-xl
              bg-green-50
              px-4
              py-2
              dark:bg-[#163122]
          "
          >

            <div>

              <p className="font-medium max-w-xs truncate">

                {attachment.name}

              </p>

              <p className="text-xs text-slate-500">

                {(attachment.size / 1024).toFixed(1)} KB • {attachment.type || 'Unknown'}

              </p>

            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setAttachment(null)
              }
            >

              ✕

            </Button>

          </div>

          )}

      <div className="flex items-center gap-4">

        <Popover>

          <PopoverTrigger asChild>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-2xl cursor-pointer"
            >
              <Smile className="h-5 w-5" />
            </Button>

          </PopoverTrigger>

          <PopoverContent
            className="w-auto border-none p-0 shadow-xl"
            align="start"
          >

            <EmojiPicker
              lazyLoadEmojis
              onEmojiClick={(emoji) =>
                setMessage(
                  (prev) => prev + emoji.emoji,
                )
              }
            />

          </PopoverContent>

        </Popover>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-2xl cursor-pointer"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => {

            const file =
              e.target.files?.[0];

            if (!file) return;

            setAttachment(file);
            e.target.value = '';
          }}
        />

        <Textarea
          ref={textareaRef}
          disabled={!selectedCommunity}
          placeholder="Type your message..."
          value={message}
          rows={1}
          onChange={(e) => {
            setMessage(
              e.target.value,
            );
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !sending
            ) {
              e.preventDefault();
              sendMessage();
            }
          }}
          onPaste={handlePaste}
          className="min-h-[52px] resize-none rounded-2xl"
        />

        <Button
          disabled={
            sending ||
            !selectedCommunity ||
            (!message.trim() &&
              !attachment)
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