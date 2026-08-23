'use client';

import {
  ChangeEvent,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  File,
  FileCheck2,
  Loader2,
  RefreshCw,
  Send,
  Upload,
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
  Badge,
} from '@/components/ui/badge';

import {
  Separator,
} from '@/components/ui/separator';

import {
  useClientApplication,
} from '@/hooks/use-client-application';

import {
  clientApplicationsService,
} from '@/services/client-applications.service';

import { useClientAuthStore } from '@/store/client-auth-store';

import type {
  ClientApplicationAttachment,
} from '@/types/client-application';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ClientApplicationRequirementsPage() {
  const router =
    useRouter();

  const params =
    useParams<{
      id: string;
    }>();

  const applicationId =
    params.id;

  const accessToken =
    useClientAuthStore(
      (state) =>
        state.accessToken,
    );

  const {
    application,
    isLoading,
    error,
    refresh,
  } =
    useClientApplication(
      applicationId,
    );

  const [
    uploadingKey,
    setUploadingKey,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [
    actionError,
    setActionError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<string | null>(
      null,
    );

  /*
   * ------------------------------------------------------------
   * DATA
   * ------------------------------------------------------------
   */
  const requirements =
    useMemo(
      () =>
        application?.serviceType
          ?.requirements ?? [],
      [application],
    );

  const attachments =
    application?.attachments ??
    [];

  const letterAttachment =
    attachments.find(
      (attachment) =>
        attachment.type ===
        'LETTER_REQUEST',
    );

  const isDraft =
    application?.status ===
    'DRAFT';

  const isAdditionalRequirements =
    application?.status ===
    'ADDITIONAL_REQUIREMENTS';

  /*
   * ------------------------------------------------------------
   * HELPERS
   * ------------------------------------------------------------
   */
  function getRequirementAttachments(
    requirementId: string,
  ) {
    return attachments.filter(
      (attachment) =>
        attachment.requirementId ===
        requirementId,
    );
  }

  function hasRequirementFile(
    requirementId: string,
  ) {
    return (
      getRequirementAttachments(
        requirementId,
      ).length > 0
    );
  }

  /*
   * Generic attachments uploaded
   * during ADDITIONAL_REQUIREMENTS.
   */
  const additionalAttachments =
    attachments.filter(
      (attachment) =>
        attachment.type ===
          'SUPPORTING_DOCUMENT' &&
        !attachment.requirementId,
    );

  /*
   * ------------------------------------------------------------
   * VALIDATION
   * ------------------------------------------------------------
   */
  const missingRequirements =
    requirements.filter(
      (requirement) =>
        requirement.isRequired &&
        !hasRequirementFile(
          requirement.id,
        ),
    );

  const missingLetter =
    Boolean(
      application?.serviceType
        ?.requiresLetterRequest &&
        !letterAttachment,
    );

  const canSubmitDraft =
    isDraft &&
    missingRequirements.length ===
      0 &&
    !missingLetter;

  const canResubmit =
    isAdditionalRequirements;

  /*
   * ------------------------------------------------------------
   * FILE VALIDATION
   * ------------------------------------------------------------
   */
  function validateFiles(
    files: File[],
  ) {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const maxSize =
      10 * 1024 * 1024;

    for (const file of files) {
      if (
        !allowedTypes.includes(
          file.type,
        )
      ) {
        throw new Error(
          `${file.name}: unsupported file type.`,
        );
      }

      if (
        file.size > maxSize
      ) {
        throw new Error(
          `${file.name}: file must not exceed 10 MB.`,
        );
      }
    }
  }

  /*
   * ------------------------------------------------------------
   * REQUIREMENT UPLOAD
   * ------------------------------------------------------------
   */
  async function handleRequirementUpload(
    requirementId: string,
    allowsMultiple: boolean,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files =
      Array.from(
        event.target.files ??
          [],
      );

    /*
     * Reset the input so the same
     * file can be selected again.
     */
    event.target.value = '';

    if (
      !accessToken ||
      files.length === 0
    ) {
      return;
    }

    setActionError(null);
    setSuccessMessage(null);

    try {
      validateFiles(files);

      if (
        !allowsMultiple &&
        files.length > 1
      ) {
        throw new Error(
          'Only one file is allowed for this requirement.',
        );
      }

      setUploadingKey(
        requirementId,
      );

      await clientApplicationsService.uploadRequirementFiles(
        accessToken,
        applicationId,
        requirementId,
        files,
      );

      setSuccessMessage(
        'File uploaded successfully.',
      );

      await refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to upload file.',
      );
    } finally {
      setUploadingKey(null);
    }
  }

  /*
   * ------------------------------------------------------------
   * LETTER REQUEST
   * ------------------------------------------------------------
   */
  async function handleLetterUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = '';

    if (
      !file ||
      !accessToken
    ) {
      return;
    }

    setActionError(null);
    setSuccessMessage(null);

    try {
      validateFiles([file]);

      setUploadingKey(
        'LETTER_REQUEST',
      );

      await clientApplicationsService.uploadLetterRequest(
        accessToken,
        applicationId,
        file,
      );

      setSuccessMessage(
        'Letter request uploaded successfully.',
      );

      await refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to upload letter request.',
      );
    } finally {
      setUploadingKey(null);
    }
  }

  /*
   * ------------------------------------------------------------
   * ADDITIONAL SUPPORTING FILES
   * ------------------------------------------------------------
   */
  async function handleAdditionalFilesUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files =
      Array.from(
        event.target.files ??
          [],
      );

    event.target.value = '';

    if (
      !accessToken ||
      files.length === 0
    ) {
      return;
    }

    setActionError(null);
    setSuccessMessage(null);

    try {
      validateFiles(files);

      setUploadingKey(
        'ADDITIONAL_FILES',
      );

      /*
       * requirementId = null
       *
       * These are general additional
       * supporting documents requested
       * by Records.
       */
      await clientApplicationsService.uploadRequirementFiles(
        accessToken,
        applicationId,
        null,
        files,
      );

      setSuccessMessage(
        'Additional document(s) uploaded successfully.',
      );

      await refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to upload additional documents.',
      );
    } finally {
      setUploadingKey(null);
    }
  }

  /*
   * ------------------------------------------------------------
   * SUBMIT / RESUBMIT
   * ------------------------------------------------------------
   */
  async function handleSubmitApplication() {
    if (
      !accessToken ||
      !application
    ) {
      return;
    }

    setActionError(null);
    setSuccessMessage(null);

    if (
      application.status ===
      'DRAFT'
    ) {
      if (
        missingRequirements.length >
        0
      ) {
        setActionError(
          'Please upload all required documents before submitting.',
        );

        return;
      }

      if (missingLetter) {
        setActionError(
          'Please upload the required letter request before submitting.',
        );

        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (
        application.status ===
        'ADDITIONAL_REQUIREMENTS'
      ) {
        await clientApplicationsService.resubmit(
          accessToken,
          application.id,
        );
      } else {
        await clientApplicationsService.submit(
          accessToken,
          application.id,
        );
      }

      router.push(
        `/client/applications/${application.id}`,
      );

      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to submit application.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          Loading requirements...
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * ERROR
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
          <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
            <AlertCircle className="mb-4 h-8 w-8 text-destructive" />

            <p className="font-medium">
              Unable to load requirements
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {error ??
                'Application not found.'}
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
      </div>
    );
  }

  const service =
    application.serviceType;

  const editable =
    isDraft ||
    isAdditionalRequirements;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* BACK */}
      <Button
        variant="ghost"
        className="-ml-3"
        asChild
      >
        <Link
          href={`/client/applications/${application.id}`}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />

          Application Details
        </Link>
      </Button>

      {/* HEADER */}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {
              application.referenceNumber
            }
          </Badge>

          <Badge variant="secondary">
            {
              application.status
            }
          </Badge>
        </div>

        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Requirements
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {service?.name ??
            application.transactionType}
        </p>
      </div>

      {/* RECORDS REQUEST */}
      {isAdditionalRequirements &&
        application.additionalRequirementsRemarks && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardContent className="flex gap-4 p-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />

              <div>
                <p className="font-semibold">
                  Additional Requirements Requested
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {
                    application.additionalRequirementsRemarks
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

      {/* FEEDBACK */}
      {actionError && (
        <Card className="border-destructive/30">
          <CardContent className="flex gap-3 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <p className="text-sm">
              {actionError}
            </p>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card>
          <CardContent className="flex gap-3 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <p className="text-sm">
              {successMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {/* =======================================================
          LETTER REQUEST
          ======================================================= */}
      {service?.requiresLetterRequest && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">
                  Letter Request
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  A formal request
                  letter is required
                  for this transaction.
                </p>
              </div>

              <Badge>
                Required
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {letterAttachment ? (
              <UploadedFile
                attachment={
                  letterAttachment
                }
              />
            ) : editable ? (
              <FileUploadBox
                id="letter-request"
                multiple={false}
                isUploading={
                  uploadingKey ===
                  'LETTER_REQUEST'
                }
                onChange={
                  handleLetterUpload
                }
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No letter request
                uploaded.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* =======================================================
          DYNAMIC REQUIREMENTS
          ======================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Required Documents
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Upload the documents
            required for this
            transaction.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {requirements.length ===
          0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-7 w-7 text-primary" />

              <p className="font-medium">
                No specific requirements
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                This transaction does
                not currently require
                specific supporting
                documents.
              </p>
            </div>
          ) : (
            requirements.map(
              (
                requirement,
                index,
              ) => {
                const files =
                  getRequirementAttachments(
                    requirement.id,
                  );

                const hasFiles =
                  files.length > 0;

                return (
                  <div
                    key={
                      requirement.id
                    }
                  >
                    {index > 0 && (
                      <Separator className="mb-6" />
                    )}

                    <div className="space-y-4">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">
                              {
                                requirement.name
                              }
                            </p>

                            <Badge
                              variant={
                                requirement.isRequired
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {requirement.isRequired
                                ? 'Required'
                                : 'Optional'}
                            </Badge>

                            {requirement.allowsMultiple && (
                              <Badge variant="outline">
                                Multiple files
                              </Badge>
                            )}
                          </div>

                          {requirement.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {
                                requirement.description
                              }
                            </p>
                          )}
                        </div>

                        {hasFiles && (
                          <div className="flex items-center gap-1 text-sm text-primary">
                            <CheckCircle2 className="h-4 w-4" />

                            Uploaded
                          </div>
                        )}
                      </div>

                      {/* UPLOADED FILES */}
                      {files.length > 0 && (
                        <div className="space-y-2">
                          {files.map(
                            (
                              attachment,
                            ) => (
                              <UploadedFile
                                key={
                                  attachment.id
                                }
                                attachment={
                                  attachment
                                }
                              />
                            ),
                          )}
                        </div>
                      )}

                      {/* UPLOAD */}
                      {editable &&
                        (requirement.allowsMultiple ||
                          !hasFiles) && (
                          <FileUploadBox
                            id={`requirement-${requirement.id}`}
                            multiple={
                              requirement.allowsMultiple
                            }
                            isUploading={
                              uploadingKey ===
                              requirement.id
                            }
                            onChange={(
                              event,
                            ) =>
                              void handleRequirementUpload(
                                requirement.id,
                                requirement.allowsMultiple,
                                event,
                              )
                            }
                          />
                        )}
                    </div>
                  </div>
                );
              },
            )
          )}
        </CardContent>
      </Card>

      {/* =======================================================
          ADDITIONAL REQUIREMENTS UPLOAD
          ======================================================= */}
      {isAdditionalRequirements && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Additional Supporting Documents
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Upload any additional
              documents requested by
              the Records Office.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {additionalAttachments.length >
              0 && (
              <div className="space-y-2">
                {additionalAttachments.map(
                  (
                    attachment,
                  ) => (
                    <UploadedFile
                      key={
                        attachment.id
                      }
                      attachment={
                        attachment
                      }
                    />
                  ),
                )}
              </div>
            )}

            <FileUploadBox
              id="additional-files"
              multiple
              isUploading={
                uploadingKey ===
                'ADDITIONAL_FILES'
              }
              onChange={
                handleAdditionalFilesUpload
              }
            />
          </CardContent>
        </Card>
      )}

      {/* =======================================================
          SUBMISSION SUMMARY
          ======================================================= */}
      {editable && (
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <p className="font-semibold">
                  {isAdditionalRequirements
                    ? 'Ready to resubmit?'
                    : 'Ready to submit?'}
                </p>

                {isDraft ? (
                  missingRequirements.length >
                    0 ||
                  missingLetter ? (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        Complete the
                        following before
                        submitting:
                      </p>

                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {missingLetter && (
                          <li>
                            Letter Request
                          </li>
                        )}

                        {missingRequirements.map(
                          (
                            requirement,
                          ) => (
                            <li
                              key={
                                requirement.id
                              }
                            >
                              {
                                requirement.name
                              }
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      All required
                      documents have
                      been uploaded.
                    </p>
                  )
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Make sure you have
                    uploaded the
                    documents requested
                    by Records before
                    resubmitting.
                  </p>
                )}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                    size="lg"
                    disabled={
                        isSubmitting ||
                        uploadingKey !== null ||
                        (isDraft &&
                        !canSubmitDraft) ||
                        (isAdditionalRequirements &&
                        !canResubmit)
                    }
                    >
                    <Send className="mr-2 h-4 w-4" />

                    {isAdditionalRequirements
                        ? 'Resubmit Application'
                        : 'Submit Application'}
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isAdditionalRequirements
                        ? 'Resubmit this transaction?'
                        : 'Submit this transaction?'}
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        {isAdditionalRequirements
                        ? 'Please make sure you have uploaded all documents requested by the Records Office before resubmitting.'
                        : 'Please review your information and uploaded requirements. Once submitted, your transaction will be forwarded to the Records Office for review.'}
                    </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isSubmitting}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isSubmitting}
                        onClick={(
                        event,
                        ) => {
                        event.preventDefault();

                        void handleSubmitApplication();
                        }}
                    >
                        {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                            {isAdditionalRequirements
                            ? 'Resubmitting...'
                            : 'Submitting...'}
                        </>
                        ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />

                            Confirm
                        </>
                        )}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NON EDITABLE */}
      {!editable && (
        <Card>
          <CardContent className="flex gap-3 p-5">
            <FileCheck2 className="mt-0.5 h-5 w-5 text-primary" />

            <div>
              <p className="font-medium">
                Requirements submitted
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Uploaded files can no
                longer be changed while
                this transaction is
                being reviewed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/*
 * ==============================================================
 * FILE UPLOAD BOX
 * ==============================================================
 */
interface FileUploadBoxProps {
  id: string;

  multiple: boolean;

  isUploading: boolean;

  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

function FileUploadBox({
  id,
  multiple,
  isUploading,
  onChange,
}: FileUploadBoxProps) {
  return (
    <div>
      <input
        id={id}
        type="file"
        className="sr-only"
        multiple={multiple}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        disabled={isUploading}
        onChange={onChange}
      />

      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-5 text-sm transition-colors hover:bg-muted/50"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />

            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />

            {multiple
              ? 'Choose file(s)'
              : 'Choose file'}
          </>
        )}
      </label>

      <p className="mt-2 text-xs text-muted-foreground">
        PDF, JPG, PNG, DOC or
        DOCX. Maximum 10 MB per
        file.
      </p>
    </div>
  );
}

/*
 * ==============================================================
 * UPLOADED FILE
 * ==============================================================
 */
interface UploadedFileProps {
  attachment:
    ClientApplicationAttachment;
}

function UploadedFile({
  attachment,
}: UploadedFileProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3">
      <div className="rounded-md bg-primary/10 p-2 text-primary">
        <File className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {
            attachment.originalName
          }
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatFileSize(
            attachment.fileSize,
          )}
        </p>
      </div>

      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
    </div>
  );
}

/*
 * ==============================================================
 * FILE SIZE
 * ==============================================================
 */
function formatFileSize(
  bytes?: number | null,
) {
  if (
    bytes === null ||
    bytes === undefined
  ) {
    return 'Uploaded';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}