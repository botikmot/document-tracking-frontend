'use client';

import {
  pdf,
} from '@react-pdf/renderer';

import { saveAs } from 'file-saver';

import RoutingSlipPDF from '@/app/dashboard/documents/components/pdf/routing-slip-pdf';

type Props = {
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

export async function downloadRoutingSlip(
  data: Props,
) {
  const blob = await pdf(
    <RoutingSlipPDF
      {...data}
    />,
  ).toBlob();

  saveAs(
    blob,
    `${data.trackingNumber}-routing-slip.pdf`,
  );
}