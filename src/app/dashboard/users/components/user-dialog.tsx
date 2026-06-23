'use client';

import { useEffect, useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';

import { api } from '@/lib/axios';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  onSuccess: () => void;
  mode?: 'create' | 'update';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type Role = {
  id: string;
  name: string;
};

type Office = {
  id: string;
  officeName: string;
};

// ✅ helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getInitialForm = (user?: any) => ({
  //employeeId: user?.employeeId ?? '',
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  email: user?.email ?? '',
  username: user?.username ?? '',
  password: '',
  roleId: user?.roles?.[0]?.roleId ?? '',
  officeId: user?.offices?.[0]?.officeId ?? '',
  designation: user?.designation ?? '',
});

export function UserDialog({
   onSuccess,
   mode = 'create',
   user,
   open: controlledOpen,
   onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(getInitialForm(user));

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // ✅ fetch roles/offices only when open
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const [rolesRes, officesRes] = await Promise.all([
          api.get('/roles'),
          api.get('/offices'),
        ]);

        setRoles(rolesRes.data);
        setOffices(officesRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchData();
  }, [open]);

  useEffect(() => {
  if (open) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(
      getInitialForm(
        mode === 'update'
          ? user
          : undefined,
      ),
    );
  }
}, [open, user, mode]);

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const saveUser = async () => {
    try {
      setLoading(true);

      const payload = {
        //employeeId: form.employeeId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        username: form.username,
        designation: form.designation,
        roleIds: form.roleId ? [form.roleId] : [],
        officeIds: form.officeId ? [form.officeId] : [],
        ...(form.password ? { password: form.password } : {}),
      };

      if (mode === 'create') {
        await api.post('/users', payload);
      } else {
        await api.patch(`/users/${user.id}`, payload);
      }

      setOpen(false);
      await onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      {mode === 'create' && (
        <DialogTrigger asChild>
          <Button className="h-12 rounded-2xl bg-slate-900 px-6 hover:bg-slate-800">
            <Plus className="mr-2 h-5 w-5" />
            Add User
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="rounded-3xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {mode === 'create' ? 'Create User' : 'Update User'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* <div>
            <Label>Employee ID</Label>
            <Input
              value={form.employeeId}
              onChange={(e) =>
                setForm({ ...form, employeeId: e.target.value })
              }
            />
          </div> */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Role</Label>
            <select
              className="mt-2 h-11 w-full rounded-xl border px-3"
              value={form.roleId}
              onChange={(e) =>
                setForm({ ...form, roleId: e.target.value })
              }
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Office</Label>
            <select
              className="mt-2 h-11 w-full rounded-xl border px-3"
              value={form.officeId}
              onChange={(e) =>
                setForm({ ...form, officeId: e.target.value })
              }
            >
              <option value="">Select office</option>
              {offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.officeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Designation</Label>
            <Input
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
            />
          </div>

          <Button
            onClick={() => void saveUser()}
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900"
          >
            <UserPlus className="mr-2 h-5 w-5" />

            {loading
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
              ? 'Create User'
              : 'Update User'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}