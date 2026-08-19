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
  | 'AWAITING_RECEIPT'
  | 'IN_CUSTODY'
  | 'FORWARDED'
  | 'COMPLETED'
  | 'RETURNED'
  | 'UNKNOWN'

  // Legacy values
  | 'PENDING'
  | 'RECEIVED'
  | null;

type DeadlineStatus =
  | 'NO_DEADLINE'
  | 'AWAITING_RECEIPT'
  | 'ON_TIME'
  | 'OVERDUE';

type DocumentItem = {
  id: string;

  trackingNumber: string;

  title: string;

  documentType: string;

  classification:
    | string
    | null;

  status: string;

  /*
   * Current Location
   */
  currentLocation?:
    | {
        officeId?: string;
        officeCode?: string;
        officeName: string;
        isInTransit?: boolean;
      }
    | string
    | null;

  /*
   * Legacy fallback
   */
  office?: string;

  /*
   * Office-relative status
   */
  officeStatus:
    OfficeStatus;

  /*
   * Responsibility
   */
  responsibleOffice?:
    | {
        id: string;
        officeCode?: string;
        officeName: string;
      }
    | null;

  responsiblePerson?:
    | string
    | null;

  responsibleParty?:
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
    DeadlineStatus;

  createdAt: string;
};

type Props = {
  documents:
    DocumentItem[];

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

  acted?: number;

  actionRate?: number;

  overdue?: number;

  averageProcessingHours?:
    number;

  processingEfficiency?:
    number;
};

/*
|--------------------------------------------------------------------------
| LOCAL STYLES
|--------------------------------------------------------------------------
*/

const localStyles =
  StyleSheet.create({
    /*
    |--------------------------------------------------------------------------
    | Report Overview
    |--------------------------------------------------------------------------
    */

    reportOverview: {
      flexDirection: 'row',

      borderWidth: 1,
      borderColor: '#D1D5DB',

      backgroundColor:
        '#F8FAF8',

      padding: 12,

      marginTop: 18,
      marginBottom: 18,
    },

    infoPanel: {
      width: '31%',

      paddingRight: 14,

      borderRightWidth: 1,
      borderRightColor:
        '#E5E7EB',
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
      borderTopColor:
        '#DDE6DF',
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
      justifyContent:
        'center',

      backgroundColor:
        '#F7FCF8',
    },

    metricCardDanger: {
      borderColor: '#DC2626',

      backgroundColor:
        '#FEF2F2',
    },

    metricLabel: {
      fontSize: 6.5,

      color: '#555555',

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

    /*
    |--------------------------------------------------------------------------
    | Table
    |--------------------------------------------------------------------------
    |
    | Same order as ReportsTable:
    |
    | Tracking
    | Subject
    | Type
    | Classification
    | Routing / Custody
    | Office Status
    | Priority
    | Allotted Time
    | Time in Office
    | Deadline Status
    | Deadline
    |
    */

    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#006838',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      minHeight: 30,
    },

    tableRow: {
      flexDirection: 'row',
      minHeight: 29,
      borderBottomWidth: 0.5,
      borderBottomColor: '#D1D5DB',
    },

    alternateRow: {
      backgroundColor: '#F8FAF8',
    },

    headerCell: {
      paddingHorizontal: 3,
      paddingVertical: 6,
      fontSize: 5.7,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },

    cell: {
      paddingHorizontal: 3,
      paddingVertical: 6,
      fontSize: 5.8,
      color: '#374151',
    },

    /*
    * Total = 100%
    */

    tracking: {
      width: '10%',
    },

    subject: {
      width: '12%',
    },

    type: {
      width: '8%',
    },

    classification: {
      width: '8%',
    },

    currentLocation: {
      width: '10%',
    },

    officeStatus: {
      width: '8%',
    },

    responsible: {
      width: '12%',
    },

    allottedTime: {
      width: '7%',
    },

    timeInOffice: {
      width: '7%',
    },

    deadlineStatus: {
      width: '9%',
    },

    deadline: {
      width: '9%',
    },

    officePending: {
      color: '#B45309',
      fontWeight: 'bold',
    },

    officeReceived: {
      color: '#1D4ED8',
      fontWeight: 'bold',
    },

    officeForwarded: {
      color: '#6D28D9',
      fontWeight: 'bold',
    },

    officeCompleted: {
      color: '#047857',
      fontWeight: 'bold',
    },

    officeReturned: {
      color: '#B91C1C',
      fontWeight: 'bold',
    },

    deadlineOverdue: {
      color: '#DC2626',
      fontWeight: 'bold',
    },

    deadlineOnTime: {
      color: '#047857',
      fontWeight: 'bold',
    },

    deadlineAwaiting: {
      color: '#B45309',
      fontWeight: 'bold',
    },

    deadlineNone: {
      color: '#6B7280',
    },

    /*
    |--------------------------------------------------------------------------
    | Office Status Colors
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Priority
    |--------------------------------------------------------------------------
    */

    priorityHigh: {
      color: '#DC2626',

      fontWeight: 'bold',
    },

    priorityMedium: {
      color: '#B45309',

      fontWeight: 'bold',
    },

    priorityLow: {
      color: '#047857',

      fontWeight: 'bold',
    },

    /*
    |--------------------------------------------------------------------------
    | Deadline Status
    |--------------------------------------------------------------------------
    */
  

    /*
    |--------------------------------------------------------------------------
    | Compact Header
    |--------------------------------------------------------------------------
    */

    compactHeader: {
      marginBottom: 12,
    },

    compactTitle: {
      fontSize: 16,

      fontWeight: 'bold',

      color: '#006838',
    },

    compactSubtitle: {
      marginTop: 2,

      fontSize: 8,

      color: '#555555',
    },

    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    footerLeft: {
      position: 'absolute',

      left: 30,

      bottom: 18,

      fontSize: 8,

      color: '#666666',
    },

    footerRight: {
      position: 'absolute',

      right: 30,

      bottom: 18,

      fontSize: 8,

      color: '#666666',
    },
  });

