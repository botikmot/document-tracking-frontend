/*
|--------------------------------------------------------------------------
| TRANSACTION FILTERS
|--------------------------------------------------------------------------
*/

export type TransactionSourceClass =
  | 'INTERNAL'
  | 'EXTERNAL';

export type TransactionMonitoringCategory =
  | 'GENERAL'
  | 'PERMIT'
  | 'SURVEY_RETURN';

export type TransactionBucket =
  | 'ALL'
  | 'INTERNAL'
  | 'EXTERNAL'
  | 'PERMIT'
  | 'SURVEY_RETURN'
  | 'PENDING'
  | 'ON_PROCESS'
  | 'FOR_REVIEW'
  | 'FOR_APPROVAL'
  | 'OVERDUE'
  | 'ACTED';

export type TransactionQuery = {
  from?: string;
  to?: string;

  search?: string;

  officeId?: string;

  sourceClass?:
    TransactionSourceClass;

  monitoringCategory?:
    TransactionMonitoringCategory;

  status?: string;
};

/*
|--------------------------------------------------------------------------
| OFFICE SUMMARY
|--------------------------------------------------------------------------
*/

export type TransactionRegionalSummary = {
  totalDocuments: number;

  internal: number;
  external: number;

  uncategorizedSource: number;

  permits: number;
  surveyReturns: number;

  active: number;

  overdue: number;

  completed: number;
};

export type TransactionOfficeSummary = {
  officeId: string;

  officeCode: string;

  officeName: string;

  total: number;

  /*
   * Source classification
   */

  internal: number;
  external: number;

  uncategorizedSource: number;

  /*
   * Monitoring categories
   */

  permits: number;

  surveyReturns: number;

  /*
   * Current workload
   */

  active: number;

  pending: number;

  onProcess: number;

  forReview: number;

  forApproval: number;

  overdue: number;

  /*
   * Historical handling
   */

  acted: number;
};

export type TransactionOfficeSummaryResponse = {
  period: {
    from: string | null;

    to: string | null;
  };

  summary:
    TransactionRegionalSummary;

  offices:
    TransactionOfficeSummary[];
};

/*
|--------------------------------------------------------------------------
| OFFICE DOCUMENTS
|--------------------------------------------------------------------------
*/

export type TransactionOfficeInfo = {
  id: string;

  officeCode: string;

  officeName: string;
};

export type TransactionLatestMovement = {
  routeId: string;

  fromOffice:
    TransactionOfficeInfo;

  toOffice:
    TransactionOfficeInfo;

  label: string;

  routeStatus: string;

  sentAt: string;

  receivedAt:
    | string
    | null;

  completedAt:
    | string
    | null;

  remarks:
    | string
    | null;
};

export type TransactionLatestRemarks = {
  text: string;

  source:
    | 'ROUTE'
    | 'ACTION';

  createdAt: string;
};

export type TransactionOfficeDocument = {
  id: string;

  trackingNumber: string;

  subject: string;

  documentType: string;

  referenceNumber:
    | string
    | null;

  /*
   * Classification
   */

  sourceClass:
    | TransactionSourceClass
    | null;

  monitoringCategory:
    TransactionMonitoringCategory;

  classification:
    | string
    | null;

  /*
   * Received
   */

  receivedAt: string;

  /*
   * Workflow
   */

  status: string;

  currentOffice: {
    id: string;

    officeCode: string;

    officeName: string;

    isSelectedOffice: boolean;
  };

  /*
   * Responsibility
   */

  responsibleOffice:
    | TransactionOfficeInfo
    | null;

  responsiblePerson:
    | string
    | null;

  /*
   * Deadline
   */

  deadline:
    | string
    | null;

  deadlineStatus:
    | 'NO_DUE_DATE'
    | 'ON_TIME'
    | 'OVERDUE'
    | 'COMPLETED';

  isOverdue: boolean;

  overdueByMs:
    | number
    | null;

  remainingMs:
    | number
    | null;

  /*
   * Movement / remarks
   */

  lastMovement:
    | TransactionLatestMovement
    | null;

  latestRemarks:
    | TransactionLatestRemarks
    | null;

  /*
   * Office relationship
   */

  actedByOffice: boolean;

  isCurrentlyAtOffice: boolean;
};

