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

  /* tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#006838',
    color: '#FFF',
    fontWeight: 'bold',
    minHeight: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
  }, */

  row: {
    flexDirection: 'row',
    minHeight: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },

  /* alternateRow: {
    backgroundColor: '#F8F8F8',
  }, */

 /*  cell: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 8,
  }, */

  /* headerCell: {
    paddingHorizontal: 6,
    paddingVertical: 7,
    fontSize: 8,
    fontWeight: 'bold',
  }, */

  no: {
    width: '3%',
  },

 /*  tracking: {
    width: '10%',
  }, */

  title: {
    width: '19%',
  },

 /*  type: {
    width: '8%',
  },
 */
  office: {
    width: '14%',
  },

  /* classification: {
    width: '10%',
  }, */

  /* deadline: {
    width: '9%',
  }, */

 /*  allottedTime: {
    width: '8%',
  }, */

  /* timeInOffice: {
    width: '10%',
  }, */

  status: {
    width: '9%',
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

 /*  statusCompleted: {
    color: '#15803d',
    fontWeight: 'bold',
  }, */

  statusProcess: {
    color: '#2563eb',
    fontWeight: 'bold',
  },

  /* statusPending: {
    color: '#ca8a04',
    fontWeight: 'bold',
  }, */

  /* statusReturned: {
    color: '#dc2626',
    fontWeight: 'bold',
  }, */

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

summaryDanger: {
  backgroundColor: '#FEE2E2',
  borderColor: '#DC2626',
},

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

  /*
  |--------------------------------------------------------------------------
  | Report Document Table
  |--------------------------------------------------------------------------
  */

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#006838',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#D1D5DB',
    minHeight: 29,
  },

  alternateRow: {
    backgroundColor: '#F8FAF8',
  },

  headerCell: {
    color: '#FFFFFF',
    fontSize: 5.7,
    fontWeight: 'bold',
    paddingHorizontal: 3,
    paddingVertical: 6,
    justifyContent: 'center',
  },

  cell: {
    color: '#374151',
    fontSize: 5.8,
    paddingHorizontal: 3,
    paddingVertical: 6,
  },

  /*
   * Width total = 100%
   */

  tracking: {
    width: '9%',
  },

  subject: {
    width: '14%',
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
    width: '9%',
  },

  responsible: {
    width: '13%',
  },

  allottedTime: {
    width: '7%',
  },

  timeInOffice: {
    width: '7%',
  },

  deadlineStatus: {
    width: '8%',
  },

  deadline: {
    width: '7%',
  },

  /*
  |--------------------------------------------------------------------------
  | Status Text
  |--------------------------------------------------------------------------
  */

  statusPending: {
    color: '#B45309',
    fontWeight: 'bold',
  },

  statusCustody: {
    color: '#1D4ED8',
    fontWeight: 'bold',
  },

  statusForwarded: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },

  statusCompleted: {
    color: '#047857',
    fontWeight: 'bold',
  },

  statusReturned: {
    color: '#B91C1C',
    fontWeight: 'bold',
  },

  deadlineOnTime: {
    color: '#047857',
    fontWeight: 'bold',
  },

  deadlineOverdue: {
    color: '#DC2626',
    fontWeight: 'bold',
  },

  deadlineWaiting: {
    color: '#B45309',
    fontWeight: 'bold',
  },

  deadlineNone: {
    color: '#6B7280',
  },

});