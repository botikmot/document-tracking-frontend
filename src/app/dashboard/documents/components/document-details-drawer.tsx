"use client";

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
  UserRound,
  CalendarClock,
  ShieldCheck,
  Loader2,
  Route,
  MapPin,
  GitBranch,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { downloadRoutingSlipV2 } from "@/lib/download-routing-slip";
import QRCode from "qrcode";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { DocumentTimelineContent } from "./document-timeline-drawer";

type OfficeOption = {
  id: string;
  officeCode?: string;
  officeName: string;
};

type DocumentTypeOption = {
  id: string;
  name: string;
};

type UpdateDocumentPayload = {
  documentTypeId: string;
  priority: string;
  classification: string;
  confidentialityLevel: string;
  deadline: string | null;
  responsibleOfficeId: string | null;
  responsiblePerson: string | null;
};

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "ROUTINE", label: "Medium" },
  { value: "IMMEDIATE", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const CLASSIFICATIONS = [
  { value: "SIMPLE", label: "Simple" },
  { value: "COMPLEX", label: "Complex" },
  { value: "HIGHLY_TECHNICAL", label: "Highly Technical" },
];

const CONFIDENTIALITY_LEVELS = [
  { value: "PUBLIC", label: "Public" },
  { value: "INTERNAL", label: "Internal" },
  { value: "CONFIDENTIAL", label: "Confidential" },
];

const WORKING_DAY_OPTIONS = Array.from({ length: 30 }, (_, index) => index + 1);

/**
 * Standard action instructions shown as selectable checkboxes.
 * The labels are persisted in the existing action comment field so no
 * backend schema change is required.
 */
const ACTION_INSTRUCTION_COLUMNS = [
  [
    { value: "APPROPRIATE_ACTION", label: "Appropriate Action" },
    { value: "INFORMATION_REFERENCE", label: "Information / Reference" },
    { value: "SIGNATURE_APPROVAL", label: "Signature / Approval" },
  ],
  [
    { value: "REVIEW_EVALUATION", label: "Review / Evaluation" },
    { value: "COMPLIANCE", label: "Compliance" },
    { value: "REFER_ARD_MS_ARD_TS", label: "Refer: ARD-MS / ARD-TS" },
  ],
  [
    { value: "RECOMMENDATION", label: "Recommendation" },
    { value: "RETURN_FOR_REVISION", label: "Return for Revision" },
    { value: "REFER_TO_DIVISION", label: "Refer to Division" },
  ],
] as const;

const ROUTABLE_STATUSES = [
  "DRAFT",
  "PENDING",
  "REJECTED",
  "FOR_REVIEW",
  "FOR_APPROVAL",
  "ON_PROCESS",
  "APPROVED",
];

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function calculateWorkingDaysDeadline(workingDays: number) {
  const result = new Date();
  let addedDays = 0;
  while (addedDays < workingDays) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) addedDays += 1;
  }
  return result;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any;
  listType?: string;
  onSave?: (documentId: string, data: UpdateDocumentPayload) => Promise<void>;
  onRouteSuccess?: () => void | Promise<void>;
}

