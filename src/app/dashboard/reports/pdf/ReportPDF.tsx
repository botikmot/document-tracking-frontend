import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { styles } from './pdf-styles';

const LOGO =
  '/images/denr_logov2.png';

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type OfficeStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'RETURNED'
  | null;

type DocumentItem = {
  id: string;

  trackingNumber: string;

  title: string;

  documentType: string;

  office: string;

  classification:
    | string
    | null;

  /*
   * Overall/global document status.
   */
  status: string;

  /*
   * Status of the document
   * relative to the selected office.
   */
  officeStatus: OfficeStatus;

  routedToOffice:
    | string
    | null;

  priority?:
    | string
    | null;

  deadline:
    | string
    | null;

  allottedTimeMs:
    | number
    | null;

  timeInOfficeMs:
    | number
    | null;

  isOverdue?: boolean;

  deadlineStatus?:
    | 'NO_DEADLINE'
    | 'AWAITING_RECEIPT'
    | 'ON_TIME'
    | 'OVERDUE';

  createdAt: string;
};

type Props = {
  documents: DocumentItem[];

  officeName?: string;

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

  averageProcessingHours?: number;

  processingEfficiency?: number;
};

/*
|--------------------------------------------------------------------------
| LOCAL LAYOUT STYLES
|--------------------------------------------------------------------------
|
| These styles control the Report Information,
| Document Summary and Office Performance area.
|
| Keeping these here prevents the 3-column squeeze
| from the previous layout.
|
*/

const localStyles = StyleSheet.create({
  reportOverview: {
    flexDirection: 'row',

    borderWidth: 1,
    borderColor: '#D1D5DB',

    backgroundColor: '#F8FAF8',

    padding: 12,

    marginTop: 18,
    marginBottom: 18,
  },

  infoPanel: {
    width: '31%',

    paddingRight: 14,

    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },

  metricsPanel: {
    width: '69%',

    paddingLeft: 14,
  },

  metricsSection: {
    width: '100%',
  },

  performanceSection: {
    width: '100%',

    marginTop: 12,

    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: '#DDE6DF',
  },

  sectionHeading: {
    fontSize: 10,

    fontWeight: 'bold',

    color: '#006838',

    marginBottom: 8,
  },

  metricRow: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    width: '100%',
  },

  metricCard: {
    width: '18.5%',

    minHeight: 48,

    borderWidth: 1,
    borderColor: '#07813C',

    borderRadius: 5,

    paddingHorizontal: 4,
    paddingVertical: 6,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F7FCF8',
  },

  metricCardDanger: {
    borderColor: '#DC2626',

    backgroundColor: '#FEF2F2',
  },

  metricLabel: {
    fontSize: 6.5,

    color: '#555',

    textAlign: 'center',

    marginBottom: 4,
  },

  metricValue: {
    fontSize: 14,

    fontWeight: 'bold',

    color: '#08783F',

    textAlign: 'center',
  },

  metricValueDanger: {
    color: '#DC2626',
  },

  officeValue: {
    color: '#006838',

    fontWeight: 'bold',
  },
});

/*
|--------------------------------------------------------------------------
| DATE FORMATTER
|--------------------------------------------------------------------------
*/

function formatDate(
  date?: string | null,
) {
  if (!date) {
    return '-';
  }

  const value =
    new Date(date);

  if (
    Number.isNaN(
      value.getTime(),
    )
  ) {
    return '-';
  }

  return value.toLocaleDateString(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    },
  );
}

/*
|--------------------------------------------------------------------------
| DURATION FORMATTER
|--------------------------------------------------------------------------
*/

function formatDuration(
  milliseconds?:
    | number
    | null,
  showSeconds = false,
) {
  if (
    milliseconds === null ||
    milliseconds === undefined
  ) {
    return '-';
  }

  if (
    milliseconds > 0 &&
    milliseconds < 1000
  ) {
    return '<1s';
  }

  const totalSeconds =
    Math.floor(
      milliseconds /
        1000,
    );

  const days =
    Math.floor(
      totalSeconds /
        86400,
    );

  const hours =
    Math.floor(
      (totalSeconds %
        86400) /
        3600,
    );

  const minutes =
    Math.floor(
      (totalSeconds %
        3600) /
        60,
    );

  const seconds =
    totalSeconds % 60;

  const parts: string[] =
    [];

  if (days > 0) {
    parts.push(
      `${days}d`,
    );
  }

  if (hours > 0) {
    parts.push(
      `${hours}h`,
    );
  }

  if (minutes > 0) {
    parts.push(
      `${minutes}m`,
    );
  }

  if (
    showSeconds &&
    seconds > 0
  ) {
    parts.push(
      `${seconds}s`,
    );
  }

  if (
    parts.length === 0
  ) {
    return showSeconds
      ? '0s'
      : '0m';
  }

  return parts.join(' ');
}

