'use client';

import { useState } from 'react';

import {
  CalendarClock,
  FilePenLine,
  Loader2,
  LockKeyhole,
  Save,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Separator } from '@/components/ui/separator';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type DocumentTypeOption = {
  id: string;
  name: string;
};

type EditableDocument = {
  id: string;

  trackingNumber: string;

  title: string;

  description?: string | null;

  addressee?: string | null;

  referenceNumber?: string | null;

  documentTypeId: string;

  priority?: string | null;

  classification?: string | null;

  confidentialityLevel?: string | null;

  deadline?: string | null;

  currentOffice?: {
    id: string;
    officeCode: string;
    officeName: string;
  } | null;

  currentStatus?: {
    id: string;
    name: string;
  } | null;

  documentType?: {
    id: string;
    name: string;
  } | null;
};

export type UpdateDocumentPayload = {
  documentTypeId: string;

  priority: string;

  classification: string;

  confidentialityLevel: string;

  deadline: string | null;
};

type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  document: EditableDocument;

  canEdit: boolean;

  documentTypes?: DocumentTypeOption[];

  onSave: (
    documentId: string,
    data: UpdateDocumentPayload,
  ) => Promise<void>;
};

/*
|--------------------------------------------------------------------------
| Select Options
|--------------------------------------------------------------------------
*/

const PRIORITIES = [
  {
    value: 'LOW',
    label: 'Low',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
  },
  {
    value: 'HIGH',
    label: 'High',
  },
  {
    value: 'URGENT',
    label: 'Urgent',
  },
];

const CLASSIFICATIONS = [
  {
    value: 'SIMPLE',
    label: 'Simple',
  },
  {
    value: 'COMPLEX',
    label: 'Complex',
  },
  {
    value: 'TECHNICAL',
    label: 'Highly Technical',
  },
];

