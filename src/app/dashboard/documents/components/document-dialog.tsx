'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  FolderOpen,
  Loader2,
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
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/axios';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { downloadRoutingSlip } from '@/lib/download-routing-slip';
import { toast } from 'sonner';

type Attachment = {
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  publicId: string;
};

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

  const initialFormData = {
    title: '',
    description: '',
    deadline:
      undefined as
        | Date
        | undefined,
    documentTypeId: '',
    addressee: '',
    classification: 'SIMPLE',
    priority: 'MEDIUM',
    confidentialityLevel: 'PUBLIC',
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
    addressee: doc.addressee || '',
    classification: doc.classification || 'SIMPLE',
    priority: doc.priority || 'MEDIUM',
    confidentialityLevel: doc.confidentialityLevel || 'PUBLIC',
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

  const fetchTrackingNumber =
    async () => {
      try {
        const response = await api.get('/documents/next-tracking-number');
          setTrackingNumber(response.data.trackingNumber);

        const typesRes = await api.get('/document-types');
        const types = typesRes.data;
        console.log('doc types:', types)
        setDocumentTypes(types);

        // Auto-select Memorandum for create mode
        if (mode === 'create') {

          const officesRes = await api.get('/offices/accessible');
          setOffices(
            officesRes.data
          );

          const memorandum = types.find(
            (type: { id: string; name: string }) =>
              type.name.toLowerCase() === 'memorandum'
          );

          if (memorandum) {
            setFormData((prev) => ({
              ...prev,
              documentTypeId: memorandum.id,
            }));
          }
        }

        const meRes = await api.get('/auth/me');
        console.log('meRes:', meRes)
        const office = meRes.data.officeUsers?.[0]?.office;
        if (office) {
          setCurrentOffice(office);
        }
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
      const load = async () => {
      await fetchTrackingNumber();
      };
      void load();
  }, []);

  
  const handleSubmit =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      if(!formData.title?.trim()) {
        toast.error('Please provide a document title.')
        return
      }

      try {
        setLoading(true);
       
        const payload = {
          ...formData,
          attachments,
        };

        console.log('data:', payload);
        let res;

        if (mode === 'edit' && document?.id) {
            const payload = {
                title: formData.title,
                description: formData.description,
                deadline: formData.deadline,
                documentTypeId: formData.documentTypeId,
                addressee: formData.addressee,
                classification: formData.classification,
                priority: formData.priority,
                confidentialityLevel: formData.confidentialityLevel,
                senderType: formData.senderType,
                senderOfficeId: formData.senderOfficeId?.trim() ? formData.senderOfficeId : undefined,
                senderName: formData.senderName,
                senderOrganization: formData.senderOrganization,
                senderContact: formData.senderContact,
                attachments: attachments,
            };

            res = await api.patch(`/documents/${document.id}`, payload);
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

const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files) return;

    try {
      setUploading(true);

      const uploadedFiles: Attachment[] = [];

      for (const file of Array.from(files)) {
        /*
        |----------------------------------------
        | FILE SIZE LIMIT
        |----------------------------------------
        */

        if (file.size > MAX_FILE_SIZE) {
          alert(
            `${file.name} exceeds 10MB limit`
          );

          continue;
        }

        /*
        |----------------------------------------
        | UPLOAD TO CLOUDINARY
        |----------------------------------------
        */

        const data = new FormData();

        data.append('file', file);

        const response = await fetch(
          '/api/upload',
          {
            method: 'POST',
            body: data,
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              'Upload failed'
          );
        }

        uploadedFiles.push({
          fileName: file.name,
          filePath: result.url,
          mimeType: file.type,
          fileSize: file.size,
          publicId: result.public_id,
        });
      }

      setAttachments((prev) => [
        ...prev,
        ...uploadedFiles,
      ]);
    } catch (error) {
      console.error(error);

      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = async (
    publicId: string
  ) => {
    try {
      await fetch(
        '/api/upload/delete',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            publicId,
          }),
        }
      );

      setAttachments((prev) =>
        prev.filter(
          (item) =>
            item.publicId !== publicId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };


  console.log('document::', document)

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
                  Document Title
                </Label>

                <Input
                  placeholder="Enter document title..."
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
              {/* SENDER TYPE */}
              <div className="lg:col-span-2">
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Sender Type
                </Label>

                <Select
                  value={formData.senderType}
                  onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    senderType: value,
                    senderOfficeId:
                      value === 'OFFICE' &&
                      currentOffice
                        ? currentOffice.id
                        : '',

                    senderName: '',
                    senderOrganization: '',
                    senderContact: '',
                  })
                }
                >
                  <SelectTrigger className="h-12 w-1/2 rounded-2xl border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                    <SelectValue placeholder="Select sender type" />
                  </SelectTrigger>

                  <SelectContent className="dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]">
                    <SelectItem value="OFFICE">
                      Office
                    </SelectItem>

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

              {/* ===================================== */}
              {/* OFFICE */}
              {/* ===================================== */}

              {formData.senderType ===
                'OFFICE' &&
                currentOffice && (
                  <div className="lg:col-span-2">
                    <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                      Originating Office
                    </Label>

                    <div className="flex h-12 items-center rounded-2xl border border-green-200 bg-green-50 px-4 transition-colors dark:border-green-700 dark:bg-green-900/20">
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        {
                          currentOffice.officeName
                        }
                      </p>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Automatically selected from
                      your assigned office
                    </p>
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

            <div>
              <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                Classification
              </Label>

              <Select
                value={
                  formData.classification
                }
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    classification:
                      value,
                  })
                }
              >
                <SelectTrigger className="h-12 rounded-2xl w-full border-slate-200 bg-slate-50 transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>

                <SelectContent className="dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]">
                  <SelectItem value="SIMPLE">
                    Simple
                  </SelectItem>
                  <SelectItem value="COMPLEX">
                    Complex
                  </SelectItem>
                  <SelectItem value="TECHNICAL">
                    Highly Technical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
              {/* DOCUMENT TYPE */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Document Type
                </Label>

                <Select
                  value={
                    formData.documentTypeId
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      documentTypeId: value,
                    })
                  }
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

              {/* STATUS */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
                  Initial Status
                </Label>

                <div className="flex h-10 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 transition-colors dark:border-[#214234] dark:bg-[#173227]">
                  <Badge className="rounded-full bg-amber-100 text-amber-700">
                    Pending Review
                  </Badge>
                </div>
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