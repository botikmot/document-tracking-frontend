import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { styles } from './pdf-styles';

const LOGO = '/images/denr_logov2.png';

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
  |--------------------------------------------------------------------------
  | CURRENT LOCATION
  |--------------------------------------------------------------------------
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
  |--------------------------------------------------------------------------
  | LEGACY / FALLBACK OFFICE
  |--------------------------------------------------------------------------
  */

  office?: string;

  /*
  |--------------------------------------------------------------------------
  | OFFICE STATUS
  |--------------------------------------------------------------------------
  */

  officeStatus:
    OfficeStatus;

  /*
  |--------------------------------------------------------------------------
  | RESPONSIBILITY
  |--------------------------------------------------------------------------
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

  /*
  |--------------------------------------------------------------------------
  | DEADLINE / PROCESSING
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT DATES
  |--------------------------------------------------------------------------
  */

  createdAt: string;

  /*
   * Business rule:
   *
   * Document creation in eDATS
   * = official received date.
   */
  receivedAt?:
    | string
    | null;

  /*
   * Actual COMPLETED /
   * END_TRANSACTION timestamp
   * from status history.
   */
  completedAt?:
    | string
    | null;

  /*
  |--------------------------------------------------------------------------
  | LATEST REMARKS / ACTION
  |--------------------------------------------------------------------------
  */

  latestRemarks?:
    | string
    | null;
};

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

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
| REPORT STATUS
|--------------------------------------------------------------------------
*/

type ReportStatusType =
  | 'completed'
  | 'ontime'
  | 'overdue'
  | 'late'
  | 'neutral';

type ReportStatusResult = {
  label: string;

  detail?: string;

  type: ReportStatusType;
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
    | REPORT OVERVIEW
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

      fontSize: 7,
      lineHeight: 1.15,
    },

    /*
    |--------------------------------------------------------------------------
    | TABLE
    |--------------------------------------------------------------------------
    |
    | Tracking No.
    | Subject
    | Responsible Office / Person
    | Classification
    | Due Date / Total Processing Time
    | Received Date
    | Status
    | Pending Office
    | Remarks
    |
    */

    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#006838',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,

      minHeight: 34,
    },

    tableRow: {
      flexDirection: 'row',

      minHeight: 38,

      borderBottomWidth: 0.5,
      borderBottomColor: '#D1D5DB',
    },

    alternateRow: {
      backgroundColor: '#F8FAF8',
    },

    headerCell: {
      paddingHorizontal: 4,
      paddingVertical: 7,

      fontSize: 6.3,
      lineHeight: 1.25,

      fontWeight: 'bold',

      color: '#FFFFFF',
    },

    cell: {
      paddingHorizontal: 4,
      paddingVertical: 7,

      fontSize: 6.3,
      lineHeight: 1.3,

      color: '#374151',
    },

    cellBox: {
      paddingHorizontal: 4,
      paddingVertical: 7,
    },

    cellPrimary: {
      fontSize: 6.3,
      lineHeight: 1.3,

      color: '#374151',
    },

    cellStrong: {
      fontSize: 6.3,
      lineHeight: 1.3,

      color: '#1F2937',

      fontWeight: 'bold',
    },

    cellSubtle: {
      marginTop: 2,

      fontSize: 5.6,
      lineHeight: 1.25,

      color: '#6B7280',
    },

    statusDate: {
      marginTop: 2,

      fontSize: 5.6,

      color: '#4B5563',
    },

    statusDetail: {
      marginTop: 2,

      fontSize: 5.6,

      color: '#6B7280',
    },

    /*
    |--------------------------------------------------------------------------
    | COLUMN WIDTHS
    |--------------------------------------------------------------------------
    |
    | Total = 100%
    |
    */

    tracking: {
      width: '9%',
    },

    subject: {
      width: '13%',
    },

    responsible: {
      width: '12%',
    },

    classification: {
      width: '8%',
    },

    dueProcessing: {
      width: '13%',
    },

    receivedDate: {
      width: '11%',
    },

    reportStatus: {
      width: '15%',
    },

    pendingOffice: {
      width: '11%',
    },

    remarks: {
      width: '8%',
    },

    /*
    |--------------------------------------------------------------------------
    | STATUS COLORS
    |--------------------------------------------------------------------------
    */

    statusCompleted: {
      color: '#047857',

      fontWeight: 'bold',
    },

    statusOnTime: {
      color: '#1D4ED8',

      fontWeight: 'bold',
    },

    statusOverdue: {
      color: '#DC2626',

      fontWeight: 'bold',
    },

    statusLate: {
      color: '#EA580C',

      fontWeight: 'bold',
    },

    statusNeutral: {
      color: '#6B7280',

      fontWeight: 'bold',
    },

    statusDetailLate: {
      color: '#DC2626',

      fontWeight: 'bold',
    },

    /*
    |--------------------------------------------------------------------------
    | COMPACT HEADER
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
    | FOOTER
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

      day: 'numeric',
    },
  );
}

/*
|--------------------------------------------------------------------------
| DATE + TIME
|--------------------------------------------------------------------------
*/

