'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  FolderOpen,
  Paperclip,
  Plus,
  Shield,
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { Label } from '@/components/ui/label';
//import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/axios';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { downloadRoutingSlip } from '@/lib/download-routing-slip';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import type {
  DocumentMonitoringCategory,
  DocumentSourceClass,
  InternalSourceScope,
} from '@/types/document';

type Attachment = {
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  publicId: string;
};

type TurnaroundTime = {
  days: number;
  hours?: number;
  minutes?: number;
};

const WORKING_DAY_OPTIONS =
  Array.from(
    {
      length: 30,
    },
    (_, index) =>
      index + 1,
  );

type PermitOption = {
  id: string;
  name: string;
  classification:
    | 'SIMPLE'
    | 'COMPLEX'
    | 'TECHNICAL';

  turnaround: {
    days: number;
    hours?: number;
    minutes?: number;
  };

  note?: string;
};

const PERMIT_OPTIONS: PermitOption[] = [
  {
    id: 'supply-contracts-plantation',
    name: 'Supply Contracts (Log, Lumber & Veneer-Plantation)',
    classification: 'COMPLEX',
    turnaround: {
      days: 7,
    },
  },
  {
    id: 'export-authority',
    name: 'Export Authority',
    classification: 'COMPLEX',
    turnaround: {
      days: 7,
    },
  },
  {
    id: 'supply-contracts-naturally-grown',
    name: 'Supply Contracts (Naturally Grown Species)',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
  },
  {
    id: 'dealership-permits',
    name: 'Dealership Permits',
    classification: 'COMPLEX',
    turnaround: {
      days: 7,
    },
  },
  {
    id: 'annual-rattan-cutting-replanting',
    name: 'Annual Rattan Cutting and Replanting Permit',
    classification: 'COMPLEX',
    turnaround: {
      days: 7,
    },
  },
  {
    id: 'rattan-cutting-contract',
    name: 'Rattan Cutting Contract (RCC)',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
  },
  {
    id: 'rattan-processing-plant-permit',
    name: 'Rattan Processing Plant Permit (RPPP)',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
  },
  {
    id: 'feasibility-permit',
    name: 'Feasibility Permit',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
  },
  {
    id: 'wood-processing-plant-permit',
    name: 'Wood Processing Plant (WPP) Permit',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
  },
  {
    id: 'private-land-timber-permit',
    name: 'Private Land Timber Permit (PLTP)',
    classification: 'TECHNICAL',
    turnaround: {
      days: 11,
      hours: 1,
      minutes: 45,
    },
    note: 'Per CC 1st Edition 2026',
  },
  {
    id: 'community-based-forest-management',
    name: 'Community Based-Forest Management (CBFM)',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
  },
  {
    id: 'gratuitous-special-use-permit',
    name: 'Gratuitous Special Use Permit (GSUP)',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
  },
  {
    id: 'special-tree-cutting-earth-balling',
    name: 'Special Tree Cutting and Earth-balling Permit',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
  },
  {
    id: 'sustainable-forest-land-management',
    name: 'Sustainable Forest Land Management Agreement',
    classification: 'TECHNICAL',
    turnaround: {
      days: 20,
    },
    note: 'Endorsement to CO',
  },
  {
    id: 'water-permit',
    name: 'Water Permit',
    classification: 'TECHNICAL',
    turnaround: {
      days: 15,
    },
  },
];

