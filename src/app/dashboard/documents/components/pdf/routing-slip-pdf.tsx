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
    marginBottom: 6,
  },

  infoLabel: {
    width: 140,
    fontWeight: 'bold',
  },

  infoValue: {
    flex: 1,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF',
    marginVertical: 12,
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
    minHeight: 28,
  },

  colDate: {
    width: '20%',
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
    width: '50%',
    padding: 6,
  },

  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 10,
  },
});

type Props = {
  trackingNumber: string;
  title: string;
  description: string;
  sender: string;
  classification: string;
  priority: string;
  createdAt: string;
  qrCode: string;
};

export default function RoutingSlipPDF({
  trackingNumber,
  title,
  description,
  sender,
  classification,
  priority,
  createdAt,
  qrCode,
}: Props) {
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
                src="/images/logo_denr.png"
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
              style={
                styles.infoValue
              }
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
              style={
                styles.infoValue
              }
            >
              {title}
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
              Description:
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {description}
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
              Classification:
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {classification}
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
                styles.colForwarded
              }
            >
              <Text
                style={
                  styles.tableHeaderText
                }
              >
                Forwarded To
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
                Remarks
              </Text>
            </View>
            </View>

          {/* EMPTY ROWS */}

          {Array.from({
            length: 15,
          }).map((_, index) => (
            <View
              key={index}
              style={
                styles.tableRow
              }
            >
              <View
                style={
                  styles.colDate
                }
              />

              <View
                style={
                  styles.colForwarded
                }
              />

              <View
                style={
                  styles.colRemarks
                }
              />
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}