function formatDateTime(
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

  return value.toLocaleString(
    'en-PH',
    {
      year: 'numeric',

      month: 'short',

      day: 'numeric',

      hour: 'numeric',

      minute: '2-digit',

      hour12: true,
    },
  );
}

/*
|--------------------------------------------------------------------------
| RESPONSIBLE OFFICE / PERSON
|--------------------------------------------------------------------------
*/

function getResponsibleParty(
  doc: DocumentItem,
) {
  /*
   * Responsible Office
   * has highest priority.
   */

  if (
    doc.responsibleOffice
      ?.officeName
  ) {
    return {
      label:
        doc.responsibleOffice
          .officeName,

      description:
        'Responsible Office',
    };
  }

  /*
   * Responsible Person.
   */

  if (
    doc.responsiblePerson
      ?.trim()
  ) {
    return {
      label:
        doc.responsiblePerson
          .trim(),

      description:
        'Responsible Person',
    };
  }

  /*
   * Backend convenience
   * field fallback.
   */

  if (
    doc.responsibleParty
      ?.trim()
  ) {
    return {
      label:
        doc.responsibleParty
          .trim(),

      description: null,
    };
  }

  return {
    label: '-',

    description: null,
  };
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

  return classification.replaceAll(
    '_',
    ' ',
  );
}

/*
|--------------------------------------------------------------------------
| CURRENT / PENDING OFFICE
|--------------------------------------------------------------------------
*/

function getCurrentLocation(
  doc: DocumentItem,
) {
  /*
   * Already formatted string.
   */

  if (
    typeof doc.currentLocation ===
    'string'
  ) {
    return (
      doc.currentLocation ||
      doc.office ||
      '-'
    );
  }

  const officeName =
    doc.currentLocation
      ?.officeName ??
    doc.office ??
    '-';

  /*
   * If route is still in transit,
   * show the destination.
   */

  if (
    doc.currentLocation
      ?.isInTransit
  ) {
    return `In Transit → ${officeName}`;
  }

  return officeName;
}

function getPendingOffice(
  doc: DocumentItem,
) {
  const reportStatus =
    getReportStatus(doc);

  /*
   * Only show the office/location
   * when the document is currently overdue.
   */
  if (
    reportStatus.type !==
    'overdue'
  ) {
    return '-';
  }

  return getCurrentLocation(doc);
}

/*
|--------------------------------------------------------------------------
| TOTAL PROCESSING TIME
|--------------------------------------------------------------------------
|
| Example:
|
| 48 hours
| 72 hours
| < 1 hour
|
*/

function formatTotalProcessingTime(
  milliseconds?:
    | number
    | null,
) {
  if (
    milliseconds === null ||
    milliseconds === undefined
  ) {
    return 'No processing time';
  }

  const hours =
    milliseconds /
    (1000 * 60 * 60);

  if (hours < 1) {
    return '< 1 hour';
  }

  const roundedHours =
    Math.round(hours);

  return `${roundedHours} hour${
    roundedHours === 1
      ? ''
      : 's'
  }`;
}

