'use client';

import { useMemo, useState } from 'react';

import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

type ReportDocument = {
  id: string;
  trackingNumber: string;
  title: string;
  documentType: string;
  status: string;
  office: string;
  priority?: string;
  createdAt: string;
  deadline?: string;
};

type Props = {
  loading: boolean;
  documents: ReportDocument[];
};

const PAGE_SIZE = 10;

export function ReportsTable({
  documents,
}: Props) {
  const [search, setSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [sortAsc, setSortAsc] =
    useState(false);

  /*
   |-------------------------------------------------------------
   | FILTER
   |-------------------------------------------------------------
   */

  const filtered =
    useMemo(() => {
      let rows =
        documents.filter(
          (doc) =>
            doc.title
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              ) ||
            doc.trackingNumber
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              ) ||
            doc.office
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              ),
        );

      rows = rows.sort(
        (a, b) => {
          const first =
            new Date(
              a.createdAt,
            ).getTime();

          const second =
            new Date(
              b.createdAt,
            ).getTime();

          return sortAsc
            ? first - second
            : second - first;
        },
      );

      return rows;
    }, [
      documents,
      search,
      sortAsc,
    ]);

  /*
   |-------------------------------------------------------------
   | PAGINATION
   |-------------------------------------------------------------
   */

  const totalPages =
    Math.ceil(
      filtered.length /
        PAGE_SIZE,
    );

  const rows =
    filtered.slice(
      (page - 1) *
        PAGE_SIZE,

      page * PAGE_SIZE,
    );

  /*
   |-------------------------------------------------------------
   | BADGE COLOR
   |-------------------------------------------------------------
   */

  function statusBadge(
    status: string,
  ) {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';

      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';

      case 'FOR_REVIEW':
        return 'bg-blue-100 text-blue-700';

      case 'RETURNED':
        return 'bg-red-100 text-red-700';

      case 'IN_TRANSIT':
        return 'bg-indigo-100 text-indigo-700';

      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  return (
    <Card className="rounded-[32px] border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-black">
          Report Documents
        </CardTitle>

        <div className="flex gap-3">
          <Input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
            placeholder="Search..."
            className="w-72 rounded-xl"
          />

          <Button
            variant="outline"
            onClick={() =>
              setSortAsc(
                !sortAsc,
              )
            }
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />

            Date
          </Button>
        </div>
      </CardHeader>

      <CardContent>

        <div className="overflow-x-auto rounded-2xl border">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left">
                  Tracking
                </th>

                <th className="px-5 py-4 text-left">
                  Title
                </th>

                <th className="px-5 py-4 text-left">
                  Type
                </th>

                <th className="px-5 py-4 text-left">
                  Office
                </th>

                <th className="px-5 py-4 text-left">
                  Status
                </th>

                <th className="px-5 py-4 text-left">
                  Priority
                </th>

                <th className="px-5 py-4 text-left">
                  Deadline
                </th>

                {/* <th className="px-5 py-4 text-left">
                  Created By
                </th> */}

              </tr>

            </thead>

            <tbody>

              {rows.map((doc) => (

                <tr
                  key={doc.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-5 py-4 font-semibold">
                    {doc.trackingNumber}
                  </td>

                  <td className="px-5 py-4">
                    {doc.title}
                  </td>

                  <td className="px-5 py-4">
                    {doc.documentType}
                  </td>

                  <td className="px-5 py-4">
                    {doc.office}
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      className={statusBadge(
                        doc.status,
                      )}
                    >
                      {
                        doc.status
                      }
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    {doc.priority ??
                      '-'}
                  </td>

                  <td className="px-5 py-4">
                    {doc.deadline
                      ? new Date(
                          doc.deadline,
                        ).toLocaleDateString()
                      : '-'}
                  </td>

                  {/* <td className="px-5 py-4">
                    {
                      doc.createdBy
                        .firstName
                    }{' '}
                    {
                      doc.createdBy
                        .lastName
                    }
                  </td> */}

                </tr>

              ))}

              {rows.length ===
                0 && (

                <tr>

                  <td
                    colSpan={8}
                    className="py-16 text-center text-slate-500"
                  >
                    No documents found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="mt-6 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            Showing{' '}
            {rows.length} of{' '}
            {filtered.length}
          </p>

          <div className="flex gap-3">

            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() =>
                setPage(
                  page - 1,
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="flex items-center px-4 text-sm font-semibold">
              {page} /{' '}
              {totalPages || 1}
            </span>

            <Button
              variant="outline"
              disabled={
                page >=
                totalPages
              }
              onClick={() =>
                setPage(
                  page + 1,
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

          </div>

        </div>

      </CardContent>
    </Card>
  );
}