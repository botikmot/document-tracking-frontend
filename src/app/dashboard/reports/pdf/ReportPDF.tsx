import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles =
  StyleSheet.create({
    page: {
      padding: 30,
    },

    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
    },

    row: {
      flexDirection: 'row',
      borderBottom: 1,
      borderColor: '#ddd',
      padding: 8,
    },

    cell: {
      flex: 1,
      fontSize: 10,
    },
  });

export function ReportPDF({
  documents,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[];
}) {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <Text style={styles.title}>
          DENR eDATS Report
        </Text>

        {documents.map(
          (doc) => (
            <View
              key={doc.id}
              style={styles.row}
            >
              <Text
                style={
                  styles.cell
                }
              >
                {
                  doc.trackingNumber
                }
              </Text>

              <Text
                style={
                  styles.cell
                }
              >
                {doc.title}
              </Text>

              <Text
                style={
                  styles.cell
                }
              >
                {
                  doc.status
                }
              </Text>

              <Text
                style={
                  styles.cell
                }
              >
                {
                  doc.office
                }
              </Text>
            </View>
          ),
        )}
      </Page>
    </Document>
  );
}