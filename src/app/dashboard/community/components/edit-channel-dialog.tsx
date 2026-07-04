'use client';

import { useEffect, useState } from 'react';

import {
  Save,
  Hash,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useCommunityStore } from '@/store/community.store';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditChannelDialog({
  open,
  onOpenChange,
}: Props) {
  const {
    selectedCommunity,
    updateCommunity,
  } = useCommunityStore();

  const [name, setName] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const resetForm = () => {
        if (!selectedCommunity) return;

        setName(selectedCommunity.name);
        setDescription(selectedCommunity.description ?? '');
    };

  const handleSave =
    async () => {
      if (
        !selectedCommunity ||
        !name.trim()
      )
        return;

      try {
        setLoading(true);

        await updateCommunity(
          selectedCommunity.id,
          {
            name: name.trim(),
            description:
              description.trim(),
          },
        );

        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

      return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
        resetForm();
        }

        onOpenChange(nextOpen);
    }}
    >
      <DialogContent className="max-w-lg rounded-3xl border-0 bg-white p-0 shadow-2xl dark:bg-[#102418]">
        <DialogHeader className="border-b border-slate-200 p-6 dark:border-[#1d3a29]">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black text-[#102418] dark:text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
              <Hash className="h-6 w-6" />
            </div>

            <div>
              <h2>Edit Channel</h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                Update your channel information.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">

          {/* Channel Name */}

          <div className="space-y-2">

            <Label>
              Channel Name
            </Label>

            <Input
              value={name}
              maxLength={60}
              placeholder="Enter channel name..."
              onChange={(e) =>
                setName(
                  e.target.value,
                )
              }
              className="rounded-2xl"
            />

          </div>

          {/* Description */}

          <div className="space-y-2">

            <Label>
              Description
            </Label>

            <Textarea
              rows={5}
              value={description}
              maxLength={300}
              placeholder="Describe this channel..."
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              className="resize-none rounded-2xl"
            />

            <div className="text-right text-xs text-slate-400">
              {description.length}/300
            </div>

          </div>

          {/* Preview */}

          <div className="rounded-2xl border bg-slate-50 p-4 dark:border-[#21442f] dark:bg-[#163122]">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Preview
            </p>

            <div className="mt-3 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                <Hash className="h-5 w-5" />
              </div>

              <div>

                <p className="font-bold text-[#102418] dark:text-white">
                  {name || 'Channel Name'}
                </p>

                <p className="text-sm text-slate-500">
                  {description ||
                    'No description'}
                </p>

              </div>

            </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t pt-5 dark:border-[#21442f]">

            <Button
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              disabled={
                loading ||
                !name.trim()
              }
              onClick={handleSave}
              className="rounded-xl bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />

              {loading
                ? 'Saving...'
                : 'Save Changes'}

            </Button>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}