import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

import type {
  RoutingSlipAction,
  RoutingSlipPdfV2Data,
  RoutingSlipRoute,
} from '@/types/document';

type Props = {
  data: RoutingSlipPdfV2Data;
};

const styles = StyleSheet.create({
  page: {
    width: '100%',
    paddingTop: 22,
    paddingBottom: 24,
    paddingHorizontal: 28,
    fontFamily: 'Helvetica',
    fontSize: 7.2,
    color: '#18352A',
    backgroundColor: '#FFFFFF',
  },

  /*
  |--------------------------------------------------------------------------
  | HEADER
  |--------------------------------------------------------------------------
  */

  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#126B50',
    paddingBottom: 8,
    marginBottom: 8,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  headerLeft: {
    width: '63%',
  },

  headerRight: {
    width: '34%',
    alignItems: 'flex-end',
  },

  agencyName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#075B45',
    letterSpacing: 0.3,
    marginBottom: 2,
  },

  agencySubtitle: {
    fontSize: 7,
    color: '#3C6253',
    marginBottom: 2,
  },

  systemName: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#075B45',
    marginTop: 3,
  },

  routingTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#075B45',
    textAlign: 'right',
    marginBottom: 2,
  },

  routingSubtitle: {
    fontSize: 6.5,
    color: '#60776B',
    textAlign: 'right',
    marginBottom: 5,
  },

  qrCode: {
    width: 58,
    height: 58,
  },

  trackingBox: {
    marginTop: 7,
    borderWidth: 1,
    borderColor: '#A9D0C1',
    borderRadius: 3,
    backgroundColor: '#EFF8F3',
    paddingVertical: 5,
    paddingHorizontal: 7,
  },

  trackingLabel: {
    fontSize: 6,
    color: '#5D786B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  trackingNumber: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#075B45',
  },

  /*
  |--------------------------------------------------------------------------
  | GENERAL SECTIONS
  |--------------------------------------------------------------------------
  */

  section: {
    marginBottom: 7,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075B45',
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  sectionHeaderText: {
    fontSize: 7.8,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },

  sectionBody: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#A9CDBE',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    padding: 7,
  },

  /*
  |--------------------------------------------------------------------------
  | DOCUMENT INFORMATION
  |--------------------------------------------------------------------------
  */

  documentColumns: {
    flexDirection: 'row',
  },

  documentColumnLeft: {
    width: '50%',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#D5E5DD',
  },

  documentColumnRight: {
    width: '50%',
    paddingLeft: 8,
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    minHeight: 9,
  },

  infoLabel: {
    width: '36%',
    fontSize: 6.5,
    color: '#527063',
  },

  infoValue: {
    width: '64%',
    fontSize: 7.2,
    color: '#18352A',
  },

  infoValueBold: {
    width: '64%',
    fontSize: 7.2,
    fontFamily: 'Helvetica-Bold',
    color: '#18352A',
  },

  infoRowFull: {
    marginTop: 3,
  },

  descriptionText: {
    fontSize: 7,
    lineHeight: 1.25,
    color: '#304B3D',
  },

  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: '#E5F2EC',
  },

  badgeText: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#075B45',
  },

  /*
  |--------------------------------------------------------------------------
  | CURRENT STATUS
  |--------------------------------------------------------------------------
  */

  statusGrid: {
    flexDirection: 'row',
    marginHorizontal: -3,
  },

  statusCard: {
    flex: 1,
    minHeight: 42,
    marginHorizontal: 3,
    padding: 6,
    borderWidth: 1,
    borderColor: '#B8D9CA',
    borderRadius: 4,
    backgroundColor: '#F5FBF7',
  },

  statusCardLabel: {
    fontSize: 6,
    color: '#5B7668',
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  statusCardValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#075B45',
  },

  statusDetails: {
    flexDirection: 'row',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#D9E9E0',
  },

  statusDetailItem: {
    width: '50%',
    flexDirection: 'row',
  },

  statusDetailLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#315B49',
    marginRight: 4,
  },

  statusDetailValue: {
    flex: 1,
    fontSize: 6.8,
    color: '#304B3D',
  },

  /*
  |--------------------------------------------------------------------------
  | INSTRUCTIONS
  |--------------------------------------------------------------------------
  */

  instructionGrid: {
    flexDirection: 'row',
    marginHorizontal: -3,
  },

  instructionCard: {
    flex: 1,
    marginHorizontal: 3,
    minHeight: 84,
    borderWidth: 1,
    borderColor: '#C9DDD2',
    borderRadius: 4,
    padding: 6,
  },

  redCard: {
    backgroundColor: '#FFF4F3',
    borderColor: '#E9C9C7',
  },

  ardCard: {
    backgroundColor: '#F1F7FF',
    borderColor: '#C8DDF2',
  },

  divisionCard: {
    backgroundColor: '#F0FAF3',
    borderColor: '#C7E2D0',
  },

  instructionTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },

  redTitle: {
    color: '#A52D35',
  },

  ardTitle: {
    color: '#1E5C9A',
  },

  divisionTitle: {
    color: '#167044',
  },

  actionItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },

  actionBullet: {
    width: 9,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },

  actionText: {
    flex: 1,
    fontSize: 6.8,
    lineHeight: 1.2,
    color: '#304B3D',
  },

  instructionDivider: {
    borderTopWidth: 1,
    borderTopColor: '#D5E5DD',
    marginTop: 5,
    paddingTop: 5,
  },

  lastActionLabel: {
    fontSize: 6.2,
    color: '#60776B',
    marginBottom: 2,
  },

  lastActionText: {
    fontSize: 6.5,
    color: '#304B3D',
    lineHeight: 1.2,
  },

  /*
  |--------------------------------------------------------------------------
  | ROUTING HISTORY TABLE
  |--------------------------------------------------------------------------
  */

  table: {
    borderWidth: 1,
    borderColor: '#A9CDBE',
    borderRadius: 3,
    overflow: 'hidden',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E6F2EB',
    borderBottomWidth: 1,
    borderBottomColor: '#A9CDBE',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0ECE5',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  tableRowLast: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  tableHeaderText: {
    fontSize: 6.2,
    fontFamily: 'Helvetica-Bold',
    color: '#075B45',
    textTransform: 'uppercase',
  },

  tableText: {
    fontSize: 6.5,
    color: '#304B3D',
    lineHeight: 1.15,
  },

  tableColNumber: {
    width: '5%',
  },

  tableColReceived: {
    width: '15%',
  },

  tableColFrom: {
    width: '14%',
  },

  tableColTo: {
    width: '14%',
  },

  tableColReleased: {
    width: '15%',
  },

  tableColStatus: {
    width: '13%',
  },

  tableColRemarks: {
    width: '24%',
  },

  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 7,
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: '#DDF3E5',
  },

  statusPillProgress: {
    backgroundColor: '#FFF0C2',
  },

  statusPillText: {
    fontSize: 5.8,
    fontFamily: 'Helvetica-Bold',
    color: '#167044',
  },

  statusPillProgressText: {
    color: '#946200',
  },

  /*
  |--------------------------------------------------------------------------
  | FOOTER
  |--------------------------------------------------------------------------
  */

  footer: {
    marginTop: 7,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#B8D9CA',
  },

  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  footerMeta: {
    fontSize: 6.5,
    color: '#526E60',
  },

  signatureGrid: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },

  signatureColumn: {
    flex: 1,
    marginHorizontal: 5,
  },

  signatureLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#315B49',
    marginBottom: 12,
  },

  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#688577',
    marginBottom: 3,
  },

  signatureValue: {
    fontSize: 6.2,
    color: '#526E60',
  },

  pageNumber: {
    position: 'absolute',
    right: 28,
    bottom: 10,
    fontSize: 6.5,
    color: '#60776B',
  },
});

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function displayValue(
  value: unknown,
  fallback = '—',
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return fallback;
  }

  return String(value);
}

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    },
  );
}

