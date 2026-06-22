"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  ArrowLeft,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth,);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true)
      const data = await login(
        username,
        password,
      );

      setAuth(
        data.user,
        data.accessToken,
      );
      setLoading(false)
      router.replace('/dashboard');
    } catch (error) {
      setLoading(false)
      toast.warning('Invalid Username or Password.');
      console.error(error);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07150d]">
      {/* ========================================= */}
      {/* BACKGROUND */}
      {/* ========================================= */}
      <div className="absolute inset-0">
        <Image
          src="/images/forest-bg.jpg"
          alt="DENR Background"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-[#07150d]/95 via-[#0b1f14]/90 to-[#102418]/90" />
      </div>

      {/* GLOW EFFECTS */}
      <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* ========================================= */}
      {/* CONTENT */}
      {/* ========================================= */}
      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* ========================================= */}
        {/* LEFT SIDE */}
        {/* ========================================= */}
        <div className="hidden flex-col justify-between p-12 lg:flex">
          {/* TOP */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-100 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="mt-16 flex items-center gap-4">
              <div className="rounded-full bg-white p-2 shadow-2xl">
                <Image
                  src="/images/logo_denr.png"
                  alt="DENR"
                  width={60}
                  height={60}
                />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-wide text-white">
                  eDATS
                </h1>

                <p className="text-sm text-green-100">
                  Electronic Document Action Tracking System
                </p>
              </div>
            </div>

            <Badge className="mt-10 rounded-full border border-green-400/20 bg-green-500/10 px-5 py-2 text-green-100 hover:bg-green-500/10">
              DENR Caraga Digital Platform
            </Badge>

            <h2 className="mt-8 max-w-xl text-5xl font-black leading-tight text-white">
              Secure Access for
              DENR Personnel
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-green-50/80">
              Access the centralized document tracking and workflow management
              platform for secure monitoring, routing, and processing of
              official government records.
            </p>
          </div>

          {/* BOTTOM FEATURES */}
          <div className="grid gap-5">
            <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="rounded-2xl bg-green-500/20 p-3">
                <ShieldCheck className="h-6 w-6 text-green-300" />
              </div>

              <div>
                <h4 className="font-bold text-white">
                  Government-Grade Security
                </h4>

                <p className="mt-1 text-sm leading-7 text-green-100/70">
                  Protected access and secure document monitoring.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="rounded-2xl bg-emerald-500/20 p-3">
                <Lock className="h-6 w-6 text-emerald-300" />
              </div>

              <div>
                <h4 className="font-bold text-white">
                  Centralized Workflow
                </h4>

                <p className="mt-1 text-sm leading-7 text-green-100/70">
                  Manage routing, approvals, and records digitally.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* RIGHT SIDE */}
        {/* ========================================= */}
        <div className="flex items-center justify-center px-6 py-12">
          <Card className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl">
            {/* HEADER */}
            <div className="border-b border-white/10 bg-white/5 px-8 py-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/20">
                <Lock className="h-10 w-10 text-green-300" />
              </div>

              <h3 className="mt-6 text-center text-3xl font-black text-white">
                Welcome Back
              </h3>

              <p className="mt-3 text-center text-sm leading-7 text-green-100/70">
                Login to access the DENR eDATS management platform
              </p>
            </div>

            {/* FORM */}
            <CardContent className="space-y-6 p-8">
              {/* EMAIL */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-green-100">
                  Username
                </label>

                <div className="relative mt-1">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-800" />

                  <Input
                    type="text"
                    placeholder="Enter your username"
                    className="h-14 rounded border border-white/10 bg-white/10 pl-12 text-white placeholder:text-green-100/50 focus-visible:ring-2 focus-visible:ring-green-500"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-green-100">
                  Password
                </label>

                <div className="relative mt-1">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-800" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-14 rounded border border-white/10 bg-white/10 pl-12 pr-12 text-white placeholder:text-green-100/50 focus-visible:ring-2 focus-visible:ring-green-500"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value,
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-800 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="remember"
                    className="border-white/20"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-green-100"
                  >
                    Remember me
                  </label>
                </div>

                {/* <button className="text-sm font-medium text-green-300 transition hover:text-green-200">
                  Forgot password?
                </button> */}
              </div>

              {/* LOGIN BUTTON */}
              <Button onClick={handleLogin} className="h-14 w-full rounded cursor-pointer bg-green-600 text-base font-bold shadow-xl transition-all hover:scale-[1.01] hover:bg-green-700">
                { loading ? 'Logging in...' : 'Login to eDATS' }
              </Button>

              {/* DIVIDER */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-4 text-green-100/60">
                    Secure Government Access
                  </span>
                </div>
              </div>

              {/* FOOTER */}
              <div className="rounded-2xl border border-green-400/10 bg-green-500/10 p-4">
                <p className="text-center text-sm leading-7 text-green-100">
                  Authorized personnel only. All access and transactions are
                  monitored and protected.
                </p>
              </div>

              {/* MOBILE LOGO */}
              <div className="pt-4 text-center lg:hidden">
                <div className="flex items-center justify-center gap-3">
                  <Image
                    src="/images/logo_denr.png"
                    alt="DENR"
                    width={42}
                    height={42}
                  />

                  <div className="text-left">
                    <h4 className="font-black text-white">
                      eDATS
                    </h4>

                    <p className="text-xs text-green-100">
                      DENR Caraga
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}