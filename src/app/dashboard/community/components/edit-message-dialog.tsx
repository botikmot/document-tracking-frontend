'use client';

import {
  useState,
} from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CommunityMessage } from '@/types/community';

import {
  useCommunityStore,
} from '@/store/community.store';

type Props = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  message: CommunityMessage;
};

export function EditMessageDialog({
  open,
  onOpenChange,
  message,
}: Props) {

  const updateMessage =
    useCommunityStore(
      (s) =>
        s.updateMessageApi,
    );

  const [text, setText] =
    useState(message.message);

  const [loading, setLoading] =
    useState(false);


  const handleSave =
    async () => {

      if (!text.trim())
        return;

      try {

        setLoading(true);

        await updateMessage(
          message.id,
          text.trim(),
        );

        onOpenChange(false);

      } finally {

        setLoading(false);

      }

    };

  return (

    <Dialog
      open={open}
      onOpenChange={(value) => {
            if (value) {
                setText(message.message);
            }
            onOpenChange(value);
        }}
    >

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>

            Edit Message

          </DialogTitle>

        </DialogHeader>

        <Textarea
          rows={5}
          value={text}
          onChange={(e) =>
            setText(
              e.target.value,
            )
          }
        />

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(
                false,
              )
            }
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleSave
            }
            disabled={
              loading
            }
          >
            Save
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );
}