/*
|--------------------------------------------------------------------------
| RELATIVE DURATION
|--------------------------------------------------------------------------
|
| Used by:
|
| On Time
| Overdue
| Completed early
| Completed late
|
*/

function formatRelativeDuration(
  milliseconds: number,
) {
  const safeMilliseconds =
    Math.abs(milliseconds);

  if (
    safeMilliseconds <
    60 * 1000
  ) {
    return '<1m';
  }

  const totalMinutes =
    Math.floor(
      safeMilliseconds /
        (1000 * 60),
    );

  const days =
    Math.floor(
      totalMinutes /
        1440,
    );

  const hours =
    Math.floor(
      (totalMinutes %
        1440) /
        60,
    );

  const minutes =
    totalMinutes % 60;

  const parts: string[] =
    [];

  if (days > 0) {
    parts.push(
      `${days}d`,
    );

    if (hours > 0) {
      parts.push(
        `${hours}h`,
      );
    }

    return parts.join(' ');
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

  return (
    parts.join(' ') ||
    '<1m'
  );
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
    totalMinutes %
    1440;

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
| DOCUMENT COMPLETED CHECK
|--------------------------------------------------------------------------
*/

function isDocumentCompleted(
  doc: DocumentItem,
) {
  return (
    doc.status ===
      'COMPLETED' ||
    doc.status ===
      'END_TRANSACTION'
  );
}

/*
|--------------------------------------------------------------------------
| REPORT STATUS
|--------------------------------------------------------------------------
|
| Rules:
|
| ACTIVE + before deadline
| → On Time
| → 2d 5h remaining
|
| ACTIVE + past deadline
| → Overdue by 1d 4h
|
| COMPLETED + before deadline
| → Completed
| → Aug 20, 2026, 10:00 AM
| → 3h 29m remaining
|
| COMPLETED + after deadline
| → Completed
| → Aug 21, 2026, 9:00 AM
| → 19h 31m late
|
| NO DEADLINE
| → No Due Date
|
*/

function getReportStatus(
  doc: DocumentItem,
): ReportStatusResult {
  const completed =
    isDocumentCompleted(
      doc,
    );

  /*
  |--------------------------------------------------------------------------
  | COMPLETED DOCUMENT WITHOUT DEADLINE
  |--------------------------------------------------------------------------
  */

  if (
    completed &&
    !doc.deadline
  ) {
    return {
      label: 'Completed',

      type: 'completed',
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ACTIVE DOCUMENT WITHOUT DEADLINE
  |--------------------------------------------------------------------------
  */

  if (!doc.deadline) {
    return {
      label: 'No Due Date',

      type: 'neutral',
    };
  }

  const deadline =
    new Date(
      doc.deadline,
    ).getTime();

  /*
   * Invalid deadline fallback.
   */

  if (
    Number.isNaN(
      deadline,
    )
  ) {
    return {
      label: '-',

      type: 'neutral',
    };
  }

  /*
  |--------------------------------------------------------------------------
  | COMPLETED DOCUMENT
  |--------------------------------------------------------------------------
  */

  if (completed) {
    /*
     * If completion timestamp
     * isn't available yet.
     */

    if (!doc.completedAt) {
      return {
        label: 'Completed',

        type: 'completed',
      };
    }

    const completedAt =
      new Date(
        doc.completedAt,
      ).getTime();

    if (
      Number.isNaN(
        completedAt,
      )
    ) {
      return {
        label: 'Completed',

        type: 'completed',
      };
    }

    /*
     * Positive:
     * completed before deadline.
     *
     * Negative:
     * completed after deadline.
     */

    const difference =
      deadline -
      completedAt;

    /*
     * Completed before or
     * exactly on deadline.
     */

    if (
      difference >= 0
    ) {
      return {
        label: 'Completed',

        detail:
          `${formatRelativeDuration(
            difference,
          )} remaining`,

        type: 'completed',
      };
    }

    /*
     * Completed after deadline.
     */

    return {
      label: 'Completed',

      detail:
        `${formatRelativeDuration(
          Math.abs(
            difference,
          ),
        )} late`,

      type: 'late',
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ACTIVE DOCUMENT
  |--------------------------------------------------------------------------
  */

  const difference =
    deadline -
    Date.now();

  /*
   * Still within deadline.
   */

  if (
    difference >= 0
  ) {
    return {
      label: 'On Time',

      detail:
        `${formatRelativeDuration(
          difference,
        )} remaining`,

      type: 'ontime',
    };
  }

  /*
   * Deadline already passed.
   */

  return {
    label:
      `Overdue by ${formatRelativeDuration(
        Math.abs(
          difference,
        ),
      )}`,

    type: 'overdue',
  };
}

/*
|--------------------------------------------------------------------------
| REPORT STATUS STYLE
|--------------------------------------------------------------------------
*/

function getReportStatusStyle(
  type: ReportStatusType,
) {
  switch (type) {
    case 'completed':
      return localStyles
        .statusCompleted;

    case 'ontime':
      return localStyles
        .statusOnTime;

    case 'overdue':
      return localStyles
        .statusOverdue;

    case 'late':
      return localStyles
        .statusLate;

    default:
      return localStyles
        .statusNeutral;
  }
}

/*
|--------------------------------------------------------------------------
| LATEST REMARKS
|--------------------------------------------------------------------------
*/

function getLatestRemarks(
  doc: DocumentItem,
) {
  const remarks =
    doc.latestRemarks
      ?.trim();

  if (!remarks) {
    return '-';
  }

  /*
   * Keep summary report rows
   * reasonably compact.
   *
   * Increase this if you want
   * longer remarks in the PDF.
   */

  const MAX_LENGTH = 140;

  if (
    remarks.length >
    MAX_LENGTH
  ) {
    return `${remarks.slice(
      0,
      MAX_LENGTH - 3,
    )}...`;
  }

  return remarks;
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
      {/* TRACKING */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.tracking,
        ]}
      >
        Tracking No.
      </Text>

      {/* SUBJECT */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.subject,
        ]}
      >
        Subject
      </Text>

      {/* RESPONSIBLE */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.responsible,
        ]}
      >
        Responsible Office / Person
      </Text>

      {/* CLASSIFICATION */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.classification,
        ]}
      >
        Classification
      </Text>

      {/* DUE DATE + PROCESSING */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.dueProcessing,
        ]}
      >
        Due Date / Total Processing Time
      </Text>

      {/* RECEIVED DATE */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.receivedDate,
        ]}
      >
        Received Date
      </Text>

      {/* STATUS */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.reportStatus,
        ]}
      >
        Status
      </Text>

      {/* PENDING OFFICE */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.pendingOffice,
        ]}
      >
        Pending Office
      </Text>

      {/* REMARKS */}

      <Text
        style={[
          localStyles.headerCell,
          localStyles.remarks,
        ]}
      >
        Remarks
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
  const reportStatus =
    getReportStatus(doc);

  const completed =
    isDocumentCompleted(
      doc,
    );

  const responsible =
    getResponsibleParty(
      doc,
    );

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
      {/* ================================================================
          TRACKING NUMBER
      ================================================================= */}

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

      {/* ================================================================
          SUBJECT
      ================================================================= */}

      <Text
        style={[
          localStyles.cell,
          localStyles.subject,
        ]}
      >
        {doc.title}
      </Text>

      {/* ================================================================
          RESPONSIBLE OFFICE / PERSON
      ================================================================= */}

      <View
        style={[
          localStyles.cellBox,
          localStyles.responsible,
        ]}
      >
        <Text
          style={
            localStyles.cellPrimary
          }
        >
          {responsible.label}
        </Text>

        {responsible.description && (
          <Text
            style={
              localStyles
                .cellSubtle
            }
          >
            {
              responsible.description
            }
          </Text>
        )}
      </View>

      {/* ================================================================
          CLASSIFICATION
      ================================================================= */}

      <Text
        style={[
          localStyles.cell,
          localStyles.classification,

          {
            fontSize: 5.4,
          },
        ]}
      >
        {getClassificationLabel(
          doc.classification,
        )}
      </Text>

      {/* ================================================================
          DUE DATE / TOTAL PROCESSING TIME
      ================================================================= */}

      <View
        style={[
          localStyles.cellBox,
          localStyles.dueProcessing,
        ]}
      >
        <Text
          style={
            localStyles.cellPrimary
          }
        >
          {doc.deadline
            ? formatDate(
                doc.deadline,
              )
            : 'No due date'}
        </Text>

        <Text
          style={
            localStyles.cellSubtle
          }
        >
          {formatTotalProcessingTime(
            doc.allottedTimeMs,
          )}
        </Text>
      </View>

      {/* ================================================================
          RECEIVED DATE
      ================================================================= */}

      <Text
        style={[
          localStyles.cell,
          localStyles.receivedDate,
        ]}
      >
        {formatDateTime(
          doc.receivedAt ??
            doc.createdAt,
        )}
      </Text>

      {/* ================================================================
          STATUS
      ================================================================= */}

      <View
        style={[
          localStyles.cellBox,
          localStyles.reportStatus,
        ]}
      >
        {/* Main Status */}

        <Text
          style={[
            localStyles.cellStrong,

            getReportStatusStyle(
              reportStatus.type,
            ),
          ]}
        >
          {reportStatus.label}
        </Text>

        {/* Completion Date */}

        {completed &&
          doc.completedAt && (
            <Text
              style={
                localStyles
                  .statusDate
              }
            >
              {formatDateTime(
                doc.completedAt,
              )}
            </Text>
          )}

        {/* Remaining / Late */}

        {reportStatus.detail && (
          <Text
            style={[
              localStyles
                .statusDetail,

              reportStatus.type ===
                'late' ||
              reportStatus.type ===
                'overdue'
                ? localStyles
                    .statusDetailLate
                : {},
            ]}
          >
            {reportStatus.detail}
          </Text>
        )}
      </View>

      {/* ================================================================
          PENDING / CURRENT OFFICE
      ================================================================= */}

      <Text
        style={[
          localStyles.cell,
          localStyles.pendingOffice,
        ]}
      >
        {getPendingOffice(doc)}
      </Text>

      {/* ================================================================
          REMARKS
      ================================================================= */}

      <Text
        style={[
          localStyles.cell,
          localStyles.remarks,

          {
            fontSize: 5.2,
          },
        ]}
      >
        {getLatestRemarks(doc)}
      </Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
