'use client';

import {
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import RoutingSlipPDF from './routing-slip-pdf';

type Props = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;

  documentData: {
    trackingNumber: string;
    title: string;
    description: string;
    sender: string;
    classification: string;
    priority: string;
    addressee: string;
    createdAt: string;
    qrCode: string;
  };
};

export default function RoutingSlipPreviewDialog({
  open,
  onOpenChange,
  documentData,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-6xl h-[95vh]">
        <DialogHeader>
          <DialogTitle>
            Routing Slip Preview
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end">
          <PDFDownloadLink
            document={
              <RoutingSlipPDF
                {...documentData}
              />
            }
            fileName={`${documentData.trackingNumber}-routing-slip.pdf`}
          >
            {({
              loading,
            }) => (
              <Button>
                {loading
                  ? 'Preparing PDF...'
                  : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>

        <div className="flex-1 overflow-hidden rounded-xl border">
          <PDFViewer
            width="100%"
            height="100%"
          >
            <RoutingSlipPDF
              {...documentData}
            />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}