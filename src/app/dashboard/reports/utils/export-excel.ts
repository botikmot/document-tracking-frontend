import * as XLSX from 'xlsx';

export function exportExcel(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[],
  filename: string,
) {
  const data = documents.map((doc) => ({
    Tracking: doc.trackingNumber,
    Title: doc.title,
    Type: doc.documentType.name,
    Status: doc.status,
    Office: doc.office,
    Priority: doc.priority,
    Deadline: doc.deadline,
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Reports',
  );

  XLSX.writeFile(
    workbook,
    filename,
  );
}