export type ClientApplicationKind =
  | 'APPLICATION'
  | 'DOCUMENT_REQUEST'
  | 'FOLLOW_UP'
  | 'GENERAL_INQUIRY';

export interface ClientServiceRequirement {
  id: string;

  code: string;

  name: string;

  description?: string | null;

  isRequired: boolean;

  allowsMultiple: boolean;

  /*
   * Optional because the current client API
   * may already filter active requirements
   * and not return this field.
   */
  isActive?: boolean;
}

export interface ClientServiceType {
  id: string;

  code: string;

  name: string;

  description?: string | null;

  kind: ClientApplicationKind;

  requiresLetterRequest: boolean;

  requiresTrackingNumber: boolean;

  allowsAttachments: boolean;

  /*
   * Same reason as requirement.isActive:
   * current API may not include this field.
   */
  isActive?: boolean;

  requirements: ClientServiceRequirement[];

  receivingOffice?: {
    id: string;

    officeCode: string;

    officeName: string;
  } | null;
}