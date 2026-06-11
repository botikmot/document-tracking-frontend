'use client';

import {
  Bell,
  Lock,
  Palette,
  Settings,
  Shield,
  User,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-green-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col gap-6 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-2xl">
                <Settings className="h-10 w-10" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
                  DENR eDATS
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102418]">
                  System Settings
                </h1>

                <p className="mt-2 text-slate-600">
                  Manage system preferences, security, notifications,
                  and user configurations.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="grid gap-6 p-8 lg:grid-cols-2">
          {/* PROFILE */}
          <Card className="rounded-[32px] border-0 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-black text-[#102418]">
                <User className="h-6 w-6 text-green-600" />

                Profile Settings
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">
                  Profile Information
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Update your account information and office details.
                </p>

                <Button className="mt-5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600">
                  Update Profile
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">
                  Password & Security
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Manage account password and login security.
                </p>

                <Button
                  variant="outline"
                  className="mt-5 rounded-2xl"
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SYSTEM */}
          <Card className="rounded-[32px] border-0 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-black text-[#102418]">
                <Shield className="h-6 w-6 text-blue-600" />

                System Preferences
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div>
                  <p className="font-semibold text-slate-900">
                    Email Notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive workflow and routing alerts.
                  </p>
                </div>

                <Switch />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div>
                  <p className="font-semibold text-slate-900">
                    Security Monitoring
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Enable audit and security tracking.
                  </p>
                </div>

                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div>
                  <p className="font-semibold text-slate-900">
                    Dark Mode
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Switch dashboard appearance theme.
                  </p>
                </div>

                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* SECURITY */}
          <Card className="rounded-[32px] border-0 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-black text-[#102418]">
                <Lock className="h-6 w-6 text-red-500" />

                Security & Compliance
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="font-semibold text-red-700">
                  Audit Logging
                </p>

                <p className="mt-2 text-sm text-red-600">
                  All system activities are securely logged for
                  compliance monitoring.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="font-semibold text-emerald-700">
                  Backup Status
                </p>

                <p className="mt-2 text-sm text-emerald-600">
                  Automated backup systems are currently operational.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* APPEARANCE */}
          <Card className="rounded-[32px] border-0 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-black text-[#102418]">
                <Palette className="h-6 w-6 text-purple-600" />

                Appearance & Interface
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <Bell className="h-5 w-5 text-blue-600" />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Notification Sounds
                    </p>

                    <p className="text-sm text-slate-500">
                      Enable workflow notification sounds.
                    </p>
                  </div>
                </div>

                <Switch />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">
                  Dashboard Theme
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  DENR enterprise interface theme enabled.
                </p>

                <div className="mt-5 flex gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-green-600" />

                  <div className="h-12 w-12 rounded-2xl bg-blue-600" />

                  <div className="h-12 w-12 rounded-2xl bg-slate-900" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}