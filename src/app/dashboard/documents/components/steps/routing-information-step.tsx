'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: any;
}

export function RoutingInformationStep({
  form,
  setForm,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>
          Route To Office
        </Label>

        <Input
          value={
            form.routeToOfficeId
          }
          onChange={(e) =>
            setForm({
              ...form,
              routeToOfficeId:
                e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>
          Remarks
        </Label>

        <Textarea
          rows={4}
          value={form.remarks}
          onChange={(e) =>
            setForm({
              ...form,
              remarks:
                e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}