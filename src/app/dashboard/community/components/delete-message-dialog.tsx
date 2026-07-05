'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
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

export function DeleteMessageDialog({
  open,
  onOpenChange,
  message,
}: Props) {

  const deleteMessage =
    useCommunityStore(
      (s) =>
        s.deleteMessageApi,
    );

  const handleDelete =
    async () => {

      await deleteMessage(
        message.id,
      );

      onOpenChange(false);

    };

  return (

    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>

            Delete Message

          </DialogTitle>

        </DialogHeader>

        <p className="text-sm text-slate-500">

          Are you sure you want to delete this message?
          This action cannot be undone.

        </p>

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
            variant="destructive"
            onClick={
              handleDelete
            }
          >
            Delete
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );
}