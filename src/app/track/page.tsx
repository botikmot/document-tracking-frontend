'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  Search,
  Loader2,
} from 'lucide-react';

import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { TrackingSummary } from '@/components/tracking/tracking-summary';
import { TrackingTimeline } from '@/components/tracking/tracking-timeline';
import { TrackingDetails } from '@/components/tracking/tracking-details';
import { TrackingRouteHistory } from '@/components/tracking/tracking-route-history';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PublicTrackingPage() {

  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [document, setDocument] = useState<any>(null);
  const [error, setError] = useState('');

  const searchParams = useSearchParams();

  const tracking = searchParams.get('tracking') ?? '';
  const [trackingNumber, setTrackingNumber] = useState(tracking);

  useEffect(() => {
        if (!tracking) return;

        void handleTrack(
            tracking,
        );
    }, [tracking]);

  /*
  |--------------------------------------------------------------------------
  | TRACK
  |--------------------------------------------------------------------------
  */

  async function handleTrack(
    trackingNo?: string,
    ) {
        const value =
            trackingNo ??
            trackingNumber;

        if (!value.trim()) return;

        try {
            setLoading(true);

            setError('');

            const response =
                await api.get(
                    `/track/${value}`,
                );

            setDocument(
                response.data,
            );
        } catch {
            setDocument(null);

            setError(
                'Tracking number not found.',
            );
        } finally {
            setLoading(false);
        }
    }


  return (
    <main className="min-h-screen bg-[#F5F7F2]">

      {/* Background */}

      <div className="fixed inset-0 overflow-hidden">

        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-green-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-3xl" />

      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">

        {/* HERO */}

        <Card className="overflow-hidden rounded-[36px] border-0 bg-gradient-to-br from-[#102418] via-[#173b27] to-[#1e5738] text-white shadow-2xl">

          <CardContent className="p-12">

            <div className="mx-auto max-w-3xl text-center">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/10 backdrop-blur">

                <div className="rounded-full bg-white p-1">
                    <Link href="/">
                        <Image
                            src="/images/logo_denr.png"
                            alt="DENR"
                            width={54}
                            height={54}
                        />
                    </Link>
                </div>

              </div>

              <Badge className="mt-8 rounded-full bg-white/10 px-5 py-2 text-white">

                DENR eDATS+

              </Badge>

              <h1 className="mt-6 text-5xl font-black">

                Public Document Tracking

              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-green-100">

                Track the status and routing history of your official
                document using your tracking number.

              </p>

              {/* SEARCH */}

              <div className="mt-10 flex flex-col gap-4 md:flex-row">

                <Input
                  placeholder="Enter Tracking Number"
                  value={trackingNumber}
                  onChange={(e) =>
                    setTrackingNumber(
                      e.target.value,
                    )
                  }
                  className="h-14 rounded-2xl border-0 bg-white text-lg text-black"
                />

                <Button
                  onClick={() => handleTrack(trackingNumber)}
                  disabled={loading}
                  className="h-14 rounded-2xl bg-green-600 px-10 hover:bg-green-700"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-5 w-5" />
                  )}

                  Track
                </Button>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ERROR */}

        {error && (

          <Card className="mt-8 rounded-[30px] border-red-200">

            <CardContent className="p-10 text-center">

              <h2 className="text-xl font-bold text-red-600">

                {error}

              </h2>

              <p className="mt-3 text-slate-500">

                Please verify the tracking number and try again.

              </p>

            </CardContent>

          </Card>

        )}

        {/* RESULT */}

        {document && (

          <div className="mt-10 space-y-8">

            <TrackingSummary
              document={document}
            />

            <div className="grid gap-8 xl:grid-cols-[420px,1fr]">

              <TrackingTimeline
                routes={document.routes}
              />

              <TrackingDetails
                document={document}
              />

            </div>

            <TrackingRouteHistory
              routes={document.routes}
            />

          </div>

        )}

      </div>

    </main>
  );
}