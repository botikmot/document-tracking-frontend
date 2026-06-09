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