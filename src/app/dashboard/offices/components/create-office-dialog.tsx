'use client';

import {
  useState,
} from 'react';

import {
  Plus,
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

import {
  Textarea,
} from '@/components/ui/textarea';

export function CreateOfficeDialog({
  organizationUnits,
  onSuccess,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    officeCode,
    setOfficeCode,
  ] = useState('');

  const [
    officeName,
    setOfficeName,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    organizationUnitId,
    setOrganizationUnitId,
  ] = useState('');

  const handleCreate =
    async () => {
      try {
        setLoading(true);

        await api.post(
          '/offices',
          {
            officeCode,
            officeName,
            description,
            organizationUnitId,
          },
        );

        onSuccess?.();

        setOpen(false);

        setOfficeCode('');
        setOfficeName('');
        setDescription('');
        setOrganizationUnitId('');
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
        <Button className="h-12 rounded-2xl bg-slate-900 px-6 hover:bg-slate-800">
          <Plus className="mr-2 h-5 w-5" />
          Add Office
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            Create Office
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div>
            <Label>
              Office Code
            </Label>

            <Input
              value={officeCode}
              onChange={(e) =>
                setOfficeCode(
                  e.target.value,
                )
              }
              className="mt-2 h-11 rounded-xl"
            />
          </div>

          <div>
            <Label>
              Office Name
            </Label>

            <Input
              value={officeName}
              onChange={(e) =>
                setOfficeName(
                  e.target.value,
                )
              }
              className="mt-2 h-11 rounded-xl"
            />
          </div>

          <div>
            <Label>
              Description
            </Label>

            <Textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              className="mt-2 rounded-xl"
            />
          </div>

          <div>
            <Label>
              Organization Unit
            </Label>

            <select
              value={
                organizationUnitId
              }
              onChange={(e) =>
                setOrganizationUnitId(
                  e.target.value,
                )
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"
            >
              <option value="">
                Select organization
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
                : 'Create Office'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}