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
  status: string;
  office: string;
  classification: string | null;
  priority: string | null;
  createdAt: string;
  deadline: string | null;
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
};

export interface Report {
  reportPeriod: {
    type: string;
    startDate: string;
    endDate: string;
  };

  summary: ReportSummary;

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

  byPriority: Array<{
    priority: string | null;
    _count: {
      priority: number;
    };
  }>;

  monthlyTrend: Array<{
    month: string;
    created: number;
    completed: number;
  }>;

  analytics: {
    averageProcessingHours: number;
  };

  documents: {
    id: string;
    trackingNumber: string;
    title: string;
    documentType: string;
    status: string;
    office: string;
    priority?: string;
    createdAt: string;
    deadline?: string;
  }[];

  generatedAt: string;
}