interface Props {
  mode?: 'create' | 'edit';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DocumentDialog({
  mode = 'create',
  document,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: Props) {

  const user =
      useAuthStore(
        (state) =>
          state.user,
      );

  console.log('user::-->>',user)
  const officeCode = user?.offices[0].officeCode;
  const isRecords = officeCode === 'RO-RECORDS'

  const initialFormData = {
    title: '',
    description: '',
    deadline:
      undefined as
        | Date
        | undefined,
    documentTypeId: '',
    permitId: '',
    addressee: '',
    classification: isRecords ? 'UNCLASSIFIED' : 'SIMPLE',
    priority: 'MEDIUM',
    confidentialityLevel: 'PUBLIC',
    // ==========================================
    // NEW DOCUMENT CLASSIFICATION
    // ==========================================

    sourceClass: '' as DocumentSourceClass | '',
    internalSourceScope: '' as InternalSourceScope | '',
    monitoringCategory: 'GENERAL' as DocumentMonitoringCategory,

    senderType: 'OFFICE',
    senderOfficeId: '',
    senderName: '',
    senderOrganization: '',
    senderContact: '',
  };
  
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [loading, setLoading] = useState(false);
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [documentTypes, setDocumentTypes] = useState<{id: string; name: string;}[]>([]);
  const [currentOffice, setCurrentOffice] = useState<{id: string; officeName: string;} | null>(null);
  const [offices, setOffices] = useState<{
        id:string;
        officeName:string;
      }[]
    >([]);

  const [
    workingDays,
    setWorkingDays,
  ] = useState('');
  
  const [routing, setRouting] = useState({
    toOfficeId:'',
    remarks:'',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapDocumentToForm = (doc: any) => ({
    title: doc.title || '',
    description: doc.description || '',
    deadline: doc.deadline ? new Date(doc.deadline) : undefined,
    documentTypeId: doc.documentTypeId || '',
    permitId: doc.permitId || '',
    addressee: doc.addressee || '',
    classification: doc.classification || 'SIMPLE',
    priority: doc.priority || 'MEDIUM',
    confidentialityLevel: doc.confidentialityLevel || 'PUBLIC',
    sourceClass: doc.sourceClass || '',
    internalSourceScope: doc.internalSourceScope || '',
    monitoringCategory: doc.monitoringCategory || 'GENERAL',
    senderType: doc.senderType || 'OFFICE',
    senderOfficeId: doc.senderOfficeId || undefined,
    senderName: doc.senderName || '',
    senderOrganization: doc.senderOrganization || '',
    senderContact: doc.senderContact || '',
  });

  const initialValues = useMemo(() => {
    if (mode === 'edit' && document) {
        if(document.attachments.length){
            // eslint-disable-next-line react-hooks/set-state-in-render
            setAttachments(document.attachments)
        }
        return mapDocumentToForm(document);
    }
    return initialFormData;
  }, [mode, document?.id]);

  const [formData, setFormData] = useState(initialValues);
  
  const resetForm = () => {
    if (mode === 'create') {
        setFormData(initialFormData);
        setAttachments([]);
        void fetchTrackingNumber();
    }
  };

  const fetchTrackingNumber = async () => {
      try {
        /*
        * ==========================================
        * TRACKING NUMBER
        * ==========================================
        */

        if (mode === 'create') {
          const response =
            await api.get(
              '/documents/next-tracking-number',
            );

          setTrackingNumber(
            response.data.trackingNumber,
          );
        } else if (document?.trackingNumber) {
          setTrackingNumber(
            document.trackingNumber,
          );
        }

        /*
        * ==========================================
        * DOCUMENT TYPES
        * ==========================================
        */

        const typesRes =
          await api.get(
            '/document-types',
          );

        const types =
          typesRes.data;

        setDocumentTypes(
          types,
        );

        /*
        * ==========================================
        * OFFICES
        *
        * IMPORTANT:
        * Load for BOTH create and edit.
        * ==========================================
        */

        const officesRes =
          await api.get(
            '/offices/accessible',
          );

        setOffices(
          officesRes.data,
        );

        /*
        * ==========================================
        * CREATE DEFAULTS
        * ==========================================
        */

        if (mode === 'create') {
          const memorandum =
            types.find(
              (type: {
                id: string;
                name: string;
              }) =>
                type.name
                  .trim()
                  .toLowerCase() ===
                'memorandum',
            );

          if (memorandum) {
            setFormData(
              (prev) => ({
                ...prev,

                documentTypeId:
                  memorandum.id,
              }),
            );
          }
        }

        /*
        * ==========================================
        * CURRENT USER OFFICE
        * ==========================================
        */

        const meRes =
          await api.get(
            '/auth/me',
          );

        const office =
          meRes.data
            .officeUsers?.[0]
            ?.office;

        if (office) {
          setCurrentOffice(
            office,
          );
        }
      } catch (error) {
        console.error(
          'Failed to load document form data:',
          error,
        );

        toast.error(
          'Failed to load document form data.',
        );
      }
    };

  useEffect(() => {
    void fetchTrackingNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, document?.id]);

  
  const handleSubmit =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      if(!formData.title?.trim()) {
        toast.error('Please provide a document title.')
        return
      }

      if (!formData.sourceClass) {
        toast.error(
          'Please classify the document as Internal or External.',
        );

        return;
      }

      if (
        formData.sourceClass === 'INTERNAL' &&
        !formData.internalSourceScope
      ) {
        toast.error(
          'Please select the internal source.',
        );

        return;
      }

      if (
        formData.sourceClass === 'INTERNAL' &&
        formData.internalSourceScope ===
          'LOCAL_CARAGA' &&
        !formData.senderOfficeId
      ) {
        toast.error(
          'Please select the originating DENR office.',
        );

        return;
      }

      if (
        formData.sourceClass === 'INTERNAL' &&
        formData.internalSourceScope ===
          'OTHER_REGION' &&
        !formData.senderOrganization.trim()
      ) {
        toast.error(
          'Please enter the originating DENR Regional Office.',
        );

        return;
      }

      if (
        formData.sourceClass === 'EXTERNAL' &&
        !formData.senderType
      ) {
        toast.error(
          'Please select the external sender type.',
        );

        return;
      }

      if (
        formData.monitoringCategory === 'PERMIT' &&
        !formData.permitId
      ) {
        toast.error(
          'Please select the permit type.',
        );

        return;
      }
      

      try {
        setLoading(true);

        const selectedPermit =
          PERMIT_OPTIONS.find(
            (permit) =>
              permit.id ===
              formData.permitId,
          );

        const finalTitle =
          isPermitDocument &&
          selectedPermit
            ? `${formData.title.trim()} Permits | ${selectedPermit.name}`
            : formData.title.trim();
       
        const payload = {
          title: finalTitle,
          description:
            formData.description,
          deadline:
            formData.deadline,
          documentTypeId:
            formData.documentTypeId,
          addressee:
            formData.addressee,
          classification:
            formData.classification,
          priority:
            formData.priority,
          confidentialityLevel:
            formData.confidentialityLevel,

          sourceClass:
            formData.sourceClass,

          internalSourceScope:
            formData.sourceClass === 'INTERNAL'
              ? formData.internalSourceScope
              : undefined,

          monitoringCategory:
            formData.sourceClass === 'EXTERNAL'
              ? formData.monitoringCategory
              : 'GENERAL',

          senderType:
            formData.senderType,
          senderOfficeId:
            formData.sourceClass === 'INTERNAL' &&
            formData.internalSourceScope === 'LOCAL_CARAGA' &&
            formData.senderOfficeId
              ? formData.senderOfficeId
              : undefined,
          senderName:
            formData.senderName,
          senderOrganization:
            formData.senderOrganization,
          senderContact:
            formData.senderContact,
          attachments,
        };

        console.log('data:', payload);
        let res;

       if (mode === 'edit' && document?.id) {
          const payload = {
            title:
              formData.title.trim(),

            description:
              formData.description,

            deadline:
              formData.deadline,

            documentTypeId:
              formData.documentTypeId,

            addressee:
              formData.addressee,

            classification:
              formData.classification,

            priority:
              formData.priority,

            confidentialityLevel:
              formData.confidentialityLevel,

            // ==========================================
            // SOURCE / MONITORING
            // ==========================================

            sourceClass:
              formData.sourceClass,

            internalSourceScope:
              formData.sourceClass === 'INTERNAL'
                ? formData.internalSourceScope
                : undefined,

            monitoringCategory:
              formData.sourceClass === 'EXTERNAL'
                ? formData.monitoringCategory
                : 'GENERAL',

            // ==========================================
            // SENDER
            // ==========================================

            senderType:
              formData.sourceClass === 'INTERNAL'
                ? 'OFFICE'
                : formData.senderType,

            senderOfficeId:
              formData.sourceClass === 'INTERNAL' &&
              formData.internalSourceScope ===
                'LOCAL_CARAGA' &&
              formData.senderOfficeId
                ? formData.senderOfficeId
                : undefined,

            senderName:
              formData.senderName?.trim() ||
              undefined,

            senderOrganization:
              formData.senderOrganization?.trim() ||
              undefined,

            senderContact:
              formData.senderContact?.trim() ||
              undefined,

            attachments,
          };

          res = await api.patch(
            `/documents/${document.id}`,
            payload,
          );
        } else {
            res = await api.post('/documents', payload);

            if(mode === 'create' && routing.toOfficeId){
              await api.post(
                `/documents/${res.data.id}/route`,
                {
                  toOfficeId:
                    routing.toOfficeId,

                  remarks:
                    routing.remarks,
                }
              );
            }

        }

        console.log('created: ', res)
        const trackingUrl = `${window.location.origin}/track?tracking=${res.data.trackingNumber}`;

        const selectedDocumentType =
              documentTypes.find(
                (type) =>
                  type.id === formData.documentTypeId,
              );

        const qrCode =
          await QRCode.toDataURL(
            trackingUrl,
          );
        
        await downloadRoutingSlip({
          trackingNumber:
            res.data.trackingNumber,

          title:
            res.data.title,

          description:
            res.data.description,

          sender:
            res.data.senderName ||
            res.data.senderOrganization ||
            currentOffice?.officeName ||
            'N/A',

          classification:
            res.data.classification,

          priority:
            res.data.priority,
          
          addressee:
            res.data.addressee,

          createdAt:
            new Date(
              res.data.createdAt,
            ).toLocaleString(),

          qrCode,
          officeCode,
          documentType: selectedDocumentType?.name ?? ''
        });

        onSuccess();

        resetForm();

        setOpen(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const handleFileUpload =
  async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files =
      e.target.files;

    if (!files) {
      return;
    }

    try {
      setUploading(true);

      const uploadedFiles:
        Attachment[] = [];

      for (
        const file of Array.from(
          files,
        )
      ) {
        /*
        |--------------------------------------------------------------------------
        | FILE SIZE
        |--------------------------------------------------------------------------
        */

        if (
          file.size >
          MAX_FILE_SIZE
        ) {
          toast.error(
            `${file.name} exceeds the 10MB limit.`,
          );

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | FORM DATA
        |--------------------------------------------------------------------------
        */

        const data =
          new FormData();

        data.append(
          'file',
          file,
        );

        /*
        |--------------------------------------------------------------------------
        | UPLOAD TO NESTJS BACKEND
        |--------------------------------------------------------------------------
        */

        const response =
          await api.post(
            '/documents/upload',
            data,
            {
              headers: {
                'Content-Type':
                  'multipart/form-data',
              },
            },
          );

        uploadedFiles.push({
          fileName:
            response.data
              .fileName,

          filePath:
            response.data
              .filePath,

          mimeType:
            response.data
              .mimeType,

          fileSize:
            response.data
              .fileSize,

          publicId:
            response.data
              .publicId,
        });
      }

      setAttachments(
        (prev) => [
          ...prev,
          ...uploadedFiles,
        ],
      );

      if (
        uploadedFiles.length >
        0
      ) {
        toast.success(
          `${uploadedFiles.length} file${
            uploadedFiles.length >
            1
              ? 's'
              : ''
          } uploaded successfully.`,
        );
      }

      /*
       * Allows selecting the same
       * file again if needed.
       */
      e.target.value = '';
    } catch (error) {
      console.error(
        'Document upload failed:',
        error,
      );

      toast.error(
        'Failed to upload attachment.',
      );
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment =
    async (
      publicId: string,
    ) => {
      try {
        await api.delete(
          `/documents/upload/${encodeURIComponent(
            publicId,
          )}`,
        );

        setAttachments(
          (prev) =>
            prev.filter(
              (item) =>
                item.publicId !==
                publicId,
            ),
        );

        toast.success(
          'Attachment removed.',
        );
      } catch (error) {
        console.error(
          'Failed to remove attachment:',
          error,
        );

        toast.error(
          'Failed to remove attachment.',
        );
      }
    };

  const selectedDocumentType =
    documentTypes.find(
      (type) =>
        type.id ===
        formData.documentTypeId,
    );

  const isPermitDocument =
    formData.monitoringCategory ===
    'PERMIT';

  const isSurveyReturnDocument =
    formData.monitoringCategory ===
    'SURVEY_RETURN';

  const isSpecialDocument =
    isPermitDocument ||
    isSurveyReturnDocument;


  console.log('document::', document)

  /*
  |--------------------------------------------------------------------------
  | WEEKEND CHECK
  |--------------------------------------------------------------------------
  */

  function isWeekend(
    date: Date,
  ) {
    const day =
      date.getDay();

    return (
      day === 0 || // Sunday
      day === 6    // Saturday
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MOVE TO NEXT WORKING DAY
  |--------------------------------------------------------------------------
  */

  function moveToNextWorkingDay(
    date: Date,
  ) {
    const result =
      new Date(date);

    while (
      isWeekend(result)
    ) {
      result.setDate(
        result.getDate() + 1,
      );
    }

    return result;
  }

  /*
  |--------------------------------------------------------------------------
  | ADD WORKING DAYS
  |--------------------------------------------------------------------------
  */

  function addWorkingDays(
    startDate: Date,
    workingDays: number,
  ) {
    const result =
      new Date(startDate);

    let addedDays = 0;

    while (
      addedDays <
      workingDays
    ) {
      result.setDate(
        result.getDate() + 1,
      );

      if (
        !isWeekend(result)
      ) {
        addedDays += 1;
      }
    }

    return result;
  }

  function calculateWorkingDaysDeadline(
    workingDays: number,
  ) {
    return addWorkingDays(
      new Date(),
      workingDays,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CALCULATE PERMIT DEADLINE
  |--------------------------------------------------------------------------
  */

  function calculatePermitDeadline(
  turnaround:
    TurnaroundTime,
) {
  const deadline =
    addWorkingDays(
      new Date(),
      turnaround.days,
    );

  if (
    turnaround.hours
  ) {
    deadline.setHours(
      deadline.getHours() +
        turnaround.hours,
    );
  }

  if (
    turnaround.minutes
  ) {
    deadline.setMinutes(
      deadline.getMinutes() +
        turnaround.minutes,
    );
  }

  /*
   * Safety in case adding hours/minutes
   * pushes the deadline into a weekend.
   */
  while (
    isWeekend(deadline)
  ) {
    deadline.setDate(
      deadline.getDate() + 1,
    );
  }

  return deadline;
}

  
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button 
            className={
                mode === 'edit'
                ? 'cursor-pointer bg-white text-gray-700 hover:bg-gray-100 w-full justify-start dark:bg-[#102418] dark:text-[#F3F8F3]'
                : 'h-12 rounded-2xl cursor-pointer px-8 font-semibold bg-gradient-to-r from-green-700 to-emerald-600 shadow-lg shadow-green-700/20 transition-all hover:scale-[1.02] hover:from-green-800 hover:to-emerald-700'
            }
        >
          {mode === 'create' && (
            <Plus className="mr-2 h-5 w-5" />
          )}
          {mode === 'edit' ? 'Update Document' : 'Create Document'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto rounded-[32px] border-0 bg-[#F8FAF6] p-0 shadow-2xl transition-colors dark:border-[#214234] dark:bg-[#07150D] sm:max-w-4xl">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}
        <DialogHeader className="relative overflow-hidden border-b border-slate-200 bg-white px-8 py-7 transition-colors dark:border-[#214234] dark:bg-[#102418]">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-green-700 to-emerald-600 text-white shadow-2xl">
              <FileText className="h-10 w-10" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
                DENR eDATS
              </p>

              <DialogTitle className="mt-2 text-4xl font-black tracking-tight text-[#102418] dark:text-[#F3F8F3]">
                {mode === 'edit' ? 'Update Document' : 'Create Document'}
              </DialogTitle>

              <p className="mt-2 text-sm text-slate-600 dark:text-[#A9C5B6]">
                {mode === 'edit'
                    ? 'Modify document details, routing, and metadata for this record.'
                    : 'Register and route official government documents across connected DENR offices and departments.'}
                </p>
            </div>
          </div>
        </DialogHeader>

        {/* ===================================== */}
        {/* FORM */}
        {/* ===================================== */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 p-8"
        >
          {/* ===================================== */}
          {/* DOCUMENT INFORMATION */}
          {/* ===================================== */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-colors dark:border-[#214234] dark:bg-[#102418]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/40">
                <FolderOpen className="h-6 w-6 text-green-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#102418] dark:text-[#F3F8F3]">
                  Document Information
                </h2>

                <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Basic document metadata and identification.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* TITLE */}
              <div className="lg:col-span-2">
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Subject
                </Label>

                <Input
                  placeholder="Enter document subject..."
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div className="lg:col-span-2">
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Description
                </Label>

                <Textarea
                  placeholder="Enter document description..."
                  className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* TRACKING NUMBER */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Tracking Number
                </Label>

                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-700" />

                  <Input
                    value={trackingNumber}
                    readOnly
                    className="h-12 rounded-2xl border-green-200 bg-green-50 pl-12 font-semibold tracking-wide text-green-800 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Automatically generated by the system
                </p>
              </div>

              {/* DEADLINE */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Deadline
                </Label>

                <DateTimePicker
                  value={formData.deadline}
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      deadline: date,
                    })
                  }
                  placeholder="Select deadline"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Select document due date and time
                </p>
              </div>
            </div>
          </section>

          {/* ===================================== */}
          {/* SOURCE & MONITORING */}
          {/* ===================================== */}

          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-colors dark:border-[#214234] dark:bg-[#102418]">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                <Shield className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#102418] dark:text-[#F3F8F3]">
                  Source & Monitoring Classification
                </h2>

                <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Classify where the document originated and how it should be monitored.
                </p>
              </div>
            </div>

            {/* SOURCE CLASS */}
            <div>
              <Label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                Document Source
              </Label>

              <div className="grid gap-4 md:grid-cols-2">
                {/* INTERNAL */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,

                      sourceClass: 'INTERNAL',

                      internalSourceScope: '',

                      monitoringCategory: 'GENERAL',

                      senderType: 'OFFICE',

                      senderOfficeId: '',

                      senderName: '',

                      senderOrganization: '',

                      senderContact: '',
                    }))
                  }
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    formData.sourceClass === 'INTERNAL'
                      ? 'border-green-600 bg-green-50 ring-2 ring-green-600/10 dark:border-green-500 dark:bg-green-950/30'
                      : 'border-slate-200 bg-slate-50 hover:border-green-300 dark:border-[#214234] dark:bg-[#173227]'
                  }`}
                >
                  <p className="font-bold text-[#102418] dark:text-[#F3F8F3]">
                    Internal
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#A9C5B6]">
                    Documents originating from DENR offices,
                    including Caraga, other DENR regions,
                    and Central Office.
                  </p>
                </button>

                {/* EXTERNAL */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,

                      sourceClass: 'EXTERNAL',

                      internalSourceScope: '',

                      monitoringCategory: 'GENERAL',

                      senderType:
                        prev.senderType === 'OFFICE'
                          ? ''
                          : prev.senderType,

                      senderOfficeId: '',
                    }))
                  }
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    formData.sourceClass === 'EXTERNAL'
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/10 dark:border-blue-500 dark:bg-blue-950/30'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-300 dark:border-[#214234] dark:bg-[#173227]'
                  }`}
                >
                  <p className="font-bold text-[#102418] dark:text-[#F3F8F3]">
                    External
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#A9C5B6]">
                    Applications, requests, communications,
                    permits and survey returns originating
                    outside DENR.
                  </p>
                </button>
              </div>
            </div>

            {/* INTERNAL SCOPE */}
            {formData.sourceClass === 'INTERNAL' && (
              <div className="mt-7 rounded-2xl border border-green-200 bg-green-50/50 p-5 dark:border-green-900 dark:bg-green-950/20">
                <Label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Internal Source
                </Label>

                <Select
                    value={formData.internalSourceScope}
                    onValueChange={(value) => {
                      const scope = value as InternalSourceScope;

                      setFormData((prev) => ({
                        ...prev,

                        internalSourceScope: scope,

                        senderType: 'OFFICE',

                        senderOfficeId: '',

                        senderName: '',

                        senderOrganization:
                          scope === 'CENTRAL_OFFICE'
                            ? 'DENR Central Office'
                            : '',

                        senderContact: '',
                      }));
                    }}
                  >
                  <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-white dark:border-[#214234] dark:bg-[#173227]">
                    <SelectValue placeholder="Select internal source" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="LOCAL_CARAGA">
                      Within DENR Caraga
                    </SelectItem>

                    <SelectItem value="OTHER_REGION">
                      Other DENR Regional Office
                    </SelectItem>

                    <SelectItem value="CENTRAL_OFFICE">
                      DENR Central Office
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* EXTERNAL CATEGORY */}
            {formData.sourceClass === 'EXTERNAL' && (
              <div className="mt-7 rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                <Label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  External Document Category
                </Label>

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      value: 'GENERAL',
                      label: 'General',
                      description:
                        'Regular external communication',
                    },
                    {
                      value: 'PERMIT',
                      label: 'Permit',
                      description:
                        'Separate permit monitoring',
                    },
                    {
                      value: 'SURVEY_RETURN',
                      label: 'Survey Return',
                      description:
                        'Separate survey monitoring',
                    },
                  ].map((item) => {
                    const selected =
                      formData.monitoringCategory ===
                      item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,

                            monitoringCategory:
                              item.value as DocumentMonitoringCategory,

                            permitId:
                              item.value === 'PERMIT'
                                ? prev.permitId
                                : '',

                            deadline:
                              item.value === 'PERMIT'
                                ? prev.deadline
                                : undefined,
                          }))
                        }
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          selected
                            ? 'border-blue-600 bg-white shadow-sm ring-2 ring-blue-600/10 dark:border-blue-500 dark:bg-[#173227]'
                            : 'border-blue-100 bg-white/60 hover:border-blue-300 dark:border-[#214234] dark:bg-[#102418]'
                        }`}
                      >
                        <p className="font-bold text-[#102418] dark:text-[#F3F8F3]">
                          {item.label}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#A9C5B6]">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {(isPermitDocument ||
                  isSurveyReturnDocument) && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                    This document uses special monitoring and
                    may be routed directly to the responsible
                    processing office without passing through
                    the standard RED / ARD workflow.
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ===================================== */}
          {/* SENDER INFORMATION */}
          {/* ===================================== */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-colors dark:border-[#214234] dark:bg-[#102418]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#102418] dark:text-[#F3F8F3]">
                  Sender Information
                </h2>

                <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Identify where the document originated from.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* ===================================== */}
              {/* SENDER TYPE */}
              {/* ===================================== */}

              {formData.sourceClass === 'INTERNAL' ? (
                <div className="lg:col-span-2">
                  <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                    Sender Type
                  </Label>

                  <div className="flex h-12 items-center rounded-2xl border border-green-200 bg-green-50 px-4 dark:border-green-800 dark:bg-green-950/20">
                    <span className="font-semibold text-green-800 dark:text-green-300">
                      DENR Office
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 dark:text-[#A9C5B6]">
                    Internal documents originate from a DENR office.
                  </p>
                </div>
              ) : formData.sourceClass === 'EXTERNAL' ? (
                <div className="lg:col-span-2">
                  <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                    Sender Type
                  </Label>

                  <Select
                    value={formData.senderType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,

                        senderType: value,

                        senderOfficeId: '',

                        senderName: '',

                        senderOrganization: '',

                        senderContact: '',
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] sm:w-1/2">
                      <SelectValue placeholder="Select sender type" />
                    </SelectTrigger>

                    <SelectContent className="dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]">
                      <SelectItem value="CLIENT">
                        Client / Citizen
                      </SelectItem>

                      <SelectItem value="AGENCY">
                        Government Agency
                      </SelectItem>

                      <SelectItem value="COMPANY">
                        Company / Organization
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              {/* ===================================== */}
              {/* INTERNAL - LOCAL CARAGA */}
              {/* ===================================== */}

              {formData.sourceClass === 'INTERNAL' &&
                formData.internalSourceScope === 'LOCAL_CARAGA' && (
                  <div className="lg:col-span-2">
                    <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                      Originating DENR Office
                    </Label>

                    <Select
                      value={formData.senderOfficeId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          senderOfficeId: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-slate-50 dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                        <SelectValue placeholder="Select originating office" />
                      </SelectTrigger>

                      <SelectContent className="dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]">
                        {offices.map((office) => (
                          <SelectItem
                            key={office.id}
                            value={office.id}
                          >
                            {office.officeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <p className="mt-2 text-xs text-slate-500 dark:text-[#A9C5B6]">
                      Select the actual DENR office that sent the document.
                    </p>
                  </div>
                )}

                {formData.sourceClass === 'INTERNAL' &&
                  formData.internalSourceScope ===
                    'OTHER_REGION' && (
                    <div className="lg:col-span-2">
                      <Label className="mb-2 block text-sm font-semibold">
                        Originating DENR Regional Office
                      </Label>

                      <Input
                        value={formData.senderOrganization}
                        placeholder="e.g. DENR Region XI"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            senderOrganization: e.target.value,
                          }))
                        }
                        className="h-12 rounded-2xl"
                      />
                    </div>
                  )}

                  {formData.sourceClass === 'INTERNAL' &&
                    formData.internalSourceScope ===
                      'CENTRAL_OFFICE' && (
                      <div className="lg:col-span-2">
                        <Label className="mb-2 block text-sm font-semibold">
                          Originating Office
                        </Label>

                        <div className="flex h-12 items-center rounded-2xl border border-green-200 bg-green-50 px-4 dark:border-green-800 dark:bg-green-950/20">
                          <span className="font-semibold text-green-800 dark:text-green-300">
                            DENR Central Office
                          </span>
                        </div>
                      </div>
                    )}

              {/* ===================================== */}
              {/* CLIENT */}
              {/* ===================================== */}

              {formData.senderType ===
                'CLIENT' && (
                <>
                  <div>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                      Client Name
                    </Label>

                    <Input
                      placeholder="Enter client name"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                      value={
                        formData.senderName
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          senderName:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                      Contact Number
                    </Label>

                    <Input
                      placeholder="09XXXXXXXXX"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                      value={
                        formData.senderContact
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          senderContact:
                            e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {/* ===================================== */}
              {/* AGENCY / COMPANY */}
              {/* ===================================== */}

              {(formData.senderType ===
                'AGENCY' ||
                formData.senderType ===
                  'COMPANY') && (
                <>
                  <div>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                      Organization Name
                    </Label>

                    <Input
                      placeholder="Enter organization"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                      value={
                        formData.senderOrganization
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          senderOrganization:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                      Contact Person
                    </Label>

                    <Input
                      placeholder="Enter contact person"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                      value={
                        formData.senderName
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          senderName:
                            e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ===================================== */}
          {/* CLASSIFICATION & Routing */}
          {/* ===================================== */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-colors dark:border-[#214234] dark:bg-[#102418]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                <Shield className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#102418] dark:text-[#F3F8F3]">
                  Classification & Routing
                </h2>

                <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Configure workflow, routing, and confidentiality.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* DOCUMENT CLASSIFICATION */}

              {/* ============================================================
                    DOCUMENT CLASSIFICATION + WORKING DAYS
                ============================================================ */}

                {(!isRecords ||
                  isPermitDocument) && (
                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-[minmax(0,1fr)_180px]
                    "
                  >
                    {/* ======================================================
                        CLASSIFICATION
                    ======================================================= */}

                    <div>
                      <Label
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-slate-700
                          dark:text-[#D7E8DD]
                        "
                      >
                        Classification
                      </Label>

                      <Select
                        disabled={
                          isPermitDocument ||
                          isRecords
                        }
                        value={
                          formData.classification
                        }
                        onValueChange={(
                          value,
                        ) =>
                          setFormData(
                            (prev) => ({
                              ...prev,

                              classification:
                                value,
                            }),
                          )
                        }
                      >
                        <SelectTrigger
                          className="
                            h-12
                            w-full
                            rounded-2xl
                            border-slate-200
                            bg-slate-50
                            transition-colors
                            dark:border-[#214234]
                            dark:bg-[#173227]
                            dark:text-[#F3F8F3]
                          "
                        >
                          <SelectValue
                            placeholder="Select classification"
                          />
                        </SelectTrigger>

                        <SelectContent
                          className="
                            dark:border-[#214234]
                            dark:bg-[#102418]
                            dark:text-[#F3F8F3]
                          "
                        >
                          <SelectItem
                            value="SIMPLE"
                          >
                            Simple
                          </SelectItem>

                          <SelectItem
                            value="COMPLEX"
                          >
                            Complex
                          </SelectItem>

                          <SelectItem
                            value="TECHNICAL"
                          >
                            Highly Technical
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ======================================================
                        WORKING DAYS
                    ======================================================= */}

                    <div>
                      <Label
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-slate-700
                          dark:text-[#D7E8DD]
                        "
                      >
                        Working Days
                      </Label>

                      <Select
                        value={
                          workingDays
                        }
                        disabled={
                          isPermitDocument
                        }
                        onValueChange={(
                          value,
                        ) => {
                          const days =
                            Number(value);

                          setWorkingDays(
                            value,
                          );

                          const deadline =
                            calculateWorkingDaysDeadline(
                              days,
                            );

                          setFormData(
                            (prev) => ({
                              ...prev,

                              deadline,
                            }),
                          );
                        }}
                      >
                        <SelectTrigger
                          className="
                            h-12
                            w-full
                            rounded-2xl
                            border-slate-200
                            bg-slate-50
                            transition-colors
                            dark:border-[#214234]
                            dark:bg-[#173227]
                            dark:text-[#F3F8F3]
                          "
                        >
                          <SelectValue
                            placeholder="Days"
                          />
                        </SelectTrigger>

                        <SelectContent
                          className="
                            max-h-[300px]
                            dark:border-[#214234]
                            dark:bg-[#102418]
                            dark:text-[#F3F8F3]
                          "
                        >
                          {WORKING_DAY_OPTIONS.map(
                            (days) => (
                              <SelectItem
                                key={days}
                                value={String(
                                  days,
                                )}
                              >
                                {days}{' '}
                                {days === 1
                                  ? 'Day'
                                  : 'Days'}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>

                      <p
                        className="
                          mt-1.5
                          text-[11px]
                          text-slate-500
                          dark:text-[#7FA18E]
                        "
                      >
                        Excludes weekends
                      </p>
                    </div>
                  </div>
                )}
              {/* DOCUMENT TYPE */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Document Type
                </Label>

                <Select
                  value={
                    formData.documentTypeId
                  }
                  onValueChange={(value) => {
                    const selectedType =
                      documentTypes.find(
                        (type) =>
                          type.id === value,
                      );

                    const isPermits =
                      selectedType?.name
                        ?.trim()
                        .toLowerCase() ===
                      'permits';

                    setFormData((prev) => ({
                      ...prev,

                      documentTypeId: value,

                      /*
                      * Clear old permit when
                      * changing document type.
                      */
                      permitId: '',

                      /*
                      * For Records:
                      * normal documents remain
                      * unclassified.
                      */
                      classification:
                        isPermits
                          ? prev.classification
                          : isRecords
                            ? 'UNCLASSIFIED'
                            : 'SIMPLE',

                      /*
                      * Prevent stale permit
                      * deadline.
                      */
                      deadline:
                        isPermits
                          ? prev.deadline
                          : undefined,
                    }));
                  }}
                >
                  <SelectTrigger className="h-12 rounded-2xl w-full border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent className="dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]">
                    {documentTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id}
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isPermitDocument && (
                <div>
                  <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                    Name of Permit
                  </Label>

                  <Select
                    value={
                      formData.permitId
                    }
                    onValueChange={(
                      value,
                    ) => {
                      const permit =
                        PERMIT_OPTIONS.find(
                          (item) =>
                            item.id ===
                            value,
                        );

                      if (!permit) {
                        return;
                      }

                      const deadline =
                        calculatePermitDeadline(
                          permit.turnaround,
                        );

                      setFormData(
                        (prev) => ({
                          ...prev,

                          permitId:
                            permit.id,

                          classification:
                            permit.classification,

                          deadline,
                        }),
                      );
                    }}
                  >
                    <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                      <SelectValue placeholder="Select permit" />
                    </SelectTrigger>

                    <SelectContent className="dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]">
                      {PERMIT_OPTIONS.map(
                        (permit) => (
                          <SelectItem
                            key={permit.id}
                            value={
                              permit.id
                            }
                          >
                            {permit.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>

                  <p className="mt-2 text-xs text-slate-500 dark:text-[#A9C5B6]">
                    Classification and
                    deadline will be set
                    automatically based on
                    the selected permit.
                  </p>
                </div>
              )}


              {/* PRIORITY */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Priority Level
                </Label>

                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      priority: value,
                    })
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl w-full border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>

                  <SelectContent className="dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]">
                    <SelectItem value="LOW">
                      Low
                    </SelectItem>

                    <SelectItem value="MEDIUM">
                      Medium
                    </SelectItem>

                    <SelectItem value="HIGH">
                      High
                    </SelectItem>

                    <SelectItem value="URGENT">
                      Urgent
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CONFIDENTIALITY */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Confidentiality
                </Label>

                <Select
                  value={
                    formData.confidentialityLevel
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      confidentialityLevel:
                        value,
                    })
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl w-full border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>

                  <SelectContent className="dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]">
                    <SelectItem value="PUBLIC">
                      Public
                    </SelectItem>

                    <SelectItem value="INTERNAL">
                      Internal
                    </SelectItem>

                    <SelectItem value="CONFIDENTIAL">
                      Confidential
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Addressee */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Addressee
                </Label>

                <Input
                  placeholder="Enter Addressee..."
                  className="rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                  value={formData.addressee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      addressee: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {mode === 'create' && (
              <>
              <div className="grid gap-6 lg:grid-cols-2 py-6">
                <div className="">
                    <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                      Route To Office
                    </Label>

                    <Select
                      value={routing.toOfficeId}
                      onValueChange={(value)=> 
                      setRouting(prev=>({
                          ...prev,
                          toOfficeId:value
                        }))
                      }
                    >

                    <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                      <SelectValue placeholder="Select destination office"/>
                    </SelectTrigger>

                      <SelectContent>

                      {
                        offices.map((office)=>(
                          <SelectItem
                            key={office.id}
                            value={office.id}
                            >
                            {office.officeName}
                          </SelectItem>
                        ))
                      }

                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-2">
                      Optional. If no office is selected, the document will be saved as Draft.
                    </p>
                </div>

                <div>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                      Routing Remarks
                    </Label>

                    <Textarea
                      value={routing.remarks}
                      onChange={(e)=>
                      setRouting(prev=>({
                        ...prev,
                        remarks:e.target.value
                        }))
                      }
                    />

                </div>

                </div>
              </>
              )}

          </section>

          {/* ===================================== */}
          {/* ATTACHMENTS */}
          {/* ===================================== */}
          <section className="rounded-[28px] border border-dashed border-green-300 bg-green-50/40 p-8 transition-colors dark:border-green-700 dark:bg-green-900/10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                <Paperclip className="h-10 w-10 text-green-700" />
              </div>

              <h2 className="mt-5 text-2xl font-black text-[#102418] dark:text-[#F3F8F3]">
                Upload Attachments
              </h2>

              <p className="mt-2 max-w-md text-sm leading-7 text-slate-600 dark:text-[#A9C5B6]">
                Upload PDF, DOCX, XLSX,
                images, and other files.
              </p>

              <label>
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={
                    handleFileUpload
                  }
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="mt-6 rounded-2xl border-green-300 bg-white transition-colors dark:border-[#214234] dark:bg-[#102418]"
                  asChild
                >
                  <span>
                    {uploading
                      ? 'Uploading...'
                      : 'Browse Files'}
                  </span>
                </Button>
              </label>
            </div>

            {/* FILE LIST */}
            <div className="mt-8 space-y-3">
              {attachments.map(
                (file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-colors dark:border-[#214234] dark:bg-[#102418]"
                  >
                    <div>
                      <p className="font-medium text-slate-800 dark:text-[#F3F8F3]">
                        {file.fileName}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                        {(
                          file.fileSize /
                          1024 /
                          1024
                        ).toFixed(2)}{' '}
                        MB
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        removeAttachment(
                          file.publicId
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}
            </div>
          </section>

          {/* ===================================== */}
          {/* ACTIONS */}
          {/* ===================================== */}
          <div className="flex flex-col-reverse cursor-pointer gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end transition-colors dark:border-[#214234]">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl px-6 dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-2xl bg-gradient-to-r cursor-pointer from-green-700 to-emerald-600 px-8 font-semibold shadow-lg shadow-green-700/20"
            >
              {loading ? (
                mode === 'edit'
                    ? 'Updating Document...'
                    : 'Creating Document...'
                ) : (
                mode === 'edit'
                    ? 'Update Document'
                    : 'Register Document'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}