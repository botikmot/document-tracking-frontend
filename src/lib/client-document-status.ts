export function getClientDocumentStatusLabel(
  status?: string | null,
) {
  switch (status) {
    case 'DRAFT':
      return 'Accepted';

    case 'PENDING':
      return 'Forwarded';

    case 'FOR_REVIEW':
      return 'Under Review';

    case 'FOR_APPROVAL':
      return 'For Approval';

    case 'ON_PROCESS':
      return 'Processing';

    case 'FOR_RELEASE':
      return 'For Release';

    case 'APPROVED':
      return 'Approved';

    case 'REJECTED':
      return 'Not Approved';

    case 'COMPLETED':
      return 'Completed';

    default:
      return 'Processing';
  }
}