import { api } from '@/lib/axios';

export async function routeDocument(
  documentId: string,
  data: {
    toOfficeId: string;
    remarks?: string;
  }
) {
  return api.post(
    `/documents/${documentId}/route`,
    data,
  );
}