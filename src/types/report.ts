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

  classification?: string | null;

  priority?: string | null;

  status: string;

  officeStatus?: string | null;

  routeStatus?: string | null;

  routedToOffice?: string | null;

  /*
  |--------------------------------------------------------------------------
  | Current Location
  |--------------------------------------------------------------------------
  */

  currentLocation?: {
    officeId: string;

    officeCode: string;

    officeName: string;

    isInTransit: boolean;
  } | null;

  /*
  |--------------------------------------------------------------------------
  | Backward Compatibility
  |--------------------------------------------------------------------------
  */

  office?: string;

  /*
  |--------------------------------------------------------------------------
  | Responsibility
  |--------------------------------------------------------------------------
  */

  responsibleOffice?: {
    id: string;

    officeCode: string;

    officeName: string;
  } | null;

  responsiblePerson?: string | null;

  responsibleParty?: string | null;

  /*
  |--------------------------------------------------------------------------
  | Dates / Timing
  |--------------------------------------------------------------------------
  */

  createdAt: string;

  deadline?: string | null;

  allottedTimeMs?: number | null;

  timeInOfficeMs: number;

  isOverdue: boolean;

  deadlineStatus:
    | 'NO_DEADLINE'
    | 'AWAITING_RECEIPT'
    | 'ON_TIME'
    | 'OVERDUE';

  acted: boolean;

  actionCount?: number;

  lastActionAt?:
    | string
    | null;

  receivedAt: string | null;

  officeCompletedAt: string | null;
  completedAt: string | null;

  latestRemarks: string | null;
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
  actedDocuments: DocumentSummary;
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

    actedDocuments: DocumentSummary;

    completedDocuments:
      DocumentSummary;

    overdueDocuments:
      DocumentSummary;

    completionRate: number;

    actionRate: number;

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