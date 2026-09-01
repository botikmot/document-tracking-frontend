import { api } from '@/lib/axios';


import type {
  TransactionOfficeDocumentsQuery,
  TransactionOfficeDocumentsResponse,
  TransactionOfficeSummaryResponse,
  TransactionQuery,
  TransactionTimelineResponse,
} from '@/types/transaction';

/*
|--------------------------------------------------------------------------
| QUERY PARAMS
|--------------------------------------------------------------------------
*/

function buildQueryParams(
  query?: Record<
    string,
    unknown
  >,
) {
  const params =
    new URLSearchParams();

  if (!query) {
    return params;
  }

  Object.entries(
    query,
  ).forEach(
    ([
      key,
      value,
    ]) => {
      if (
        value ===
          undefined ||
        value ===
          null ||
        value ===
          ''
      ) {
        return;
      }

      params.set(
        key,
        String(value),
      );
    },
  );

  return params;
}

/*
|--------------------------------------------------------------------------
| OFFICE SUMMARY
|--------------------------------------------------------------------------
*/

export async function getTransactionOfficeSummary(
  query?: TransactionQuery,
) {
  const params =
    buildQueryParams(
      query,
    );

  const response =
    await api.get<TransactionOfficeSummaryResponse>(
      '/transactions/office-summary',
      {
        params,
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| OFFICE DOCUMENTS
|--------------------------------------------------------------------------
*/

export async function getTransactionOfficeDocuments(
  officeId: string,
  query?:
    TransactionOfficeDocumentsQuery,
) {
  const params =
    buildQueryParams(
      query,
    );

  const response =
    await api.get<TransactionOfficeDocumentsResponse>(
      `/transactions/offices/${officeId}/documents`,
      {
        params,
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| DOCUMENT TIMELINE
|--------------------------------------------------------------------------
*/

export async function getTransactionDocumentTimeline(
  documentId: string,
) {
  const response =
    await api.get<TransactionTimelineResponse>(
      `/transactions/documents/${documentId}/timeline`,
    );

  return response.data;
}