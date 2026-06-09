'use client';

import {
  useState,
} from 'react';

import {
  Network,
} from 'lucide-react';

import { api } from '@/lib/axios';

import {
  Button,
} from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Input,
} from '@/components/ui/input';

import {
  Label,
} from '@/components/ui/label';

export function CreateOrganizationDialog({
  organizationUnits,
  onSuccess,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [code, setCode] =
    useState('');

  const [name, setName] =
    useState('');

  const [type, setType] =
    useState('REGIONAL');

  const [parentId, setParentId] =
    useState('');

  const handleCreate =
    async () => {
      try {
        setLoading(true);

        await api.post(
          '/organization-units',
          {
            code,
            name,
            type,
            parentId:
              parentId || null,
          },
        );

        onSuccess?.();

        setOpen(false);

        setCode('');
        setName('');
        setType('REGIONAL');
        setParentId('');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-12 rounded-2xl"
        >
          <Network className="mr-2 h-5 w-5" />
          Add Organization
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            Create Organization
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div>
            <Label>Code</Label>

            <Input
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value,
                )
              }
              className="mt-2 h-11 rounded-xl"
            />
          </div>

          <div>
            <Label>Name</Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value,
                )
              }
              className="mt-2 h-11 rounded-xl"
            />
          </div>

          <div>
            <Label>Type</Label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value,
                )
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"
            >
              <option value="REGIONAL">
                Regional
              </option>

              <option value="PENRO">
                PENRO
              </option>

              <option value="CENRO">
                CENRO
              </option>
            </select>
          </div>

          <div>
            <Label>
              Parent Organization
            </Label>

            <select
              value={parentId}
              onChange={(e) =>
                setParentId(
                  e.target.value,
                )
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"
            >
              <option value="">
                None
              </option>

              {organizationUnits.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (org: any) => (
                  <option
                    key={org.id}
                    value={org.id}
                  >
                    {org.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              disabled={loading}
              onClick={() =>
                void handleCreate()
              }
              className="rounded-xl bg-slate-900 hover:bg-slate-800"
            >
              {loading
                ? 'Creating...'
                : 'Create Organization'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}