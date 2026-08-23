'use client';

import Link from 'next/link';

import {
  AlertCircle,
  ArrowRight,
  FileCheck2,
  Files,
  FileText,
  Loader2,
  Plus,
} from 'lucide-react';

import {
  ApplicationStatusBadge,
} from '@/components/client-portal/application-status-badge';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  useClientApplications,
} from '@/hooks/use-client-applications';

import { useClientAuthStore } from '@/store/client-auth-store';

import {
  formatDate,
} from '@/lib/format-date';

export default function ClientDashboardPage() {
  const client =
    useClientAuthStore(
      (state) =>
        state.client,
    );

  const {
    applications,
    isLoading,
  } = useClientApplications();

  /*
   * ------------------------------------------------------------
   * DASHBOARD COUNTERS
   * ------------------------------------------------------------
   */

  const totalApplications =
    applications.length;

  const actionNeeded =
    applications.filter(
      (application) =>
        application.status ===
        'ADDITIONAL_REQUIREMENTS',
    ).length;

  const completed =
    applications.filter(
      (application) =>
        application.status ===
          'COMPLETED' ||
        application.document
          ?.currentStatus?.name ===
          'COMPLETED',
    ).length;

  const processing =
    applications.filter(
      (application) => {
        if (
          application.status !==
          'ACCEPTED'
        ) {
          return false;
        }

        return (
          application.document
            ?.currentStatus
            ?.name !==
          'COMPLETED'
        );
      },
    ).length;

  /*
   * Backend should already return newest first.
   * slice() protects the original array.
   */
  const recentApplications =
    [...applications]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      )
      .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Welcome back
          </p>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {client?.firstName ??
              'Client'}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track your
            transactions with DENR.
          </p>
        </div>

        <Button asChild>
          <Link href="/client/applications/new">
            <Plus className="mr-2 h-4 w-4" />

            New Application
          </Link>
        </Button>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Applications
              </p>

              <p className="mt-1 text-2xl font-bold">
                {isLoading
                  ? '—'
                  : totalApplications}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Files className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Processing
              </p>

              <p className="mt-1 text-2xl font-bold">
                {isLoading
                  ? '—'
                  : processing}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Action Needed
              </p>

              <p className="mt-1 text-2xl font-bold">
                {isLoading
                  ? '—'
                  : actionNeeded}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold">
                {isLoading
                  ? '—'
                  : completed}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECENT TRANSACTIONS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Recent Transactions
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Your most recent
              applications and requests.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link href="/client/applications">
              View all

              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : recentApplications.length ===
            0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <FileText className="mb-3 h-7 w-7 text-muted-foreground" />

              <p className="font-medium">
                No transactions yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create your first
                transaction to get
                started.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentApplications.map(
                (
                  application,
                ) => (
                  <Link
                    key={
                      application.id
                    }
                    href={`/client/applications/${application.id}`}
                    className="flex flex-col justify-between gap-3 py-4 transition-colors first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">
                          {
                            application.transactionType
                          }
                        </p>

                        <ApplicationStatusBadge
                          status={
                            application.status
                          }
                        />
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          {
                            application.referenceNumber
                          }
                        </span>

                        <span>
                          {formatDate(
                            application.submittedAt ??
                              application.createdAt,
                          )}
                        </span>
                      </div>

                      {application
                        .document
                        ?.trackingNumber && (
                        <p className="mt-2 font-mono text-xs font-medium">
                          {
                            application
                              .document
                              .trackingNumber
                          }
                        </p>
                      )}
                    </div>

                    <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                  </Link>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}