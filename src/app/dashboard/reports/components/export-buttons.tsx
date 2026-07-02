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
  incoming?: number;
  outgoing?: number;
  pending?: number;
  completed?: number;
  overdue?: number;
};

export function ExportButtons({
  documents,
  reportName,
  reportType,
  year,
  month,
  quarter,
  incoming = 0,
  outgoing = 0,
  pending = 0,
  completed = 0,
  overdue = 0,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 justify-end">

      {/* PDF */}

      <PDFDownloadLink
        document={
          <ReportPDF
            documents={
              documents
            }
            reportType={reportType}
            year={year}
            month={month}
            quarter={quarter}
            incoming={incoming}
            outgoing={outgoing}
            pending={pending}
            completed={completed}
            overdue={overdue}
          />
        }
        fileName={`${reportName}.pdf`}
      >
        {({
          loading,
        }) => (
          <Button className="rounded-2xl cursor-pointer bg-red-600 hover:bg-red-700 dark:text-white">

            <FileText className="mr-2 h-4 w-4" />

            {loading
              ? 'Generating...'
              : 'Export PDF'}

          </Button>
        )}
      </PDFDownloadLink>

      {/* Excel */}

      {/* <Button
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
      </Button> */}

      {/* CSV */}

      {/* <Button
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
      </Button> */}

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