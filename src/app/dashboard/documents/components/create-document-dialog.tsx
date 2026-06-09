'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import {
  ArrowRight,
  Check,
  FileText,
  Info,
  Route,
  Shield,
  ClipboardCheck,
  Flag,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Attachment = {
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  publicId: string;
};

type FormData = {
  documentType: string;
  title: string;
  referenceNumber: string;
  trackingNumber: string;
  description: string;
  confidentiality: string;
  priority: string;

  originatingOffice: string;
  category: string;
  keywords: string;
  dueDate: string;

  routeTo: string;
  remarks: string;

  attachments: Attachment[];
};

const initialForm: FormData = {
  documentType: '',
  title: '',
  referenceNumber: '',
  trackingNumber: 'DOC-2026-000123',
  description: '',
  confidentiality: '',
  priority: '',
  originatingOffice: '',
  category: '',
  keywords: '',
  dueDate: '',
  routeTo: '',
  remarks: '',
  attachments: [],
};

export default function CreateDocumentDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] =
    useState<FormData>(initialForm);

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Create Document
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl overflow-hidden rounded-2xl border-0 px-0 pt-0 shadow-2xl">
        <div className="flex flex-col bg-[#f8fafc]">

          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
            <div>
              <DialogTitle className="text-[28px] font-semibold tracking-[-0.02em] text-slate-900">
                Create Document
              </DialogTitle>
            </div>

           
          </div>

          {/* MAIN */}
          <div className="grid flex-1 grid-cols-[280px_1fr] overflow-hidden">

            {/* SIDEBAR */}
            <div className="border-r border-slate-200 bg-[#fbfcfe] px-7 py-8">
              <CreateDocumentSteps
                currentStep={step}
              />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col bg-white">

              {/* FORM AREA */}
              <div className="flex-1 overflow-y-auto px-10 py-8">

                {step === 1 && (
                  <BasicInformationStep
                    form={form}
                    setForm={setForm}
                  />
                )}

                {step === 2 && (
                  <AdditionalDetailsStep
                    form={form}
                    setForm={setForm}
                  />
                )}

                {step === 3 && (
                  <RoutingInformationStep
                    form={form}
                    setForm={setForm}
                  />
                )}

                {step === 4 && (
                  <ReviewConfirmStep
                    form={form}
                  />
                )}
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-10 py-5">

                {/* PROGRESS */}
                <div className="flex items-center gap-5">
                  <span className="text-sm font-medium text-slate-500">
                    Step {step} of 4
                  </span>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className={`h-[4px] w-14 rounded-full transition-all ${
                          item <= step
                            ? 'bg-blue-600'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">

                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="rounded-lg cursor-pointer border-slate-200 px-6 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Back
                    </Button>
                  )}

                  <Button
                    onClick={nextStep}
                    className="rounded-lg cursor-pointer bg-blue-600 px-6 font-medium hover:bg-blue-700"
                  >
                    <span className="flex items-center gap-2">
                      {step === 4
                        ? 'Create Document'
                        : 'Next'}

                      {step !== 4 && (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   STEPS SIDEBAR
========================================================= */

function CreateDocumentSteps({
  currentStep,
}: {
  currentStep: number;
}) {
  const steps = [
    {
      number: 1,
      title: 'Basic Information',
      description: 'Document details',
      icon: FileText,
    },
    {
      number: 2,
      title: 'Additional Details',
      description: 'More information',
      icon: Info,
    },
    {
      number: 3,
      title: 'Routing Information',
      description: 'Set initial route',
      icon: Route,
    },
    {
      number: 4,
      title: 'Review & Confirm',
      description: 'Review document',
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const active =
          currentStep === step.number;

        const completed =
          currentStep > step.number;

        return (
          <div
            key={step.number}
            className="relative flex gap-4"
          >
            {index !== steps.length - 1 && (
              <div className="absolute left-[16px] top-9 h-[58px] w-px bg-slate-200" />
            )}

            <div
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                active
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : completed
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-300 bg-white text-slate-500'
              }`}
            >
              {completed ? (
                <Check className="h-4 w-4" />
              ) : (
                step.number
              )}
            </div>

            <div className="pt-1">
              <h3
                className={`text-sm font-semibold ${
                  active
                    ? 'text-blue-600'
                    : 'text-slate-700'
                }`}
              >
                {step.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   STEP 1
========================================================= */

function BasicInformationStep({
  form,
  setForm,
}: {
  form: FormData;
  setForm: Dispatch<
    SetStateAction<FormData>
  >;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">
          Basic Information
        </h3>

        <p className="text-sm text-slate-500">
          Provide the essential details about
          the document.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">

        <FormField label="Document Type">
          <Select
            value={form.documentType}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                documentType: value,
              }))
            }
          >
            <SelectTrigger className="rounded w-full">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>

            <SelectContent className="rounded">
              <SelectItem value="memo">
                Memorandum
              </SelectItem>

              <SelectItem value="letter">
                Letter
              </SelectItem>

              <SelectItem value="report">
                Report
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Title">
          <Input
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="Enter document title"
            className="rounded"
          />
        </FormField>

        <FormField label="Reference Number">
          <Input
            value={form.referenceNumber}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                referenceNumber:
                  e.target.value,
              }))
            }
            placeholder="Enter reference number"
            className="rounded"
          />
        </FormField>

        <FormField label="Tracking Number">
          <Input
            value={form.trackingNumber}
            disabled
            className="rounded"
          />
        </FormField>

        <div className="col-span-2">
          <FormField label="Description">
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description:
                    e.target.value,
                }))
              }
              placeholder="Enter a brief description of the document"
              className="min-h-[120px] rounded"
            />
          </FormField>
        </div>

        <FormField label="Confidentiality Level">
          <Select
            value={form.confidentiality}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                confidentiality: value,
              }))
            }
          >
            <SelectTrigger className="rounded w-full">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <SelectValue placeholder="Select level" />
              </div>
            </SelectTrigger>

            <SelectContent className="rounded">
              <SelectItem value="low">
                Low
              </SelectItem>

              <SelectItem value="medium">
                Medium
              </SelectItem>

              <SelectItem value="high">
                High
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Priority Level">
          <Select
            value={form.priority}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                priority: value,
              }))
            }
          >
            <SelectTrigger className="rounded w-full">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-orange-500" />
                <SelectValue placeholder="Select priority" />
              </div>
            </SelectTrigger>

            <SelectContent className="rounded">
              <SelectItem value="low">
                Low
              </SelectItem>

              <SelectItem value="normal">
                Normal
              </SelectItem>

              <SelectItem value="urgent">
                Urgent
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  );
}

