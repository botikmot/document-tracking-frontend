'use client';

import Link from 'next/link';

import { useParams } from 'next/navigation';

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  Upload,
} from 'lucide-react';

import {
  ApplicationStatusBadge,
} from '@/components/client-portal/application-status-badge';

import {
  ClientTrackingTimeline,
} from '@/components/client-portal/client-tracking-timeline';

import {
  Badge,
} from '@/components/ui/badge';

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
  Separator,
} from '@/components/ui/separator';

import {
  useClientApplication,
} from '@/hooks/use-client-application';

import {
  getClientDocumentStatusLabel,
} from '@/lib/client-document-status';

import {
  formatDate,
} from '@/lib/format-date';

export default function ClientApplicationDetailsPage() {
  /*
   * ------------------------------------------------------------
   * ROUTE PARAM
   * ------------------------------------------------------------
   *
   * URL:
   * /client/applications/:id
   */
  const params = useParams<{
    id: string;
  }>();

  const applicationId =
    params.id;

  /*
   * ------------------------------------------------------------
   * APPLICATION DATA
   * ------------------------------------------------------------
   */
  const {
    application,
    tracking,
    isLoading,
    error,
    refresh,
  } = useClientApplication(
    applicationId,
  );

  /*
   * ------------------------------------------------------------
   * LOADING STATE
   * ------------------------------------------------------------
   */
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          Loading application...
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * ERROR / NOT FOUND
   * ------------------------------------------------------------
   */
  if (
    error ||
    !application
  ) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="-ml-3"
          asChild
        >
          <Link href="/client/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />

            My Applications
          </Link>
        </Button>

        <Card>
          <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>

            <h2 className="font-semibold">
              Unable to load application
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {error ??
                'The requested application could not be found.'}
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={() =>
                void refresh()
              }
            >
              <RefreshCw className="mr-2 h-4 w-4" />

              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * OFFICIAL DOCUMENT DATA
   * ------------------------------------------------------------
   *
   * tracking.document comes from our dedicated
   * tracking endpoint.
   *
   * application.document is used as fallback.
   */
  const trackingDocument =
    tracking?.document;

  const applicationDocument =
    application.document;

  const trackingNumber =
    trackingDocument?.trackingNumber ??
    applicationDocument?.trackingNumber ??
    null;

  const documentTitle =
    trackingDocument?.title ??
    applicationDocument?.title ??
    null;

  const documentStatus =
    trackingDocument?.status ??
    applicationDocument
      ?.currentStatus
      ?.name ??
    null;

  const currentOffice =
    trackingDocument?.currentOffice ??
    applicationDocument
      ?.currentOffice ??
    null;

  const responsibleOffice =
    trackingDocument?.responsibleOffice ??
    applicationDocument
      ?.responsibleOffice ??
    null;

  const hasOfficialDocument =
    Boolean(trackingNumber);

  /*
   * ------------------------------------------------------------
   * CLIENT FRIENDLY DOCUMENT STATUS
   * ------------------------------------------------------------
   */
  const documentStatusLabel =
    documentStatus
      ? getClientDocumentStatusLabel(
          documentStatus,
        )
      : null;

  return (
    <div className="space-y-6">
      {/* =========================================================
          BACK BUTTON
          ========================================================= */}
      <Button
        variant="ghost"
        className="-ml-3"
        asChild
      >
        <Link href="/client/applications">
          <ArrowLeft className="mr-2 h-4 w-4" />

          My Applications
        </Link>
      </Button>

      {/* =========================================================
          PAGE HEADER
          ========================================================= */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ApplicationStatusBadge
              status={
                application.status
              }
            />

            {documentStatusLabel && (
              <Badge variant="outline">
                {documentStatusLabel}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {
              application.transactionType
            }
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              Application Reference:
            </span>

            <span className="font-mono font-medium text-foreground">
              {
                application.referenceNumber
              }
            </span>
          </div>
        </div>

        {application.status ===
          'ADDITIONAL_REQUIREMENTS' && (
          <Button asChild>
            <Link
              href={`/client/applications/${application.id}/requirements`}
            >
              <Upload className="mr-2 h-4 w-4" />

              Upload Requirements
            </Link>
          </Button>
        )}
      </div>

      {/* =========================================================
          ADDITIONAL REQUIREMENTS ALERT
          ========================================================= */}
      {application.status ===
        'ADDITIONAL_REQUIREMENTS' &&
        application.additionalRequirementsRemarks && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardContent className="flex gap-4 p-5">
              <div className="mt-0.5 shrink-0">
                <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/40">
                  <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  Additional Requirements Needed
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  The Records Office needs
                  additional information or
                  documents before your
                  transaction can continue.
                </p>

                <div className="mt-4 rounded-lg border bg-background/70 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Records Remarks
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {
                      application.additionalRequirementsRemarks
                    }
                  </p>
                </div>

                <Button
                  className="mt-4"
                  size="sm"
                  asChild
                >
                  <Link
                    href={`/client/applications/${application.id}/requirements`}
                  >
                    <Upload className="mr-2 h-4 w-4" />

                    Submit Requirements
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      {/* =========================================================
          REJECTED ALERT
          ========================================================= */}
      {application.status ===
        'REJECTED' && (
          <Card className="border-destructive/30">
            <CardContent className="flex gap-4 p-5">
              <div className="mt-0.5 shrink-0">
                <div className="rounded-full bg-destructive/10 p-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>

              <div className="min-w-0">
                <p className="font-semibold">
                  Application Not Accepted
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your{' '}
                  {
                    application.transactionType
                  }{' '}
                  transaction was reviewed
                  and was not accepted.
                </p>

                {application.rejectionReason && (
                  <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Reason / Remarks
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm">
                      {
                        application.rejectionReason
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {application.status ===
        'SUBMITTED' && (
        <Card>
          <CardContent className="flex gap-4 p-5">
            <div className="mt-0.5 rounded-full bg-primary/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-semibold">
                Application Submitted
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your{' '}
                {application.transactionType}{' '}
                transaction has been submitted
                successfully and is waiting for
                review by the Records Office.
              </p>

              <p className="mt-2 text-sm">
                Application Reference:{' '}
                <span className="font-mono font-medium">
                  {
                    application.referenceNumber
                  }
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {application.status ===
        'UNDER_REVIEW' && (
        <Card>
          <CardContent className="flex gap-4 p-5">
            <div className="mt-0.5 rounded-full bg-primary/10 p-2">
              <FileCheck2 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-semibold">
                Under Review
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                The Records Office is
                currently reviewing your
                submitted information and
                requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {application.status ===
        'RESUBMITTED' && (
        <Card>
          <CardContent className="flex gap-4 p-5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />

            <div>
              <p className="font-semibold">
                Additional Requirements Submitted
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your additional documents
                have been resubmitted and are
                waiting for review.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* =======================================================
            LEFT COLUMN
            ======================================================= */}
        <div className="space-y-6 xl:col-span-2">
          {/* APPLICATION DETAILS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Application Details
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Information submitted
                for this transaction.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* TRANSACTION */}
              <div className="flex gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Transaction
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {
                      application.transactionType
                    }
                  </p>
                </div>
              </div>

              <Separator />

              {/* APPLICATION REFERENCE */}
              <div className="flex gap-3">
                <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Application Reference
                  </p>

                  <p className="mt-1 break-all font-mono text-sm font-medium">
                    {
                      application.referenceNumber
                    }
                  </p>
                </div>
              </div>

              <Separator />

              {/* SUBMITTED */}
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm">
                    {formatDate(
                      application.submittedAt ??
                        application.createdAt,
                    )}
                  </p>
                </div>
              </div>

              {/* TITLE */}
              {application.title && (
                <>
                  <Separator />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Title / Subject
                    </p>

                    <p className="mt-2 text-sm">
                      {
                        application.title
                      }
                    </p>
                  </div>
                </>
              )}

              {/* DESCRIPTION */}
              {application.description && (
                <>
                  <Separator />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Description
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {
                        application.description
                      }
                    </p>
                  </div>
                </>
              )}

              {/* RELATED TRACKING NUMBER */}
              {application.relatedTrackingNumber && (
                <>
                  <Separator />

                  <div className="flex gap-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Related Tracking Number
                      </p>

                      <p className="mt-1 font-mono text-sm font-medium">
                        {
                          application.relatedTrackingNumber
                        }
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* =====================================================
              OFFICIAL DOCUMENT
              ===================================================== */}
          {hasOfficialDocument && (
            <Card>
              <CardHeader>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Official Document
                    </CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your application has
                      been registered in the
                      official document
                      tracking system.
                    </p>
                  </div>

                  {documentStatusLabel && (
                    <Badge variant="outline">
                      {
                        documentStatusLabel
                      }
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* TRACKING NUMBER */}
                <div className="rounded-lg border bg-muted/30 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Official Tracking Number
                  </p>

                  <p className="mt-2 break-all font-mono text-xl font-bold tracking-tight md:text-2xl">
                    {trackingNumber}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Use this tracking
                    number to monitor the
                    progress of your
                    official document.
                  </p>
                </div>

                {/* DOCUMENT TITLE */}
                {documentTitle && (
                  <>
                    <Separator />

                    <div className="flex gap-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Document
                        </p>

                        <p className="mt-1 text-sm">
                          {
                            documentTitle
                          }
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* DOCUMENT STATUS */}
                {documentStatusLabel && (
                  <>
                    <Separator />

                    <div className="flex gap-3">
                      <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Current Status
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {
                            documentStatusLabel
                          }
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* CURRENT OFFICE */}
                {currentOffice && (
                  <>
                    <Separator />

                    <div className="flex gap-3">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Current Office
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {
                            currentOffice.officeName
                          }
                        </p>

                        {currentOffice.officeCode && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {
                              currentOffice.officeCode
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* RESPONSIBLE OFFICE */}
                {responsibleOffice && (
                  <>
                    <Separator />

                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Responsible Office
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {
                            responsibleOffice.officeName
                          }
                        </p>

                        {responsibleOffice.officeCode && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {
                              responsibleOffice.officeCode
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* =====================================================
              NOT YET ACCEPTED
              ===================================================== */}
          {!hasOfficialDocument &&
            application.status !==
              'REJECTED' && (
              <Card>
                <CardContent className="flex gap-4 p-5">
                  <div className="rounded-full bg-muted p-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="font-medium">
                      Official tracking
                      number not yet assigned
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      An official document
                      tracking number will be
                      provided once your
                      transaction has been
                      reviewed and accepted by
                      the Records Office.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* =======================================================
            RIGHT COLUMN - PROGRESS
            ======================================================= */}
        <div>
          <Card className="xl:sticky xl:top-24">
            <CardHeader>
              <CardTitle className="text-lg">
                Progress
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Track the progress of
                your transaction.
              </p>
            </CardHeader>

            <CardContent>
              {tracking ? (
                <ClientTrackingTimeline
                  tracking={
                    tracking
                  }
                />
              ) : (
                <div className="py-6 text-center">
                  <FileText className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />

                  <p className="text-sm font-medium">
                    Tracking information
                    is not available yet
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Progress will appear
                    here as your
                    transaction moves
                    through the system.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}