'use client';

import {
  pdf,
} from '@react-pdf/renderer';

import { saveAs } from 'file-saver';

import RoutingSlipPDF from '@/app/dashboard/documents/components/pdf/routing-slip-pdf';
import RoutingSlipPDFV2 from '@/app/dashboard/documents/components/pdf/routing-slip-pdf-v2';

import type {
  RoutingHistoryItem,
  RoutingSlipPdfV2Data,
} from '@/types/document';

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
  officeCode: string;
  documentType: string;
  routingHistory?: RoutingHistoryItem[];
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

export async function downloadRoutingSlipV2(
  data: RoutingSlipPdfV2Data,
) {
  const blob = await pdf(
    <RoutingSlipPDFV2
      data={data}
    />,
  ).toBlob();

  saveAs(
    blob,
    `${data.trackingNumber}-routing-slip-v2.pdf`,
  );
}