/* =========================================================
   STEP 2
========================================================= */

function AdditionalDetailsStep({
  form,
  setForm,
}: {
  form: FormData;
  setForm: Dispatch<
    SetStateAction<FormData>
  >;
}) {

  const [uploading, setUploading] =
    useState(false);
  
  const MAX_FILE_SIZE =
    10 * 1024 * 1024;

  const handleUpload = async (
      files: FileList | null
    ) => {
      if (!files) return;

      setUploading(true);

      try {
        const uploadedFiles: Attachment[] =
          [];

        for (const file of Array.from(files)) {

          // FILE SIZE VALIDATION
          if (
            file.size > MAX_FILE_SIZE
          ) {
            alert(
              `${file.name} exceeds 10MB limit`
            );

            continue;
          }

          const formData = new FormData();

          formData.append('file', file);

          const response = await fetch(
            '/api/upload',
            {
              method: 'POST',
              body: formData,
            }
          );

          const data =
            await response.json();

          uploadedFiles.push({
            fileName: file.name,
            filePath: data.url,
            mimeType: file.type,
            fileSize: file.size,
            publicId: data.publicId,
          });
        }

        setForm((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            ...uploadedFiles,
          ],
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    };

  const removeAttachment = async (
  index: number
) => {
  try {
    const attachment =
      form.attachments[index];

    await fetch(
      '/api/upload/delete',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          publicId:
            attachment.publicId,
        }),
      }
    );

    setForm((prev) => ({
      ...prev,
      attachments:
        prev.attachments.filter(
          (_, i) => i !== index
        ),
    }));
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">
          Additional Details
        </h3>

        <p className="text-sm text-slate-500">
          Add more contextual information.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">

        <FormField label="Originating Office">
          <Input
            value={form.originatingOffice}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                originatingOffice:
                  e.target.value,
              }))
            }
            placeholder="Enter office"
            className="rounded"
          />
        </FormField>

        <FormField label="Category">
          <Input
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            placeholder="Enter category"
            className="rounded"
          />
        </FormField>

        <FormField label="Keywords">
          <Input
            value={form.keywords}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                keywords: e.target.value,
              }))
            }
            placeholder="Add keywords"
            className="rounded"
          />
        </FormField>

        <FormField label="Due Date">
          <Input
            type="datetime-local"
            value={form.dueDate}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                dueDate: e.target.value,
              }))
            }
            className="rounded"
          />
        </FormField>

        {/* ATTACHMENTS */}

        <div className="col-span-2">
          <FormField label="Attachments">
            <div className="space-y-4">

              {/* DROP ZONE */}

              <label
                className="
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  p-6
                  transition
                  hover:border-blue-500
                  hover:bg-blue-50
                "
                onDragOver={(e) =>
                  e.preventDefault()
                }
                onDrop={(e) => {
                  e.preventDefault();

                  handleUpload(
                    e.dataTransfer.files
                  );
                }}
              >
                <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />

                <p className="text-sm font-medium text-slate-700">
                  Drag and drop files here
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  or{' '}
                  <span className="font-semibold text-blue-600">
                    click to browse
                  </span>
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  PDF, DOCX, XLSX up to
                  10MB
                </p>

                <Input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    handleUpload(
                      e.target.files
                    )
                  }
                />
              </label>

              {/* UPLOADING */}

              {uploading && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  Uploading attachments...
                </div>
              )}

              {/* FILE LIST */}

              <div className="space-y-3">
                {form.attachments.map(
                  (file, index) => (
                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-100 p-2">
                          <FileText className="h-5 w-5 text-slate-600" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {file.fileName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {(
                              file.fileSize /
                              1024 /
                              1024
                            ).toFixed(2)}{' '}
                            MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeAttachment(
                            index
                          )
                        }
                        className="
                          rounded-md
                          p-2
                          text-slate-400
                          transition
                          hover:bg-red-50
                          hover:text-red-500
                        "
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </FormField>
        </div>



      </div>
    </div>
  );
}

/* =========================================================
   STEP 3
========================================================= */

function RoutingInformationStep({
  form,
  setForm,
}: {
  form: FormData;
  setForm: Dispatch<
    SetStateAction<FormData>
  >;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">
          Routing Information
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Configure the initial routing of
          this document.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">

        <FormField label="Route To">
          <Select
            value={form.routeTo}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                routeTo: value,
              }))
            }
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select office" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="hr">
                HR Department
              </SelectItem>

              <SelectItem value="finance">
                Finance Department
              </SelectItem>

              <SelectItem value="admin">
                Admin Office
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div />

        <div className="col-span-2">
          <FormField label="Remarks">
            <Textarea
              value={form.remarks}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
              placeholder="Enter routing remarks"
              className="min-h-[140px] rounded-xl"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STEP 4
========================================================= */

function ReviewConfirmStep({
  form,
}: {
  form: FormData;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">
          Review & Confirm
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Please review all details before
          creating the document.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ReviewCard
          label="Document Type"
          value={form.documentType}
        />

        <ReviewCard
          label="Title"
          value={form.title}
        />

        <ReviewCard
          label="Reference Number"
          value={form.referenceNumber}
        />

        <ReviewCard
          label="Tracking Number"
          value={form.trackingNumber}
        />

        <ReviewCard
          label="Confidentiality"
          value={form.confidentiality}
        />

        <ReviewCard
          label="Priority"
          value={form.priority}
        />

        <div className="col-span-2">
          <ReviewCard
            label="Description"
            value={form.description}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLES
========================================================= */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

function ReviewCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-900">
        {value || '—'}
      </p>
    </div>
  );
}