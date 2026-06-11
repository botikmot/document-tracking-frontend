'use client';

import { useState } from 'react';

import {
  CalendarDays,
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

export default function CreateDocumentDialog() {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        /*
         |----------------------------------------
         | SUBMIT API HERE
         |----------------------------------------
         */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1500,
            ),
        );

        setOpen(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
                />
              </div>

              {/* REFERENCE */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  Reference Number
                </Label>

                <Input
                  placeholder="REF-2026-001"
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                />
              </div>

              {/* DEADLINE */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deadline
                </Label>

                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="date"
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-12"
                  />
                </div>
              </div>
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

                <Select>
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
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
              </div>

              {/* PRIORITY */}
              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  Priority Level
                </Label>

                <Select>
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="low">
                      Low
                    </SelectItem>

                    <SelectItem value="medium">
                      Medium
                    </SelectItem>

                    <SelectItem value="high">
                      High
                    </SelectItem>

                    <SelectItem value="urgent">
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

                <Select>
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="public">
                      Public
                    </SelectItem>

                    <SelectItem value="internal">
                      Internal
                    </SelectItem>

                    <SelectItem value="restricted">
                      Restricted
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
                Drag and drop files here or browse documents for
                upload. Supported formats include PDF, DOCX, XLSX,
                and image files.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-6 rounded-2xl border-green-300 bg-white"
              >
                Browse Files
              </Button>
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