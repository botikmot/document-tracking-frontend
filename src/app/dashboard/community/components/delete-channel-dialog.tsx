'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  Trash2,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import { useCommunityStore } from '@/store/community.store';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteChannelDialog({
  open,
  onOpenChange,
}: Props) {
  const {
    selectedCommunity,
    removeCommunity,
  } = useCommunityStore();

  const [loading, setLoading] =
    useState(false);

  const handleDelete =
    async () => {
      if (!selectedCommunity) return;

      try {
        setLoading(true);

        await removeCommunity(
          selectedCommunity.id,
        );

        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-md rounded-3xl border-0 bg-white p-0 shadow-2xl dark:bg-[#102418]">

        <DialogHeader className="border-b border-slate-200 p-6 dark:border-[#21442f]">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">

            <AlertTriangle className="h-8 w-8 text-red-600" />

          </div>

          <DialogTitle className="text-center text-2xl font-black text-[#102418] dark:text-white">
            Delete Channel
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6 p-6">

          <div className="text-center">

            <p className="text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete
            </p>

            <p className="mt-2 text-xl font-bold text-[#102418] dark:text-white">
              #{selectedCommunity?.name}
            </p>

            <p className="mt-4 text-sm text-red-600">
              This action cannot be undone.
              All messages in this channel will also
              be permanently deleted.
            </p>

          </div>

          <div className="rounded-2xl bg-red-50 p-4 dark:bg-red-900/10">

            <p className="text-sm text-red-700 dark:text-red-400">
              ⚠️ Members will lose access to this
              channel immediately after deletion.
            </p>

          </div>

          <div className="flex justify-end gap-3 border-t pt-5 dark:border-[#21442f]">

            <Button
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />

              {loading
                ? 'Deleting...'
                : 'Delete Channel'}
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}