export function DocumentDetailsDrawer({
  open,
  onOpenChange,
  document,
  listType = "documents",
  onSave,
  onRouteSuccess,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [actions, setActions] = useState<any[]>(document?.actions ?? []);

  const [selectedActionInstructions, setSelectedActionInstructions] = useState<
    string[]
  >([]);
  const [otherInstructions, setOtherInstructions] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editAttachment, setEditAttachment] = useState<File | null>(null);
  const [updatingAction, setUpdatingAction] = useState(false);
  const [deletingActionId, setDeletingActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "actions" | "routing" | "timeline"
  >("overview");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [documentData, setDocumentData] = useState<any>(document);
  const [routeOffices, setRouteOffices] = useState<OfficeOption[]>([]);
  const [loadingRouteOffices, setLoadingRouteOffices] = useState(false);
  const [routingDocument, setRoutingDocument] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeForm, setRouteForm] = useState({ toOfficeId: "", remarks: "" });
  const [isEditingDocument, setIsEditingDocument] = useState(false);
  const [savingDocument, setSavingDocument] = useState(false);
  const [documentEditError, setDocumentEditError] = useState<string | null>(
    null,
  );
  const [offices, setOffices] = useState<OfficeOption[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeOption[]>([]);
  const [loadingEditOptions, setLoadingEditOptions] = useState(false);

  const [documentTypeId, setDocumentTypeId] = useState(
    documentData?.documentTypeId ?? "",
  );
  const [priority, setPriority] = useState(documentData?.priority ?? "ROUTINE");
  const [classification, setClassification] = useState(
    documentData?.classification ?? "SIMPLE",
  );
  const [confidentialityLevel, setConfidentialityLevel] = useState(
    documentData?.confidentialityLevel ?? "PUBLIC",
  );
  const [deadline, setDeadline] = useState(() =>
    toDateTimeLocal(documentData?.deadline),
  );
  const [workingDays, setWorkingDays] = useState("");
  const [responsibleOfficeId, setResponsibleOfficeId] = useState(
    documentData?.responsibleOfficeId ??
      documentData?.responsibleOffice?.id ??
      "",
  );
  const [responsiblePerson, setResponsiblePerson] = useState(
    documentData?.responsiblePerson ?? "",
  );

  const overviewTabRef = useRef<HTMLButtonElement>(null);
  const actionsTabRef = useRef<HTMLButtonElement>(null);
  const routingTabRef = useRef<HTMLButtonElement>(null);
  const timelineTabRef = useRef<HTMLButtonElement>(null);

  // Form state is initialized from the selected document. DocumentsTable
  // gives this workspace a fresh key for each open session, so no reset
  // effect (and no synchronous setState inside an effect) is necessary.

  useEffect(() => {
    if (!open || !isEditingDocument) return;

    let cancelled = false;

    const loadEditOptions = async () => {
      try {
        const [officeResult, typeResult] = await Promise.allSettled([
          api.get("/offices/accessible"),
          api.get("/document-types"),
        ]);

        if (cancelled) return;

        if (officeResult.status === "fulfilled") {
          const officeList: OfficeOption[] = officeResult.value.data ?? [];
          const uniqueOffices = Array.from(
            new Map(officeList.map((office) => [office.id, office])).values(),
          );
          setOffices(uniqueOffices);
        } else {
          console.error(
            "Failed to load accessible offices:",
            officeResult.reason,
          );
        }

        if (typeResult.status === "fulfilled") {
          setDocumentTypes(typeResult.value.data ?? []);
        } else {
          console.error("Failed to load document types:", typeResult.reason);
        }
      } finally {
        if (!cancelled) setLoadingEditOptions(false);
      }
    };

    void loadEditOptions();
    return () => {
      cancelled = true;
    };
  }, [open, isEditingDocument]);

  useEffect(() => {
    if (!open || activeTab !== "routing") return;

    let cancelled = false;

    const loadRouteOffices = async () => {
      try {
        const response = await api.get("/offices/accessible");
        if (cancelled) return;

        const officeList: OfficeOption[] = response.data ?? [];
        const uniqueOffices = Array.from(
          new Map(officeList.map((office) => [office.id, office])).values(),
        );
        setRouteOffices(uniqueOffices);
      } catch (error) {
        console.error("Failed to load routing offices:", error);
        if (!cancelled) {
          setRouteOffices([]);
          setRouteError("Unable to load accessible offices. Please try again.");
        }
      } finally {
        if (!cancelled) setLoadingRouteOffices(false);
      }
    };

    void loadRouteOffices();
    return () => {
      cancelled = true;
    };
  }, [open, activeTab]);

  const activateTab = (
    tab: "overview" | "actions" | "routing" | "timeline",
  ) => {
    if (tab === "routing" && activeTab !== "routing") {
      setLoadingRouteOffices(true);
      setRouteError(null);
    }

    setActiveTab(tab);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isEditingDocument) {
      if (event.key === "Home") {
        event.preventDefault();
        activateTab("overview");
        overviewTabRef.current?.focus();
      }
      return;
    }

    const availableTabs: Array<
      "overview" | "actions" | "routing" | "timeline"
    > = [
      "overview",
      "actions",
      ...(canRouteDocument ? ["routing" as const] : []),
      "timeline",
    ];

    const focusTab = (tab: "overview" | "actions" | "routing" | "timeline") => {
      const refs = {
        overview: overviewTabRef,
        actions: actionsTabRef,
        routing: routingTabRef,
        timeline: timelineTabRef,
      };
      refs[tab].current?.focus();
    };

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const currentIndex = availableTabs.indexOf(activeTab);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + availableTabs.length) %
        availableTabs.length;
      const nextTab = availableTabs[nextIndex];
      activateTab(nextTab);
      focusTab(nextTab);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      activateTab("overview");
      focusTab("overview");
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastTab = availableTabs[availableTabs.length - 1];
      activateTab(lastTab);
      focusTab(lastTab);
    }
  };

  if (!document) {
    return null;
  }

  const resetDocumentEditForm = () => {
    setDocumentTypeId(documentData?.documentTypeId ?? "");
    setPriority(documentData?.priority ?? "ROUTINE");
    setClassification(documentData?.classification ?? "SIMPLE");
    setConfidentialityLevel(documentData?.confidentialityLevel ?? "PUBLIC");
    setDeadline(toDateTimeLocal(documentData?.deadline));
    setWorkingDays("");
    setResponsibleOfficeId(
      documentData?.responsibleOfficeId ??
        documentData?.responsibleOffice?.id ??
        "",
    );
    setResponsiblePerson(documentData?.responsiblePerson ?? "");
    setDocumentEditError(null);
  };

  const availableDocumentTypes = Array.from(
    new Map(
      (documentTypes.length > 0
        ? documentTypes
        : documentData.documentType
          ? [
              {
                id: documentData.documentType.id,
                name: documentData.documentType.name,
              },
            ]
          : []
      ).map((item) => [item.id, item]),
    ).values(),
  );

  const availableOffices = Array.from(
    new Map(
      [
        ...offices,
        ...(documentData.responsibleOffice?.id
          ? [documentData.responsibleOffice]
          : []),
      ].map((office) => [office.id, office]),
    ).values(),
  );

  const handleSaveDocument = async () => {
    if (!canEdit) {
      setDocumentEditError(
        "Only authorized users from the Office of the Regional Director can edit this document while it is under ORD custody.",
      );
      return;
    }

    if (!documentTypeId) {
      setDocumentEditError("Document type is required.");
      return;
    }

    if (!onSave) {
      setDocumentEditError(
        "Document update is not available. Please contact your system administrator.",
      );
      return;
    }

    const payload: UpdateDocumentPayload = {
      documentTypeId,
      priority,
      classification,
      confidentialityLevel,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      responsibleOfficeId: responsibleOfficeId || null,
      responsiblePerson: responsiblePerson.trim() || null,
    };

    try {
      setSavingDocument(true);
      setDocumentEditError(null);
      await onSave(documentData.id, payload);

      const selectedType = availableDocumentTypes.find(
        (item) => item.id === documentTypeId,
      );
      const selectedOffice = availableOffices.find(
        (office) => office.id === responsibleOfficeId,
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setDocumentData((previous: any) => ({
        ...previous,
        ...payload,
        documentType: selectedType
          ? { id: selectedType.id, name: selectedType.name }
          : previous.documentType,
        responsibleOffice: selectedOffice
          ? selectedOffice
          : responsibleOfficeId
            ? previous.responsibleOffice
            : null,
      }));

      setIsEditingDocument(false);
      toast.success("Document updated successfully.");
    } catch (error) {
      console.error("Failed to update document:", error);
      setDocumentEditError("Unable to update the document. Please try again.");
      toast.error("Failed to update document.");
    } finally {
      setSavingDocument(false);
    }
  };

  const isOrdUser = user?.offices?.some(
    (item) => item.office?.officeCode === "ORD" || item.officeCode === "ORD",
  );

  const canAddAction = user?.offices?.some(
    (item) =>
      item.officeId === documentData.currentOfficeId ||
      item.office?.id === documentData.currentOfficeId,
  );

  const API_URL = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") ?? "";

  const API_URL2 = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  const officeCode = user?.offices?.[0]?.officeCode ?? "";

  const documentIsInOrd = documentData?.currentOffice?.officeCode === "ORD";

  const canEdit = Boolean(isOrdUser && documentIsInOrd);

  const canRouteDocument = Boolean(
    listType !== "outgoing" &&
    ROUTABLE_STATUSES.includes(documentData?.currentStatus?.name),
  );

  const selectedRouteOffice = routeOffices.find(
    (office) => office.id === routeForm.toOfficeId,
  );

  const handleRouteDocument = async () => {
    if (!canRouteDocument) {
      setRouteError("This document is not currently eligible for routing.");
      return;
    }

    if (!routeForm.toOfficeId) {
      setRouteError("Please select a receiving office.");
      return;
    }

    try {
      setRoutingDocument(true);
      setRouteError(null);

      await api.post(`/documents/${documentData.id}/route`, {
        toOfficeId: routeForm.toOfficeId,
        remarks: routeForm.remarks.trim(),
      });

      toast.success(
        `Document routed to ${selectedRouteOffice?.officeName ?? "the selected office"}.`,
      );
      setRouteForm({ toOfficeId: "", remarks: "" });

      // Close immediately after the route endpoint confirms success.
      // Optional data/list refreshes continue without keeping the drawer open.
      onOpenChange(false);

      // The workspace is already closed; refresh the parent list so its row
      // reflects the receiving office and new workflow status.
      try {
        await onRouteSuccess?.();
      } catch (listRefreshError) {
        // Do not report a routing failure if the route itself succeeded but the list refresh failed.
        console.warn(
          "Document routed, but the pending list refresh failed:",
          listRefreshError,
        );
      }
    } catch (error) {
      console.error("Failed to route document:", error);
      setRouteError(
        "Unable to route this document. Please review the destination and try again.",
      );
      toast.error("Failed to route document.");
    } finally {
      setRoutingDocument(false);
    }
  };

  const formatEnumLabel = (value?: string | null) => {
    if (!value) return "N/A";

    return value
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getInternalSourceLabel = (scope?: string | null) => {
    switch (scope) {
      case "LOCAL_CARAGA":
        return "Within DENR Caraga";

      case "OTHER_REGION":
        return "Other DENR Regional Office";

      case "CENTRAL_OFFICE":
        return "DENR Central Office";

      default:
        return "N/A";
    }
  };

  const getMonitoringCategoryLabel = (category?: string | null) => {
    switch (category) {
      case "PERMIT":
        return "Permit";

      case "SURVEY_RETURN":
        return "Survey Return";

      case "GENERAL":
        return "General";

      default:
        return "General";
    }
  };

  const getDocumentSender = () => {
    /*
     * INTERNAL - LOCAL CARAGA
     */
    if (
      documentData.sourceClass === "INTERNAL" &&
      documentData.internalSourceScope === "LOCAL_CARAGA"
    ) {
      return (
        documentData.senderOffice?.officeName ||
        documentData.senderOrganization ||
        documentData.senderName ||
        "N/A"
      );
    }

    /*
     * INTERNAL - OTHER REGION
     * INTERNAL - CENTRAL OFFICE
     */
    if (documentData.sourceClass === "INTERNAL") {
      return (
        documentData.senderOrganization ||
        documentData.senderOffice?.officeName ||
        documentData.senderName ||
        "N/A"
      );
    }

    /*
     * EXTERNAL
     */
    return (
      documentData.senderOrganization ||
      documentData.senderName ||
      documentData.senderOffice?.officeName ||
      "N/A"
    );
  };

  /* const handleDownloadRoutingSlip =
    async () => {
      try {
       

        const historyResponse =
          await api.get(
            `/documents/${documentData.id}/routing-slip-history`,
          );

        const routingHistory =
          historyResponse.data
            ?.routingHistory ?? [];

       

        const trackingUrl =
          `${window.location.origin}/track/${documentData.trackingNumber}`;

        const qrCode =
          await QRCode.toDataURL(
            trackingUrl,
          );

       

        await downloadRoutingSlip({
          trackingNumber:
            documentData.trackingNumber,

          title:
            documentData.title,

          description:
            documentData.description ??
            '',

          sender: getDocumentSender(),

          classification:
            documentData.classification ??
            '',

          priority:
            documentData.priority ??
            '',

          addressee:
            documentData.addressee ??
            '',

          createdAt:
            new Date(
              documentData.createdAt,
            ).toLocaleString(),

          qrCode,

          officeCode,

          documentType:
            documentData.documentType
              ?.name ?? '',

          
          routingHistory,
        });
      } catch (error) {
        console.error(
          'Failed to download routing slip:',
          error,
        );

        toast.error(
          'Failed to generate routing slip.',
        );
      }
    }; */

  const handleDownloadRoutingSlip = async () => {
    try {
      /*
        |--------------------------------------------------------------------------
        | GET COMPLETE ROUTING SLIP DATA
        |--------------------------------------------------------------------------
        */

      const historyResponse = await api.get(
        `/documents/${documentData.id}/routing-slip-history`,
      );

      const routingSlip = historyResponse.data;

      const routingDocument = routingSlip?.document;
      const routingHistory = routingSlip?.routingHistory ?? [];

      const instructions = routingSlip?.instructions ?? {
        red: [],
        ard: [],
        division: [],
      };

      /*
        |--------------------------------------------------------------------------
        | TRACKING QR CODE
        |--------------------------------------------------------------------------
        */

      const trackingUrl = `${window.location.origin}/track/${documentData.trackingNumber}`;

      const qrCode = await QRCode.toDataURL(trackingUrl, {
        margin: 1,
        width: 180,
      });

      /*
        |--------------------------------------------------------------------------
        | GENERATE ROUTING SLIP PDF
        |--------------------------------------------------------------------------
        */

      await downloadRoutingSlipV2({
        trackingNumber:
          routingSlip?.trackingNumber ?? documentData.trackingNumber,

        title: routingDocument?.title ?? documentData.title,

        description:
          routingDocument?.description ?? documentData.description ?? "",

        sender: routingDocument?.senderName ?? getDocumentSender(),

        senderOrganization: routingDocument?.senderOrganization ?? "",

        senderContact: routingDocument?.senderContact ?? "",

        senderOffice: routingDocument?.senderOffice ?? null,

        addressee: routingDocument?.addressee ?? documentData.addressee ?? "",

        referenceNumber: routingDocument?.referenceNumber ?? "",

        sourceClass: routingDocument?.sourceClass ?? "",

        internalSourceScope: routingDocument?.internalSourceScope ?? "",

        monitoringCategory: routingDocument?.monitoringCategory ?? "",

        routingProfile: routingDocument?.routingProfile ?? "",

        classification:
          routingDocument?.classification ?? documentData.classification ?? "",

        priority: routingDocument?.priority ?? documentData.priority ?? "",

        confidentialityLevel: routingDocument?.confidentialityLevel ?? "",

        deadline: routingDocument?.deadline ?? null,

        createdAt: routingDocument?.createdAt ?? documentData.createdAt,

        currentStatus: routingDocument?.currentStatus ?? null,

        currentOffice: routingDocument?.currentOffice ?? null,

        responsibleOffice: routingDocument?.responsibleOffice ?? null,

        responsiblePerson: routingDocument?.responsiblePerson ?? null,

        totalAgeDays: routingDocument?.totalAgeDays ?? 0,

        currentOfficeAgeDays: routingDocument?.currentOfficeAgeDays ?? 0,

        qrCode,

        officeCode,

        documentType: documentData.documentType?.name ?? "",

        /*
          |--------------------------------------------------------------------------
          | ROUTING HISTORY
          |--------------------------------------------------------------------------
          */

        routingHistory,

        /*
          |--------------------------------------------------------------------------
          | INSTRUCTIONS
          |--------------------------------------------------------------------------
          */

        instructions,

        /*
          |--------------------------------------------------------------------------
          | ALL ACTIONS
          |--------------------------------------------------------------------------
          */

        allActions: routingSlip?.allActions ?? [],
      });
    } catch (error) {
      console.error("Failed to download routing slip:", error);

      toast.error("Failed to generate routing slip.");
    }
  };

  const getAttachmentUrl = (filePath: string) => {
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    return `${API_URL}${filePath}`;
  };

  const handleSubmitAction = async () => {
    const selectedLabels = ACTION_INSTRUCTION_COLUMNS.flat()
      .filter((option) => selectedActionInstructions.includes(option.value))
      .map((option) => option.label);
    const additionalInstructions = otherInstructions.trim();

    const actionComment = [
      selectedLabels.length > 0 ? selectedLabels.join("\n") : "",
      additionalInstructions ? `Others:\n${additionalInstructions}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    // Preserve the existing ability to submit an attachment without text.
    if (!actionComment && !attachment) {
      return;
    }

    try {
      setSubmittingAction(true);

      const formData = new FormData();

      if (actionComment) {
        formData.append("comment", actionComment);
      }

      if (attachment) {
        formData.append("file", attachment);
      }

      const response = await fetch(
        `${API_URL2}/documents/${documentData.id}/actions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save action");
      }

      const newAction = await response.json();

      setActions((previous) => [newAction, ...previous]);
      setSelectedActionInstructions([]);
      setOtherInstructions("");
      setAttachment(null);
      toast.success("Action submitted successfully.");
    } catch (error) {
      console.error("Submit action error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit action. Please try again.",
      );
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleStartEditAction = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: any,
  ) => {
    setEditingActionId(action.id);

    setEditComment(action.comment ?? "");

    setEditAttachment(null);
  };

  const handleCancelEditAction = () => {
    setEditingActionId(null);

    setEditComment("");

    setEditAttachment(null);
  };

  const handleUpdateAction = async (actionId: string) => {
    try {
      setUpdatingAction(true);

      const formData = new FormData();

      formData.append("comment", editComment.trim());

      if (editAttachment) {
        formData.append("file", editAttachment);
      }

      const response = await api.patch(
        `/documents/${documentData.id}/actions/${actionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setActions((prev) =>
        prev.map((action) => (action.id === actionId ? response.data : action)),
      );

      toast.success("Action updated successfully.");

      handleCancelEditAction();
    } catch (error) {
      console.error("Update action failed:", error);

      toast.error("Failed to update action.");
    } finally {
      setUpdatingAction(false);
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this action?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingActionId(actionId);

      await api.delete(`/documents/${documentData.id}/actions/${actionId}`);

      setActions((prev) => prev.filter((action) => action.id !== actionId));

      toast.success("Action deleted successfully.");
    } catch (error) {
      console.error("Delete action failed:", error);

      toast.error("Failed to delete action.");
    } finally {
      setDeletingActionId(null);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && savingDocument) return;
        if (!nextOpen && isEditingDocument) {
          resetDocumentEditForm();
          setIsEditingDocument(false);
        }
        onOpenChange(nextOpen);
      }}
    >
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden border-0 bg-[#F8FAF6] p-0 transition-colors dark:bg-[#07150D] sm:!max-w-5xl"
      >
        {/* WORKSPACE HEADER: stays visible while tab content scrolls. */}
        <SheetHeader className="shrink-0 border-b border-slate-200 bg-white px-6 py-4 text-left transition-colors dark:border-[#214234] dark:bg-[#0B1F14]">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <SheetTitle className="text-xl font-black tracking-tight text-[#102418] dark:text-[#F3F8F3]">
                Document Workspace
              </SheetTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#A9C5B6]">
                Review document information, record actions, and manage its
                workflow.
              </p>
            </div>
            <Badge className="hidden shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 sm:inline-flex">
              {documentData.currentOffice?.officeName || "Current office"}
            </Badge>
          </div>
        </SheetHeader>

        {/* DOCUMENT IDENTITY: compact summary remains visible across tabs. */}
        <div className="shrink-0 px-5 pt-4 sm:px-6">
          {/* TITLE */}
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-colors dark:border-[#214234] dark:bg-[#102418]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 transition-colors dark:bg-[#173227]">
                <FileText className="h-7 w-7 text-slate-700 dark:text-[#A9C5B6]" />
              </div>

              <div className="flex-1">
                <h2 className="line-clamp-2 text-xl font-black text-slate-900 dark:text-[#F3F8F3]">
                  {documentData.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Tracking Number: {documentData.trackingNumber}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                  Sender:{"  "}
                  <span className="font-bold dark:text-[#F3F8F3]">
                    {getDocumentSender()}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {/* DOCUMENT TYPE */}
                  <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-100 dark:bg-[#173227] dark:text-[#D7E8DD]">
                    {documentData.documentType?.name || "Document"}
                  </Badge>

                  {/* STATUS */}
                  <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {formatEnumLabel(documentData.currentStatus?.name)}
                  </Badge>

                  {/* SOURCE */}
                  {documentData.sourceClass && (
                    <Badge
                      className={
                        documentData.sourceClass === "INTERNAL"
                          ? "rounded-full bg-green-100 px-3 py-1 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-300"
                          : "rounded-full bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                      }
                    >
                      {formatEnumLabel(documentData.sourceClass)}
                    </Badge>
                  )}

                  {/* SPECIAL MONITORING */}
                  {documentData.monitoringCategory &&
                    documentData.monitoringCategory !== "GENERAL" && (
                      <Badge className="rounded-full bg-amber-100 px-3 py-1 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300">
                        {getMonitoringCategoryLabel(
                          documentData.monitoringCategory,
                        )}
                      </Badge>
                    )}

                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    {canEdit && !isEditingDocument && (
                      <Button
                        size="sm"
                        onClick={() => {
                          resetDocumentEditForm();
                          setActiveTab("overview");
                          setLoadingEditOptions(true);
                          setIsEditingDocument(true);
                        }}
                        className="cursor-pointer rounded-xl"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Document
                      </Button>
                    )}
                    {canEdit && isEditingDocument && (
                      <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        Editing Document
                      </Badge>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer rounded-xl dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
                      onClick={handleDownloadRoutingSlip}
                    >
                      Download Routing Slip
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WORKSPACE TABS */}
        <div className="shrink-0 px-5 pt-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Document workspace sections"
            className={`grid h-12 w-full ${canRouteDocument ? "grid-cols-4" : "grid-cols-3"} rounded-xl border border-slate-200 bg-slate-100/90 p-1 dark:border-[#214234] dark:bg-[#102418]`}
          >
            <button
              id="document-overview-tab"
              ref={overviewTabRef}
              type="button"
              role="tab"
              aria-selected={activeTab === "overview"}
              aria-controls="document-overview-panel"
              onClick={() => activateTab("overview")}
              onKeyDown={handleTabKeyDown}
              className={`flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === "overview"
                  ? "bg-white text-[#102418] shadow-sm dark:bg-[#1B3829] dark:text-white"
                  : "text-slate-600 hover:text-[#102418] dark:text-[#A9C5B6] dark:hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" />
              Overview
            </button>
            <button
              id="document-actions-tab"
              ref={actionsTabRef}
              type="button"
              role="tab"
              aria-selected={activeTab === "actions"}
              aria-controls="document-actions-panel"
              aria-disabled={isEditingDocument}
              disabled={isEditingDocument}
              onClick={() => activateTab("actions")}
              onKeyDown={handleTabKeyDown}
              className={`flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === "actions"
                  ? "bg-white text-[#102418] shadow-sm dark:bg-[#1B3829] dark:text-white"
                  : "text-slate-600 hover:text-[#102418] dark:text-[#A9C5B6] dark:hover:text-white"
              } ${isEditingDocument ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <MessageSquare className="h-4 w-4" />
              Actions
              <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-[#294B38] dark:text-[#D7E8DD]">
                {actions.length}
              </span>
            </button>
            {canRouteDocument && (
              <button
                id="document-routing-tab"
                ref={routingTabRef}
                type="button"
                role="tab"
                aria-selected={activeTab === "routing"}
                aria-controls="document-routing-panel"
                aria-disabled={isEditingDocument}
                disabled={isEditingDocument}
                onClick={() => activateTab("routing")}
                onKeyDown={handleTabKeyDown}
                className={`flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  activeTab === "routing"
                    ? "bg-white text-[#102418] shadow-sm dark:bg-[#1B3829] dark:text-white"
                    : "text-slate-600 hover:text-[#102418] dark:text-[#A9C5B6] dark:hover:text-white"
                } ${isEditingDocument ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <Route className="h-4 w-4" />
                Routing
              </button>
            )}
            <button
              id="document-timeline-tab"
              ref={timelineTabRef}
              type="button"
              role="tab"
              aria-selected={activeTab === "timeline"}
              aria-controls="document-timeline-panel"
              aria-disabled={isEditingDocument}
              disabled={isEditingDocument}
              onClick={() => activateTab("timeline")}
              onKeyDown={handleTabKeyDown}
              className={`flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === "timeline"
                  ? "bg-white text-[#102418] shadow-sm dark:bg-[#1B3829] dark:text-white"
                  : "text-slate-600 hover:text-[#102418] dark:text-[#A9C5B6] dark:hover:text-white"
              } ${isEditingDocument ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <GitBranch className="h-4 w-4" />
              Timeline
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        <div
          id="document-overview-panel"
          role="tabpanel"
          aria-labelledby="document-overview-tab"
          hidden={activeTab !== "overview"}
          className="min-h-0 flex-1 overflow-y-auto px-5 pb-7 pt-5 sm:px-6"
        >
          {isEditingDocument ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-[#F3F8F3]">
                    Edit Document Information
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Update processing attributes and accountability while this
                    document remains under ORD custody.
                  </p>
                </div>
                <Badge className="w-fit rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  ORD Editable
                </Badge>
              </div>

              {documentEditError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                >
                  {documentEditError}
                </div>
              )}

              {loadingEditOptions && (
                <p className="text-xs text-slate-500 dark:text-[#7FA18E]">
                  Loading document types and offices...
                </p>
              )}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-[#F3F8F3]">
                      Classification & Priority
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-[#7FA18E]">
                      Processing and security attributes.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Classification</Label>
                    <Select
                      value={classification}
                      disabled={savingDocument || loadingEditOptions}
                      onValueChange={setClassification}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]">
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSIFICATIONS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Working Days</Label>
                    <Select
                      value={workingDays}
                      disabled={savingDocument || loadingEditOptions}
                      onValueChange={(value) => {
                        const days = Number(value);
                        setWorkingDays(value);
                        setDeadline(
                          toDateTimeLocal(
                            calculateWorkingDaysDeadline(days).toISOString(),
                          ),
                        );
                      }}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]">
                        <SelectValue placeholder="Select working days" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {WORKING_DAY_OPTIONS.map((days) => (
                          <SelectItem key={days} value={String(days)}>
                            {days} {days === 1 ? "Day" : "Days"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-slate-500 dark:text-[#7FA18E]">
                      Excludes Saturdays and Sundays.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={priority}
                      disabled={savingDocument || loadingEditOptions}
                      onValueChange={setPriority}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Confidentiality</Label>
                    <Select
                      value={confidentialityLevel}
                      disabled={savingDocument || loadingEditOptions}
                      onValueChange={setConfidentialityLevel}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]">
                        <SelectValue placeholder="Select confidentiality" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIDENTIALITY_LEVELS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      Document Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={documentTypeId}
                      disabled={
                        savingDocument ||
                        loadingEditOptions ||
                        availableDocumentTypes.length === 0
                      }
                      onValueChange={setDocumentTypeId}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDocumentTypes.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-[#F3F8F3]">
                      Responsibility
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-[#7FA18E]">
                      Assign an optional responsible office or person.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Responsible Office{" "}
                      <span className="text-xs font-normal text-slate-400">
                        Optional
                      </span>
                    </Label>
                    <Select
                      value={responsibleOfficeId || "NONE"}
                      disabled={savingDocument || loadingEditOptions}
                      onValueChange={(value) =>
                        setResponsibleOfficeId(value === "NONE" ? "" : value)
                      }
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]">
                        <SelectValue placeholder="Select responsible office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">
                          No responsible office
                        </SelectItem>
                        {availableOffices.map((office) => (
                          <SelectItem key={office.id} value={office.id}>
                            {office.officeName}
                            {office.officeCode ? ` (${office.officeCode})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs leading-5 text-slate-500 dark:text-[#7FA18E]">
                      Select the office accountable for the document or
                      requested action.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workspace-responsible-person">
                      Responsible Person{" "}
                      <span className="text-xs font-normal text-slate-400">
                        Optional
                      </span>
                    </Label>
                    <Input
                      id="workspace-responsible-person"
                      value={responsiblePerson}
                      disabled={savingDocument || loadingEditOptions}
                      onChange={(event) =>
                        setResponsiblePerson(event.target.value)
                      }
                      placeholder="Enter responsible person's name"
                      className="h-11 rounded-xl dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]"
                    />
                    <p className="text-xs leading-5 text-slate-500 dark:text-[#7FA18E]">
                      This can be entered even when no responsible office is
                      selected.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-[#F3F8F3]">
                      Processing Deadline
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-[#7FA18E]">
                      Set or adjust the allowed completion period.
                    </p>
                  </div>
                </div>
                <div className="max-w-md space-y-2">
                  <Label htmlFor="workspace-document-deadline">Deadline</Label>
                  <Input
                    id="workspace-document-deadline"
                    type="datetime-local"
                    value={deadline}
                    disabled={savingDocument || loadingEditOptions}
                    onChange={(event) => setDeadline(event.target.value)}
                    className="h-11 rounded-xl dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]"
                  />
                  <p className="text-xs leading-5 text-slate-500 dark:text-[#7FA18E]">
                    Leave this empty if the document does not have a fixed
                    deadline.
                  </p>
                </div>
              </section>

              <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500 dark:border-[#214234] dark:bg-[#102418] dark:text-[#7FA18E]">
                <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                Tracking number, current office, current status, sender, and
                routing history remain controlled by the system.
              </div>
            </div>
          ) : (
            <div className="space-y-7">
              {/* DESCRIPTION */}
              <div>
                <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-[#F3F8F3]">
                  Description
                </h3>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 transition-colors dark:border-[#214234] dark:bg-[#102418] dark:text-[#A9C5B6]">
                  {documentData.description || "No description"}
                </div>
              </div>

              <Separator className="dark:bg-[#214234]" />

              {/* ===================================== */}
              {/* SOURCE & MONITORING CLASSIFICATION */}
              {/* ===================================== */}

              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F8F3]">
                    Source & Monitoring
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                    Document origin, monitoring category, and routing profile.
                  </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#214234] dark:bg-[#102418]">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4">
                    {/* SOURCE CLASS */}
                    <div className="border-b border-slate-200 p-5 dark:border-[#214234] md:border-r lg:border-b-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Source
                      </p>

                      <div className="mt-2">
                        <Badge
                          className={
                            documentData.sourceClass === "INTERNAL"
                              ? "rounded-full bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-300"
                              : "rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                          }
                        >
                          {formatEnumLabel(documentData.sourceClass)}
                        </Badge>
                      </div>
                    </div>

                    {/* INTERNAL SCOPE */}
                    <div className="border-b border-slate-200 p-5 dark:border-[#214234] lg:border-b-0 lg:border-r">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Internal Source
                      </p>

                      <p className="mt-2 font-bold text-slate-900 dark:text-[#F3F8F3]">
                        {documentData.sourceClass === "INTERNAL"
                          ? getInternalSourceLabel(
                              documentData.internalSourceScope,
                            )
                          : "Not Applicable"}
                      </p>
                    </div>

                    {/* MONITORING CATEGORY */}
                    <div className="border-b border-slate-200 p-5 dark:border-[#214234] md:border-r lg:border-b-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Monitoring
                      </p>

                      <p className="mt-2 font-bold text-slate-900 dark:text-[#F3F8F3]">
                        {getMonitoringCategoryLabel(
                          documentData.monitoringCategory,
                        )}
                      </p>
                    </div>

                    {/* ROUTING PROFILE */}
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Routing Profile
                      </p>

                      <p className="mt-2 font-bold text-slate-900 dark:text-[#F3F8F3]">
                        {documentData.routingProfile ===
                        "DIRECT_TO_ACTION_OFFICE"
                          ? "Direct to Action Office"
                          : "Standard Routing"}
                      </p>
                    </div>
                  </div>

                  {/* SPECIAL DOCUMENT NOTICE */}
                  {(documentData.monitoringCategory === "PERMIT" ||
                    documentData.monitoringCategory === "SURVEY_RETURN") && (
                    <div className="border-t border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                      <div className="flex gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <div>
                          <p className="font-semibold text-amber-900 dark:text-amber-300">
                            Special Monitoring Document
                          </p>

                          <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-400">
                            This document is monitored separately and may
                            proceed directly to the responsible processing
                            office without using the standard RED / ARD routing
                            flow.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-[#F3F8F3]">
                  Sender Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* ACTUAL SENDER */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                      <div>
                        <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                          Originating Office / Sender
                        </p>

                        <p className="mt-1 font-bold text-slate-900 dark:text-[#F3F8F3]">
                          {getDocumentSender()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SENDER TYPE */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">
                    <div className="flex items-start gap-3">
                      <UserRound className="mt-0.5 h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                      <div>
                        <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                          Sender Type
                        </p>

                        <p className="mt-1 font-bold text-slate-900 dark:text-[#F3F8F3]">
                          {documentData.sourceClass === "INTERNAL"
                            ? "DENR Office"
                            : formatEnumLabel(documentData.senderType)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CONTACT PERSON */}
                  {documentData.senderName && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">
                      <div className="flex items-start gap-3">
                        <UserRound className="mt-0.5 h-5 w-5 text-slate-500" />

                        <div>
                          <p className="text-sm text-slate-500">
                            Contact Person / Sender Name
                          </p>

                          <p className="mt-1 font-bold text-slate-900 dark:text-[#F3F8F3]">
                            {documentData.senderName}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CONTACT */}
                  {documentData.senderContact && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">
                      <p className="text-sm text-slate-500">
                        Contact Information
                      </p>

                      <p className="mt-1 font-bold text-slate-900 dark:text-[#F3F8F3]">
                        {documentData.senderContact}
                      </p>
                    </div>
                  )}
                </div>
              </div>

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
                        {documentData.classification === "HIGHLY_TECHNICAL"
                          ? "HIGHLY HIGHLY_TECHNICAL"
                          : documentData.classification || "N/A"}
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
                        {document.currentOffice?.officeName}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* RESPONSIBLE OFFICE */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-[#214234] dark:bg-[#102418]">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                    <div>
                      <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                        Responsible Office
                      </p>

                      <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                        {documentData.responsibleOffice?.officeName ||
                          "Not assigned"}
                      </h4>

                      {documentData.responsibleOffice?.officeCode && (
                        <p className="mt-0.5 text-xs text-slate-400 dark:text-[#7FA18E]">
                          {documentData.responsibleOffice.officeCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* RESPONSIBLE PERSON */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-[#214234] dark:bg-[#102418]">
                  <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-slate-500 dark:text-[#A9C5B6]" />

                    <div>
                      <p className="text-sm text-slate-500 dark:text-[#A9C5B6]">
                        Responsible Person
                      </p>

                      <h4 className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                        {documentData.responsiblePerson || "Not assigned"}
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
                        {documentData.deadline
                          ? new Date(documentData.deadline).toLocaleString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )
                          : "No deadline"}
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
                        {documentData.priority || "N/A"}
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
                        {documentData.confidentialityLevel || "N/A"}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATTACHMENTS (NEW) */}
              {documentData.attachments?.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#102418] dark:text-[#F3F8F3]">
                    <Paperclip className="h-5 w-5" />
                    Attachments
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      documentData.attachments.map((file: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-[#214234] dark:bg-[#102418] dark:hover:bg-[#173227]"
                        >
                          <p className="font-medium text-slate-900 dark:text-[#F3F8F3]">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                            {file.type || "File"}
                          </p>

                          {/* optional preview hook */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 cursor-pointer dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
                            onClick={() =>
                              window.open(
                                getAttachmentUrl(file.filePath),
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                          >
                            Preview
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              <Separator className="dark:bg-[#214234]" />
            </div>
          )}
        </div>

        {/* ACTIONS TAB */}
        <div
          id="document-actions-panel"
          role="tabpanel"
          aria-labelledby="document-actions-tab"
          hidden={activeTab !== "actions"}
          className="min-h-0 flex-1 overflow-y-auto px-5 pb-7 pt-5 sm:px-6"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-[#F3F8F3]">
                Document Actions
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                Record work performed by your office and review the action
                history.
              </p>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-slate-200 bg-white text-slate-600 dark:border-[#214234] dark:bg-[#102418] dark:text-[#A9C5B6]"
            >
              {actions.length} {actions.length === 1 ? "entry" : "entries"}
            </Badge>
          </div>
          <div className="space-y-5">
            {/* ACTIONS */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-[#F3F8F3]">
                <MessageSquare className="h-5 w-5" />
                Action
              </h3>

              {canAddAction && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]">
                  {/* STANDARD ACTION INSTRUCTIONS */}
                  <div>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-[#F3F8F3]">
                          Select Action Instructions
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-[#A9C5B6]">
                          Select one or more instructions that apply to this
                          document.
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                      >
                        Multiple selection
                      </Badge>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3 sm:gap-5">
                      {ACTION_INSTRUCTION_COLUMNS.map((column, columnIndex) => (
                        <div
                          key={`instruction-column-${columnIndex}`}
                          className="space-y-2"
                        >
                          {column.map((option) => {
                            const checked = selectedActionInstructions.includes(
                              option.value,
                            );

                            return (
                              <label
                                key={option.value}
                                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-colors ${
                                  checked
                                    ? "border-emerald-300 bg-emerald-50/80 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-slate-50 dark:border-[#214234] dark:bg-[#07150D] dark:text-[#D7E8DD] dark:hover:bg-[#173227]"
                                } ${submittingAction ? "cursor-not-allowed opacity-60" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={submittingAction}
                                  onChange={(event) => {
                                    setSelectedActionInstructions((previous) =>
                                      event.target.checked
                                        ? [...previous, option.value]
                                        : previous.filter(
                                            (value) => value !== option.value,
                                          ),
                                    );
                                  }}
                                  className="h-4 w-4 shrink-0 cursor-pointer accent-emerald-600 disabled:cursor-not-allowed"
                                />
                                <span className="font-medium leading-5">
                                  {option.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OPTIONAL CUSTOM INSTRUCTIONS */}
                  <div className="mt-5 space-y-2">
                    <Label
                      htmlFor="document-action-others"
                      className="font-semibold text-slate-900 dark:text-[#F3F8F3]"
                    >
                      Others{" "}
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    </Label>
                    <Textarea
                      id="document-action-others"
                      value={otherInstructions}
                      onChange={(event) =>
                        setOtherInstructions(event.target.value)
                      }
                      placeholder="Enter any specific instructions not listed above..."
                      rows={3}
                      disabled={submittingAction}
                      className="resize-y rounded-xl border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                    />
                    <p className="text-xs text-slate-500 dark:text-[#7FA18E]">
                      Use this field only for instructions that are not covered
                      by the selections above.
                    </p>
                  </div>

                  {/* FILE */}
                  <div className="mt-4">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-[#315844] dark:text-[#A9C5B6] dark:hover:bg-[#173227]">
                      <Upload className="h-4 w-4" />

                      {attachment ? attachment.name : "Attach supporting file"}

                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          setAttachment(e.target.files?.[0] ?? null)
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
                        onClick={() => setAttachment(null)}
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
                        (selectedActionInstructions.length === 0 &&
                          !otherInstructions.trim() &&
                          !attachment)
                      }
                      onClick={handleSubmitAction}
                      className="cursor-pointer rounded-xl"
                    >
                      <Send className="mr-2 h-4 w-4" />

                      {submittingAction ? "Saving..." : "Submit Action"}
                    </Button>
                  </div>
                </div>
              )}

              {/* ACTION HISTORY */}
              <div className="mt-5 space-y-3">
                {actions.map((action) => {
                  /*
                   * Only the user who created
                   * this action can manage it.
                   */
                  const canManageAction = action.user?.id === user?.userId;

                  const isEditing = editingActionId === action.id;

                  const isDeleting = deletingActionId === action.id;

                  return (
                    <div
                      key={action.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#214234] dark:bg-[#102418]"
                    >
                      {/* ===================================== */}
                      {/* USER / DATE / ACTION BUTTONS */}
                      {/* ===================================== */}

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-[#F3F8F3]">
                            {action.user
                              ? `${action.user.firstName} ${action.user.lastName}`
                              : "User"}
                          </p>

                          {action.office?.officeName && (
                            <p className="text-xs text-slate-500 dark:text-[#A9C5B6]">
                              {action.office.officeName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400">
                            {new Date(action.createdAt).toLocaleString()}
                          </span>

                          {/* ================================= */}
                          {/* OWNER ONLY ACTIONS */}
                          {/* ================================= */}

                          {canManageAction && !isEditing && (
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-[#173227]"
                                onClick={() => handleStartEditAction(action)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={isDeleting}
                                className="h-8 w-8 cursor-pointer text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                onClick={() => handleDeleteAction(action.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ===================================== */}
                      {/* EDIT MODE */}
                      {/* ===================================== */}

                      {isEditing ? (
                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-900 dark:bg-emerald-950/10">
                          {/* COMMENT */}

                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            placeholder="Update comment..."
                            rows={4}
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]"
                          />

                          {/* CURRENT ATTACHMENT */}

                          {action.filePath && (
                            <div className="mt-3 rounded-xl bg-white px-4 py-3 dark:bg-[#173227]">
                              <p className="text-xs font-medium text-slate-500 dark:text-[#A9C5B6]">
                                Current attachment
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-slate-500" />

                                <span className="truncate text-sm text-slate-700 dark:text-[#F3F8F3]">
                                  {action.fileName ?? "Attachment"}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* NEW ATTACHMENT */}

                          <div className="mt-3">
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 transition hover:bg-white dark:border-[#315844] dark:text-[#A9C5B6] dark:hover:bg-[#173227]">
                              <Upload className="h-4 w-4" />

                              {editAttachment
                                ? editAttachment.name
                                : action.filePath
                                  ? "Replace attachment"
                                  : "Add attachment"}

                              <input
                                type="file"
                                hidden
                                onChange={(e) =>
                                  setEditAttachment(e.target.files?.[0] ?? null)
                                }
                              />
                            </label>
                          </div>

                          {/* SELECTED NEW FILE */}

                          {editAttachment && (
                            <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-4 py-3 dark:bg-[#173227]">
                              <div className="flex min-w-0 items-center gap-2">
                                <Paperclip className="h-4 w-4 shrink-0 text-slate-500" />

                                <span className="truncate text-sm text-slate-700 dark:text-[#F3F8F3]">
                                  {editAttachment.name}
                                </span>
                              </div>

                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditAttachment(null)}
                              >
                                Remove
                              </Button>
                            </div>
                          )}

                          {/* EDIT BUTTONS */}

                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={updatingAction}
                              onClick={handleCancelEditAction}
                              className="cursor-pointer rounded-xl"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>

                            <Button
                              type="button"
                              disabled={
                                updatingAction ||
                                (!editComment.trim() &&
                                  !editAttachment &&
                                  !action.filePath)
                              }
                              onClick={() => handleUpdateAction(action.id)}
                              className="cursor-pointer rounded-xl"
                            >
                              <Save className="mr-2 h-4 w-4" />

                              {updatingAction ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* ================================= */}
                          {/* NORMAL COMMENT */}
                          {/* ================================= */}

                          {action.comment && (
                            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-[#A9C5B6]">
                              {action.comment}
                            </p>
                          )}

                          {/* ================================= */}
                          {/* ATTACHMENT */}
                          {/* ================================= */}

                          {action.filePath && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-4 cursor-pointer dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]"
                              onClick={() =>
                                window.open(
                                  getAttachmentUrl(action.filePath),
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <Paperclip className="mr-2 h-4 w-4" />

                              {action.fileName ?? "View Attachment"}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ROUTING TAB */}
        {canRouteDocument && (
          <div
            id="document-routing-panel"
            role="tabpanel"
            aria-labelledby="document-routing-tab"
            hidden={activeTab !== "routing"}
            className="min-h-0 flex-1 overflow-y-auto px-5 pb-7 pt-5 sm:px-6"
          >
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <Route className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-[#F3F8F3]">
                      Route Document
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-[#A9C5B6]">
                      Forward this document to the next responsible office.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#214234] dark:bg-[#102418] sm:p-6">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#173227]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Current Office
                    </p>
                    <p className="mt-2 font-bold text-slate-900 dark:text-[#F3F8F3]">
                      {documentData.currentOffice?.officeName ??
                        "Not available"}
                    </p>
                  </div>
                  <div className="hidden text-slate-400 sm:block">
                    <Send className="h-5 w-5" />
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                      Receiving Office
                    </p>
                    <p className="mt-2 font-bold text-emerald-900 dark:text-emerald-200">
                      {selectedRouteOffice?.officeName ??
                        "Select a destination below"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label
                    htmlFor="document-route-office"
                    className="font-semibold text-slate-700 dark:text-[#D7E8DD]"
                  >
                    Route To Office <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={routeForm.toOfficeId}
                    onValueChange={(value) => {
                      setRouteForm((previous) => ({
                        ...previous,
                        toOfficeId: value,
                      }));
                      setRouteError(null);
                    }}
                    disabled={loadingRouteOffices || routingDocument}
                  >
                    <SelectTrigger
                      id="document-route-office"
                      className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3]"
                    >
                      <SelectValue
                        placeholder={
                          loadingRouteOffices
                            ? "Loading offices..."
                            : "Select receiving office"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {routeOffices.map((office) => (
                        <SelectItem key={office.id} value={office.id}>
                          {office.officeName}
                          {office.officeCode ? ` (${office.officeCode})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 dark:text-[#7FA18E]">
                    Only offices accessible to your account are listed.
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <Label
                    htmlFor="document-route-remarks"
                    className="font-semibold text-slate-700 dark:text-[#D7E8DD]"
                  >
                    Routing Instructions / Remarks{" "}
                    <span className="font-normal text-slate-400">Optional</span>
                  </Label>
                  <Textarea
                    id="document-route-remarks"
                    value={routeForm.remarks}
                    onChange={(event) =>
                      setRouteForm((previous) => ({
                        ...previous,
                        remarks: event.target.value,
                      }))
                    }
                    placeholder="Add instructions for the receiving office..."
                    rows={4}
                    disabled={routingDocument}
                    className="resize-y rounded-xl border-slate-200 bg-slate-50 dark:border-[#214234] dark:bg-[#07150D] dark:text-[#F3F8F3] dark:placeholder:text-[#7FA18E]"
                  />
                </div>

                {routeError && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                  >
                    {routeError}
                  </div>
                )}

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-200">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    The document will be routed using the existing eDATS
                    workflow. The routing activity will remain part of the
                    document history.
                  </p>
                </div>

                {loadingRouteOffices && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-[#A9C5B6]">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading
                    accessible offices...
                  </p>
                )}
                {!loadingRouteOffices &&
                  routeOffices.length === 0 &&
                  !routeError && (
                    <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">
                      No accessible destination offices were returned.
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        <div
          id="document-timeline-panel"
          role="tabpanel"
          aria-labelledby="document-timeline-tab"
          hidden={activeTab !== "timeline"}
          className="min-h-0 flex-1 overflow-y-auto px-5 pb-7 pt-5 sm:px-6"
        >
          <DocumentTimelineContent document={documentData} />
        </div>

        {/* STICKY WORKSPACE FOOTER */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white px-5 py-3 dark:border-[#214234] dark:bg-[#0B1F14] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {isEditingDocument && activeTab === "overview" ? (
            <>
              <p className="hidden max-w-md text-xs leading-5 text-slate-500 dark:text-[#7FA18E] sm:block">
                Review your changes before saving. System-controlled fields
                cannot be edited here.
              </p>
              <div className="flex justify-end gap-2 sm:ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  disabled={savingDocument}
                  onClick={() => {
                    resetDocumentEditForm();
                    setIsEditingDocument(false);
                  }}
                  className="rounded-xl dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={
                    savingDocument ||
                    loadingEditOptions ||
                    !canEdit ||
                    !documentTypeId
                  }
                  onClick={handleSaveDocument}
                  className="rounded-xl bg-[#102418] px-5 text-white hover:bg-[#183B27] dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  {savingDocument ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : activeTab === "routing" && canRouteDocument ? (
            <>
              <p className="hidden max-w-md text-xs leading-5 text-slate-500 dark:text-[#7FA18E] sm:block">
                Confirm the receiving office before routing. Remarks are
                optional.
              </p>
              <div className="flex justify-end gap-2 sm:ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  disabled={routingDocument}
                  onClick={() => {
                    setRouteForm({ toOfficeId: "", remarks: "" });
                    setRouteError(null);
                    setActiveTab("overview");
                  }}
                  className="rounded-xl dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleRouteDocument}
                  disabled={
                    routingDocument ||
                    loadingRouteOffices ||
                    !routeForm.toOfficeId ||
                    routeOffices.length === 0
                  }
                  className="rounded-xl bg-emerald-700 px-5 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  {routingDocument ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Routing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Route Document
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="hidden text-xs text-slate-500 dark:text-[#7FA18E] sm:block">
                Document activity is recorded in the workflow history.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="ml-auto rounded-xl border-slate-200 dark:border-[#214234] dark:bg-[#102418] dark:text-[#F3F8F3]"
              >
                Close Workspace
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
