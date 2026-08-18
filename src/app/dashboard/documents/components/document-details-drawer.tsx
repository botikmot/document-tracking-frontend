'use client';

import {
  CalendarDays,
  Building2,
  FileText,
  Shield,
  AlertCircle,
  Paperclip,
  Pencil,
  MessageSquare,
  Upload,
  Send,
} from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import {
  Badge,
} from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Separator,
} from '@/components/ui/separator';
import { downloadRoutingSlip } from '@/lib/download-routing-slip';
import QRCode from 'qrcode';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (document: any) => void;
}

export function DocumentDetailsDrawer({
  open,
  onOpenChange,
  document,
  onEdit,
}: Props) {

  const user = useAuthStore((state) => state.user)
  const token = useAuthStore(
    (state) => state.accessToken,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [actions, setActions] = useState<any[]>(
    document?.actions ?? [],
  );

  const [comment, setComment] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submittingAction, setSubmittingAction] = useState(false);

  if (!document) {
    return null;
  }
 
  const isOrdUser = user?.offices?.some(
    (item) =>
      item.office?.officeCode === 'ORD' ||
      item.officeCode === 'ORD',
  );
  
  const canAddAction = user?.offices?.some(
        (item) =>
        item.officeId === document.currentOfficeId ||
        item.office?.id === document.currentOfficeId,
    );  


  const API_URL = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, '') ?? '';

  const API_URL2 = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
  const officeCode = user?.offices[0].officeCode;

  const documentIsInOrd = document?.currentOffice?.officeCode === 'ORD';

  const canEdit = Boolean(isOrdUser && documentIsInOrd);

  const handleDownloadRoutingSlip =
  async () => {
    const trackingUrl = `${window.location.origin}/track/${document.trackingNumber}`;

    const qrCode =
      await QRCode.toDataURL(
        trackingUrl,
      );

    await downloadRoutingSlip({
      trackingNumber:
        document.trackingNumber,

      title:
        document.title,

      description:
        document.description,

      sender:
         document.senderType === 'OFFICE'
          ? document.senderOffice?.officeName
          : document.senderName,

      classification:
        document.classification,

      priority:
        document.priority,
      
      addressee:
            document.addressee,

      createdAt:
        new Date(
          document.createdAt,
        ).toLocaleString(),

      qrCode,
      officeCode,
      documentType: document.documentType?.name ?? ''
    });
  };

  const getAttachmentUrl = (
    filePath: string,
  ) => {
    if (
      filePath.startsWith('http://') ||
      filePath.startsWith('https://')
    ) {
      return filePath;
    }

    return `${API_URL}${filePath}`;
  };

  const handleSubmitAction = async () => {
    if (!comment.trim() && !attachment) {
      return;
    }

    try {
      setSubmittingAction(true);

      const formData = new FormData();

      if (comment.trim()) {
        formData.append('comment', comment.trim());
      }

      if (attachment) {
        formData.append('file', attachment);
      }

      const response = await fetch(
        `${API_URL2}/documents/${document.id}/actions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          error.message || 'Failed to save action',
        );
      }

      const newAction = await response.json();

      setActions((previous) => [
        newAction,
        ...previous,
      ]);

      setComment('');
      setAttachment(null);
    } catch (error) {
      console.error('Submit action error:', error);
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-0 transition-colors dark:bg-[#07150D] sm:!max-w-4xl"
      >
        <SheetHeader className="border-b border-slate-200 pb-5 transition-colors dark:border-[#214234]">
          <SheetTitle className="text-2xl font-black text-[#102418] dark:text-[#F3F8F3]">
            Document Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8 px-6 py-6 pb-10">
          {/* TITLE */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-colors dark:border-[#214234] dark:bg-[#102418]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white transition-colors dark:bg-[#173227]">
                <FileText className="h-7 w-7 text-slate-700 dark:text-[#A9C5B6]" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-[#F3F8F3]">
                  {document.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Tracking Number:{' '}
                  {
                    document.trackingNumber
                  }
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Sender:{'  '}
                  <span className="font-bold dark:text-[#F3F8F3]">
                  {
                    document.senderType === 'OFFICE' ? document.senderOffice.officeName : document.senderName
                  }
                  </span>
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-blue-100 text-blue-700">
                    {
                      document
                        .documentType
                        ?.name
                    }
                  </Badge>

                  <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                    {
                      document
                        .currentStatus
                        ?.name
                    }
                  </Badge>
                  
                  <div className="ml-auto flex items-center gap-2">
                    {canEdit && (
                      <Button
                        size="sm"
                        onClick={() =>
                          onEdit?.(document)
                        }
                        className="cursor-pointer rounded-xl"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Document
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer rounded-xl dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
                      onClick={() =>
                        handleDownloadRoutingSlip()
                      }
                    >
                      Download Routing Slip
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-[#F3F8F3]">
              Description
            </h3>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 transition-colors dark:border-[#214234] dark:bg-[#102418] dark:text-[#A9C5B6]">
              {document.description ||
                'No description'}
            </div>
          </div>

          <Separator className="dark:bg-[#214234]" />

          {/* DETAILS GRID */}
          <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-[#214234] dark:bg-[#102418]">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Document Classification
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {document.classification ===
                    'TECHNICAL'
                      ? 'HIGHLY TECHNICAL'
                      : document.classification ||
                        'N/A'}
                  </h4>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-[#214234] dark:bg-[#102418]">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Current Office
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {
                      document
                        .currentOffice
                        ?.officeName
                    }
                  </h4>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Deadline
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {document.deadline
                      ? new Date(
                          document.deadline,
                        ).toLocaleString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          },
                        )
                      : 'No deadline'}
                  </h4>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Priority
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {
                      document.priority ||
                      'N/A'
                    }
                  </h4>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Confidentiality
                  </p>

                  <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                    {
                      document.confidentialityLevel ||
                      'N/A'
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* ATTACHMENTS (NEW) */}
          {document.attachments?.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#102418] dark:text-[#F3F8F3]">
                <Paperclip className="h-5 w-5" />
                Attachments
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                document.attachments.map((file: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-[#214234] dark:bg-[#102418] dark:hover:bg-[#173227]"
                  >
                    <p className="font-medium text-slate-900 dark:text-[#F3F8F3]">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                      {file.type || 'File'}
                    </p>

                    {/* optional preview hook */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 cursor-pointer dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
                      onClick={() =>
                        window.open(
                          getAttachmentUrl(
                            file.filePath,
                          ),
                          '_blank',
                          'noopener,noreferrer',
                        )
                      }
                    >
                      Preview
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="dark:bg-[#214234]" />

          {/* ACTIONS */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-[#F3F8F3]">
                <MessageSquare className="h-5 w-5" />
                Action
              </h3>

              {canAddAction && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">

                  {/* COMMENT */}
                  <textarea
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    placeholder="Write a comment or action taken..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]"
                  />

                  {/* FILE */}
                  <div className="mt-4">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-[#315844] dark:text-[#A9C5B6] dark:hover:bg-[#173227]">
                      <Upload className="h-4 w-4" />

                      {attachment
                        ? attachment.name
                        : 'Attach supporting file'}

                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          setAttachment(
                            e.target.files?.[0] ?? null,
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* SELECTED FILE */}
                  {attachment && (
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-[#173227]">
                      <div className="flex min-w-0 items-center gap-2">
                        <Paperclip className="h-4 w-4 shrink-0 text-slate-500" />

                        <span className="truncate text-sm text-slate-700 dark:text-[#F3F8F3]">
                          {attachment.name}
                        </span>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setAttachment(null)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  )}

                  {/* SUBMIT */}
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      disabled={
                        submittingAction ||
                        (!comment.trim() && !attachment)
                      }
                      onClick={handleSubmitAction}
                      className="cursor-pointer rounded-xl"
                    >
                      <Send className="mr-2 h-4 w-4" />

                      {submittingAction
                        ? 'Saving...'
                        : 'Submit Action'}
                    </Button>
                  </div>
                </div>
              )}

              {/* ACTION HISTORY */}
              <div className="mt-5 space-y-3">
                {actions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-[#214234] dark:text-[#A9C5B6]">
                    No actions recorded yet.
                  </div>
                ) : (
                  actions.map((action) => (
                    <div
                      key={action.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]"
                    >
                      {/* USER */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                            {action.user
                              ? `${action.user.firstName} ${action.user.lastName}`
                              : 'User'}
                          </p>

                          {action.office?.officeName && (
                            <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                              {action.office.officeName}
                            </p>
                          )}
                        </div>

                        <span className="text-xs text-slate-400">
                          {new Date(
                            action.createdAt,
                          ).toLocaleString()}
                        </span>
                      </div>

                      {/* COMMENT */}
                      {action.comment && (
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-[#A9C5B6]">
                          {action.comment}
                        </p>
                      )}

                      {/* ATTACHMENT */}
                      {action.filePath && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-4 cursor-pointer dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]"
                          onClick={() =>
                            window.open(
                              getAttachmentUrl(
                                action.filePath,
                              ),
                              '_blank',
                              'noopener,noreferrer',
                            )
                          }
                        >
                          <Paperclip className="mr-2 h-4 w-4" />

                          {action.fileName ??
                            'View Attachment'}
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            


        </div>
      </SheetContent>
    </Sheet>
  );
}