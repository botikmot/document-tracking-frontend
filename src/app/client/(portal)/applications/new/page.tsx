'use client';

import {
  FormEvent,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useRouter,
} from 'next/navigation';

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Info,
  Loader2,
} from 'lucide-react';

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
  Input,
} from '@/components/ui/input';

import {
  Label,
} from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Textarea,
} from '@/components/ui/textarea';

import {
  clientApplicationsService,
} from '@/services/client-applications.service';

import {
  useClientServiceTypes,
} from '@/hooks/use-client-service-types';

import { useClientAuthStore } from '@/store/client-auth-store';

export default function NewClientApplicationPage() {
  const router =
    useRouter();

  const accessToken =
    useClientAuthStore(
      (state) =>
        state.accessToken,
    );

  const {
    serviceTypes,
    isLoading:
      isLoadingServices,
    error:
      servicesError,
  } =
    useClientServiceTypes();

  const [
    serviceTypeId,
    setServiceTypeId,
  ] = useState('');

  const [
    title,
    setTitle,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    relatedTrackingNumber,
    setRelatedTrackingNumber,
  ] = useState('');

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState<string | null>(
    null,
  );

  /*
   * ------------------------------------------------------------
   * SELECTED SERVICE
   * ------------------------------------------------------------
   */
  const selectedService =
    useMemo(
      () =>
        serviceTypes.find(
          (service) =>
            service.id ===
            serviceTypeId,
        ) ?? null,
      [
        serviceTypes,
        serviceTypeId,
      ],
    );

  /*
   * ------------------------------------------------------------
   * REQUIREMENTS
   * ------------------------------------------------------------
   */
  const activeRequirements =
    useMemo(
      () =>
        selectedService
          ?.requirements
          ?.filter(
            (requirement) =>
              requirement.isActive,
          ) ?? [],
      [selectedService],
    );

  /*
   * ------------------------------------------------------------
   * SERVICE CHANGE
   * ------------------------------------------------------------
   */
  function handleServiceChange(
    value: string,
  ) {
    setServiceTypeId(value);

    const service =
      serviceTypes.find(
        (item) =>
          item.id === value,
      );

    if (!service) {
      return;
    }

    /*
     * Pre-fill subject.
     *
     * Client may still edit it.
     */
    setTitle(service.name);

    /*
     * Clear tracking number if
     * newly selected service does
     * not require one.
     */
    if (
      !service.requiresTrackingNumber
    ) {
      setRelatedTrackingNumber(
        '',
      );
    }

    setSubmitError(null);
  }

  /*
   * ------------------------------------------------------------
   * CREATE DRAFT
   * ------------------------------------------------------------
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    setSubmitError(null);

    if (!serviceTypeId) {
      setSubmitError(
        'Please select a transaction or service.',
      );

      return;
    }

    if (!title.trim()) {
      setSubmitError(
        'Please enter a subject or title.',
      );

      return;
    }

    if (
      selectedService
        ?.requiresTrackingNumber &&
      !relatedTrackingNumber.trim()
    ) {
      setSubmitError(
        'A related tracking number is required for this transaction.',
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const application =
        await clientApplicationsService.create(
          accessToken,
          {
            serviceTypeId,

            title:
              title.trim(),

            description:
              description.trim() ||
              undefined,

            relatedTrackingNumber:
              selectedService
                ?.requiresTrackingNumber
                ? relatedTrackingNumber.trim()
                : undefined,
          },
        );

      /*
       * ----------------------------------------------------------
       * NEXT STEP
       * ----------------------------------------------------------
       *
       * Draft exists now.
       *
       * We can safely upload files using
       * application.id.
       */
      router.push(
        `/client/applications/${application.id}/requirements`,
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to create application.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* BACK */}
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

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          New Transaction
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Select the service you
          need and provide the
          required information.
        </p>
      </div>

      {/* SERVICE LOAD ERROR */}
      {servicesError && (
        <Card className="border-destructive/30">
          <CardContent className="flex gap-3 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div>
              <p className="text-sm font-medium">
                Unable to load
                available services
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {servicesError}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* =======================================================
            LEFT - FORM
            ======================================================= */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Transaction Information
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Tell us what
                transaction you want
                to process.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* SERVICE */}
              <div className="space-y-2">
                <Label htmlFor="service">
                  Service / Transaction
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Select
                  value={
                    serviceTypeId
                  }
                  onValueChange={
                    handleServiceChange
                  }
                  disabled={
                    isLoadingServices
                  }
                >
                  <SelectTrigger id="service">
                    <SelectValue
                      placeholder={
                        isLoadingServices
                          ? 'Loading services...'
                          : 'Select a service'
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {serviceTypes.map(
                      (service) => (
                        <SelectItem
                          key={
                            service.id
                          }
                          value={
                            service.id
                          }
                        >
                          {
                            service.name
                          }
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* SERVICE DESCRIPTION */}
              {selectedService
                ?.description && (
                <div className="flex gap-3 rounded-lg border bg-muted/30 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">
                      {
                        selectedService.name
                      }
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {
                        selectedService.description
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* SUBJECT */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Subject / Title
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="title"
                  value={title}
                  onChange={(
                    event,
                  ) =>
                    setTitle(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Enter the subject of your transaction"
                  maxLength={255}
                  required
                />

                <p className="text-xs text-muted-foreground">
                  You may edit the
                  default subject if
                  needed.
                </p>
              </div>

              {/* RELATED TRACKING NUMBER */}
              {selectedService
                ?.requiresTrackingNumber && (
                <div className="space-y-2">
                  <Label htmlFor="relatedTrackingNumber">
                    Existing Tracking
                    Number
                    <span className="ml-1 text-destructive">
                      *
                    </span>
                  </Label>

                  <Input
                    id="relatedTrackingNumber"
                    value={
                      relatedTrackingNumber
                    }
                    onChange={(
                      event,
                    ) =>
                      setRelatedTrackingNumber(
                        event
                          .target
                          .value,
                      )
                    }
                    placeholder="e.g. DOC-2026-000123"
                    maxLength={100}
                    required
                  />

                  <p className="text-xs text-muted-foreground">
                    Enter the existing
                    document tracking
                    number related to
                    this transaction.
                  </p>
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>

                <Textarea
                  id="description"
                  value={
                    description
                  }
                  onChange={(
                    event,
                  ) =>
                    setDescription(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Provide any additional details that may help us process your transaction."
                  rows={6}
                />

                <p className="text-xs text-muted-foreground">
                  Optional. Do not
                  include passwords or
                  other sensitive
                  account information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ERROR */}
          {submitError && (
            <Card className="border-destructive/30">
              <CardContent className="flex gap-3 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                <p className="text-sm">
                  {submitError}
                </p>
              </CardContent>
            </Card>
          )}

          {/* ACTION */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <Link href="/client/applications">
                Cancel
              </Link>
            </Button>

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                isLoadingServices ||
                !serviceTypeId
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  Creating Draft...
                </>
              ) : (
                <>
                  Continue to Requirements

                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* =======================================================
            RIGHT - REQUIREMENTS PREVIEW
            ======================================================= */}
        <div>
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-lg">
                Requirements
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Documents needed for
                the selected
                transaction.
              </p>
            </CardHeader>

            <CardContent>
              {!selectedService ? (
                <div className="py-8 text-center">
                  <FileText className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />

                  <p className="text-sm font-medium">
                    Select a service
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Its requirements
                    will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* LETTER REQUEST */}
                  {selectedService
                    .requiresLetterRequest && (
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                      <div>
                        <p className="text-sm font-medium">
                          Letter Request
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Required
                        </p>
                      </div>
                    </div>
                  )}

                  {/* DYNAMIC REQUIREMENTS */}
                  {activeRequirements.map(
                    (
                      requirement,
                    ) => (
                      <div
                        key={
                          requirement.id
                        }
                        className="flex gap-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                        <div>
                          <p className="text-sm font-medium">
                            {
                              requirement.name
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {requirement.isRequired
                              ? 'Required'
                              : 'Optional'}

                            {requirement.allowsMultiple
                              ? ' • Multiple files allowed'
                              : ''}
                          </p>

                          {requirement.description && (
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {
                                requirement.description
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )}

                  {!selectedService
                    .requiresLetterRequest &&
                    activeRequirements.length ===
                      0 && (
                      <div className="py-4 text-center">
                        <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-primary" />

                        <p className="text-sm font-medium">
                          No specific
                          document
                          requirements
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          You may continue
                          with your
                          transaction.
                        </p>
                      </div>
                    )}

                  {selectedService
                    .allowsAttachments && (
                    <div className="border-t pt-4">
                      <p className="text-xs text-muted-foreground">
                        You will upload
                        the required files
                        on the next step.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}