'use client';

import {
  pdf,
} from '@react-pdf/renderer';

import { saveAs } from 'file-saver';

import RoutingSlipPDF from '@/app/dashboard/documents/components/pdf/routing-slip-pdf';
import RoutingSlipPDFV2, {
  type RoutingSlipPdfV2DataWithResponsibilities,
} from '@/app/dashboard/documents/components/pdf/routing-slip-pdf-v2';

import type {
  RoutingHistoryItem,
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

/**
 * Generates the official V2 routing slip as a Blob.
 * This can be used for an embedded preview, printing, or downloading.
 */
export async function generateRoutingSlipV2Blob(
  data: RoutingSlipPdfV2DataWithResponsibilities,
): Promise<Blob> {
  return pdf(
    <RoutingSlipPDFV2
      data={data}
    />,
  ).toBlob();
}

/**
 * Keeps the existing download API backward-compatible.
 */
export async function downloadRoutingSlipV2(
  data: RoutingSlipPdfV2DataWithResponsibilities,
) {
  const blob = await generateRoutingSlipV2Blob(data);

  saveAs(
    blob,
    `${data.trackingNumber}-routing-slip-v2.pdf`,
  );
}
