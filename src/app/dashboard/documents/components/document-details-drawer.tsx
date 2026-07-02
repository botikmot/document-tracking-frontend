'use client';

import {
  CalendarDays,
  Building2,
  FileText,
  Shield,
  AlertCircle,
  Paperclip
} from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import {
  Badge,
} from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Separator,
} from '@/components/ui/separator';
import { downloadRoutingSlip } from '@/lib/download-routing-slip';
import QRCode from 'qrcode';

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any;
}

export function DocumentDetailsDrawer({
  open,
  onOpenChange,
  document,
}: Props) {
  if (!document) {
    return null;
  }

  const handleDownloadRoutingSlip =
  async () => {
    const trackingUrl = `${window.location.origin}/track/${document.trackingNumber}`;

    const qrCode =
      await QRCode.toDataURL(
        trackingUrl,
      );

    await downloadRoutingSlip({
      trackingNumber:
        document.trackingNumber,

      title:
        document.title,

      description:
        document.description,

      sender:
         document.senderType === 'OFFICE'
          ? document.senderOffice?.officeName
          : document.senderName,

      classification:
        document.classification,

      priority:
        document.priority,
      
      addressee:
            document.addressee,

      createdAt:
        new Date(
          document.createdAt,
        ).toLocaleString(),

      qrCode,
    });
  };


  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-0 transition-colors dark:bg-[#07150D] sm:!max-w-4xl"
      >
        <SheetHeader className="border-b border-slate-200 pb-5 transition-colors dark:border-[#214234]">
          <SheetTitle className="text-2xl font-black text-[#102418] dark:text-[#F3F8F3]">
            Document Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8 px-6 py-6 pb-10">
          {/* TITLE */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-colors dark:border-[#214234] dark:bg-[#102418]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white transition-colors dark:bg-[#173227]">
                <FileText className="h-7 w-7 text-slate-700 dark:text-[#A9C5B6]" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-[#F3F8F3]">
                  {document.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Tracking Number:{' '}
                  {
                    document.trackingNumber
                  }
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Sender:{'  '}
                  <span className="font-bold dark:text-[#F3F8F3]">
                  {
                    document.senderType === 'OFFICE' ? document.senderOffice.officeName : document.senderName
                  }
                  </span>
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-blue-100 text-blue-700">
                    {
                      document
                        .documentType
                        ?.name
                    }
                  </Badge>

                  <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                    {
                      document
                        .currentStatus
                        ?.name
                    }
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto rounded-xl cursor-pointer dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
                    onClick={() =>
                      handleDownloadRoutingSlip()
                    }
                  >
                    Download Routing Slip
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-[#F3F8F3]">
              Description
            </h3>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 transition-colors dark:border-[#214234] dark:bg-[#102418] dark:text-[#A9C5B6]">
              {document.description ||
                'No description'}
            </div>
          </div>

          <Separator className="dark:bg-[#214234]" />

          {/* DETAILS GRID */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-[#214234] dark:bg-[#102418]">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Current Office
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {
                      document
                        .currentOffice
                        ?.officeName
                    }
                  </h4>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Deadline
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {document.deadline
                      ? new Date(
                          document.deadline,
                        ).toLocaleString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          },
                        )
                      : 'No deadline'}
                  </h4>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Priority
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {
                      document.priority ||
                      'N/A'
                    }
                  </h4>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Confidentiality
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {
                      document.confidentialityLevel ||
                      'N/A'
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* ATTACHMENTS (NEW ✨) */}
          {document.attachments?.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#102418] dark:text-[#F3F8F3]">
                <Paperclip className="h-5 w-5" />
                Attachments
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                document.attachments.map((file: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-[#214234] dark:bg-[#102418] dark:hover:bg-[#173227]"
                  >
                    <p className="font-medium text-slate-900 dark:text-[#F3F8F3]">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                      {file.type || 'File'}
                    </p>

                    {/* optional preview hook */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 cursor-pointer dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
                      onClick={() => window.open(file.filePath)}
                    >
                      Preview
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}