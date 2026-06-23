'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchParamsContent({
  setTrackingNumber,
  handleTrack,
}: {
  setTrackingNumber: (val: string) => void;
  handleTrack: (val: string) => void;
}) {
  const searchParams = useSearchParams();

  const tracking = searchParams.get('tracking') ?? '';

  useEffect(() => {
    if (!tracking) return;

    setTrackingNumber(tracking);
    void handleTrack(tracking);
  }, [tracking]);

  return null;
}