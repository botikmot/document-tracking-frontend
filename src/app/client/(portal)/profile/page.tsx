'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useClientAuthStore } from '@/store/client-auth-store';

export default function ClientProfilePage() {
  const client =
    useClientAuthStore(
      (state) =>
        state.client,
    );

  const fullName = [
    client?.firstName,
    client?.middleName,
    client?.lastName,
    client?.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Your Client Portal
          account information.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            Personal Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Full Name
            </p>

            <p className="mt-1 text-sm">
              {fullName || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </p>

            <p className="mt-1 text-sm">
              {client?.email ||
                '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mobile Number
            </p>

            <p className="mt-1 text-sm">
              {client?.mobileNumber ||
                '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Organization
            </p>

            <p className="mt-1 text-sm">
              {client?.organizationName ||
                '—'}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Address
            </p>

            <p className="mt-1 text-sm">
              {client?.address ||
                '—'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}