function formatDateTime(
  value?: string | null,
) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  );
}

function formatActionType(
  actionType?: string | null,
) {
  if (!actionType) {
    return 'Action';
  }

  return actionType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getActionUser(
  action: RoutingSlipAction,
) {
  return (
    action.user?.name ||
    action.office?.officeName ||
    'Unknown personnel'
  );
}

function getLatestAction(
  actions: RoutingSlipAction[],
) {
  if (!actions.length) {
    return null;
  }

  return [...actions].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  )[0];
}

function getActionSummary(
  action: RoutingSlipAction,
) {
  if (action.comment) {
    return action.comment;
  }

  return formatActionType(action.actionType);
}

function InstructionCard({
  title,
  titleStyle,
  cardStyle,
  actions,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titleStyle: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardStyle: any;
  actions: RoutingSlipAction[];
}) {
  const latestAction = getLatestAction(actions);

  return (
    <View
      style={[
        styles.instructionCard,
        cardStyle,
      ]}
      wrap={false}
    >
      <Text
        style={[
          styles.instructionTitle,
          titleStyle,
        ]}
      >
        {title}
      </Text>

      {actions.length === 0 ? (
        <Text style={styles.lastActionText}>
          No recorded instruction or action.
        </Text>
      ) : (
        <>
          {actions.slice(-3).map((action) => (
            <View
              key={action.id}
              style={styles.actionItem}
            >
              <Text style={styles.actionBullet}>
                •
              </Text>

              <Text style={styles.actionText}>
                {getActionSummary(action)}
              </Text>
            </View>
          ))}

          <View style={styles.instructionDivider}>
            <Text style={styles.lastActionLabel}>
              LAST ACTION
            </Text>

            <Text style={styles.lastActionText}>
              {formatDateTime(latestAction?.createdAt)}
            </Text>

            <Text style={styles.lastActionText}>
              By: {latestAction ? getActionUser(latestAction) : '—'}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

function RoutingHistoryTable({
  routes,
}: {
  routes: RoutingSlipRoute[];
}) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <View style={styles.tableColNumber}>
          <Text style={styles.tableHeaderText}>
            #
          </Text>
        </View>

        <View style={styles.tableColReceived}>
          <Text style={styles.tableHeaderText}>
            Received
          </Text>
        </View>

        <View style={styles.tableColFrom}>
          <Text style={styles.tableHeaderText}>
            From
          </Text>
        </View>

        <View style={styles.tableColTo}>
          <Text style={styles.tableHeaderText}>
            To
          </Text>
        </View>

        <View style={styles.tableColReleased}>
          <Text style={styles.tableHeaderText}>
            Released
          </Text>
        </View>

        <View style={styles.tableColStatus}>
          <Text style={styles.tableHeaderText}>
            Status
          </Text>
        </View>

        <View style={styles.tableColRemarks}>
          <Text style={styles.tableHeaderText}>
            Remarks / Actions
          </Text>
        </View>
      </View>

      {routes.length === 0 ? (
        <View style={styles.tableRowLast}>
          <Text style={styles.tableText}>
            No routing history available.
          </Text>
        </View>
      ) : (
        routes.map((route, index) => {
          const isLast =
            index === routes.length - 1;

          const isInProgress =
            route.status
              ?.toLowerCase()
              .includes('progress');

          return (
            <View
              key={route.id}
              style={
                isLast
                  ? styles.tableRowLast
                  : styles.tableRow
              }
              wrap={false}
            >
              <View style={styles.tableColNumber}>
                <Text style={styles.tableText}>
                  {index + 1}
                </Text>
              </View>

              <View style={styles.tableColReceived}>
                <Text style={styles.tableText}>
                  {formatDate(route.dateReceived)}
                </Text>
              </View>

              <View style={styles.tableColFrom}>
                <Text style={styles.tableText}>
                  {displayValue(route.fromOffice?.officeCode)}
                </Text>
              </View>

              <View style={styles.tableColTo}>
                <Text style={styles.tableText}>
                  {displayValue(route.toOffice?.officeCode)}
                </Text>
              </View>

              <View style={styles.tableColReleased}>
                <Text style={styles.tableText}>
                  {formatDate(route.dateReleased)}
                </Text>
              </View>

              <View style={styles.tableColStatus}>
                <View
                  style={[
                    styles.statusPill,
                    isInProgress
                      ? styles.statusPillProgress
                      : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      isInProgress
                        ? styles.statusPillProgressText
                        : {},
                    ]}
                  >
                    {displayValue(route.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.tableColRemarks}>
                <Text style={styles.tableText}>
                  {displayValue(route.routeRemarks)}
                </Text>

                {route.actions.length > 0 ? (
                  <Text style={styles.tableText}>
                    {route.actions.length} action
                    {route.actions.length > 1 ? 's' : ''}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN PDF COMPONENT
|--------------------------------------------------------------------------
*/

export default function RoutingSlipPDFV2({
  data,
}: Props) {
  const redActions =
    data.instructions?.red ?? [];

  const ardActions =
    data.instructions?.ard ?? [];

  const divisionActions =
    data.instructions?.division ?? [];

  return (
    <Document
      title={`Routing Slip - ${data.trackingNumber}`}
      author="DENR Caraga eDATS+"
      subject="Document Routing Slip"
    >
      <Page
        size="A4"
        orientation="portrait"
        style={styles.page}
        wrap
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.agencyName}>
                DENR CARAGA
              </Text>

              <Text style={styles.agencySubtitle}>
                Department of Environment and Natural Resources
              </Text>

              <Text style={styles.agencySubtitle}>
                Caraga Region
              </Text>

              <Text style={styles.systemName}>
                Environmental Document Tracking System
              </Text>

              <View style={styles.trackingBox}>
                <Text style={styles.trackingLabel}>
                  Tracking Number
                </Text>

                <Text style={styles.trackingNumber}>
                  {displayValue(data.trackingNumber)}
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <Text style={styles.routingTitle}>
                ROUTING SLIP
              </Text>

              <Text style={styles.routingSubtitle}>
                Official Document Movement Record
              </Text>

              {data.qrCode ? (
                <Image
                  src={data.qrCode}
                  style={styles.qrCode}
                />
              ) : null}
            </View>
          </View>
        </View>

        {/* DOCUMENT INFORMATION */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              Document Information
            </Text>
          </View>

          <View style={styles.sectionBody}>
            <View style={styles.documentColumns}>
              {/* LEFT COLUMN */}

              <View style={styles.documentColumnLeft}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Title
                  </Text>

                  <Text style={styles.infoValueBold}>
                    {displayValue(data.title)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Document Type
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.documentType)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Reference No.
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.referenceNumber)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Date Created
                  </Text>

                  <Text style={styles.infoValue}>
                    {formatDateTime(data.createdAt)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Deadline
                  </Text>

                  <Text style={styles.infoValue}>
                    {formatDate(data.deadline)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Sender
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.sender)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Organization
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.senderOrganization)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Contact
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.senderContact)}
                  </Text>
                </View>
              </View>

              {/* RIGHT COLUMN */}

              <View style={styles.documentColumnRight}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Addressee
                  </Text>

                  <Text style={styles.infoValueBold}>
                    {displayValue(data.addressee)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Sender Office
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.senderOffice?.officeName)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Source Class
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.sourceClass)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Source Scope
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.internalSourceScope)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Monitoring
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.monitoringCategory)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Routing Profile
                  </Text>

                  <Text style={styles.infoValue}>
                    {displayValue(data.routingProfile)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Priority
                  </Text>

                  <View style={styles.infoValue}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {displayValue(data.priority)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Classification
                  </Text>

                  <View style={styles.infoValue}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {displayValue(data.classification)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Confidentiality
                  </Text>

                  <View style={styles.infoValue}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {displayValue(data.confidentialityLevel)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.infoRowFull}>
              <Text style={styles.infoLabel}>
                Description
              </Text>

              <Text style={styles.descriptionText}>
                {displayValue(data.description)}
              </Text>
            </View>
          </View>
        </View>

        {/* CURRENT STATUS */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              At a Glance Status
            </Text>
          </View>

          <View style={styles.sectionBody}>
            <View style={styles.statusGrid}>
              <View style={styles.statusCard}>
                <Text style={styles.statusCardLabel}>
                  Current Office
                </Text>

                <Text style={styles.statusCardValue}>
                  {displayValue(data.currentOffice?.officeCode)}
                </Text>
              </View>

              <View style={styles.statusCard}>
                <Text style={styles.statusCardLabel}>
                  Responsible Office
                </Text>

                <Text style={styles.statusCardValue}>
                  {displayValue(data.responsibleOffice?.officeCode)}
                </Text>
              </View>

              <View style={styles.statusCard}>
                <Text style={styles.statusCardLabel}>
                  Responsible Person
                </Text>

                <Text style={styles.statusCardValue}>
                  {displayValue(data.responsiblePerson)}
                </Text>
              </View>

              <View style={styles.statusCard}>
                <Text style={styles.statusCardLabel}>
                  Total Age
                </Text>

                <Text style={styles.statusCardValue}>
                  {data.totalAgeDays ?? 0} day
                  {(data.totalAgeDays ?? 0) !== 1 ? 's' : ''}
                </Text>
              </View>

              <View style={styles.statusCard}>
                <Text style={styles.statusCardLabel}>
                  Office Age
                </Text>

                <Text style={styles.statusCardValue}>
                  {data.currentOfficeAgeDays ?? 0} day
                  {(data.currentOfficeAgeDays ?? 0) !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <View style={styles.statusDetails}>
              <View style={styles.statusDetailItem}>
                <Text style={styles.statusDetailLabel}>
                  Current Status:
                </Text>

                <Text style={styles.statusDetailValue}>
                  {displayValue(data.currentStatus?.name)}
                </Text>
              </View>

              <View style={styles.statusDetailItem}>
                <Text style={styles.statusDetailLabel}>
                  Tracking No.:
                </Text>

                <Text style={styles.statusDetailValue}>
                  {displayValue(data.trackingNumber)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* INSTRUCTIONS AND ACTIONS */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              Instructions and Actions
            </Text>
          </View>

          <View style={styles.sectionBody}>
            <View style={styles.instructionGrid}>
              <InstructionCard
                title="Regional Executive Director"
                titleStyle={styles.redTitle}
                cardStyle={styles.redCard}
                actions={redActions}
              />

              <InstructionCard
                title="Assistant Regional Director"
                titleStyle={styles.ardTitle}
                cardStyle={styles.ardCard}
                actions={ardActions}
              />

              <InstructionCard
                title="Division / Office"
                titleStyle={styles.divisionTitle}
                cardStyle={styles.divisionCard}
                actions={divisionActions}
              />
            </View>
          </View>
        </View>

        {/* ROUTING HISTORY */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              Routing History
            </Text>
          </View>

          <View style={styles.sectionBody}>
            <RoutingHistoryTable
              routes={data.routingHistory ?? []}
            />
          </View>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <Text style={styles.footerMeta}>
              {data.trackingNumber} | Routing Slip
            </Text>

            <Text style={styles.footerMeta}>
              Generated: {formatDateTime(new Date().toISOString())}
            </Text>
          </View>

          {/* <View style={styles.signatureGrid}>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureLabel}>
                Prepared by:
              </Text>

              <View style={styles.signatureLine} />

              <Text style={styles.signatureValue}>
                {displayValue(data.currentOffice?.officeName)}
              </Text>
            </View>

            <View style={styles.signatureColumn}>
              <Text style={styles.signatureLabel}>
                Received by:
              </Text>

              <View style={styles.signatureLine} />

              <Text style={styles.signatureValue}>
                ______________________________
              </Text>
            </View>

            <View style={styles.signatureColumn}>
              <Text style={styles.signatureLabel}>
                Date:
              </Text>

              <View style={styles.signatureLine} />

              <Text style={styles.signatureValue}>
                {formatDate(new Date().toISOString())}
              </Text>
            </View>
          </View> */}
        </View>

        <Text
          style={styles.pageNumber}
          fixed
          render={({ pageNumber }) =>
            `Page ${pageNumber} of 1`
          }
        />
      </Page>
    </Document>
  );
}