/*
|--------------------------------------------------------------------------
| DATE
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

function getResponsibleParty(
  doc: DocumentItem,
) {
  /*
   * Responsible Office has priority.
   */
  if (
    doc.responsibleOffice
      ?.officeName
  ) {
    return doc
      .responsibleOffice
      .officeName;
  }

  /*
   * Then Responsible Person.
   */
  if (
    doc.responsiblePerson
      ?.trim()
  ) {
    return doc
      .responsiblePerson
      .trim();
  }

  /*
   * Backend convenience field fallback.
   */
  if (
    doc.responsibleParty
      ?.trim()
  ) {
    return doc
      .responsibleParty
      .trim();
  }

  return '-';
}

/*
|--------------------------------------------------------------------------
| DURATION
|--------------------------------------------------------------------------
*/

function formatDuration(
  milliseconds?:
    | number
    | null,

  showSeconds = false,
) {
  if (
    milliseconds ===
      null ||
    milliseconds ===
      undefined
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
| AVERAGE PROCESSING HOURS
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
    remainingMinutes % 60;

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
  if (!classification) {
    return '-';
  }

  if (
    classification ===
    'TECHNICAL'
  ) {
    return 'HIGHLY TECHNICAL';
  }

  return classification
    .replaceAll(
      '_',
      ' ',
    );
}

/*
|--------------------------------------------------------------------------
| ROUTING / CUSTODY
|--------------------------------------------------------------------------
*/

function getCurrentLocation(
  doc: DocumentItem,
) {
  if (
    typeof doc.currentLocation ===
    'string'
  ) {
    return (
      doc.currentLocation ||
      '-'
    );
  }

  const officeName =
    doc.currentLocation
      ?.officeName ??
    doc.office ??
    '-';

  if (
    doc.currentLocation
      ?.isInTransit
  ) {
    return `In Transit → ${officeName}`;
  }

  return officeName;
}

/*
|--------------------------------------------------------------------------
| OFFICE STATUS
|--------------------------------------------------------------------------
*/

function getOfficeStatusLabel(
  status?: OfficeStatus,
) {
  switch (status) {
    case 'AWAITING_RECEIPT':
    case 'PENDING':
      return 'Awaiting Receipt';

    case 'IN_CUSTODY':
    case 'RECEIVED':
      return 'In Custody';

    case 'FORWARDED':
      return 'Forwarded';

    case 'COMPLETED':
      return 'Completed';

    case 'RETURNED':
      return 'Returned';

    case 'UNKNOWN':
    default:
      return '-';
  }
}

function getOfficeStatusStyle(
  status?: OfficeStatus,
) {
  switch (status) {
    case 'AWAITING_RECEIPT':
    case 'PENDING':
      return localStyles
        .officePending;

    case 'IN_CUSTODY':
    case 'RECEIVED':
      return localStyles
        .officeReceived;

    case 'FORWARDED':
      return localStyles
        .officeForwarded;

    case 'COMPLETED':
      return localStyles
        .officeCompleted;

    case 'RETURNED':
      return localStyles
        .officeReturned;

    default:
      return {};
  }
}

/*
|--------------------------------------------------------------------------
| PRIORITY
|--------------------------------------------------------------------------
*/

function getPriorityLabel(
  priority?:
    | string
    | null,
) {
  if (!priority) {
    return '-';
  }

  return priority
    .replaceAll(
      '_',
      ' ',
    );
}

function getPriorityStyle(
  priority?:
    | string
    | null,
) {
  switch (priority) {
    case 'HIGH':
    case 'URGENT':
      return localStyles
        .priorityHigh;

    case 'MEDIUM':
      return localStyles
        .priorityMedium;

    case 'LOW':
      return localStyles
        .priorityLow;

    default:
      return {};
  }
}

/*
|--------------------------------------------------------------------------
| DEADLINE STATUS
|--------------------------------------------------------------------------
*/

function getDeadlineStatusLabel(
  doc: DocumentItem,
) {
  switch (
    doc.deadlineStatus
  ) {
    case 'NO_DEADLINE':
      return 'No Deadline';

    case 'AWAITING_RECEIPT':
      return 'Awaiting Receipt';

    case 'OVERDUE':
      return 'Overdue';

    case 'ON_TIME':
      return 'On Time';

    default:
      if (!doc.deadline) {
        return 'No Deadline';
      }

      if (
        doc.isOverdue
      ) {
        return 'Overdue';
      }

      return 'On Time';
  }
}

function getDeadlineStatusStyle(
  doc: DocumentItem,
) {
  switch (
    doc.deadlineStatus
  ) {
    case 'OVERDUE':
      return localStyles
        .deadlineOverdue;

    case 'ON_TIME':
      return localStyles
        .deadlineOnTime;

    case 'AWAITING_RECEIPT':
      return localStyles
        .deadlineAwaiting;

    case 'NO_DEADLINE':
      return localStyles
        .deadlineNone;

    default:
      if (
        doc.isOverdue
      ) {
        return localStyles
          .deadlineOverdue;
      }

      return localStyles
        .deadlineNone;
  }
}

/*
|--------------------------------------------------------------------------
| DEADLINE DATE STYLE
|--------------------------------------------------------------------------
*/

function getDeadlineDateStyle(
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
    return localStyles
      .deadlineOverdue;
  }

  const deadline =
    new Date(
      doc.deadline,
    );

  if (
    Number.isNaN(
      deadline.getTime(),
    )
  ) {
    return {};
  }

  const now =
    new Date();

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

  if (
    days >= 0 &&
    days <= 3
  ) {
    return localStyles
      .deadlineAwaiting;
  }

  return {};
}