const CONFIDENTIALITY_LEVELS = [
  {
    value: 'PUBLIC',
    label: 'Public',
  },
  {
    value: 'INTERNAL',
    label: 'Internal',
  },
  {
    value: 'CONFIDENTIAL',
    label: 'Confidential',
  },
];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function toDateTimeLocal(
  value?: string | null,
) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  const pad = (
    number: number,
  ) =>
    String(number).padStart(
      2,
      '0',
    );

  const year =
    date.getFullYear();

  const month = pad(
    date.getMonth() + 1,
  );

  const day = pad(
    date.getDate(),
  );

  const hour = pad(
    date.getHours(),
  );

  const minute = pad(
    date.getMinutes(),
  );

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export function EditDocumentDialog({
  open,
  onOpenChange,
  document,
  canEdit,
  documentTypes = [],
  onSave,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  |
  | No useEffect.
  |
  | The parent should render this component using:
  |
  | key={documentToEdit.id}
  |
  | so every selected document gets a fresh form state.
  |
  */



  

  

  const [
    documentTypeId,
    setDocumentTypeId,
  ] = useState(
    () =>
      document.documentTypeId ??
      '',
  );

  const [
    priority,
    setPriority,
  ] = useState(
    () =>
      document.priority ??
      'MEDIUM',
  );

  const [
    classification,
    setClassification,
  ] = useState(
    () =>
      document.classification ??
      'SIMPLE',
  );

  const [
    confidentialityLevel,
    setConfidentialityLevel,
  ] = useState(
    () =>
      document.confidentialityLevel ??
      'PUBLIC',
  );

  const [
    deadline,
    setDeadline,
  ] = useState(() =>
    toDateTimeLocal(
      document.deadline,
    ),
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | Permission
  |--------------------------------------------------------------------------
  */

  const documentIsInOrd =
    document.currentOffice
      ?.officeCode === 'ORD';

  const editable =
    canEdit &&
    documentIsInOrd;

  /*
  |--------------------------------------------------------------------------
  | Document Type Options
  |--------------------------------------------------------------------------
  |
  | If documentTypes has not been loaded yet, at least retain the
  | document's current type so the Select has a valid option.
  |
  */

  const availableDocumentTypes =
    documentTypes.length > 0
      ? documentTypes
      : document.documentType
        ? [
            {
              id: document
                .documentType
                .id,

              name: document
                .documentType
                .name,
            },
          ]
        : [];

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async () => {
      if (!editable) {
        setError(
          'Only authorized users from the Office of the Regional Director can edit this document while it is under ORD custody.',
        );

        return;
      }

      if (!documentTypeId) {
        setError(
          'Document type is required.',
        );

        return;
      }

      try {
        setSubmitting(true);

        setError(null);

        const payload: UpdateDocumentPayload =
          {
            documentTypeId,

            priority,

            classification,

            confidentialityLevel,

            deadline: deadline
              ? new Date(
                  deadline,
                ).toISOString()
              : null,
          };

        await onSave(
          document.id,
          payload,
        );

        onOpenChange(false);
      } catch (error) {
        console.error(
          'Failed to update document:',
          error,
        );

        setError(
          'Unable to update the document. Please try again.',
        );
      } finally {
        setSubmitting(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <Dialog
      open={open}
      onOpenChange={(
        nextOpen,
      ) => {
        if (submitting) {
          return;
        }

        onOpenChange(
          nextOpen,
        );
      }}
    >
      <DialogContent
        className="
          max-h-[100vh]
          overflow-hidden
          border-slate-200
          bg-white
          p-0
          shadow-2xl
          sm:max-w-4xl
          dark:border-[#214234]
          dark:bg-[#07150D]
        "
      >
        {/* =========================================================
            HEADER
        ========================================================= */}

        <DialogHeader
          className="
            border-b
            border-slate-200
            bg-gradient-to-r
            from-slate-50
            to-white
            px-7
            py-6
            dark:border-[#214234]
            dark:from-[#102418]
            dark:to-[#07150D]
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-emerald-100
                text-emerald-700
                dark:bg-emerald-950/60
                dark:text-emerald-400
              "
            >
              <FilePenLine className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle
                  className="
                    text-2xl
                    font-black
                    text-[#102418]
                    dark:text-[#F3F8F3]
                  "
                >
                  Edit Document
                </DialogTitle>

                {editable && (
                  <Badge
                    className="
                      rounded-full
                      bg-emerald-100
                      text-emerald-700
                      hover:bg-emerald-100
                      dark:bg-emerald-950/60
                      dark:text-emerald-400
                    "
                  >
                    ORD Editable
                  </Badge>
                )}
              </div>

              <DialogDescription
                className="
                  mt-1
                  max-w-2xl
                  text-slate-500
                  dark:text-[#A9C5B6]
                "
              >
                Update the document
                information while the
                document is under the
                custody of the Office
                of the Regional
                Director.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* =========================================================
            SCROLLABLE BODY
        ========================================================= */}

        <div
          className="
            max-h-[calc(92vh-190px)]
            overflow-y-auto
          "
        >
          <div className="space-y-7 px-7 py-7">
            

            {/* =====================================================
                PERMISSION WARNING
            ===================================================== */}

            {!editable && (
              <div
                className="
                  flex
                  gap-3
                  rounded-2xl
                  border
                  border-amber-200
                  bg-amber-50
                  p-4
                  text-amber-800
                  dark:border-amber-900/60
                  dark:bg-amber-950/30
                  dark:text-amber-300
                "
              >
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="font-bold">
                    Editing unavailable
                  </p>

                  <p className="mt-1 text-sm leading-6">
                    Only authorized
                    users from the
                    Office of the
                    Regional Director
                    may edit this
                    document while it
                    is currently under
                    ORD custody.
                  </p>
                </div>
              </div>
            )}

            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (
              <div
                className="
                  flex
                  gap-3
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                  text-red-700
                  dark:border-red-900/60
                  dark:bg-red-950/30
                  dark:text-red-300
                "
              >
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="font-bold">
                    Unable to save
                  </p>

                  <p className="mt-1 text-sm leading-6">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* =====================================================
                CLASSIFICATION AND PRIORITY
            ===================================================== */}

            <section>
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-violet-100
                    text-violet-700
                    dark:bg-violet-950
                    dark:text-violet-400
                  "
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <h3
                    className="
                      font-black
                      text-slate-900
                      dark:text-[#F3F8F3]
                    "
                  >
                    Classification &
                    Priority
                  </h3>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-[#7FA18E]
                    "
                  >
                    Processing and
                    security
                    attributes.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* CLASSIFICATION */}

                <div className="space-y-2">
                  <Label>
                    Classification
                  </Label>

                  <Select
                    value={
                      classification
                    }
                    disabled={
                      submitting ||
                      !editable
                    }
                    onValueChange={
                      setClassification
                    }
                  >
                    <SelectTrigger
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border-slate-200
                        bg-white
                        dark:border-[#214234]
                        dark:bg-[#102418]
                        dark:text-[#F3F8F3]
                      "
                    >
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>

                    <SelectContent>
                      {CLASSIFICATIONS.map(
                        (item) => (
                          <SelectItem
                            key={
                              item.value
                            }
                            value={
                              item.value
                            }
                          >
                            {
                              item.label
                            }
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* PRIORITY */}

                <div className="space-y-2">
                  <Label>
                    Priority
                  </Label>

                  <Select
                    value={priority}
                    disabled={
                      submitting ||
                      !editable
                    }
                    onValueChange={
                      setPriority
                    }
                  >
                    <SelectTrigger
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border-slate-200
                        bg-white
                        dark:border-[#214234]
                        dark:bg-[#102418]
                        dark:text-[#F3F8F3]
                      "
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>

                    <SelectContent>
                      {PRIORITIES.map(
                        (item) => (
                          <SelectItem
                            key={
                              item.value
                            }
                            value={
                              item.value
                            }
                          >
                            {
                              item.label
                            }
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                

                {/* CONFIDENTIALITY */}

                <div className="space-y-2">
                  <Label>
                    Confidentiality
                  </Label>

                  <Select
                    value={
                      confidentialityLevel
                    }
                    disabled={
                      submitting ||
                      !editable
                    }
                    onValueChange={
                      setConfidentialityLevel
                    }
                  >
                    <SelectTrigger
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border-slate-200
                        bg-white
                        dark:border-[#214234]
                        dark:bg-[#102418]
                        dark:text-[#F3F8F3]
                      "
                    >
                      <SelectValue placeholder="Select confidentiality" />
                    </SelectTrigger>

                    <SelectContent>
                      {CONFIDENTIALITY_LEVELS.map(
                        (item) => (
                          <SelectItem
                            key={
                              item.value
                            }
                            value={
                              item.value
                            }
                          >
                            {
                              item.label
                            }
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* DOCUMENT TYPE */}

                <div className="space-y-2">
                  <Label>
                    Document Type

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </Label>

                  <Select
                    value={
                      documentTypeId
                    }
                    disabled={
                      submitting ||
                      !editable
                    }
                    onValueChange={
                      setDocumentTypeId
                    }
                  >
                    <SelectTrigger
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border-slate-200
                        bg-white
                        dark:border-[#214234]
                        dark:bg-[#102418]
                        dark:text-[#F3F8F3]
                      "
                    >
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>

                    <SelectContent>
                      {availableDocumentTypes.map(
                        (type) => (
                          <SelectItem
                            key={
                              type.id
                            }
                            value={
                              type.id
                            }
                          >
                            {
                              type.name
                            }
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </section>

            <Separator className="dark:bg-[#214234]" />

            {/* =====================================================
                DEADLINE
            ===================================================== */}

            <section>
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-100
                    text-amber-700
                    dark:bg-amber-950
                    dark:text-amber-400
                  "
                >
                  <CalendarClock className="h-4 w-4" />
                </div>

                <div>
                  <h3
                    className="
                      font-black
                      text-slate-900
                      dark:text-[#F3F8F3]
                    "
                  >
                    Processing Deadline
                  </h3>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-[#7FA18E]
                    "
                  >
                    Set or adjust the
                    allowed completion
                    period.
                  </p>
                </div>
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="edit-document-deadline">
                  Deadline
                </Label>

                <Input
                  id="edit-document-deadline"
                  type="datetime-local"
                  value={deadline}
                  disabled={
                    submitting ||
                    !editable
                  }
                  onChange={(
                    event,
                  ) =>
                    setDeadline(
                      event.target
                        .value,
                    )
                  }
                  className="
                    h-11
                    rounded-xl
                    border-slate-200
                    bg-white
                    dark:border-[#214234]
                    dark:bg-[#102418]
                    dark:text-[#F3F8F3]
                  "
                />

                <p
                  className="
                    text-xs
                    leading-5
                    text-slate-500
                    dark:text-[#7FA18E]
                  "
                >
                  Leave this empty if
                  the document does not
                  have a fixed
                  deadline.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* =========================================================
            FOOTER
        ========================================================= */}

        <DialogFooter
          className="
            border-t
            border-slate-200
            bg-slate-50
            px-7
            py-5
            dark:border-[#214234]
            dark:bg-[#102418]
          "
        >
          <div
            className="
              flex
              w-full
              flex-col-reverse
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                flex
                max-w-md
                items-start
                text-xs
                leading-5
                text-slate-500
                dark:text-[#7FA18E]
              "
            >
              <LockKeyhole className="mr-1.5 mt-0.5 h-3.5 w-3.5 shrink-0" />

              Tracking number, current
              office, current status,
              sender and routing
              history are controlled
              by the system.
            </p>

            <div className="flex shrink-0 gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={
                  submitting
                }
                className="
                  cursor-pointer
                  rounded-xl
                  dark:border-[#214234]
                  dark:bg-[#173227]
                  dark:text-[#F3F8F3]
                  dark:hover:bg-[#214234]
                "
                onClick={() =>
                  onOpenChange(
                    false,
                  )
                }
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={
                  submitting ||
                  !editable
                }
                onClick={
                  handleSubmit
                }
                className="
                  cursor-pointer
                  rounded-xl
                  bg-[#102418]
                  px-6
                  text-white
                  hover:bg-[#183B27]
                  disabled:cursor-not-allowed
                  dark:bg-emerald-600
                  dark:hover:bg-emerald-500
                "
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />

                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}