import { Suspense } from 'react';

import { ClientVerifyEmail } from '@/components/client-auth/client-verify-email';

export default function ClientVerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Verifying email...
        </div>
      }
    >
      <ClientVerifyEmail />
    </Suspense>
  );
}