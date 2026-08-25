export type DocumentSourceClass =
  | 'INTERNAL'
  | 'EXTERNAL';

export type InternalSourceScope =
  | 'LOCAL_CARAGA'
  | 'OTHER_REGION'
  | 'CENTRAL_OFFICE';

export type DocumentMonitoringCategory =
  | 'GENERAL'
  | 'PERMIT'
  | 'SURVEY_RETURN';

export interface CreateDocumentForm {
  documentTypeId: string;

  title: string;
  referenceNumber: string;
  description: string;

  addressee: string;

  classification: string;
  confidentialityLevel: string;
  priority: string;

  deadline: string;

  sourceClass: DocumentSourceClass | '';
  internalSourceScope: InternalSourceScope | '';
  monitoringCategory: DocumentMonitoringCategory;

  senderType: string;
  senderOfficeId: string;
  senderName: string;
  senderOrganization: string;
  senderContact: string;

  routeToOfficeId: string;
  remarks: string;
  notifyRecipient: boolean;
}

export type RoutingAction = {
  id: string;
  comment: string | null;
  fileName: string | null;
  createdAt: string;
};

export type RoutingHistoryItem = {
  id: string;

  fromOffice: {
    id: string;
    officeCode: string;
    officeName: string;
  };

  dateReceived: string | null;

  toOffice: {
    id: string;
    officeCode: string;
    officeName: string;
  };

  dateReleased: string;

  routeRemarks: string | null;

  status: string;

  actions: RoutingAction[];
};