import type {
  ClientServiceType,
} from '@/types/client-service-type';

/*
 * ==============================================================
 * APPLICATION STATUS
 * ==============================================================
 */

export type ClientApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_REQUIREMENTS'
  | 'RESUBMITTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

/*
 * ==============================================================
 * ATTACHMENTS
 * ==============================================================
 */

export type ClientApplicationAttachmentType =
  | 'LETTER_REQUEST'
  | 'SUPPORTING_DOCUMENT';

export interface ClientApplicationAttachmentRequirement {
  id: string;

  code: string;

  name: string;
}

export interface ClientApplicationAttachment {
  id: string;

  type:
    ClientApplicationAttachmentType;

  requirementId?: string | null;

  requirement?:
    ClientApplicationAttachmentRequirement | null;

  /*
   * Stored/internal filename.
   */
  fileName: string;

  /*
   * Original filename uploaded by client.
   */
  originalName: string;

  filePath: string;

  mimeType: string;

  fileSize?: number | null;

  createdAt: string;
}

/*
 * ==============================================================
 * OFFICIAL DOCUMENT
 * ==============================================================
 */

export interface ClientApplicationDocumentStatus {
  id: string;

  name: string;
}

export interface ClientApplicationDocumentOffice {
  id: string;

  officeCode: string;

  officeName: string;
}

export interface ClientApplicationDocument {
  id: string;

  trackingNumber: string;

  title: string;

  currentStatus?:
    ClientApplicationDocumentStatus | null;

  currentOffice?:
    ClientApplicationDocumentOffice | null;

  responsibleOffice?:
    ClientApplicationDocumentOffice | null;

  createdAt?: string;
}

/*
 * ==============================================================
 * CLIENT APPLICATION
 * ==============================================================
 */

export interface ClientApplication {
  id: string;

  referenceNumber: string;

  clientId?: string;

  serviceTypeId?: string | null;

  receivingOfficeId?: string | null;

  transactionType: string;

  title: string;

  description?: string | null;

  relatedTrackingNumber?: string | null;

  status:
    ClientApplicationStatus;

  /*
   * IMPORTANT:
   *
   * Reuse the full ClientServiceType.
   *
   * This fixes:
   * serviceType.requirements
   * serviceType.requiresLetterRequest
   * serviceType.requiresTrackingNumber
   * serviceType.allowsAttachments
   */
  serviceType?:
    ClientServiceType | null;

  /*
   * Uploaded files.
   */
  attachments:
    ClientApplicationAttachment[];

  /*
   * Linked official eDATS document.
   */
  documentId?: string | null;

  document?:
    ClientApplicationDocument | null;

  /*
   * Review information.
   */
  reviewRemarks?: string | null;

  additionalRequirementsRemarks?: string | null;

  rejectionReason?: string | null;

  reviewedByUserId?: string | null;

  /*
   * Lifecycle dates.
   */
  submittedAt?: string | null;

  resubmittedAt?: string | null;

  reviewedAt?: string | null;

  acceptedAt?: string | null;

  rejectedAt?: string | null;

  completedAt?: string | null;

  createdAt: string;

  updatedAt: string;
}

/*
 * ==============================================================
 * CREATE APPLICATION
 * ==============================================================
 */

export interface CreateClientApplicationDto {
  serviceTypeId: string;

  title: string;

  description?: string;

  relatedTrackingNumber?: string;
}

/*
 * ==============================================================
 * TRACKING
 * ==============================================================
 */

export interface ClientTrackingOffice {
  id: string;

  officeCode: string;

  officeName: string;
}

export interface ClientTrackingRoute {
  id: string;

  status: string;

  fromOffice?:
    ClientTrackingOffice | null;

  toOffice?:
    ClientTrackingOffice | null;

  sentAt?: string | null;

  receivedAt?: string | null;

  completedAt?: string | null;
}

export interface ClientDocumentTracking {
  id: string;

  trackingNumber: string;

  title: string;

  /*
   * Raw internal DocumentStatus.
   *
   * Example:
   * DRAFT
   * PENDING
   * ON_PROCESS
   * COMPLETED
   */
  status?: string | null;

  /*
   * Client-friendly transformed status.
   *
   * Example:
   * Accepted
   * Processing
   * Completed
   */
  displayStatus?: string | null;

  currentOffice?:
    ClientTrackingOffice | null;

  responsibleOffice?:
    ClientTrackingOffice | null;

  createdAt?: string | null;
}

export interface ClientApplicationTrackingResponse {
  applicationReference: string;

  transactionType: string;

  applicationStatus:
    ClientApplicationStatus;

  submittedAt?: string | null;

  acceptedAt?: string | null;

  /*
   * These may be returned when
   * application is not yet linked
   * to an official document.
   */
  officialTrackingNumber?: string | null;

  documentStatus?: string | null;

  currentOffice?:
    ClientTrackingOffice | null;

  responsibleOffice?:
    ClientTrackingOffice | null;

  message?: string;

  /*
   * Present once official Document exists.
   */
  document?:
    ClientDocumentTracking | null;

  timeline?:
    ClientTrackingRoute[];
}