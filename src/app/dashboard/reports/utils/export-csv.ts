import { saveAs } from 'file-saver';

export function exportCSV(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[],
  filename: string,
) {
  const headers = [
    'Tracking Number',
    'Title',
    'Type',
    'Status',
    'Office',
    'Priority',
    'Deadline',
  ];

  const rows = documents.map((doc) => [
    doc.trackingNumber,
    doc.title,
    doc.documentType.name,
    doc.status,
    doc.office,
    doc.priority,
    doc.deadline,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  saveAs(blob, filename);
}