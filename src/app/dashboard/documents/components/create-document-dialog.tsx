'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  FolderOpen,
  Loader2,
  Paperclip,
  Plus,
  Shield,
} from 'lucide-react';

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

type Attachment = {
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  publicId: string;
};

export default function CreateDocumentDialog(
  {
    onCreated,
  }: {
    onCreated: () => void;
  }
) {

  const initialFormData = {
    title: '',
    description: '',
    deadline:
      undefined as
        | Date
        | undefined,
    documentTypeId: '',
    priority: '',
    confidentialityLevel: '',
    senderType: '',
    senderOfficeId: '',
    senderName: '',
    senderOrganization: '',
    senderContact: '',
  };
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [documentTypes, setDocumentTypes] = useState<{id: string; name: string;}[]>([]);
  const [currentOffice, setCurrentOffice] = useState<{id: string; officeName: string;} | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setAttachments([]);
    void fetchTrackingNumber();
  };

  const fetchTrackingNumber =
    async () => {
      try {
        const response = await api.get('/documents/next-tracking-number');
          setTrackingNumber(response.data.trackingNumber);

        const types = await api.get('/document-types');
        console.log('doc types:', types)
        setDocumentTypes(types.data);

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

      try {
        setLoading(true);
       
        const payload = {
          ...formData,
          attachments,
        };

        console.log('data:', payload);
        const res = await api.post('/documents', payload);

        console.log('created: ', res)
        onCreated()
        resetForm()
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

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="h-12 rounded-2xl cursor-pointer bg-gradient-to-r from-green-700 to-emerald-600 px-6 text-sm font-semibold shadow-lg shadow-green-700/20 transition-all hover:scale-[1.02] hover:from-green-800 hover:to-emerald-700">
          <Plus className="mr-2 h-5 w-5" />

          Create Document
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto rounded-[32px] border-0 bg-[#F8FAF6] p-0 shadow-2xl sm:max-w-4xl">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}
        <DialogHeader className="relative overflow-hidden border-b border-slate-200 bg-white px-8 py-7">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-green-700 to-emerald-600 text-white shadow-2xl">
              <FileText className="h-10 w-10" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
                DENR eDATS
              </p>

              <DialogTitle className="mt-2 text-4xl font-black tracking-tight text-[#102418]">
                Create Document
              </DialogTitle>

              <p className="mt-2 text-sm text-slate-600">
                Register and route official government documents
                across connected DENR offices and departments.
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
          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                <FolderOpen className="h-6 w-6 text-green-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#102418]">
                  Document Information
                </h2>

                <p className="text-sm text-slate-500">
                  Basic document metadata and identification.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* TITLE */}
              <div className="lg:col-span-2">
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  Document Title
                </Label>

                <Input
                  placeholder="Enter document title..."
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50"
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
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </Label>

                <Textarea
                  placeholder="Enter document description..."
                  className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50"
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
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tracking Number
                </Label>

                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-700" />

                  <Input
                    value={trackingNumber}
                    readOnly
                    className="h-12 rounded-2xl border-green-200 bg-green-50 pl-12 font-semibold tracking-wide text-green-800"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Automatically generated by the system
                </p>
              </div>

              {/* DEADLINE */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
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
          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#102418]">
                  Sender Information
                </h2>

                <p className="text-sm text-slate-500">
                  Identify where the document originated from.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* SENDER TYPE */}
              <div className="lg:col-span-2">
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  <SelectTrigger className="h-12 w-1/2 rounded-2xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select sender type" />
                  </SelectTrigger>

                  <SelectContent>
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
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Originating Office
                    </Label>

                    <div className="flex h-12 items-center rounded-2xl border border-green-200 bg-green-50 px-4">
                      <p className="font-semibold text-green-800">
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
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Client Name
                    </Label>

                    <Input
                      placeholder="Enter client name"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50"
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
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Contact Number
                    </Label>

                    <Input
                      placeholder="09XXXXXXXXX"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50"
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
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Organization Name
                    </Label>

                    <Input
                      placeholder="Enter organization"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50"
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
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Contact Person
                    </Label>

                    <Input
                      placeholder="Enter contact person"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50"
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
          {/* CLASSIFICATION */}
          {/* ===================================== */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Shield className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#102418]">
                  Classification & Routing
                </h2>

                <p className="text-sm text-slate-500">
                  Configure workflow, routing, and confidentiality.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* DOCUMENT TYPE */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  <SelectTrigger className="h-12 rounded-2xl w-full border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
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
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  <SelectTrigger className="h-12 rounded-2xl w-full border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>

                  <SelectContent>
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
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  <SelectTrigger className="h-12 rounded-2xl w-full border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>

                  <SelectContent>
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

              {/* STATUS */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  Initial Status
                </Label>

                <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <Badge className="rounded-full bg-amber-100 text-amber-700">
                    Pending Review
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================== */}
          {/* ATTACHMENTS */}
          {/* ===================================== */}
          <section className="rounded-[28px] border border-dashed border-green-300 bg-green-50/40 p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Paperclip className="h-10 w-10 text-green-700" />
              </div>

              <h2 className="mt-5 text-2xl font-black text-[#102418]">
                Upload Attachments
              </h2>

              <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">
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
                  className="mt-6 rounded-2xl border-green-300 bg-white"
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
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
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
          <div className="flex flex-col-reverse cursor-pointer gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl px-6"
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
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />

                  Creating Document...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />

                  Register Document
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}