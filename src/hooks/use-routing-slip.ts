import { useCallback, useEffect, useState } from 'react';

import type { RoutingSlipResponse } from '@/types/document';
import { getRoutingSlipHistory } from '@/services/documents';

type UseRoutingSlipOptions = {
  enabled?: boolean;
};

export function useRoutingSlip(
  documentId?: string,
  options: UseRoutingSlipOptions = {},
) {
  const { enabled = true } = options;

  const [data, setData] = useState<RoutingSlipResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutingSlip = useCallback(async () => {
    if (!documentId || !enabled) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getRoutingSlipHistory(documentId);

      setData(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load routing slip';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [documentId, enabled]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoutingSlip();
  }, [fetchRoutingSlip]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchRoutingSlip,
  };
}