|
| First page contains:
|
| - DENR Header
| - Report Information
| - Document Summary
| - Office Performance
| - Document Table
|
| Rows are slightly taller now because
| Status, Responsibility, Due Date and
| Remarks may contain multiple lines.
|
*/

const FIRST_PAGE_ROWS = 4;

const OTHER_PAGE_ROWS = 10;

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

  officeName = 'N/A',

  reportName =
    'Document Tracking Report',

  reportType = 'General',

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
  | GENERATED DATE
  |--------------------------------------------------------------------------
  */

  const generatedAt =
    new Date().toLocaleString(
      'en-PH',
    );

  /*
  |--------------------------------------------------------------------------
  | DISPLAY REPORT NAME
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
    reportType === 'annual'
  ) {
    displayReportName =
      'Annual Report';
  }

  /*
  |--------------------------------------------------------------------------
  | MONTH NAME
  |--------------------------------------------------------------------------
  */

  const getMonthName = () => {
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
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const {
    firstPage,
    otherPages,
  } = paginateDocuments(
    documents,
  );

  /*
  |--------------------------------------------------------------------------
  | RENDER
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

                  localStyles
                    .officeValue,
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
                    {
                      getMonthName()
                    }
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
                {documents.length}
              </Text>
            </View>
          </View>

          {/* ============================================================
              DOCUMENT SUMMARY / OFFICE PERFORMANCE
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