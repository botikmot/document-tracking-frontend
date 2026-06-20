'use client';

import {
  Download,
  FileSpreadsheet,
  FileText,
  Table,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';
import {
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { exportCSV } from '../utils/export-csv';
import { exportExcel } from '../utils/export-excel';
import { ReportPDF } from '../pdf/ReportPDF';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[];
  reportName: string;
  reportType?: string;
  year?: number;
  month?: number;
  quarter?: number;
};

export function ExportButtons({
  documents,
  reportName,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">

      {/* PDF */}

      <PDFDownloadLink
        document={
          <ReportPDF
            documents={
              documents
            }
          />
        }
        fileName={`${reportName}.pdf`}
      >
        {({
          loading,
        }) => (
          <Button className="rounded-2xl bg-red-600 hover:bg-red-700">

            <FileText className="mr-2 h-4 w-4" />

            {loading
              ? 'Generating...'
              : 'Export PDF'}

          </Button>
        )}
      </PDFDownloadLink>

      {/* Excel */}

      <Button
        className="rounded-2xl bg-emerald-600 hover:bg-emerald-700"
        onClick={() =>
          exportExcel(
            documents,
            `${reportName}.xlsx`,
          )
        }
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />

        Export Excel
      </Button>

      {/* CSV */}

      <Button
        className="rounded-2xl bg-blue-600 hover:bg-blue-700"
        onClick={() =>
          exportCSV(
            documents,
            `${reportName}.csv`,
          )
        }
      >
        <Table className="mr-2 h-4 w-4" />

        Export CSV
      </Button>

      {/* Future */}

      {/* <Button
        variant="outline"
        className="rounded-2xl"
      >
        <Download className="mr-2 h-4 w-4" />

        More
      </Button> */}

    </div>
  );
}