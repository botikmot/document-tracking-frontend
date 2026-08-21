'use client';

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { RoutingHistoryItem } from '@/types/document';

Font.register({
  family: 'Helvetica',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/helvetica/v6/Helvetica.ttf',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },

  /*
   |--------------------------------------------------------------------------
   | HEADER
   |--------------------------------------------------------------------------
   */

  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#991B1B',
    paddingBottom: 12,
    marginBottom: 20,
  },

  topBorder: {
    borderTopWidth: 3,
    borderTopColor: '#059669',
    marginBottom: 12,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logo: {
    width: 60,
    height: 60,
  },

  agencyText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  regionText: {
    fontSize: 12,
    marginTop: 3,
  },

  qrCode: {
    width: 80,
    height: 80,
  },

  /*
   |--------------------------------------------------------------------------
   | DOCUMENT INFO
   |--------------------------------------------------------------------------
   */

  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  infoContainer: {
    marginBottom: 18,
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },

  infoLabel: {
    width: 140,
    //fontWeight: 'bold',
  },

  infoValue: {
    flex: 1,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF',
    marginVertical: 5,
  },

  /*
   |--------------------------------------------------------------------------
   | TABLE
   |--------------------------------------------------------------------------
   */

  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    minHeight: 20,
  },

  colFromTo: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#374151',
    padding: 6,
  },

  colDate: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#374151',
    padding: 6,
  },

  colForwarded: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#374151',
    padding: 6,
  },

  colRemarks: {
    width: '40%',
    padding: 6,
  },

  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 8,
  },

  classificationOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    flex: 1,
  },

  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },

  checkboxLabel: {
    fontSize: 8,
  },

  tableCellText: {
    fontSize: 7,
    lineHeight: 1.25,
  },

});

type Props = {
  trackingNumber: string;
  title: string;
  description: string;
  sender: string;
  classification: string;
  priority: string;
  addressee: string;
  createdAt: string;
  qrCode: string;
  officeCode: string;
  documentType: string;

  routingHistory?: RoutingHistoryItem[];
};

function formatRoutingDate(
  value?: string | null,
) {
  if (!value) {
    return '-';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '-';
  }

  const datePart =
    date.toLocaleDateString(
      'en-US',
      {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      },
    );

  const timePart =
    date.toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
    );

  return `${datePart} ${timePart}`;
}

function getOfficeLabel(
  office: {
    officeCode: string;
    officeName: string;
  },
) {
  /*
   * Optional shorter Records label.
   */
  if (
    office.officeCode ===
    'RO-RECORDS'
  ) {
    return 'Records';
  }

  /*
   * ORD is much shorter and cleaner
   * inside the routing table.
   */
  if (
    office.officeCode ===
    'ORD'
  ) {
    return 'ORD';
  }

  return (
    office.officeCode ||
    office.officeName
  );
}

function getRoutingRemarks(
  item: RoutingHistoryItem,
) {
  const lines: string[] = [];

  item.actions.forEach(
    (action) => {
      /*
       * Comment / action text
       */
      if (
        action.comment?.trim()
      ) {
        lines.push(
          `Action: ${action.comment.trim()}`,
        );
      }

      /*
       * Attached supporting file
       */
      if (
        action.fileName?.trim()
      ) {
        lines.push(
          `Attachment: ${action.fileName.trim()}`,
        );
      }
    },
  );

  /*
   * Routing remarks
   */
  if (
    item.routeRemarks?.trim()
  ) {
    lines.push(
      `Remarks: ${item.routeRemarks.trim()}`,
    );
  }

  return (
    lines.join('\n') || '-'
  );
}