/*
|--------------------------------------------------------------------------
| METRIC CARD
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
        localStyles
          .metricCard,

        danger
          ? localStyles
              .metricCardDanger
          : {},
      ]}
    >
      <Text
        style={
          localStyles
            .metricLabel
        }
      >
        {label}
      </Text>

      <Text
        style={[
          localStyles
            .metricValue,

          danger
            ? localStyles
                .metricValueDanger
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
        localStyles.tableHeader
      }
    >
      <Text
        style={[
          localStyles.headerCell,
          localStyles.tracking,
        ]}
      >
        Tracking
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.subject,
        ]}
      >
        Subject
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.type,
        ]}
      >
        Type
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.classification,
        ]}
      >
        Classification
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.currentLocation,
        ]}
      >
        Current Location
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.officeStatus,
        ]}
      >
        Office Status
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.responsible,
        ]}
      >
        Responsible Office / Person
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.allottedTime,
        ]}
      >
        Allotted Time
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.timeInOffice,
        ]}
      >
        Time in Office
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.deadlineStatus,
        ]}
      >
        Deadline Status
      </Text>

      <Text
        style={[
          localStyles.headerCell,
          localStyles.deadline,
        ]}
      >
        Deadline
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
  const awaitingReceipt =
    doc.officeStatus ===
      'AWAITING_RECEIPT' ||
    doc.officeStatus ===
      'PENDING';

  return (
    <View
      wrap={false}
      style={[
        localStyles.tableRow,

        index % 2 === 0
          ? localStyles
              .alternateRow
          : {},
      ]}
    >
      {/* Tracking */}

      <Text
        style={[
          localStyles.cell,
          localStyles.tracking,
          {
            fontWeight:
              'bold',

            color:
              '#1F2937',
          },
        ]}
      >
        {doc.trackingNumber}
      </Text>

      {/* Subject */}

      <Text
        style={[
          localStyles.cell,
          localStyles.subject,
        ]}
      >
        {doc.title}
      </Text>

      {/* Type */}

      <Text
        style={[
          localStyles.cell,
          localStyles.type,
        ]}
      >
        {doc.documentType}
      </Text>

      {/* Classification */}

      <Text
        style={[
          localStyles.cell,
          localStyles.classification,
        ]}
      >
        {getClassificationLabel(
          doc.classification,
        )}
      </Text>

      {/* Current Location */}

      <Text
        style={[
          localStyles.cell,
          localStyles.currentLocation,
        ]}
      >
        {getCurrentLocation(
          doc,
        )}
      </Text>

      {/* Office Status */}

      <Text
        style={[
          localStyles.cell,
          localStyles.officeStatus,

          getOfficeStatusStyle(
            doc.officeStatus,
          ),
        ]}
      >
        {getOfficeStatusLabel(
          doc.officeStatus,
        )}
      </Text>

      {/* Responsible Office / Person */}

      <Text
        style={[
          localStyles.cell,
          localStyles.responsible,
        ]}
      >
        {getResponsibleParty(
          doc,
        )}
      </Text>

      {/* Allotted Time */}

      <Text
        style={[
          localStyles.cell,
          localStyles.allottedTime,
        ]}
      >
        {formatDuration(
          doc.allottedTimeMs,
        )}
      </Text>

      {/* Time in Office */}

      <Text
        style={[
          localStyles.cell,
          localStyles.timeInOffice,
        ]}
      >
        {awaitingReceipt
          ? 'Not Received'
          : formatDuration(
              doc.timeInOfficeMs,
              true,
            )}
      </Text>

      {/* Deadline Status */}

      <Text
        style={[
          localStyles.cell,
          localStyles.deadlineStatus,

          getDeadlineStatusStyle(
            doc,
          ),
        ]}
      >
        {getDeadlineStatusLabel(
          doc,
        )}
      </Text>

      {/* Deadline */}

      <Text
        style={[
          localStyles.cell,
          localStyles.deadline,

          getDeadlineDateStyle(
            doc,
          ),
        ]}
      >
        {formatDate(
          doc.deadline,
        )}
      </Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
