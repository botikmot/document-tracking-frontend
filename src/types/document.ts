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


export type RoutingSlipOffice = {
  id: string;
  officeCode: string;
  officeName: string;
};

export type RoutingSlipUser = {
  id: string;
  employeeId?: string | null;
  name: string;
};

export type RoutingSlipAction = {
  id: string;
  actionType: string | null;
  comment: string | null;
  fileName: string | null;
  filePath?: string | null;
  fileType?: string | null;
  createdAt: string;

  user: RoutingSlipUser;

  office: RoutingSlipOffice;
};

export type RoutingSlipStatus = {
  id: string;
  name: string;
};

export type RoutingSlipDocument = {
  id: string;
  trackingNumber: string;
  title: string;
  description: string | null;
  referenceNumber: string | null;

  senderType: string | null;
  senderName: string | null;
  senderOrganization: string | null;
  senderContact: string | null;
  senderOffice: RoutingSlipOffice | null;

  addressee: string | null;

  sourceClass: string | null;
  internalSourceScope: string | null;
  monitoringCategory: string;
  routingProfile: string;

  priority: string | null;
  classification: string | null;
  confidentialityLevel: string | null;

  deadline: string | null;
  createdAt: string;

  currentStatus: RoutingSlipStatus;
  currentOffice: RoutingSlipOffice;

  responsibleOffice: RoutingSlipOffice | null;
  responsiblePerson: string | null;

  totalAgeDays: number;
  currentOfficeAgeDays: number;
};

export type RoutingSlipRoute = {
  id: string;

  fromOffice: RoutingSlipOffice;

  dateReceived: string | null;

  toOffice: RoutingSlipOffice;

  dateReleased: string;

  routeRemarks: string | null;

  status: string;

  actions: RoutingSlipAction[];
};

export type RoutingSlipInstructions = {
  red: RoutingSlipAction[];
  ard: RoutingSlipAction[];
  division: RoutingSlipAction[];
};

export type RoutingSlipResponse = {
  documentId: string;
  trackingNumber: string;

  document: RoutingSlipDocument;

  instructions: RoutingSlipInstructions;

  allActions: RoutingSlipAction[];

  routingHistory: RoutingSlipRoute[];
};

export type RoutingSlipPdfV2Data = {
  trackingNumber: string;
  title: string;
  description: string;

  sender: string;
  senderOrganization?: string;
  senderContact?: string;
  senderOffice?: RoutingSlipOffice | null;

  addressee: string;
  referenceNumber?: string;

  sourceClass?: string;
  internalSourceScope?: string;
  monitoringCategory?: string;
  routingProfile?: string;

  classification: string;
  priority: string;
  confidentialityLevel?: string;

  deadline?: string | null;
  createdAt: string;

  currentStatus?: RoutingSlipStatus | null;
  currentOffice?: RoutingSlipOffice | null;
  responsibleOffice?: RoutingSlipOffice | null;
  responsiblePerson?: string | null;

  totalAgeDays?: number;
  currentOfficeAgeDays?: number;

  qrCode: string;
  officeCode: string;
  documentType: string;

  routingHistory: RoutingSlipRoute[];

  instructions: RoutingSlipInstructions;

  allActions: RoutingSlipAction[];
};