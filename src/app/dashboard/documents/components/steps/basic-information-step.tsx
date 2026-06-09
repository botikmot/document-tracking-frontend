'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: any;
}

export function BasicInformationStep({
  form,
  setForm,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>
          Title
        </Label>

        <Input
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title:
                e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>
          Reference Number
        </Label>

        <Input
          value={
            form.referenceNumber
          }
          onChange={(e) =>
            setForm({
              ...form,
              referenceNumber:
                e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>
          Description
        </Label>

        <Textarea
          rows={5}
          value={
            form.description
          }
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}