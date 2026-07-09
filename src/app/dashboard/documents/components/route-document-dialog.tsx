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
  title: string;
  onSuccess?: () => void;
}

export function RouteDocumentDialog({
  documentId,
  title,
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
        <Button className="rounded-xl cursor-pointer w-full">
          <Send className="mr-2 h-4 w-4" />
          Route
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl border border-slate-200 bg-white transition-colors dark:border-[#214234] dark:bg-[#07150D] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 dark:text-[#F3F8F3]">
            Route Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pb-4">
          {/* OFFICE */}
          <div>
            <h2 className="font-semibold pb-4">Title: {title}</h2>
            <Label className="font-semibold text-slate-700 dark:text-[#D7E8DD]">
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
              <SelectTrigger className="mt-2 h-11 w-full rounded-xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                <SelectValue placeholder="Select office" />
              </SelectTrigger>

              <SelectContent className="border-slate-200 bg-white dark:border-[#214234] dark:bg-[#102418]">
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
                      className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white"
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
            <Label className="font-semibold text-slate-700 dark:text-[#D7E8DD]">
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
              className="mt-2 rounded-xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
              placeholder="Optional remarks..."
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="rounded-xl cursor-pointer dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
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
              className="rounded-xl cursor-pointer bg-green-700 text-white transition-colors hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
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