/*
|--------------------------------------------------------------------------
| AVERAGE PROCESSING TIME
|--------------------------------------------------------------------------
*/

function formatAverageHours(
  hours: number,
) {
  if (
    !hours ||
    hours <= 0
  ) {
    return '0m';
  }

  const totalMinutes =
    Math.round(
      hours * 60,
    );

  const days =
    Math.floor(
      totalMinutes /
        1440,
    );

  const remainingMinutes =
    totalMinutes % 1440;

  const displayHours =
    Math.floor(
      remainingMinutes /
        60,
    );

  const minutes =
    remainingMinutes %
    60;

  const parts: string[] =
    [];

  if (days > 0) {
    parts.push(
      `${days}d`,
    );
  }

  if (
    displayHours > 0
  ) {
    parts.push(
      `${displayHours}h`,
    );
  }

  if (minutes > 0) {
    parts.push(
      `${minutes}m`,
    );
  }

  return (
    parts.join(' ') ||
    '0m'
  );
}

/*
|--------------------------------------------------------------------------
| CLASSIFICATION
|--------------------------------------------------------------------------
*/

function getClassificationLabel(
  classification?:
    | string
    | null,
) {
  if (
    !classification
  ) {
    return '-';
  }

  if (
    classification ===
    'TECHNICAL'
  ) {
    return 'HIGHLY TECHNICAL';
  }

  return classification.replaceAll(
    '_',
    ' ',
  );
}

/*
|--------------------------------------------------------------------------
| OFFICE STATUS LABEL
|--------------------------------------------------------------------------
*/

function getOfficeStatusLabel(
  status?: OfficeStatus,
) {
  switch (status) {
    case 'PENDING':
      return 'AWAITING RECEIPT';

    case 'RECEIVED':
      return 'IN CUSTODY';

    case 'COMPLETED':
      return 'ACTED';

    case 'RETURNED':
      return 'RETURNED';

    default:
      return '-';
  }
}

/*
|--------------------------------------------------------------------------
| STATUS STYLE
|--------------------------------------------------------------------------
*/

function getStatusStyle(
  status?: OfficeStatus,
) {
  switch (status) {
    case 'COMPLETED':
      return styles.statusCompleted;

    case 'RECEIVED':
      return styles.statusProcess;

    case 'PENDING':
      return styles.statusPending;

    case 'RETURNED':
      return styles.statusReturned;

    default:
      return {};
  }
}

/*
|--------------------------------------------------------------------------
| ROUTING / CUSTODY
|--------------------------------------------------------------------------
*/

function getRoutingCustody(
  doc: DocumentItem,
) {
  switch (
    doc.officeStatus
  ) {
    case 'PENDING':
      return 'Awaiting Receipt';

    case 'RECEIVED':
      return 'In Custody';

    case 'COMPLETED':
      if (
        doc.routedToOffice
      ) {
        return `Routed to ${doc.routedToOffice}`;
      }

      return 'Completed';

    case 'RETURNED':
      return 'Returned';

    default:
      return (
        doc.office ||
        '-'
      );
  }
}

/*
|--------------------------------------------------------------------------
| DEADLINE STYLE
|--------------------------------------------------------------------------
*/

function getDeadlineStyle(
  doc: DocumentItem,
) {
  if (!doc.deadline) {
    return {};
  }

  if (
    doc.isOverdue ||
    doc.deadlineStatus ===
      'OVERDUE'
  ) {
    return styles.overdue;
  }

  if (
    doc.officeStatus ===
    'COMPLETED'
  ) {
    return {};
  }

  const now =
    new Date();

  const deadline =
    new Date(
      doc.deadline,
    );

  const difference =
    deadline.getTime() -
    now.getTime();

  const days =
    Math.ceil(
      difference /
        (1000 *
          60 *
          60 *
          24),
    );

  if (days <= 3) {
    return styles.dueSoon;
  }

  return {};
}

/*
|--------------------------------------------------------------------------
| SUMMARY / PERFORMANCE CARD
|--------------------------------------------------------------------------
*/

function MetricCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value:
    | string
    | number;
  danger?: boolean;
}) {
  return (
    <View
      style={[
        localStyles.metricCard,

        danger
          ? localStyles.metricCardDanger
          : {},
      ]}
    >
      <Text
        style={
          localStyles.metricLabel
        }
      >
        {label}
      </Text>

      <Text
        style={[
          localStyles.metricValue,

          danger
            ? localStyles.metricValueDanger
            : {},
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| TABLE HEADER
|--------------------------------------------------------------------------
*/

function TableHeader() {
  return (
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
        Routing / Custody
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
          styles.allottedTime,
        ]}
      >
        Allotted Time
      </Text>

      <Text
        style={[
          styles.headerCell,
          styles.timeInOffice,
        ]}
      >
        Time in Office
      </Text>

      <Text
        style={[
          styles.headerCell,
          styles.status,
        ]}
      >
        Office Status
      </Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| TABLE ROW
|--------------------------------------------------------------------------
*/

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
      {/* NUMBER */}

      <Text
        style={[
          styles.cell,
          styles.no,
        ]}
      >
        {index + 1}
      </Text>

      {/* TRACKING */}

      <Text
        style={[
          styles.cell,
          styles.tracking,
        ]}
      >
        {doc.trackingNumber}
      </Text>

      {/* TITLE */}

      <Text
        style={[
          styles.cell,
          styles.title,
        ]}
      >
        {doc.title}
      </Text>

      {/* TYPE */}

      <Text
        style={[
          styles.cell,
          styles.type,
        ]}
      >
        {doc.documentType}
      </Text>

      {/* ROUTING / CUSTODY */}

      <Text
        style={[
          styles.cell,
          styles.office,
        ]}
      >
        {getRoutingCustody(
          doc,
        )}
      </Text>

      {/* CLASSIFICATION */}

      <Text
        style={[
          styles.cell,
          styles.classification,
          {
            fontSize: 6.5,
          },
        ]}
      >
        {getClassificationLabel(
          doc.classification,
        )}
      </Text>

      {/* DEADLINE */}

      <Text
        style={[
          styles.cell,
          styles.deadline,

          getDeadlineStyle(
            doc,
          ),
        ]}
      >
        {formatDate(
          doc.deadline,
        )}
      </Text>

      {/* ALLOTTED TIME */}

      <Text
        style={[
          styles.cell,
          styles.allottedTime,
        ]}
      >
        {formatDuration(
          doc.allottedTimeMs,
        )}
      </Text>

      {/* TIME IN OFFICE */}

      <Text
        style={[
          styles.cell,
          styles.timeInOffice,
        ]}
      >
        {formatDuration(
          doc.timeInOfficeMs,
          true,
        )}
      </Text>

      {/* OFFICE STATUS */}

      <Text
        style={[
          styles.cell,
          styles.status,

          getStatusStyle(
            doc.officeStatus,
          ),
        ]}
      >
        {getOfficeStatusLabel(
          doc.officeStatus,
        )}
      </Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

const FIRST_PAGE_ROWS = 5;

const OTHER_PAGE_ROWS = 16;

function paginateDocuments(
  documents: DocumentItem[],
) {
  const firstPage =
    documents.slice(
      0,
      FIRST_PAGE_ROWS,
    );

  const remaining =
    documents.slice(
      FIRST_PAGE_ROWS,
    );

  const otherPages:
    DocumentItem[][] = [];

  for (
    let index = 0;
    index <
    remaining.length;
    index +=
      OTHER_PAGE_ROWS
  ) {
    otherPages.push(
      remaining.slice(
        index,
        index +
          OTHER_PAGE_ROWS,
      ),
    );
  }

  return {
    firstPage,
    otherPages,
  };
}

/*
|--------------------------------------------------------------------------
| REPORT PDF
|--------------------------------------------------------------------------
*/

export function ReportPDF({
  documents,

  officeName =
    'N/A',

  reportName =
    'Document Tracking Report',

  reportType =
    'General',

  year,

  month,

  quarter,

  incoming = 0,

  outgoing = 0,

  pending = 0,

  completed = 0,

  overdue = 0,

  averageProcessingHours = 0,

  processingEfficiency = 0,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | GENERATED DATE
  |--------------------------------------------------------------------------
  */

  const generatedAt =
    new Date().toLocaleString(
      'en-PH',
    );

  /*
  |--------------------------------------------------------------------------
  | REPORT NAME
  |--------------------------------------------------------------------------
  */

  let displayReportName =
    reportName;

  if (
    reportType ===
      'monthly' &&
    month
  ) {
    displayReportName =
      'Monthly Report';
  } else if (
    reportType ===
      'quarterly' &&
    quarter
  ) {
    displayReportName =
      'Quarterly Report';
  } else if (
    reportType ===
    'annual'
  ) {
    displayReportName =
      'Annual Report';
  }

  /*
  |--------------------------------------------------------------------------
  | MONTH NAME
  |--------------------------------------------------------------------------
  */

  const getMonthName =
    () => {
      if (
        reportType !==
          'monthly' ||
        !month
      ) {
        return '-';
      }

      return new Date(
        year ??
          new Date()
            .getFullYear(),

        month - 1,
      ).toLocaleString(
        'en-US',
        {
          month: 'long',
        },
      );
    };

  /*
  |--------------------------------------------------------------------------
  | PERFORMANCE
  |--------------------------------------------------------------------------
  */

  const actedRate =
    documents.length === 0
      ? 0
      : Number(
          (
            (completed /
              documents.length) *
            100
          ).toFixed(1),
        );

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const {
    firstPage,
    otherPages,
  } =
    paginateDocuments(
      documents,
    );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <Document>
      {/* ==============================================================
          FIRST PAGE
      ============================================================== */}

      <Page
        size="A4"
        orientation="landscape"
        style={styles.page}
      >
        {/* ============================================================
            HEADER
        ============================================================ */}

        <View
          style={
            styles.header
          }
        >
          <Image
            src={LOGO}
            style={
              styles.logo
            }
          />

          <View
            style={
              styles.headerText
            }
          >
            <Text
              style={
                styles.republic
              }
            >
              Republic of the
              Philippines
            </Text>

            <Text
              style={
                styles.department
              }
            >
              Department of
              Environment and
              Natural Resources |
              Caraga
            </Text>

            <Text
              style={
                styles.system
              }
            >
              Electronic Document
              Tracking System
              (eDATS)
            </Text>

            <Text
              style={
                styles.reportTitle
              }
            >
              Document Tracking
              Report
            </Text>
          </View>
        </View>

        {/* ============================================================
            REPORT OVERVIEW
        ============================================================ */}

        <View
          style={
            localStyles.reportOverview
          }
        >
          {/* ==========================================================
              LEFT: REPORT INFORMATION
          ========================================================== */}

          <View
            style={
              localStyles.infoPanel
            }
          >
            <Text
              style={
                localStyles.sectionHeading
              }
            >
              REPORT INFORMATION
            </Text>

            {/* OFFICE */}

            <View
              style={
                styles.metadataRow
              }
            >
              <Text
                style={
                  styles.metadataLabel
                }
              >
                Office
              </Text>

              <Text
                style={[
                  styles.metadataValue,
                  localStyles.officeValue,
                ]}
              >
                {officeName}
              </Text>
            </View>

            {/* REPORT NAME */}

            <View
              style={
                styles.metadataRow
              }
            >
              <Text
                style={
                  styles.metadataLabel
                }
              >
                Report Name
              </Text>

              <Text
                style={[
                  styles.metadataValue,
                  {
                    fontWeight:
                      'bold',
                  },
                ]}
              >
                {
                  displayReportName
                }
              </Text>
            </View>

            {/* YEAR */}

            <View
              style={
                styles.metadataRow
              }
            >
              <Text
                style={
                  styles.metadataLabel
                }
              >
                Year
              </Text>

              <Text
                style={
                  styles.metadataValue
                }
              >
                {year ?? '-'}
              </Text>
            </View>

            {/* MONTH */}

            {reportType ===
              'monthly' &&
              month && (
                <View
                  style={
                    styles.metadataRow
                  }
                >
                  <Text
                    style={
                      styles.metadataLabel
                    }
                  >
                    Month
                  </Text>

                  <Text
                    style={
                      styles.metadataValue
                    }
                  >
                    {getMonthName()}
                  </Text>
                </View>
              )}

            {/* QUARTER */}

            {reportType ===
              'quarterly' &&
              quarter && (
                <View
                  style={
                    styles.metadataRow
                  }
                >
                  <Text
                    style={
                      styles.metadataLabel
                    }
                  >
                    Quarter
                  </Text>

                  <Text
                    style={
                      styles.metadataValue
                    }
                  >
                    Q{quarter}
                  </Text>
                </View>
              )}

            {/* GENERATED */}

            <View
              style={
                styles.metadataRow
              }
            >
              <Text
                style={
                  styles.metadataLabel
                }
              >
                Generated
              </Text>

              <Text
                style={
                  styles.metadataValue
                }
              >
                {generatedAt}
              </Text>
            </View>

            {/* TOTAL */}

            <View
              style={
                styles.metadataRow
              }
            >
              <Text
                style={
                  styles.metadataLabel
                }
              >
                Total Documents
              </Text>

              <Text
                style={
                  styles.metadataValue
                }
              >
                {
                  documents.length
                }
              </Text>
            </View>
          </View>

          {/* ==========================================================
              RIGHT SIDE
          ========================================================== */}

          <View
            style={
              localStyles.metricsPanel
            }
          >
            {/* ========================================================
                DOCUMENT SUMMARY
            ======================================================== */}

            <View
              style={
                localStyles.metricsSection
              }
            >
              <Text
                style={
                  localStyles.sectionHeading
                }
              >
                DOCUMENT SUMMARY
              </Text>

              <View
                style={
                  localStyles.metricRow
                }
              >
                <MetricCard
                  label="Incoming"
                  value={incoming}
                />

                <MetricCard
                  label="Outgoing"
                  value={outgoing}
                />

                <MetricCard
                  label="Pending"
                  value={pending}
                />

                <MetricCard
                  label="Acted"
                  value={
                    completed
                  }
                />

                <MetricCard
                  label="Overdue"
                  value={overdue}
                  danger={
                    overdue > 0
                  }
                />
              </View>
            </View>

            {/* ========================================================
                OFFICE PERFORMANCE
            ======================================================== */}

            <View
              style={
                localStyles.performanceSection
              }
            >
              <Text
                style={
                  localStyles.sectionHeading
                }
              >
                OFFICE PERFORMANCE
              </Text>

              <View
                style={
                  localStyles.metricRow
                }
              >
                <MetricCard
                  label="Handled"
                  value={
                    documents.length
                  }
                />

                <MetricCard
                  label="Acted Upon"
                  value={
                    completed
                  }
                />

                <MetricCard
                  label="Action Rate"
                  value={`${actedRate}%`}
                />

                <MetricCard
                  label="Avg. Time"
                  value={formatAverageHours(
                    averageProcessingHours,
                  )}
                />

                <MetricCard
                  label="Efficiency"
                  value={`${processingEfficiency.toFixed(
                    1,
                  )}%`}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ============================================================
            TABLE
        ============================================================ */}

        <View
          style={
            styles.table
          }
        >
          <TableHeader />

          {firstPage.map(
            (
              doc,
              index,
            ) => (
              <TableRow
                key={doc.id}
                doc={doc}
                index={
                  index
                }
              />
            ),
          )}
        </View>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <Text
          fixed
          style={{
            position:
              'absolute',

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
            position:
              'absolute',

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

      {/* ==============================================================
          OTHER PAGES
      ============================================================== */}

      {otherPages.map(
        (
          pageDocuments,
          pageIndex,
        ) => (
          <Page
            key={
              pageIndex
            }
            size="A4"
            orientation="landscape"
            style={
              styles.page
            }
          >
            {/* COMPACT HEADER */}

            <View
              style={{
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 16,

                  fontWeight:
                    'bold',

                  color:
                    '#006838',
                }}
              >
                Document Tracking
                Report
              </Text>

              <Text
                style={{
                  marginTop: 2,

                  fontSize: 8,

                  color:
                    '#555',
                }}
              >
                {officeName} ·{' '}
                {
                  displayReportName
                }
              </Text>
            </View>

            {/* TABLE */}

            <View
              style={
                styles.table
              }
            >
              <TableHeader />

              {pageDocuments.map(
                (
                  doc,
                  rowIndex,
                ) => (
                  <TableRow
                    key={
                      doc.id
                    }
                    doc={doc}
                    index={
                      FIRST_PAGE_ROWS +
                      pageIndex *
                        OTHER_PAGE_ROWS +
                      rowIndex
                    }
                  />
                ),
              )}
            </View>

            {/* FOOTER */}

            <Text
              fixed
              style={{
                position:
                  'absolute',

                left: 30,

                bottom: 18,

                fontSize: 8,

                color:
                  '#666',
              }}
            >
              Generated by eDATS
            </Text>

            <Text
              fixed
              style={{
                position:
                  'absolute',

                right: 30,

                bottom: 18,

                fontSize: 8,

                color:
                  '#666',
              }}
              render={({
                pageNumber,
                totalPages,
              }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </Page>
        ),
      )}
    </Document>
  );
}