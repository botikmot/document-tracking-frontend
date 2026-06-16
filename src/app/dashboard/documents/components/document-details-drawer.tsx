'use client';

import {
  CalendarDays,
  Building2,
  FileText,
  Shield,
  AlertCircle,
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
        className="w-full overflow-y-auto border-0 sm:!max-w-4xl"
      >
        <SheetHeader className="border-b pb-5">
          <SheetTitle className="text-2xl font-black">
            Document Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8 px-6 py-6 pb-10">
          {/* TITLE */}
          <div className="rounded-3xl border bg-slate-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                <FileText className="h-7 w-7 text-slate-700" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900">
                  {document.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Tracking Number:{' '}
                  {
                    document.trackingNumber
                  }
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
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
                    className="ml-auto rounded-xl cursor-pointer"
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
            <h3 className="mb-3 text-lg font-bold text-slate-900">
              Description
            </h3>

            <div className="rounded-2xl border bg-white p-5 text-sm leading-7 text-slate-600">
              {document.description ||
                'No description'}
            </div>
          </div>

          <Separator />

          {/* DETAILS GRID */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-sm text-slate-500">
                    Current Office
                  </p>

                  <h4 className="font-bold text-slate-900">
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
                <CalendarDays className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-sm text-slate-500">
                    Deadline
                  </p>

                  <h4 className="font-bold text-slate-900">
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
                <AlertCircle className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-sm text-slate-500">
                    Priority
                  </p>

                  <h4 className="font-bold text-slate-900">
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
                <Shield className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-sm text-slate-500">
                    Confidentiality
                  </p>

                  <h4 className="font-bold text-slate-900">
                    {
                      document.confidentialityLevel ||
                      'N/A'
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* REFERENCE */}
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-slate-500">
              Reference Number
            </p>

            <h4 className="mt-2 text-lg font-bold text-slate-900">
              {document.referenceNumber ||
                'N/A'}
            </h4>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}