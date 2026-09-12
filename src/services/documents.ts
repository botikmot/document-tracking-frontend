
import { api } from '@/lib/axios';
import type { RoutingSlipResponse } from '@/types/document';

export async function getRoutingSlipHistory(
  documentId: string,
): Promise<RoutingSlipResponse> {
  const response = await api.get<RoutingSlipResponse>(
    `/documents/${documentId}/routing-slip-history`,
  );

  return response.data;
}