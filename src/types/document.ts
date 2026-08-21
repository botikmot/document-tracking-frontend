export interface CreateDocumentForm {
  documentTypeId: string;
  title: string;
  referenceNumber: string;
  description: string;
  confidentialityLevel: string;
  priority: string;
  deadline: string;
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

  dateReceived:
    | string
    | null;

  toOffice: {
    id: string;
    officeCode: string;
    officeName: string;
  };

  dateReleased: string;

  routeRemarks:
    | string
    | null;

  status: string;

  actions: RoutingAction[];
};