export type TransactionOfficeDocumentsResponse = {
  office: {
    id: string;

    officeCode: string;

    officeName: string;

    category: string;

    organizationUnit: {
      id: string;

      code: string;

      name: string;

      type: string;
    };
  };

  filter: {
    bucket:
      TransactionBucket;

    search:
      | string
      | null;

    sourceClass:
      | TransactionSourceClass
      | null;

    monitoringCategory:
      | TransactionMonitoringCategory
      | null;

    status:
      | string
      | null;

    from:
      | string
      | null;

    to:
      | string
      | null;
  };

  pagination: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;

    hasNextPage: boolean;

    hasPreviousPage: boolean;
  };

  documents:
    TransactionOfficeDocument[];
};

/*
|--------------------------------------------------------------------------
| OFFICE DOCUMENT QUERY
|--------------------------------------------------------------------------
*/

export type TransactionOfficeDocumentsQuery =
  TransactionQuery & {
    bucket?:
      TransactionBucket;

    page?: number;

    limit?: number;
  };

/*
|--------------------------------------------------------------------------
| TRANSACTION TIMELINE
|--------------------------------------------------------------------------
*/

export type TransactionTimelineEventType =
  | 'REGISTERED'
  | 'ROUTED'
  | 'RECEIVED'
  | 'ROUTE_COMPLETED'
  | 'ACTION'
  | 'STATUS_UPDATED';

export type TransactionTimelineActor = {
  id: string;

  name:
    | string
    | null;
};

export type TransactionTimelineEvent = {
  id: string;

  type:
    TransactionTimelineEventType;

  occurredAt: string;

  title: string;

  description:
    | string
    | null;

  actor:
    | TransactionTimelineActor
    | null;

  office:
    | TransactionOfficeInfo
    | null;

  fromOffice?:
    | TransactionOfficeInfo
    | null;

  toOffice?:
    | TransactionOfficeInfo
    | null;

  routeStatus?:
    | string
    | null;

  documentStatus?:
    | string
    | null;

  remarks?:
    | string
    | null;

  timeHeldMs?:
    | number
    | null;

  attachment?:
    | {
        fileName:
          | string
          | null;

        filePath:
          | string
          | null;

        fileType:
          | string
          | null;
      }
    | null;
};

/*
|--------------------------------------------------------------------------
| TIMELINE DOCUMENT
|--------------------------------------------------------------------------
*/

export type TransactionTimelineDocument = {
  id: string;

  trackingNumber: string;

  subject: string;

  description:
    | string
    | null;

  referenceNumber:
    | string
    | null;

  documentType: string;

  sourceClass:
    | TransactionSourceClass
    | null;

  internalSourceScope:
    | string
    | null;

  monitoringCategory:
    TransactionMonitoringCategory;

  routingProfile:
    | 'STANDARD'
    | 'DIRECT_TO_ACTION_OFFICE';

  classification:
    | string
    | null;

  priority:
    | string
    | null;

  confidentialityLevel:
    | string
    | null;

  receivedAt: string;

  status: string;

  currentOffice:
    TransactionOfficeInfo;

  responsibleOffice:
    | TransactionOfficeInfo
    | null;

  responsiblePerson:
    | string
    | null;

  deadline:
    | string
    | null;

  deadlineStatus:
    | 'NO_DUE_DATE'
    | 'ON_TIME'
    | 'OVERDUE'
    | 'COMPLETED';

  isOverdue: boolean;

  overdueByMs:
    | number
    | null;

  remainingMs:
    | number
    | null;

  latestRemarks:
    | TransactionLatestRemarks
    | null;
};

export type TransactionTimelineResponse = {
  document:
    TransactionTimelineDocument;

  summary: {
    routeCount: number;

    actionCount: number;

    timelineEventCount: number;
  };

  timeline:
    TransactionTimelineEvent[];
};

export type TransactionQuickFilter =
  | 'ALL'
  | 'INTERNAL'
  | 'EXTERNAL'
  | 'PERMIT'
  | 'SURVEY_RETURN'
  | 'GENERAL';