|
| First page has Report Information + Summary + Performance.
| Therefore fewer rows are used on page 1.
|
*/

const FIRST_PAGE_ROWS = 5;

const OTHER_PAGE_ROWS = 14;

function paginateDocuments(
  documents:
    DocumentItem[],
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

  acted = 0,

  overdue = 0,

  actionRate = 0,

  averageProcessingHours = 0,

  processingEfficiency = 0,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Generated
  |--------------------------------------------------------------------------
  */

  const generatedAt =
    new Date()
      .toLocaleString(
        'en-PH',
      );

  /*
  |--------------------------------------------------------------------------
  | Report Name
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
  | Month
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
  | Performance
  |--------------------------------------------------------------------------
  */

  const actedRate =
    documents.length ===
      0
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
  | Pagination
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
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <Document>

      {/* ================================================================
          FIRST PAGE
      ================================================================= */}

      <Page
        size="A4"
        orientation="landscape"
        style={styles.page}
      >

        {/* ==============================================================
            HEADER
        =============================================================== */}

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

        {/* ==============================================================
            REPORT OVERVIEW
        =============================================================== */}

        <View
          style={
            localStyles
              .reportOverview
          }
        >

          {/* ============================================================
              REPORT INFORMATION
          ============================================================= */}

          <View
            style={
              localStyles
                .infoPanel
            }
          >
            <Text
              style={
                localStyles
                  .sectionHeading
              }
            >
              REPORT INFORMATION
            </Text>

            {/* Office */}

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

                  localStyles
                    .officeValue,
                ]}
              >
                {officeName}
              </Text>
            </View>

            {/* Report Name */}

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

            {/* Year */}

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

            {/* Month */}

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

            {/* Quarter */}

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

            {/* Generated */}

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

            {/* Total */}

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

          {/* ============================================================
              SUMMARY / PERFORMANCE
          ============================================================= */}

          <View
            style={
              localStyles
                .metricsPanel
            }
          >

            {/* DOCUMENT SUMMARY */}

            <View
              style={
                localStyles
                  .metricsSection
              }
            >
              <Text
                style={
                  localStyles
                    .sectionHeading
                }
              >
                DOCUMENT SUMMARY
              </Text>

              <View
                style={
                  localStyles
                    .metricRow
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
                  label="Completed"
                  value={completed}
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

            {/* OFFICE PERFORMANCE */}

            <View
              style={
                localStyles
                  .performanceSection
              }
            >
              <Text
                style={
                  localStyles
                    .sectionHeading
                }
              >
                OFFICE PERFORMANCE
              </Text>

              <View
                style={
                  localStyles
                    .metricRow
                }
              >
                <MetricCard
                  label="Total Documents"
                  value={
                    documents.length
                  }
                />

                <MetricCard
                  label="Acted Upon"
                  value={acted}
                />

                <MetricCard
                  label="Action Rate"
                  value={`${actionRate}%`}
                />

                <MetricCard
                  label="Avg. Time"
                  value={
                    formatAverageHours(
                      averageProcessingHours,
                    )
                  }
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

        {/* ==============================================================
            DOCUMENT TABLE
        =============================================================== */}

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
                index={index}
              />
            ),
          )}
        </View>

        {/* ==============================================================
            FOOTER
        =============================================================== */}

        <Text
          fixed
          style={
            localStyles
              .footerLeft
          }
        >
          Generated by eDATS
        </Text>

        <Text
          fixed
          style={
            localStyles
              .footerRight
          }
          render={({
            pageNumber,
            totalPages,
          }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>

      {/* ================================================================
          NEXT PAGES
      ================================================================= */}

      {otherPages.map(
        (
          pageDocuments,
          pageIndex,
        ) => (
          <Page
            key={
              `report-page-${pageIndex}`
            }
            size="A4"
            orientation="landscape"
            style={styles.page}
          >

            {/* COMPACT HEADER */}

            <View
              style={
                localStyles
                  .compactHeader
              }
            >
              <Text
                style={
                  localStyles
                    .compactTitle
                }
              >
                Document Tracking
                Report
              </Text>

              <Text
                style={
                  localStyles
                    .compactSubtitle
                }
              >
                {officeName}
                {' · '}
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
                    key={doc.id}
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
              style={
                localStyles
                  .footerLeft
              }
            >
              Generated by eDATS
            </Text>

            <Text
              fixed
              style={
                localStyles
                  .footerRight
              }
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