export default function RoutingSlipPDF({
  trackingNumber,
  title,
  sender,
  classification,
  priority,
  addressee,
  createdAt,
  qrCode,
  officeCode,
  documentType,
  routingHistory = [],
}: Props) {

  const isPermitDocument =
      documentType
        ?.trim()
        .toLowerCase() ===
      'permits';

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <View
          style={
            styles.headerContainer
          }
        >
          <View
            style={
              styles.topBorder
            }
          />

          <View
            style={
              styles.headerRow
            }
          >
            {/* LEFT */}

            <View
              style={
                styles.logoSection
              }
            >
              <Image
                src="/images/denr_logov2.png"
                style={
                  styles.logo
                }
              />

              <View>
                <Text
                  style={
                    styles.agencyText
                  }
                >
                  Department of
                  Environment and
                  Natural Resources
                </Text>

                <Text
                  style={
                    styles.regionText
                  }
                >
                  Caraga Region
                </Text>
              </View>
            </View>

            {/* QR */}

            <Image
              src={qrCode}
              style={
                styles.qrCode
              }
            />
          </View>
        </View>

        {/* ========================================= */}
        {/* TITLE */}
        {/* ========================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Document Routing Slip
        </Text>

        {/* ========================================= */}
        {/* DOCUMENT INFO */}
        {/* ========================================= */}

        <View
          style={
            styles.infoContainer
          }
        >
          <View
            style={
              styles.infoRow
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Print Date:
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {new Date().toLocaleString()}
            </Text>
          </View>

          <View
            style={
              styles.infoRow
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Date Received:
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {createdAt}
            </Text>
          </View>

          <View
            style={
              styles.infoRow
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Document Number:
            </Text>

            <Text
              style={{
                    ...styles.infoValue,
                    fontWeight: 'bold',
                }}
            >
              {trackingNumber}
            </Text>
          </View>

          <View
            style={
              styles.infoRow
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Sender:
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {sender}
            </Text>
          </View>

          <View
            style={
              styles.infoRow
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Subject:
            </Text>

            <Text
              style={{
                    ...styles.infoValue,
                    fontWeight: 'bold',
                }}
            >
              {title}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Classification:
            </Text>

            {officeCode === 'RO-RECORDS' &&
                !isPermitDocument ? (
              <View style={styles.classificationOptions}>
                <View style={styles.checkboxOption}>
                  <View style={styles.checkbox} />
                  <Text style={styles.checkboxLabel}>
                    Simple
                  </Text>
                </View>

                <View style={styles.checkboxOption}>
                  <View style={styles.checkbox} />
                  <Text style={styles.checkboxLabel}>
                    Complex
                  </Text>
                </View>

                <View style={styles.checkboxOption}>
                  <View style={styles.checkbox} />
                  <Text style={styles.checkboxLabel}>
                    Highly Technical
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.infoValue}>
                {classification === 'TECHNICAL'
                  ? 'HIGHLY TECHNICAL'
                  : classification}
              </Text>
            )}
          </View>

          <View
            style={
              styles.infoRow
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Priority:
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {priority}
            </Text>
          </View>
        
          <View
            style={
              styles.infoRow
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Addressee:
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {addressee}
            </Text>
          </View>

        </View>

        <View
          style={
            styles.divider
          }
        />

        {/* ========================================= */}
        {/* TABLE TITLE */}
        {/* ========================================= */}

        <Text
          style={{
            ...styles.sectionTitle,
            marginBottom: 12,
          }}
        >
          Routing and Action
          Information
        </Text>

        {/* ========================================= */}
        {/* TABLE */}
        {/* ========================================= */}

        <View
          style={styles.table}
        >
          {/* HEADER */}

          <View
            style={
              styles.tableHeader
            }
          >
            <View
              style={
                styles.colFromTo
              }
            >
              <Text
                style={
                  styles.tableHeaderText
                }
              >
                From
              </Text>
            </View>

            <View
              style={
                styles.colDate
              }
            >
              <Text
                style={
                  styles.tableHeaderText
                }
              >
                Date Received
              </Text>
            </View>

            <View
              style={
                styles.colFromTo
              }
            >
              <Text
                style={
                  styles.tableHeaderText
                }
              >
                To
              </Text>
            </View>

            <View
              style={
                styles.colDate
              }
            >
              <Text
                style={
                  styles.tableHeaderText
                }
              >
                Date Released
              </Text>
            </View>

            <View
              style={
                styles.colRemarks
              }
            >
              <Text
                style={
                  styles.tableHeaderText
                }
              >
                Action Required / Taken / Remarks / Status
              </Text>
            </View>
            </View>

          {/* ===================================== */}
          {/* EXISTING ROUTING HISTORY */}
          {/* ===================================== */}

          {routingHistory.map(
            (item) => (
              <View
                key={item.id}
                style={
                  styles.tableRow
                }
                wrap={false}
              >
                {/* FROM */}

                <View
                  style={
                    styles.colFromTo
                  }
                >
                  <Text
                    style={
                      styles.tableCellText
                    }
                  >
                    {getOfficeLabel(
                      item.fromOffice,
                    )}
                  </Text>
                </View>

                {/* DATE RECEIVED */}

                <View
                  style={
                    styles.colDate
                  }
                >
                  <Text
                    style={
                      styles.tableCellText
                    }
                  >
                    {formatRoutingDate(
                      item.dateReceived,
                    )}
                  </Text>
                </View>

                {/* TO */}

                <View
                  style={
                    styles.colFromTo
                  }
                >
                  <Text
                    style={
                      styles.tableCellText
                    }
                  >
                    {getOfficeLabel(
                      item.toOffice,
                    )}
                  </Text>
                </View>

                {/* DATE RELEASED */}

                <View
                  style={
                    styles.colDate
                  }
                >
                  <Text
                    style={
                      styles.tableCellText
                    }
                  >
                    {formatRoutingDate(
                      item.dateReleased,
                    )}
                  </Text>
                </View>

                {/* ACTION / REMARKS / STATUS */}

                <View
                  style={
                    styles.colRemarks
                  }
                >
                  <Text
                    style={
                      styles.tableCellText
                    }
                  >
                    {getRoutingRemarks(
                      item,
                    )}
                  </Text>
                </View>
              </View>
            ),
          )}

          {/* ===================================== */}
          {/* REMAINING BLANK ROWS */}
          {/* ===================================== */}

          {Array.from({
            length: Math.max(
              0,
              18 -
                routingHistory.length,
            ),
          }).map(
            (_, index) => (
              <View
                key={`empty-${index}`}
                style={
                  styles.tableRow
                }
              >
                <View
                  style={
                    styles.colFromTo
                  }
                />

                <View
                  style={
                    styles.colDate
                  }
                />

                <View
                  style={
                    styles.colFromTo
                  }
                />

                <View
                  style={
                    styles.colDate
                  }
                />

                <View
                  style={
                    styles.colRemarks
                  }
                />
              </View>
            ),
          )}
        </View>
      </Page>
    </Document>
  );
}