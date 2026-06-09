'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: any;
}

export function AdditionalDetailsStep({
  form,
  setForm,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>
          Deadline
        </Label>

        <Input
          type="date"
          value={form.deadline}
          onChange={(e) =>
            setForm({
              ...form,
              deadline:
                e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>
          Priority
        </Label>

        <Input
          value={form.priority}
          onChange={(e) =>
            setForm({
              ...form,
              priority:
                e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>
          Confidentiality
        </Label>

        <Input
          value={
            form.confidentialityLevel
          }
          onChange={(e) =>
            setForm({
              ...form,
              confidentialityLevel:
                e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}