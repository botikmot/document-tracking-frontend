export type RecordsMonitoringStatus =
  | 'AWAITING_RECEIPT'
  | 'IN_CUSTODY'
  | 'COMPLETED'
  | 'RETURNED'
  | 'UNKNOWN';

export interface RecordsMonitoringInfo {
  recordsOffice: {
    id: string;
    officeCode: string;
    officeName: string;
  };

  status: RecordsMonitoringStatus;

  currentlyInRecords: boolean;

  isOverdue: boolean;

  allottedTimeMs: number | null;

  timeInRecordsMs: number | null;

  receivedAt: string | null;

  completedAt: string | null;

  lastRoutedFrom: string | null;

  lastRoutedTo: string | null;

  routedFromRecordsAt: string | null;

  transactionCount: number;

  lastTransactionAt: string;
}

export interface RecordsMonitoringDocument {
  id: string;

  trackingNumber: string;

  title: string;

  description?: string | null;

  referenceNumber?: string | null;

  addressee?: string | null;

  priority?: string | null;

  classification?: string | null;

  confidentialityLevel?: string | null;

  deadline?: string | null;

  createdAt: string;

  updatedAt: string;

  documentType: {
    id: string;
    name: string;
  };

  currentStatus: {
    id: string;
    name: string;
  };

  currentOffice: {
    id: string;
    officeCode: string;
    officeName: string;
  };

  recordsMonitoring: RecordsMonitoringInfo;

  routes: unknown[];
}

export interface RecordsMonitoringResponse {
  recordsOffice: {
    id: string;
    officeCode: string;
    officeName: string;
  };

  data: RecordsMonitoringDocument[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}