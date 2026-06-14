'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Send,
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
  Label,
} from '@/components/ui/label';

import {
  Textarea,
} from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  documentId: string;

  onSuccess?: () => void;
}

export function RouteDocumentDialog({
  documentId,
  onSuccess,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    offices,
    setOffices,
  ] = useState([]);

  const [
    form,
    setForm,
  ] = useState({
    toOfficeId: '',
    remarks: '',
  });

  /*
   |------------------------------------------------------------
   | FETCH ACCESSIBLE OFFICES
   |------------------------------------------------------------
   */

  useEffect(() => {
    if (!open) return;

    const fetchOffices =
      async () => {
        try {
          const response =
            await api.get(
              '/offices/accessible',
            );
          
          console.log('route office:',response)
          setOffices(
            response.data,
          );
        } catch (error) {
          console.error(error);
        }
      };

    void fetchOffices();
  }, [open]);

  /*
   |------------------------------------------------------------
   | ROUTE DOCUMENT
   |------------------------------------------------------------
   */

  const routeDocument =
    async () => {
      try {
        setLoading(true);

        await api.post(
          `/documents/${documentId}/route`,
          {
            toOfficeId:
              form.toOfficeId,

            remarks:
              form.remarks,
          },
        );

        setOpen(false);

        setForm({
          toOfficeId: '',
          remarks: '',
        });

        onSuccess?.();
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
        <Button className="rounded-xl cursor-pointer">
          <Send className="mr-2 h-4 w-4" />
          Route
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            Route Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* OFFICE */}
          <div>
            <Label>
              Route To Office
            </Label>

            <Select
              value={
                form.toOfficeId
              }
              onValueChange={(
                value,
              ) =>
                setForm(
                  (
                    prev,
                  ) => ({
                    ...prev,
                    toOfficeId:
                      value,
                  }),
                )
              }
            >
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue placeholder="Select office" />
              </SelectTrigger>

              <SelectContent>
                {offices.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (office: any) => (
                    <SelectItem
                      key={
                        office.id
                      }
                      value={
                        office.id
                      }
                    >
                      {
                        office.officeName
                      }
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* REMARKS */}
          <div>
            <Label>
              Remarks
            </Label>

            <Textarea
              value={
                form.remarks
              }
              onChange={(
                e,
              ) =>
                setForm(
                  (
                    prev,
                  ) => ({
                    ...prev,
                    remarks:
                      e
                        .target
                        .value,
                  }),
                )
              }
              className="mt-2 rounded-xl"
              placeholder="Optional remarks..."
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                setOpen(
                  false,
                )
              }
            >
              Cancel
            </Button>

            <Button
              onClick={
                routeDocument
              }
              disabled={
                loading
              }
              className="rounded-xl bg-slate-900 hover:bg-slate-800"
            >
              {
                loading
                  ? 'Routing...'
                  : 'Route Document'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}