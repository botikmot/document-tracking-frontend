"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                GovTrack Portal
              </h1>
              <p className="text-xs text-slate-500">
                Document Tracking Management System
              </p>
            </div>
          </div>

          <Link href="/login">
            <Button
              className="rounded-xl cursor-pointer bg-slate-900 px-6 hover:bg-slate-800"
            >
              <Lock className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-slate-200/40 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          {/* LEFT CONTENT */}
          <div>
            <Badge className="rounded-full bg-slate-100 px-4 py-1 text-slate-700 hover:bg-slate-100">
              Government Office Digital Services
            </Badge>

            <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-900">
              Track Your
              <span className="block text-blue-600">
                Official Documents
              </span>
              In Real-Time
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Easily monitor the status of your submitted documents using your
              tracking number. Fast, transparent, and secure document tracking
              for citizens and government offices.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">
                  Secure Tracking
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm">
                <Clock3 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  Real-Time Updates
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  Reliable Processing
                </span>
              </div>
            </div>
          </div>

          {/* TRACKING CARD */}
          <div className="relative">
            <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-2xl shadow-slate-200/60">
              <div className="bg-slate-900 px-8 py-6 text-white">
                <h3 className="text-2xl font-bold">
                  Track Your Document
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Enter your tracking number below
                </p>
              </div>

              <CardContent className="space-y-6 p-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Tracking Number
                  </label>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      value={trackingNumber}
                      onChange={(e) =>
                        setTrackingNumber(e.target.value)
                      }
                      placeholder="e.g. DOC-2026-001245"
                      className="h-14 rounded-2xl border-slate-200 pl-12 text-base focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                <Button className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold hover:bg-blue-700">
                  Track Document
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {/* SAMPLE STATUS */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Sample Status
                      </p>
                      <h4 className="font-bold text-slate-900">
                        Processing in Records Office
                      </h4>
                    </div>

                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                      In Progress
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

                      <div>
                        <p className="font-medium text-slate-800">
                          Document Received
                        </p>
                        <p className="text-sm text-slate-500">
                          May 25, 2026 - 8:45 AM
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />

                      <div>
                        <p className="font-medium text-slate-800">
                          Under Review
                        </p>
                        <p className="text-sm text-slate-500">
                          May 26, 2026 - 2:10 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 opacity-50">
                      <div className="mt-1 h-3 w-3 rounded-full bg-slate-300" />

                      <div>
                        <p className="font-medium text-slate-700">
                          Ready for Release
                        </p>
                        <p className="text-sm text-slate-500">
                          Pending
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-14 text-center">
          <h3 className="text-3xl font-black text-slate-900">
            Why Use GovTrack?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Designed for efficiency, transparency, and convenience for both
            citizens and government offices.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-3xl border-0 bg-white shadow-lg shadow-slate-100">
            <CardContent className="p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <Search className="h-7 w-7 text-blue-600" />
              </div>

              <h4 className="text-xl font-bold text-slate-900">
                Easy Tracking
              </h4>

              <p className="mt-3 leading-7 text-slate-600">
                Quickly check the status of your documents anytime using your
                unique tracking number.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-white shadow-lg shadow-slate-100">
            <CardContent className="p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                <ShieldCheck className="h-7 w-7 text-emerald-600" />
              </div>

              <h4 className="text-xl font-bold text-slate-900">
                Secure System
              </h4>

              <p className="mt-3 leading-7 text-slate-600">
                Built with security and privacy in mind for sensitive government
                documents and records.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-white shadow-lg shadow-slate-100">
            <CardContent className="p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                <Clock3 className="h-7 w-7 text-amber-600" />
              </div>

              <h4 className="text-xl font-bold text-slate-900">
                Faster Updates
              </h4>

              <p className="mt-3 leading-7 text-slate-600">
                Citizens receive real-time progress updates from receiving up to
                release.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center md:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 GovTrack Document Tracking System
          </p>

          <p className="text-sm text-slate-500">
            Secure • Transparent • Efficient
          </p>
        </div>
      </footer>
    </main>
  );
}