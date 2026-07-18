import {
  Document,
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';

import { styles } from './pdf-styles';

// Change this to your logo location.
// If using Vite/Next public folder:
// public/images/denr-logo.png
const LOGO = '/images/denr_logov2.png';

type DocumentItem = {
  id: string;
  trackingNumber: string;
  title: string;
  documentType: string;
  office: string;
  classification: string;
  status: string;
  deadline?: string | null;
  createdAt: string;
};

type Props = {
  documents: DocumentItem[];
  reportName?: string;
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

function formatDate(date?: string | null) {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'COMPLETED':
      return styles.statusCompleted;

    case 'ON_PROCESS':
      return styles.statusProcess;

    case 'PENDING':
      return styles.statusPending;

    case 'RETURNED':
      return styles.statusReturned;

    default:
      return {};
  }
}

function getDeadlineStyle(deadline?: string | null) {
  if (!deadline) return {};

  const today = new Date();

  const due = new Date(deadline);

  const diff =
    due.getTime() - today.getTime();

  const days = Math.ceil(
    diff / (1000 * 60 * 60 * 24),
  );

  if (days < 0)
    return styles.overdue;

  if (days <= 3)
    return styles.dueSoon;

  return {};
}

export function ReportPDF({
  documents,
  reportName = 'Document Tracking Report',
  reportType = 'General',
  year,
  month,
  quarter,
  incoming = 0,
  outgoing = 0,
  pending = 0,
  completed = 0,
  overdue = 0,
}: Props) {
  const generatedAt =
    new Date().toLocaleString();

  if(reportType === 'monthly' && month){
    reportName = "Monthly Report"
  }else if(reportType === 'quarterly' && quarter){
    reportName = "Quarterly Report"
  }else if(reportType === 'annual'){
    reportName = "Annual Report"
  }


  function getPeriod() {
    if (reportType === 'monthly' && month) {

      return new Date(
        year ?? new Date().getFullYear(),
        month - 1,
      ).toLocaleString('en-US', {
        month: 'long',
      });
    }

    if (reportType === 'quarterly' && quarter) {
      return `Quarter ${quarter}`;
    }

    if (reportType === 'annual') {
      return '-';
    }

    return '-';
  }

  const FIRST_PAGE_ROWS = 7;
  const OTHER_PAGE_ROWS = 18;

  function paginateDocuments(documents: DocumentItem[]) {
    const firstPage = documents.slice(0, FIRST_PAGE_ROWS);

    const remaining = documents.slice(FIRST_PAGE_ROWS);

    const otherPages: DocumentItem[][] = [];

    for (let i = 0; i < remaining.length; i += OTHER_PAGE_ROWS) {
      otherPages.push(
        remaining.slice(i, i + OTHER_PAGE_ROWS),
      );
    }

    return {
      firstPage,
      otherPages,
    };
  }

  function TableHeader() {
    return (
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.no]}>#</Text>

        <Text style={[styles.headerCell, styles.tracking]}>
          Tracking No.
        </Text>

        <Text style={[styles.headerCell, styles.title]}>
          Title
        </Text>

        <Text style={[styles.headerCell, styles.type]}>
          Type
        </Text>

        <Text style={[styles.headerCell, styles.office]}>
          Current Office
        </Text>

        <Text style={[styles.headerCell, styles.classification]}>
          Classification
        </Text>

        <Text style={[styles.headerCell, styles.deadline]}>
          Deadline
        </Text>

        <Text style={[styles.headerCell, styles.status]}>
          Status
        </Text>
      </View>
    );
  }

  function TableRow({
    doc,
    index,
  }: {
    doc: DocumentItem;
    index: number;
  }) {
    return (
      <View
        style={[
          styles.row,
          index % 2 === 0
            ? styles.alternateRow
            : {},
        ]}
      >
        <Text style={[styles.cell, styles.no]}>
          {index + 1}
        </Text>

        <Text style={[styles.cell, styles.tracking]}>
          {doc.trackingNumber}
        </Text>

        <Text style={[styles.cell, styles.title]}>
          {doc.title}
        </Text>

        <Text style={[styles.cell, styles.type]}>
          {doc.documentType}
        </Text>

        <Text style={[styles.cell, styles.office]}>
          {doc.office}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.classification,
          ]}
        >
          {doc.classification}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.deadline,
            getDeadlineStyle(doc.deadline),
          ]}
        >
          {formatDate(doc.deadline)}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.status,
            getStatusStyle(doc.status),
          ]}
        >
          {doc.status.replaceAll('_', ' ')}
        </Text>
      </View>
    );
  }

  const { firstPage, otherPages } = paginateDocuments(documents);

  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={styles.page}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Image
            src={LOGO}
            style={styles.logo}
          />

          <View style={styles.headerText}>
            <Text style={styles.republic}>
              Republic of the Philippines
            </Text>

            <Text style={styles.department}>
              Department of Environment and Natural Resources | Caraga
            </Text>

            <Text style={styles.system}>
              Electronic Document Tracking System (eDATS)
            </Text>

            <Text style={styles.reportTitle}>
              Document Tracking Report
            </Text>
          </View>
        </View>

        {/* REPORT INFORMATION */}

        <View style={styles.metadataContainer}>

          <View style={styles.metadataLeft}>

            <Text style={styles.sectionTitle}>
              REPORT INFORMATION
            </Text>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>
                Report Name
              </Text>

              <Text 
              style={[
                  styles.metadataValue,
                  {
                    fontWeight: 'bold',
                  },
                ]}>
                {reportName}
              </Text>
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>
                Year
              </Text>

              <Text style={styles.metadataValue}>
                {year ?? '-'}
              </Text>
            </View>

            {month && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>
                  Month
                </Text>

                <Text style={styles.metadataValue}>
                  {getPeriod()}
                </Text>
              </View>
            )}

            {quarter && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>
                  Quarter
                </Text>

                <Text style={styles.metadataValue}>
                  Q{quarter}
                </Text>
              </View>
            )}

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>
                Generated
              </Text>

              <Text style={styles.metadataValue}>
                {generatedAt}
              </Text>
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>
                Total Documents
              </Text>

              <Text style={styles.metadataValue}>
                {documents.length}
              </Text>
            </View>

          </View>

          {/* <View style={styles.metadataRight}> */}
          <View style={styles.summarySection}>

            <Text style={styles.sectionTitle}>
              DOCUMENT SUMMARY
            </Text>

            <View style={styles.summaryCards}>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardTitle}>
                  Incoming
                </Text>

                <Text style={styles.summaryCardValue}>
                  {incoming}
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardTitle}>
                  Outgoing
                </Text>

                <Text style={styles.summaryCardValue}>
                  {outgoing}
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardTitle}>
                  Pending
                </Text>

                <Text style={styles.summaryCardValue}>
                  {pending}
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardTitle}>
                  Completed
                </Text>

                <Text style={styles.summaryCardValue}>
                  {completed}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  overdue > 0
                    ? styles.summaryCardDanger
                    : {},
                ]}
              >
                <Text style={styles.summaryCardTitle}>
                  Overdue
                </Text>

                <Text
                  style={[
                    styles.summaryCardValue,
                    overdue > 0
                      ? styles.summaryCardValueDanger
                      : {},
                  ]}
                >
                  {overdue}
                </Text>
              </View>

            </View>
          </View>
        </View>

        {/* TABLE */}

        <View style={styles.table}>
          {/* HEADER */}

          <View
            style={
              styles.tableHeader
            }
            fixed
          >
            <Text
              style={[
                styles.headerCell,
                styles.no,
              ]}
            >
              #
            </Text>

            <Text
              style={[
                styles.headerCell,
                styles.tracking,
              ]}
            >
              Tracking No.
            </Text>

            <Text
              style={[
                styles.headerCell,
                styles.title,
              ]}
            >
              Title
            </Text>

            <Text
              style={[
                styles.headerCell,
                styles.type,
              ]}
            >
              Type
            </Text>

            <Text
              style={[
                styles.headerCell,
                styles.office,
              ]}
            >
              Current Office
            </Text>

            <Text
              style={[
                styles.headerCell,
                styles.classification,
              ]}
            >
              Classification
            </Text>

            <Text
              style={[
                styles.headerCell,
                styles.deadline,
              ]}
            >
              Deadline
            </Text>

            <Text
              style={[
                styles.headerCell,
                styles.status,
              ]}
            >
              Status
            </Text>
          </View>

          {/* ROWS */}

          {firstPage.map((doc, index) => (
            <TableRow
              key={doc.id}
              doc={doc}
              index={index}
            />
          ))}

        </View>

        {/* FOOTER */}

        <Text
          fixed
          style={{
            position: 'absolute',
            left: 30,
            bottom: 18,
            fontSize: 8,
            color: '#666',
          }}
        >
          Generated by eDATS
        </Text>

        <Text
          fixed
          style={{
            position: 'absolute',
            right: 30,
            bottom: 18,
            fontSize: 8,
            color: '#666',
          }}
          render={({
            pageNumber,
            totalPages,
          }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>


      {otherPages.map((page, pageIndex) => (
            <Page
              key={pageIndex}
              size="A4"
              orientation="landscape"
              style={styles.page}
            >

              {/* Compact Header */}

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#006838',
                  marginBottom: 12,
                }}
              >
                Document Tracking Report
              </Text>

              <View style={styles.table}>
                <TableHeader />

                {page.map((doc, rowIndex) => (
                  <TableRow
                    key={doc.id}
                    doc={doc}
                    index={
                      FIRST_PAGE_ROWS +
                      pageIndex * OTHER_PAGE_ROWS +
                      rowIndex
                    }
                  />
                ))}
              </View>

              <Text
                fixed
                style={{
                  position: 'absolute',
                  left: 30,
                  bottom: 18,
                  fontSize: 8,
                }}
              >
                Generated by eDATS
              </Text>

              <Text
                fixed
                style={{
                  position: 'absolute',
                  right: 30,
                  bottom: 18,
                  fontSize: 8,
                }}
                render={({ pageNumber, totalPages }) =>
                  `Page ${pageNumber} of ${totalPages}`
                }
              />
            </Page>
          ))}

    </Document>
  );
}