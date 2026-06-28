import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 55,
    paddingHorizontal: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#006838',
    paddingBottom: 12,
    marginBottom: 14,
  },

  logo: {
    width: 58,
    height: 58,
    marginRight: 15,
  },

  headerText: {
    flex: 1,
  },

  republic: {
    fontSize: 9,
    color: '#444',
  },

  department: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#006838',
    marginTop: 2,
  },

  system: {
    fontSize: 10,
    color: '#444',
    marginTop: 2,
  },

  reportTitle: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
    borderColor: '#D8D8D8',
    backgroundColor: '#F8FAF8',
    padding: 10,
  },

  metadataLeft: {
    width: '42%',
    paddingRight: 20,
  },

  metadataRight: {
    width: '50%',
    alignItems: 'flex-end',
  },

  metadataRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  metadataLabel: {
    width: 95,
    fontWeight: 'bold',
    color: '#333',
  },

  metadataValue: {
    flex: 1,
    color: '#444',
  },

  table: {
    display: 'flex',
    width: '100%',
    borderWidth: 1,
    borderColor: '#CFCFCF',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#006838',
    color: '#FFF',
    fontWeight: 'bold',
    minHeight: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
  },

  row: {
    flexDirection: 'row',
    minHeight: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },

  alternateRow: {
    backgroundColor: '#F8F8F8',
  },

  cell: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 8,
  },

  headerCell: {
    paddingHorizontal: 6,
    paddingVertical: 7,
    fontSize: 8,
    fontWeight: 'bold',
  },

  no: {
    width: '5%',
  },

  tracking: {
    width: '16%',
  },

  title: {
    width: '28%',
  },

  type: {
    width: '13%',
  },

  office: {
    width: '18%',
  },

  classification: {
    width: '10%',
  },

  deadline: {
    width: '10%',
  },

  status: {
    width: '10%',
  },

  footer: {
    position: 'absolute',
    left: 30,
    right: 30,
    bottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
    paddingTop: 6,
    fontSize: 8,
    color: '#666',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statusCompleted: {
    color: '#15803d',
    fontWeight: 'bold',
  },

  statusProcess: {
    color: '#2563eb',
    fontWeight: 'bold',
  },

  statusPending: {
    color: '#ca8a04',
    fontWeight: 'bold',
  },

  statusReturned: {
    color: '#dc2626',
    fontWeight: 'bold',
  },

  overdue: {
    color: '#dc2626',
    fontWeight: 'bold',
  },

  dueSoon: {
    color: '#d97706',
    fontWeight: 'bold',
  },

  sectionTitle: {
  fontSize: 12,
  fontWeight: 'bold',
  color: '#006838',
  marginBottom: 14,
},

infoRow: {
  flexDirection: 'row',
  marginBottom: 6,
},

infoLabel: {
  width: 90,
  fontWeight: 'bold',
  color: '#444',
},

infoValue: {
  flex: 1,
  color: '#222',
},

summaryGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},

/* summaryCard: {
  width: '48%',
  borderWidth: 1,
  borderColor: '#D6D6D6',
  backgroundColor: '#F5F8F5',
  borderRadius: 4,
  padding: 8,
  marginBottom: 8,
  alignItems: 'center',
}, */

summaryDanger: {
  backgroundColor: '#FEE2E2',
  borderColor: '#DC2626',
},

/* summaryTitle: {
  fontSize: 8,
  color: '#555',
}, */

/* summaryValue: {
  marginTop: 4,
  fontSize: 14,
  fontWeight: 'bold',
  color: '#006838',
}, */

summaryTitle: {
  fontSize: 11,
  fontWeight: 'bold',
  color: '#006838',
  textAlign: 'center',
  marginBottom: 10,
},

summaryContainer: {
  justifyContent: 'center',
},

summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 5,
},

summaryLabel: {
  width: 90,
  fontWeight: 'bold',
  color: '#333',
},

summaryValue: {
  width: 30,
  textAlign: 'right',
  fontWeight: 'bold',
},

summarySection: {
  //marginTop: 20,
  width: '55%',
  justifyContent: 'flex-start',
},

summaryCards: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},

summaryCard: {
  width: '18%',
  borderWidth: 1,
  borderColor: '#0F7A41',
  borderRadius: 5,
  backgroundColor: '#F4FAF6',
  paddingTop: 8,
  paddingBottom: 8,
  alignItems: 'center',
},

summaryCardDanger: {
  borderColor: '#DC2626',
  backgroundColor: '#FEF2F2',
},

summaryCardTitle: {
  fontSize: 9,
  color: '#555',
  marginBottom: 6,
},

summaryCardValue: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#0F7A41',
},

summaryCardValueDanger: {
  color: '#DC2626',
},

});