'use client';

import {
  useEffect,
  useState,
} from 'react';

import { api } from '@/lib/axios';

import {
  Building2,
  Shield,
} from 'lucide-react';

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

interface Props {
  onSuccess: () => void;
}

interface OrganizationUnit {
  id: string;
  name: string;
  type: string;
}

export default function CreateOfficeDialog({
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  const [organizations, setOrganizations] =
    useState<OrganizationUnit[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      officeCode: '',
      officeName: '',
      organizationUnitId: '',
      category: 'REGULAR',
      description: '',
    });

  const fetchOrganizations =
    async () => {
      try {
        const response = await api.get(
          '/organization-units',
        );
        console.log('organization units:', response)
        setOrganizations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    const load =
      async () => {
        await fetchOrganizations();
      };

    void load();
  }, []);


  const handleSubmit = async () => {
    try {
      setLoading(true);

      await api.post(
        '/offices',
        formData,
      );

      onSuccess();

      setOpen(false);

      setFormData({
        officeCode: '',
        officeName: '',
        organizationUnitId: '',
        category: 'REGULAR',
        description: '',
      });
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
        <Button className="gap-2">
          <Building2 className="size-4" />
          Add Office
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create Office
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* OFFICE CODE */}

          <div className="space-y-2">
            <Label>
              Office Code
            </Label>

            <Input
              placeholder="e.g. PENRO-ADN-Records"
              value={
                formData.officeCode
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  officeCode:
                    e.target.value,
                })
              }
            />
          </div>

          {/* OFFICE NAME */}

          <div className="space-y-2">
            <Label>
              Office Name
            </Label>

            <Input
              placeholder="Enter office name"
              value={
                formData.officeName
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  officeName:
                    e.target.value,
                })
              }
            />
          </div>

          {/* ORGANIZATION */}

          <div className="space-y-2">
            <Label>
              Organization Unit
            </Label>

            <select
              className="w-full rounded-md border bg-background px-3 py-2"
              value={
                formData.organizationUnitId
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  organizationUnitId:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select organization
              </option>

              {organizations.map(
                (organization) => (
                  <option
                    key={
                      organization.id
                    }
                    value={
                      organization.id
                    }
                  >
                    {
                      organization.name
                    }{' '}
                    (
                    {
                      organization.type
                    }
                    )
                  </option>
                ),
              )}
            </select>
          </div>

          {/* CATEGORY */}

          <div className="space-y-2">
            <Label>
              Office Category
            </Label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    category:
                      'REGULAR',
                  })
                }
                className={`rounded-xl border p-4 text-left transition ${
                  formData.category ===
                  'REGULAR'
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
              >
                <Building2 className="mb-2 size-5" />

                <p className="font-medium">
                  Regular Office
                </p>

                <p className="text-sm text-muted-foreground">
                  Standard office
                  within organization
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    category:
                      'RECORDS',
                  })
                }
                className={`rounded-xl border p-4 text-left transition ${
                  formData.category ===
                  'RECORDS'
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
              >
                <Shield className="mb-2 size-5" />

                <p className="font-medium">
                  Records Office
                </p>

                <p className="text-sm text-muted-foreground">
                  Handles routing
                  and document
                  transfers
                </p>
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="space-y-2">
            <Label>
              Description
            </Label>

            <textarea
              className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2"
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
            />
          </div>

          {/* SUBMIT */}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'Creating Office...'
              : 'Create Office'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}