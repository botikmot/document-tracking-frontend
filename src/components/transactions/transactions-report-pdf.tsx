import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import type {
  TransactionOfficeSummaryResponse,
  TransactionQuery,
} from '@/types/transaction';

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

type TransactionsReportPDFProps = {
  data:
    TransactionOfficeSummaryResponse;

  query:
    TransactionQuery;

  logoUrl?: string;
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return 'All dates';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    },
  ).format(date);
}

function formatGeneratedAt() {
  return new Intl.DateTimeFormat(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(
    new Date(),
  );
}

function getFilterLabel(
  query:
    TransactionQuery,
) {
  if (
    query.sourceClass ===
    'INTERNAL'
  ) {
    return 'Internal';
  }

  if (
    query.sourceClass ===
    'EXTERNAL'
  ) {
    return 'External';
  }

  if (
    query.monitoringCategory ===
    'PERMIT'
  ) {
    return 'Permits';
  }

  if (
    query.monitoringCategory ===
    'SURVEY_RETURN'
  ) {
    return 'Survey Returns';
  }

  if (
    query.monitoringCategory ===
    'GENERAL'
  ) {
    return 'General';
  }

  return 'All Transactions';
}

function getReportingPeriod(
  query:
    TransactionQuery,
) {
  if (
    query.from &&
    query.to
  ) {
    return `${formatDate(
      query.from,
    )} - ${formatDate(
      query.to,
    )}`;
  }

  if (query.from) {
    return `From ${formatDate(
      query.from,
    )}`;
  }

  if (query.to) {
    return `Up to ${formatDate(
      query.to,
    )}`;
  }

  return 'All available records';
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles =
  StyleSheet.create({
    page: {
      backgroundColor:
        '#FFFFFF',

      paddingTop: 28,
      paddingHorizontal: 30,
      paddingBottom: 34,

      fontFamily:
        'Helvetica',

      color:
        '#1F2937',
    },

    /*
    |--------------------------------------------------------------------------
    | HEADER
    |--------------------------------------------------------------------------
    */

    header: {
      flexDirection:
        'row',

      alignItems:
        'center',

      paddingBottom: 14,

      borderBottomWidth: 1.2,
      borderBottomColor:
        '#0E6B3B',
    },

    logoWrap: {
      width: 58,

      alignItems:
        'center',
    },

    logo: {
      width: 48,
      height: 48,
      objectFit:
        'contain',
    },

    headerText: {
      flex: 1,

      alignItems:
        'center',

      paddingHorizontal: 10,
    },

    republic: {
      fontSize: 7.2,

      color:
        '#4B5563',
    },

    department: {
      marginTop: 2,

      fontSize: 10,

      fontWeight:
        'bold',

      color:
        '#0E5A32',
    },

    region: {
      marginTop: 2,

      fontSize: 7.5,

      color:
        '#374151',
    },

    headerSpacer: {
      width: 58,
    },

    /*
    |--------------------------------------------------------------------------
    | TITLE
    |--------------------------------------------------------------------------
    */

    titleSection: {
      marginTop: 18,

      alignItems:
        'center',
    },

    title: {
      fontSize: 16,

      fontWeight:
        'bold',

      color:
        '#102418',
    },

    subtitle: {
      marginTop: 4,

      fontSize: 7.5,

      color:
        '#6B7280',
    },

    /*
    |--------------------------------------------------------------------------
    | REPORT INFO
    |--------------------------------------------------------------------------
    */

    infoPanel: {
      marginTop: 16,

      flexDirection:
        'row',

      borderWidth: 1,
      borderColor:
        '#DDE6E0',

      borderRadius: 7,

      backgroundColor:
        '#F7FAF8',
    },

    infoItem: {
      flex: 1,

      paddingVertical: 8,
      paddingHorizontal: 10,
    },

    infoDivider: {
      borderRightWidth: 1,
      borderRightColor:
        '#DDE6E0',
    },

    infoLabel: {
      fontSize: 5.8,

      fontWeight:
        'bold',

      color:
        '#6B7280',

      textTransform:
        'uppercase',
    },

    infoValue: {
      marginTop: 3,

      fontSize: 7.4,

      fontWeight:
        'bold',

      color:
        '#102418',
    },

    /*
    |--------------------------------------------------------------------------
    | SECTION
    |--------------------------------------------------------------------------
    */

    section: {
      marginTop: 16,
    },

    sectionHeading: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom: 8,
    },

    sectionMarker: {
      width: 4,
      height: 13,

      borderRadius: 2,

      backgroundColor:
        '#15803D',

      marginRight: 7,
    },

    sectionTitle: {
      fontSize: 9,

      fontWeight:
        'bold',

      color:
        '#102418',
    },

    /*
    |--------------------------------------------------------------------------
    | SUMMARY CARDS
    |--------------------------------------------------------------------------
    */

    summaryGrid: {
      flexDirection:
        'row',

      flexWrap:
        'wrap',

      gap: 6,
    },

    summaryCard: {
      width: '24%',

      minHeight: 48,

      paddingVertical: 8,
      paddingHorizontal: 9,

      borderWidth: 1,
      borderColor:
        '#DDE6E0',

      borderRadius: 6,

      backgroundColor:
        '#FAFCFA',
    },

    summaryLabel: {
      fontSize: 5.8,

      fontWeight:
        'bold',

      color:
        '#6B7280',

      textTransform:
        'uppercase',
    },

    summaryValue: {
      marginTop: 4,

      fontSize: 14,

      fontWeight:
        'bold',

      color:
        '#102418',
    },

    summarySubtext: {
      marginTop: 2,

      fontSize: 5.3,

      color:
        '#7A8B80',
    },

    /*
    |--------------------------------------------------------------------------
    | TABLE
    |--------------------------------------------------------------------------
    */

    table: {
      overflow:
        'hidden',

      borderWidth: 1,
      borderColor:
        '#D7E0DA',

      borderRadius: 6,
    },

    tableHeader: {
      flexDirection:
        'row',

      alignItems:
        'stretch',

      minHeight: 30,

      backgroundColor:
        '#102418',
    },

    tableRow: {
      flexDirection:
        'row',

      alignItems:
        'stretch',

      minHeight: 28,

      borderTopWidth: 1,
      borderTopColor:
        '#E5E7EB',
    },

    alternatingRow: {
      backgroundColor:
        '#F9FBFA',
    },

    headerCell: {
      justifyContent:
        'center',

      paddingVertical: 6,
      paddingHorizontal: 2,

      fontSize: 5.2,

      fontWeight:
        'bold',

      textAlign:
        'center',

      color:
        '#FFFFFF',
    },

    cell: {
      justifyContent:
        'center',

      paddingVertical: 6,
      paddingHorizontal: 2,

      fontSize: 5.8,

      textAlign:
        'center',

      color:
        '#374151',
    },

    officeHeader: {
      width: '19%',

      textAlign:
        'left',

      paddingLeft: 5,
    },

    officeCell: {
      width: '19%',

      alignItems:
        'flex-start',

      textAlign:
        'left',

      paddingLeft: 5,
    },

    officeName: {
      fontSize: 5.9,

      fontWeight:
        'bold',

      color:
        '#102418',
    },

    officeCode: {
      marginTop: 2,

      fontSize: 5,

      color:
        '#6B7280',
    },

    totalColumn: {
      width: '6%',
    },

    standardColumn: {
      width: '7%',
    },

    surveyColumn: {
      width: '8%',
    },

    /*
    |--------------------------------------------------------------------------
    | NOTES
    |--------------------------------------------------------------------------
    */

    noteBox: {
      marginTop: 10,

      paddingVertical: 7,
      paddingHorizontal: 9,

      borderRadius: 5,

      backgroundColor:
        '#F3F7F4',

      borderWidth: 1,
      borderColor:
        '#DDE6E0',
    },

    noteText: {
      fontSize: 5.5,

      lineHeight: 1.35,

      color:
        '#647067',
    },

    /*
    |--------------------------------------------------------------------------
    | FOOTER
    |--------------------------------------------------------------------------
    */

    footer: {
      position:
        'absolute',

      left: 30,
      right: 30,
      bottom: 16,

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      borderTopWidth: 0.8,
      borderTopColor:
        '#D7E0DA',

      paddingTop: 5,
    },

    footerText: {
      fontSize: 5.3,

      color:
        '#7A8B80',
    },
  });

/*
|--------------------------------------------------------------------------
| PDF
|--------------------------------------------------------------------------
*/

export function TransactionsReportPDF({
  data,
  query,
  logoUrl,
}: TransactionsReportPDFProps) {
  const {
    summary,
    offices,
  } = data;

  const summaryCards = [
    {
      label:
        'Total Transactions',

      value:
        summary.totalDocuments,

      subtext:
        'Unique transactions',
    },

    {
      label:
        'Internal',

      value:
        summary.internal,

      subtext:
        'Internal source',
    },

    {
      label:
        'External',

      value:
        summary.external,

      subtext:
        'External source',
    },

    {
      label:
        'Permits',

      value:
        summary.permits,

      subtext:
        'Permit transactions',
    },

    {
      label:
        'Survey Returns',

      value:
        summary.surveyReturns,

      subtext:
        'Survey return transactions',
    },

    {
      label:
        'Active',

      value:
        summary.active,

      subtext:
        'Currently active',
    },

    {
      label:
        'Overdue',

      value:
        summary.overdue,

      subtext:
        'Past due and active',
    },

    {
      label:
        'Completed',

      value:
        summary.completed,

      subtext:
        'Terminal transactions',
    },
  ];

  return (
    <Document
      title="Regional Office Transaction Report"
      author="DENR Caraga eDATS"
      subject="Regional Office Transaction Monitoring Report"
      creator="DENR Caraga eDATS"
    >
      <Page
        size="A4"
        orientation="landscape"
        style={
          styles.page
        }
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <View style={styles.header}>
          <View
            style={
              styles.logoWrap
            }
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                style={
                  styles.logo
                }
              />
            ) : null}
          </View>

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
              Republic of the Philippines
            </Text>

            <Text
              style={
                styles.department
              }
            >
              DEPARTMENT OF ENVIRONMENT AND NATURAL RESOURCES
            </Text>

            <Text
              style={
                styles.region
              }
            >
              Caraga Region
            </Text>
          </View>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>

        {/* =====================================================
            TITLE
        ===================================================== */}

        <View
          style={
            styles.titleSection
          }
        >
          <Text
            style={
              styles.title
            }
          >
            REGIONAL OFFICE TRANSACTION REPORT
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Electronic Document Action Tracking System (eDATS)
          </Text>
        </View>

        {/* =====================================================
            REPORT INFO
        ===================================================== */}

        <View
          style={
            styles.infoPanel
          }
        >
          <View
            style={[
              styles.infoItem,
              styles.infoDivider,
            ]}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Reporting Period
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {getReportingPeriod(
                query,
              )}
            </Text>
          </View>

          <View
            style={[
              styles.infoItem,
              styles.infoDivider,
            ]}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Transaction Filter
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {getFilterLabel(
                query,
              )}
            </Text>
          </View>

          <View
            style={styles.infoItem}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Generated
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {formatGeneratedAt()}
            </Text>
          </View>
        </View>

        {/* =====================================================
            REGIONAL SUMMARY
        ===================================================== */}

        <View
          style={
            styles.section
          }
        >
          <View
            style={
              styles.sectionHeading
            }
          >
            <View
              style={
                styles.sectionMarker
              }
            />

            <Text
              style={
                styles.sectionTitle
              }
            >
              Regional Transaction Summary
            </Text>
          </View>

          <View
            style={
              styles.summaryGrid
            }
          >
            {summaryCards.map(
              (card) => (
                <View
                  key={
                    card.label
                  }
                  style={
                    styles.summaryCard
                  }
                >
                  <Text
                    style={
                      styles.summaryLabel
                    }
                  >
                    {
                      card.label
                    }
                  </Text>

                  <Text
                    style={
                      styles.summaryValue
                    }
                  >
                    {
                      card.value
                    }
                  </Text>

                  <Text
                    style={
                      styles.summarySubtext
                    }
                  >
                    {
                      card.subtext
                    }
                  </Text>
                </View>
              ),
            )}
          </View>
        </View>

        {/* =====================================================
            OFFICE SUMMARY
        ===================================================== */}

        <View
          style={
            styles.section
          }
        >
          <View
            style={
              styles.sectionHeading
            }
          >
            <View
              style={
                styles.sectionMarker
              }
            />

            <Text
              style={
                styles.sectionTitle
              }
            >
              Transactions by Office
            </Text>
          </View>

          <View
            style={
              styles.table
            }
          >
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
                  styles.officeHeader,
                ]}
              >
                Office
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.totalColumn,
                ]}
              >
                Total
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                Internal
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                External
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                Permits
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.surveyColumn,
                ]}
              >
                Survey Returns
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                Pending
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                Process
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                Review
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                Approval
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                Overdue
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.standardColumn,
                ]}
              >
                Acted
              </Text>
            </View>

            {/* ROWS */}

            {offices.map(
              (
                office,
                index,
              ) => (
                <View
                  key={
                    office.officeId
                  }
                  wrap={false}
                  style={[
                    styles.tableRow,

                    index % 2 ===
                    1
                      ? styles.alternatingRow
                      : {},
                  ]}
                >
                  <View
                    style={[
                      styles.cell,
                      styles.officeCell,
                    ]}
                  >
                    <Text
                      style={
                        styles.officeName
                      }
                    >
                      {
                        office.officeName
                      }
                    </Text>

                    <Text
                      style={
                        styles.officeCode
                      }
                    >
                      {
                        office.officeCode
                      }
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.cell,
                      styles.totalColumn,
                    ]}
                  >
                    {
                      office.total
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.internal
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.external
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.permits
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.surveyColumn,
                    ]}
                  >
                    {
                      office.surveyReturns
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.pending
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.onProcess
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.forReview
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.forApproval
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.overdue
                    }
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.standardColumn,
                    ]}
                  >
                    {
                      office.acted
                    }
                  </Text>
                </View>
              ),
            )}
          </View>

          {/* EXPLANATORY NOTES */}

          <View
            style={
              styles.noteBox
            }
          >
            <Text
              style={
                styles.noteText
              }
            >
              Note: Total represents unique documents handled by each office within the report scope.
              A document may therefore appear in more than one office total as it moves through the workflow.
              Internal and External identify document source, while Permits and Survey Returns are monitoring
              categories and may overlap with source classifications. Pending, Process, Review, Approval and
              Overdue reflect current office responsibility. Acted represents documents on which the office
              completed or performed handling activity.
            </Text>
          </View>
        </View>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <View
          style={
            styles.footer
          }
          fixed
        >
          <Text
            style={
              styles.footerText
            }
          >
            DENR Caraga eDATS - Regional Office Transaction Report
          </Text>

          <Text
            style={
              styles.footerText
            }
            render={({
              pageNumber,
              totalPages,
            }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}