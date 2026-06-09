'use client';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

export function ReviewConfirmStep({
  form,
}: Props) {
  return (
    <div className="space-y-4 rounded-2xl border p-6">
      <div>
        <strong>
          Title:
        </strong>{' '}
        {form.title}
      </div>

      <div>
        <strong>
          Reference:
        </strong>{' '}
        {
          form.referenceNumber
        }
      </div>

      <div>
        <strong>
          Priority:
        </strong>{' '}
        {form.priority}
      </div>

      <div>
        <strong>
          Deadline:
        </strong>{' '}
        {form.deadline}
      </div>

      <div>
        <strong>
          Route To:
        </strong>{' '}
        {
          form.routeToOfficeId
        }
      </div>
    </div>
  );
}