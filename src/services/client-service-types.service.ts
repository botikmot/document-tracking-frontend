import { clientApi } from '@/lib/client-api';

import type {
  ClientServiceType,
} from '@/types/client-service-type';

export const clientServiceTypesService = {
  async findAll(
    token: string,
  ): Promise<ClientServiceType[]> {
    return clientApi<ClientServiceType[]>(
      '/client-service-types',
      {
        method: 'GET',
        token,
      },
    );
  },
};