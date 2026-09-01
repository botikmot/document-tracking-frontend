import {
  Building2,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type {
  TransactionOfficeSummary,
  TransactionQuery,
} from '@/types/transaction';

import {
  OfficeTransactionRow,
} from './office-transaction-row';

type OfficeTransactionsTableProps = {
  offices:
    TransactionOfficeSummary[];

  query:
    TransactionQuery;

  onDocumentClick:
    (
      documentId: string,
    ) => void;
};

export function OfficeTransactionsTable({
  offices,
  query,
  onDocumentClick,
}: OfficeTransactionsTableProps) {
  return (
    <Card
      className="
        overflow-hidden
        rounded-[30px]
        border-slate-200
        shadow-sm
        dark:border-[#214234]
        dark:bg-[#102418]
      "
    >
      <CardHeader
        className="
          border-b
          border-slate-100
          dark:border-[#214234]
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-emerald-100
              text-emerald-700
              dark:bg-emerald-950/40
              dark:text-emerald-300
            "
          >
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <CardTitle
              className="
                text-2xl
                font-black
                text-[#102418]
                dark:text-[#F3F8F3]
              "
            >
              Office Transactions
            </CardTitle>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-slate-500
                dark:text-[#A9C5B6]
              "
            >
              Regional Office
              transaction workload,
              status, and performance
              by office.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {offices.length ===
        0 ? (
          <div className="py-20 text-center">
            <Building2
              className="
                mx-auto
                h-8
                w-8
                text-slate-300
                dark:text-[#7FA18E]
              "
            />

            <p
              className="
                mt-4
                font-bold
                text-[#102418]
                dark:text-[#F3F8F3]
              "
            >
              No office transactions
              found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="
                min-w-[1450px]
                w-full
                text-left
              "
            >
              <thead>
                <tr
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                    dark:border-[#214234]
                    dark:bg-[#173227]
                    dark:text-[#A9C5B6]
                  "
                >
                  <th className="min-w-[280px] px-4 py-4">
                    Office
                  </th>

                  <th className="px-3 py-4 text-center">
                    Total
                  </th>

                  <th className="px-3 py-4 text-center">
                    Internal
                  </th>

                  <th className="px-3 py-4 text-center">
                    External
                  </th>

                  <th className="px-3 py-4 text-center">
                    Permits
                  </th>

                  <th className="px-3 py-4 text-center">
                    Survey Returns
                  </th>

                  <th className="px-3 py-4 text-center">
                    Pending
                  </th>

                  <th className="px-3 py-4 text-center">
                    Process
                  </th>

                  <th className="px-3 py-4 text-center">
                    Review
                  </th>

                  <th className="px-3 py-4 text-center">
                    Approval
                  </th>

                  <th className="px-3 py-4 text-center text-red-600 dark:text-red-400">
                    Overdue
                  </th>

                  <th className="px-3 py-4 text-center">
                    Acted
                  </th>
                </tr>
              </thead>

              <tbody>
                {offices.map(
                  (office) => (
                    <OfficeTransactionRow
                      key={
                        office.officeId
                      }
                      office={
                        office
                      }
                      query={
                        query
                      }
                      onDocumentClick={
                        onDocumentClick
                      }
                    />
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}