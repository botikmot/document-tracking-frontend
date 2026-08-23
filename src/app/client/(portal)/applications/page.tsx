'use client';

import Link from 'next/link';

import {
  AlertCircle,
  ArrowRight,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
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
} from '@/components/ui/card';

import {
  useClientApplications,
} from '@/hooks/use-client-applications';

import {
  formatDate,
} from '@/lib/format-date';

export default function ClientApplicationsPage() {
  const {
    applications,
    isLoading,
    error,
    refresh,
  } = useClientApplications();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Applications
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View and track your
            submitted transactions.
          </p>
        </div>

        <Button asChild>
          <Link href="/client/applications/new">
            <Plus className="mr-2 h-4 w-4" />

            New Application
          </Link>
        </Button>
      </div>

      {/* LOADING */}
      {isLoading && (
        <Card>
          <CardContent className="flex min-h-60 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />

              Loading applications...
            </div>
          </CardContent>
        </Card>
      )}

      {/* ERROR */}
      {!isLoading &&
        error && (
          <Card>
            <CardContent className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="mb-3 h-8 w-8 text-destructive" />

              <h3 className="font-medium">
                Unable to load applications
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() =>
                  void refresh()
                }
              >
                <RefreshCw className="mr-2 h-4 w-4" />

                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

      {/* EMPTY */}
      {!isLoading &&
        !error &&
        applications.length ===
          0 && (
          <Card>
            <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="font-medium">
                No applications yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Start a new
                transaction and
                monitor its progress
                here.
              </p>

              <Button
                className="mt-5"
                asChild
              >
                <Link href="/client/applications/new">
                  <Plus className="mr-2 h-4 w-4" />

                  New Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

      {/* APPLICATIONS */}
      {!isLoading &&
        !error &&
        applications.length >
          0 && (
          <div className="space-y-3">
            {applications.map(
              (
                application,
              ) => (
                <Card
                  key={
                    application.id
                  }
                  className="transition-shadow hover:shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">
                            {
                              application.transactionType
                            }
                          </h2>

                          <ApplicationStatusBadge
                            status={
                              application.status
                            }
                          />
                        </div>

                        <p className="truncate text-sm text-muted-foreground">
                          {
                            application.title
                          }
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                          <span>
                            Application
                            Reference:{' '}
                            <strong className="font-medium text-foreground">
                              {
                                application.referenceNumber
                              }
                            </strong>
                          </span>

                          <span>
                            Submitted:{' '}
                            {formatDate(
                              application.submittedAt ??
                                application.createdAt,
                            )}
                          </span>
                        </div>

                        {application
                          .document
                          ?.trackingNumber && (
                          <div className="pt-1">
                            <p className="text-xs text-muted-foreground">
                              Official
                              Tracking
                              Number
                            </p>

                            <p className="font-mono text-sm font-semibold">
                              {
                                application
                                  .document
                                  .trackingNumber
                              }
                            </p>
                          </div>
                        )}

                        {application.status ===
                          'ADDITIONAL_REQUIREMENTS' &&
                          application.additionalRequirementsRemarks && (
                            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                              <strong>
                                Action
                                required:
                              </strong>{' '}
                              {
                                application.additionalRequirementsRemarks
                              }
                            </div>
                          )}

                        {application.status ===
                          'REJECTED' &&
                          application.rejectionReason && (
                            <div className="rounded-md border px-3 py-2 text-sm">
                              <strong>
                                Reason:
                              </strong>{' '}
                              {
                                application.rejectionReason
                              }
                            </div>
                          )}
                      </div>

                      <Button
                        variant="outline"
                        asChild
                      >
                        <Link
                          href={`/client/applications/${application.id}`}
                        >
                          View Details

                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        )}
    </div>
  );
}