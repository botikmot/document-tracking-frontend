'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
} from 'lucide-react';

import { verifyClientEmail } from '@/services/client-auth.service';

type VerificationStatus =
  | 'VERIFYING'
  | 'SUCCESS'
  | 'ERROR';

export function ClientVerifyEmail() {
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const [status, setStatus] =
    useState<VerificationStatus>('VERIFYING');

  const [message, setMessage] = useState(
    'Verifying your email address...',
  );

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!token) {
        setStatus('ERROR');
        setMessage(
          'The verification link is invalid or incomplete.',
        );

        return;
      }

      try {
        const result =
          await verifyClientEmail(token);

        if (cancelled) {
          return;
        }

        setStatus('SUCCESS');
        setMessage(result.message);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus('ERROR');

        setMessage(
          error instanceof Error
            ? error.message
            : 'Unable to verify your email address.',
        );
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {status === 'VERIFYING' && (
            <>
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-muted">
                <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
              </div>

              <h1 className="text-2xl font-semibold">
                Verifying your email
              </h1>

              <p className="mt-3 text-sm text-muted-foreground">
                {message}
              </p>
            </>
          )}

          {status === 'SUCCESS' && (
            <>
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="size-8 text-green-700" />
              </div>

              <h1 className="text-2xl font-semibold">
                Email Verified
              </h1>

              <p className="mt-3 text-sm text-muted-foreground">
                {message}
              </p>

              <Link
                href="/client/login"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
              >
                Continue to Login
              </Link>
            </>
          )}

          {status === 'ERROR' && (
            <>
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                <CircleAlert className="size-8 text-destructive" />
              </div>

              <h1 className="text-2xl font-semibold">
                Verification Failed
              </h1>

              <p className="mt-3 text-sm text-muted-foreground">
                {message}
              </p>

              <Link
                href="/client/login"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md border px-5 text-sm font-medium"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}