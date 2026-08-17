type RoutingDisplayParams = {
  officeStatus?: string | null;
  routedToOffice?: string | null;
};

export function getRoutingDisplay({
  officeStatus,
  routedToOffice,
}: RoutingDisplayParams) {
  if (officeStatus === 'PENDING') {
    return 'Awaiting Receipt';
  }

  if (
    officeStatus === 'RECEIVED' ||
    officeStatus === 'FOR_REVIEW' ||
    officeStatus === 'FOR_APPROVAL' ||
    officeStatus === 'ON_PROCESS'
  ) {
    return 'In Custody';
  }

  if (officeStatus === 'COMPLETED') {
    return routedToOffice || 'Completed';
  }

  return routedToOffice || '-';
}