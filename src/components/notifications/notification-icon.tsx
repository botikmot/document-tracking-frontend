import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
} from 'lucide-react';

export function renderNotificationIcon(
  type: string,
) {
  switch (type) {
    case 'DEADLINE':
      return (
        <div className="rounded-xl bg-red-100 p-2 text-red-600">
          <Clock3 className="h-5 w-5" />
        </div>
      );

    case 'ROUTED':
      return (
        <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
          <FileText className="h-5 w-5" />
        </div>
      );

    case 'APPROVED':
      return (
        <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      );

    default:
      return (
        <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
      );
  }
}