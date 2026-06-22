"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';

import {
  ArrowRight,
  Clock3,
  FileCheck2,
  FileText,
  Lock,
  Search,
  ShieldCheck,
  Trees,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F7F2]">
      {/* ========================================= */}
      {/* NAVBAR */}
      {/* ========================================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1F14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-1 shadow-xl">
              <Image
                src="/images/logo_denr.png"
                alt="DENR"
                width={52}
                height={52}
              />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-wide text-white">
                eDATS+
              </h1>

              <p className="text-xs text-green-200">
                Electronic Document Action Tracking System
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-green-100 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#tracking"
              className="text-sm text-green-100 transition hover:text-white"
            >
              Track
            </a>

            <a
              href="#about"
              className="text-sm text-green-100 transition hover:text-white"
            >
              About
            </a>
          </div>

          <Link href="/login">
            <Button className="rounded-2xl cursor-pointer bg-green-600 px-6 hover:bg-green-700">
              <Lock className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* ========================================= */}
      {/* HERO SECTION */}
      {/* ========================================= */}
      <section className="relative overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">
          <Image
            src="/images/forest-bg.jpg"
            alt="DENR Background"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#07150d]/95 via-[#0b1f14]/85 to-[#0b1f14]/60" />
        </div>

        {/* GLOW EFFECTS */}
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl gap-20 px-6 py-20 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <Badge className="rounded-full border border-green-400/30 bg-green-500/10 px-5 py-2 text-green-100 backdrop-blur-md hover:bg-green-500/10">
              Digital Services
            </Badge>

            <h2 className="mt-8 text-4xl font-black text-white lg:text-6xl">
              DENR Caraga
              <span className="block text-green-400">
               Document Action
              </span>
              Tracking System+
            </h2>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-green-50/90">
              Monitor document movement, processing status, and office actions
              in real-time through a secure and modern digital tracking platform
              designed for the Department of Environment and Natural Resources.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/track">
              <Button
                size="lg"
                className="h-14 cursor-pointer rounded-2xl bg-green-600 px-8 text-base font-semibold shadow-2xl transition-all hover:scale-[1.02] hover:bg-green-700"
              >
                Track Document
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </Link>

              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 cursor-pointer rounded-2xl border-green-300/30 bg-white/10 px-8 text-base text-white backdrop-blur-md hover:bg-white/20"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* STATS */}
            {/* <div className="mt-14 grid grid-cols-3 gap-5">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                <h3 className="text-3xl font-black text-white">10K+</h3>

                <p className="mt-2 text-sm text-green-100">
                  Documents Processed
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                <h3 className="text-3xl font-black text-white">24/7</h3>

                <p className="mt-2 text-sm text-green-100">
                  Tracking Access
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                <h3 className="text-3xl font-black text-white">100%</h3>

                <p className="mt-2 text-sm text-green-100">
                  Secure Monitoring
                </p>
              </div>
            </div> */}
          </div>

          {/* TRACKING CARD */}
          <div
            id="tracking"
            className="relative"
          >
            <Card className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/10 bg-white/5 px-8 py-7">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-green-500/20 p-4">
                    <FileText className="h-8 w-8 text-green-300" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">
                      Track Your Document
                    </h3>

                    <p className="mt-1 text-sm text-green-100/80">
                      Enter your tracking reference number
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-7 p-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-green-100">
                    Tracking Number
                  </label>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-200" />

                    <Input
                      value={trackingNumber}
                      onChange={(e) =>
                        setTrackingNumber(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          router.push(`/track?tracking=${encodeURIComponent(trackingNumber)}`);
                        }
                      }}
                      placeholder="e.g. DOC-2026-000001"
                      className="h-14 rounded-2xl mt-2 border border-white/10 bg-white/10 pl-12 text-white placeholder:text-green-100/50 focus-visible:ring-2 focus-visible:ring-green-500"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    if (!trackingNumber.trim()) return;

                    router.push(`/track?tracking=${encodeURIComponent(trackingNumber)}`);
                  }}
                  className="h-14 w-full cursor-pointer rounded-2xl bg-green-600 text-base font-bold hover:bg-green-700"
                >
                  Search Document
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {/* TIMELINE */}
                <div className="rounded-3xl border border-white/10 bg-black/10 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-100/70">
                        Current Status
                      </p>

                      <h4 className="text-lg font-bold text-white">
                        Processing in Records Office
                      </h4>
                    </div>

                    <Badge className="bg-amber-400/20 text-amber-200 hover:bg-amber-400/20">
                      In Progress
                    </Badge>
                  </div>

                  <div className="space-y-7">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-4 w-4 rounded-full bg-green-400" />
                        <div className="h-16 w-[2px] bg-green-500/30" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          Document Received
                        </p>

                        <p className="mt-1 text-sm text-green-100/70">
                          May 25, 2026 • 8:45 AM
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-4 w-4 rounded-full bg-blue-400" />
                        <div className="h-16 w-[2px] bg-white/10" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          Under Review
                        </p>

                        <p className="mt-1 text-sm text-green-100/70">
                          May 26, 2026 • 2:10 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 opacity-50">
                      <div className="flex flex-col items-center">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          Ready for Release
                        </p>

                        <p className="mt-1 text-sm text-green-100/70">
                          Pending
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECURITY */}
                <div className="flex items-center gap-3 rounded-2xl border border-green-400/10 bg-green-500/10 p-4">
                  <ShieldCheck className="h-6 w-6 text-green-300" />

                  <p className="text-sm text-green-100">
                    Protected with secure government-grade document tracking
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FEATURES */}
      {/* ========================================= */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="rounded-full bg-green-100 px-4 py-1 text-green-700 hover:bg-green-100">
            System Features
          </Badge>

          <h3 className="mt-6 text-4xl font-black text-[#102418]">
            Designed for Transparency,
            Security, and Efficiency
          </h3>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Built to modernize government document monitoring and improve
            service accessibility for citizens and DENR personnel.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* CARD 1 */}
          <Card className="rounded-[32px] border-0 bg-white shadow-xl shadow-green-100/40 transition-all hover:-translate-y-2">
            <CardContent className="p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100">
                <Search className="h-8 w-8 text-green-700" />
              </div>

              <h4 className="text-2xl font-black text-[#102418]">
                Easy Tracking
              </h4>

              <p className="mt-4 leading-8 text-slate-600">
                Instantly monitor document movement using a unique tracking
                number accessible anytime and anywhere.
              </p>
            </CardContent>
          </Card>

          {/* CARD 2 */}
          <Card className="rounded-[32px] border-0 bg-white shadow-xl shadow-green-100/40 transition-all hover:-translate-y-2">
            <CardContent className="p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100">
                <ShieldCheck className="h-8 w-8 text-emerald-700" />
              </div>

              <h4 className="text-2xl font-black text-[#102418]">
                Secure Records
              </h4>

              <p className="mt-4 leading-8 text-slate-600">
                Built with secure digital handling for sensitive government
                records and internal transactions.
              </p>
            </CardContent>
          </Card>

          {/* CARD 3 */}
          <Card className="rounded-[32px] border-0 bg-white shadow-xl shadow-green-100/40 transition-all hover:-translate-y-2">
            <CardContent className="p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100">
                <Clock3 className="h-8 w-8 text-amber-700" />
              </div>

              <h4 className="text-2xl font-black text-[#102418]">
                Real-Time Updates
              </h4>

              <p className="mt-4 leading-8 text-slate-600">
                Receive live processing updates from receiving, routing,
                approval, up to release.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========================================= */}
      {/* TRUST SECTION */}
      {/* ========================================= */}
      <section
        id="about"
        className="bg-[#102418] py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
          <div>
            <Badge className="bg-green-500/20 text-green-200 hover:bg-green-500/20">
              DENR Caraga
            </Badge>

            <h3 className="mt-6 text-4xl font-black leading-tight text-white">
              Trusted Digital Platform for
              Government Document Monitoring
            </h3>

            <p className="mt-6 text-lg leading-8 text-green-50/80">
              eDATS helps improve transparency, accountability, and operational
              efficiency in handling official government documents across
              departments and offices.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-green-400" />

                <div>
                  <h4 className="text-xl font-bold text-white">
                    Secure Transactions
                  </h4>

                  <p className="mt-2 text-green-100/70">
                    Protected access and secure tracking infrastructure.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <FileCheck2 className="h-10 w-10 text-emerald-400" />

                <div>
                  <h4 className="text-xl font-bold text-white">
                    Transparent Workflow
                  </h4>

                  <p className="mt-2 text-green-100/70">
                    Monitor every stage of the document process.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <Trees className="h-10 w-10 text-lime-400" />

                <div>
                  <h4 className="text-xl font-bold text-white">
                    Environmental Digitalization
                  </h4>

                  <p className="mt-2 text-green-100/70">
                    Supporting DENR’s modern and sustainable initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-center md:flex-row">
          <div>
            <h4 className="font-black text-[#102418]">
              eDATS+
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Electronic Document Action Tracking System
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 DENR Caraga Region • Secure • Transparent • Efficient
          </p>
        </div>
      </footer>
    </main>
  );
}