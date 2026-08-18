export interface ReportFilters {
  type:
    | 'monthly'
    | 'quarterly'
    | 'annual'
    | 'custom';

  year?: number;
  month?: number;
  quarter?: number;
  startDate?: string;
  endDate?: string;
  officeIds?: string[];
  documentTypeId?: string;
  status?: string;
}

export type ReportDocument = {
  id: string;

  trackingNumber: string;
  title: string;

  documentType: string;

  // Global document status
  status: string;

  // Selected office handling status
  officeStatus:
    | 'PENDING'
    | 'RECEIVED'
    | 'COMPLETED'
    | 'RETURNED'
    | null;

  routeStatus:
    | 'PENDING'
    | 'RECEIVED'
    | 'COMPLETED'
    | 'RETURNED'
    | null;

  routedToOffice:
    | string
    | null;

  office: string;

  classification: string;

  priority?: string | null;

  createdAt: string;

  deadline?: string | null;

  allottedTimeMs:
    | number
    | null;

  timeInOfficeMs:
    | number
    | null;

  deadlineStatus:
    | 'NO_DEADLINE'
    | 'AWAITING_RECEIPT'
    | 'ON_TIME'
    | 'OVERDUE';

  isOverdue: boolean;

  officeCompletedAt?:
    | string
    | null;
};

export type DocumentSummary = {
  count: number;
  documents: ReportDocument[];
};

export type ReportSummary = {
  totalDocuments: DocumentSummary;
  incomingDocuments: DocumentSummary;
  outgoingDocuments: DocumentSummary;
  pendingDocuments: DocumentSummary;
  completedDocuments: DocumentSummary;
  overdueDocuments: DocumentSummary;
  completionRate: number;
  averageProcessingHours: number;
  processingEfficiency: number;
};

export type Report = {
  reportPeriod: {
    type: string;
    startDate: string;
    endDate: string;
  };

  summary: {
    totalDocuments:
      DocumentSummary;

    incomingDocuments:
      DocumentSummary;

    outgoingDocuments:
      DocumentSummary;

    pendingDocuments:
      DocumentSummary;

    completedDocuments:
      DocumentSummary;

    overdueDocuments:
      DocumentSummary;

    completionRate: number;

    averageProcessingHours:
      number;

    processingEfficiency:
      number;
  };

  statusBreakdown: {
    statusId: string;
    statusName: string;
    count: number;
  }[];

  documentTypeBreakdown: {
    documentTypeId: string;
    documentTypeName: string;
    count: number;
  }[];

  byPriority: {
    priority: string | null;

    _count: {
      priority: number;
    };
  }[];

  monthlyTrend: {
    month: string;
    handled: number;
    completed: number;
  }[];

  analytics: {
    averageProcessingHours:
      number;
  };

  documents:
    ReportDocument[];

  generatedAt: string;
};