"use client";

import {
  Building2,
  FileText,
  MoreVertical,
  Search,
  UserCheck,
} from "lucide-react";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { DocumentDetailsDrawer } from "./document-details-drawer";
import { useNotificationStore } from "@/store/notification.store";
import DocumentDialog from "./document-dialog";
import { useRouter } from "next/navigation";

export function DocumentsTable({
  documents,
  type,
  loading,
  onRefresh,
  page,
  setPage,
  meta,
  search,
  setSearch,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[];
  type: string;
  loading: boolean;
  onRefresh: () => void;
  page?: number;
  setPage?: (page: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
  search?: string;
  setSearch?: (value: string) => void;
}) {
  const router = useRouter();

  const [
    selectedDocument,
    setSelectedDocument,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] = useState<any | null>(null);

  const [openDetails, setOpenDetails] = useState(false);

  // Incremented each time a document is opened so the workspace initializes
  // its local form state from the latest selected row without a reset effect.
  const [workspaceSession, setWorkspaceSession] = useState(0);

  const { markAsRead, notifications } = useNotificationStore();

  // Keep the selected Document Workspace mounted while a save or route refreshes the table.
  if (loading && !openDetails) {
    return (
      <Card className="rounded-[32px] border-0 bg-white shadow-xl transition-colors dark:bg-[#102418] dark:shadow-[0_0_30px_rgba(34,197,94,0.10)]">
        <CardContent className="p-16 text-center text-slate-500 dark:text-[#A9C5B6]">
          Loading documents...
        </CardContent>
      </Card>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";

      case "COMPLETED":
        return "bg-slate-200 text-slate-700 border-slate-300";

      case "FOR_REVIEW":
        return "bg-blue-100 text-blue-700 border-blue-200";

      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getClassificationStyle = (status: string) => {
    switch (status) {
      case "SIMPLE":
        return "bg-green-100 text-green-700 border-green-200";

      case "COMPLEX":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "HIGHLY_TECHNICAL":
        return "bg-red-200 text-red-700 border-red-300";

      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getDeadlineInfo = (deadline: string, status?: string) => {
    if (!deadline) {
      return null;
    }

    const now = new Date();

    const deadlineDate = new Date(deadline);

    const diffMs = deadlineDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      if (status?.toUpperCase() === "COMPLETED") {
        return null;
      }

      return {
        text: "Overdue",
        className: "bg-red-100 text-red-700 border-red-200",
      };
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return {
        text: `${diffHours} hour${diffHours > 1 ? "s" : ""} remaining`,
        className:
          "bg-orange-100 text-orange-700 border-orange-200 animate-pulse",
      };
    }

    if (diffDays <= 3) {
      return {
        text: `${diffDays} day${diffDays > 1 ? "s" : ""} remaining`,
        className: "bg-amber-100 text-amber-700 border-amber-200",
      };
    }

    return {
      text: `${diffDays} days remaining`,
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  };

  const handleUpdateDocument = async (
    documentId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
  ) => {
    console.log("updated data:", data);

    try {
      const res = await api.patch(`/documents/${documentId}`, data);

      console.log("DOCUMENT UPDATED:", res.data);

      // Replace this with imong existing
      // document-list refresh function.
      onRefresh();
    } catch (error) {
      console.error("UPDATE DOCUMENT ERROR:", error);

      throw error;
    }
  };

  const uniqueDocuments = Array.from(
    new Map(documents.map((document) => [document.id, document])).values(),
  );

  console.log("all documents::", documents);

  return (
    <>
      <Card className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition-colors dark:border-[#214234] dark:bg-[#102418]">
        {/* HEADER */}
        <CardHeader className="border-b border-slate-100 bg-white transition-colors dark:border-[#214234] dark:bg-[#102418]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-3xl font-black text-[#102418] dark:text-[#F3F8F3]">
                Documents Registry
              </CardTitle>

              <p className="mt-2 text-sm text-slate-500 dark:text-[#A9C5B6]">
                Monitor and manage all incoming and outgoing documents.
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full lg:w-[320px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-[#7FA18E]" />

              <Input
                placeholder="Search documents..."
                className="pl-10 dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                value={search ?? ""}
                onChange={(e) => {
                  setSearch?.(e.target.value);

                  setPage?.(1);
                }}
              />
            </div>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-3 p-4">
          {uniqueDocuments.map((doc, i) => {
            const deadlineInfo = getDeadlineInfo(
              doc.deadline,
              doc.currentStatus?.name,
            );

            const canUpdate = ["DRAFT"].includes(doc.currentStatus?.name);

            return (
              <div
                key={i}
                onClick={async () => {
                  setWorkspaceSession((session) => session + 1);
                  setSelectedDocument(doc);

                  const notification = notifications.find(
                    (n) => n.documentId === doc.id,
                  );
                  if (notification) {
                    await api.patch(`/notifications/${notification.id}/read`);
                    markAsRead(notification.id);
                  }

                  setOpenDetails(true);
                }}
                className={`group cursor-pointer rounded-3xl border p-5 transition-all duration-300 hover:border-green-200 hover:bg-slate-50 hover:shadow-md dark:hover:border-green-600 dark:hover:bg-[#173227] ${
                  deadlineInfo?.text === "Overdue"
                    ? "border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/30"
                    : "border-slate-200 bg-white dark:border-[#214234] dark:bg-[#102418]"
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* LEFT */}
                  <div className="flex min-w-0 items-start gap-4">
                    {/* ICON */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg">
                      <FileText className="h-8 w-8" />
                    </div>

                    {/* INFO */}
                    <div className="min-w-0">
                      {/* TITLE */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-xl font-bold text-[#102418] dark:text-[#F3F8F3]">
                          {doc.title}
                        </h3>

                        <span className="text-sm text-slate-400 dark:text-[#6C9A83]">
                          •
                        </span>

                        <span className="text-sm font-medium text-slate-500 dark:text-[#A9C5B6]">
                          {doc.documentType?.name}
                        </span>
                      </div>

                      {/* META */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-[#A9C5B6]">
                        <div className="font-medium text-slate-700 dark:text-[#F3F8F3]">
                          {doc.trackingNumber}
                        </div>

                        {type !== "documents" && type !== "pending" ? (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" />
                            {doc.currentOffice?.officeName}
                          </div>
                        ) : (
                          doc.addressee && (
                            <div className="flex items-center gap-1.5">
                              <UserCheck className="h-4 w-4 text-slate-500" />
                              <span className="font-bold dark:text-[#F3F8F3]">
                                {doc.addressee}
                              </span>
                            </div>
                          )
                        )}

                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getClassificationStyle(
                              doc.classification,
                            )}`}
                          >
                            {doc.classification === "HIGHLY_TECHNICAL"
                              ? "HIGHLY HIGHLY_TECHNICAL"
                              : doc.classification}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">
                    {/* STATUS */}
                    <Badge
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusStyle(
                        doc.currentStatus?.name,
                      )}`}
                    >
                      {doc.currentStatus?.name}
                    </Badge>

                    {/* DEADLINE */}
                    {deadlineInfo && (
                      <div
                        className={`rounded-full border px-4 py-1 text-sm font-bold ${deadlineInfo.className}`}
                      >
                        {deadlineInfo.text}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl cursor-pointer transition-colors dark:text-[#F3F8F3] dark:hover:bg-[#173227]"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-52 rounded-2xl dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* VIEW DETAILS */}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();

                            setWorkspaceSession((session) => session + 1);
                            setSelectedDocument(doc);
                            setOpenDetails(true);
                          }}
                          className="cursor-pointer"
                        >
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/track?tracking=${encodeURIComponent(doc.trackingNumber)}`,
                            );
                          }}
                        >
                          Track
                        </DropdownMenuItem>

                        {canUpdate && (
                          <DocumentDialog
                            mode="edit"
                            document={doc}
                            onSuccess={onRefresh}
                          />
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 transition-colors dark:border-[#214234]">
          <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
            Page {meta?.page} of {meta?.totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage?.(page! - 1)}
              className="dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={page === meta?.totalPages}
              onClick={() => setPage?.(page! + 1)}
              className="dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* DETAILS */}
      <DocumentDetailsDrawer
        key={`${selectedDocument?.id ?? "document-details"}-${workspaceSession}`}
        open={openDetails}
        onOpenChange={setOpenDetails}
        document={selectedDocument}
        listType={type}
        onSave={handleUpdateDocument}
        onRouteSuccess={onRefresh}
        onStatusChanged={(updatedDocument) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setSelectedDocument((current: any) =>
            current ? { ...current, ...updatedDocument } : updatedDocument,
          );
          onRefresh();
        }}
      />
    </>
  );
}
