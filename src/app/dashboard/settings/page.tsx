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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Camera,
  Upload,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

export default function SettingsPage() {
  const [profileOpen, setProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } =
        await api.get(
          '/users/profile/me',
        );

      console.log('profile:', data)
      setUser(data);

      setFirstName(
        data.firstName,
      );

      setLastName(
        data.lastName,
      );

      setEmail(data.email);

      setUsername(
        data.username,
      );

      setMobileNumber(
        data.mobileNumber ??
          '',
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load =
      async () => {
        await fetchProfile();
      };

    void load();
  }, []);


  const handleUpdateProfile =
    async () => {
      try {
        setLoading(true);

        await api.patch(
          '/users/profile',
          {
            firstName,
            lastName,
            email,
            username,
            mobileNumber,
          },
        );

        toast.success(
          'Profile updated',
        );

        await fetchProfile();

        setProfileOpen(false);
      } catch {
        toast.error(
          'Failed to update profile',
        );
      } finally {
        setLoading(false);
      }
    };


  const handlePhotoUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      setPreviewImage(URL.createObjectURL(file),);

      try {
        setUploadingPhoto(true);

        /**
         * Delete old photo first
         */
        if (
          user?.profileImageId
        ) {
          await fetch(
            '/api/upload/delete',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify({
                publicId:
                  user.profileImageId,
              }),
            },
          );
        }

        /**
         * Upload new image
         */
        const formData =
          new FormData();

        formData.append(
          'file',
          file,
        );

        formData.append(
          'folder',
          'users/profile-pictures',
        );

        const uploadRes =
          await fetch(
            '/api/upload',
            {
              method: 'POST',
              body: formData,
            },
          );

        const uploadData =
          await uploadRes.json();
        console.log(uploadData)
        /**
         * Save image to user
         */
        await api.patch(
          '/users/profile',
          {
            profileImageUrl:
              uploadData.url,

            profileImageId:
              uploadData.public_id,
          },
        );

        toast.success(
          'Profile photo updated',
        );

        await fetchProfile();
      } catch (error) {
        console.error(error);

        toast.error(
          'Failed to upload photo',
        );
      } finally {
        setUploadingPhoto(false);

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            '';
        }
      }
    };

  const handleChangePassword =
    async () => {
      if (
        newPassword !==
        confirmPassword
      ) {
        toast.error(
          'Passwords do not match',
        );

        return;
      }

      try {
        setChangingPassword(
          true,
        );

        await api.patch(
          '/users/change-password',
          {
            currentPassword,
            newPassword,
          },
        );

        toast.success(
          'Password changed successfully',
        );

        setCurrentPassword(
          '',
        );

        setNewPassword('');

        setConfirmPassword(
          '',
        );

        setPasswordOpen(
          false,
        );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(
          error?.response?.data
            ?.message ||
            'Failed to change password',
        );
      } finally {
        setChangingPassword(
          false,
        );
      }
    };

  const passwordStrength =
    newPassword.length >= 12
      ? 'Strong'
      : newPassword.length >= 8
        ? 'Medium'
        : 'Weak';

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
              <div className="flex rounded-2xl border border-slate-100 bg-slate-50 p-5">
                 <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-green-100">
                      <AvatarImage
                        src={
                          previewImage ||
                          user?.profileImageUrl
                        }
                      />

                      <AvatarFallback className="bg-green-600 text-3xl text-white">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <Button
                      size="icon"
                      disabled={uploadingPhoto}
                      className="
                        absolute
                        bottom-5
                        right-1
                        rounded-full
                        bg-green-600
                        hover:bg-green-700
                      "
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={
                        handlePhotoUpload
                      }
                    />
                  </div>

                <div className="p-5">
                  <p className="font-semibold text-slate-900">
                    Profile Information
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Update your account information and office details.
                  </p>

                  <Button onClick={() => setProfileOpen(true)} className="mt-5 rounded-2xl bg-gradient-to-r cursor-pointer from-green-600 to-emerald-600">
                    Update Profile
                  </Button>
                </div>
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
                  className="mt-5 rounded-2xl cursor-pointer"
                  onClick={() =>
                    setPasswordOpen(true)
                  }
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

      <Dialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Update Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                value={firstName}
                onChange={(e) =>
                  setFirstName(
                    e.target.value,
                  )
                }
              />

              <Input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) =>
                  setLastName(
                    e.target.value,
                  )
                }
              />
            </div>

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value,
                )
              }
            />

            <Input
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value,
                )
              }
            />

            <Input
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(
                  e.target.value,
                )
              }
            />

            <Button
              disabled={loading}
              onClick={
                handleUpdateProfile
              }
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
            >
              {loading
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={passwordOpen}
        onOpenChange={
          setPasswordOpen
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Change Password
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={
                currentPassword
              }
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value,
                )
              }
            />

            <Input
              type="password"
              placeholder="New Password"
              value={
                newPassword
              }
              onChange={(e) =>
                setNewPassword(
                  e.target.value,
                )
              }
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value,
                )
              }
            />

            <p className="text-sm text-slate-500">
              Password Strength:
              <span className="font-medium">
                {' '}
                {passwordStrength}
              </span>
            </p>

            <Button
              disabled={
                changingPassword
              }
              onClick={
                handleChangePassword
              }
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 cursor-pointer"
            >
              {changingPassword
                ? 'Updating...'
                : 'Update Password'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </main>
  );
}