'use client';

import {
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';

import {
  useState,
} from 'react';

import {
  useTransactionOfficeDocuments,
} from '@/hooks/use-transactions';

import type {
  TransactionBucket,
  TransactionOfficeSummary,
  TransactionQuery,
} from '@/types/transaction';

import {
  OfficeDocumentsTable,
} from './office-documents-table';

type OfficeTransactionRowProps = {
  office:
    TransactionOfficeSummary;

  query:
    TransactionQuery;

  onDocumentClick:
    (
      documentId: string,
    ) => void;
};

export function OfficeTransactionRow({
  office,
  query,
  onDocumentClick,
}: OfficeTransactionRowProps) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(false);

  const [
    bucket,
    setBucket,
  ] =
    useState<TransactionBucket>(
      'ALL',
    );

  const [
    page,
    setPage,
  ] =
    useState(1);

  const {
    data,
    isLoading,
    error,
  } =
    useTransactionOfficeDocuments(
      office.officeId,

      {
        ...query,

        bucket,

        page,

        limit: 10,
      },

      expanded,
    );

  /*
  |--------------------------------------------------------------------------
  | EXPAND WHOLE ROW
  |--------------------------------------------------------------------------
  */

  const handleRowClick =
    () => {
      if (!expanded) {
        setBucket('ALL');
        setPage(1);
      }

      setExpanded(
        (value) =>
          !value,
      );
    };

  /*
  |--------------------------------------------------------------------------
  | CLICK COUNT
  |--------------------------------------------------------------------------
  */

  const openBucket = (
    nextBucket:
      TransactionBucket,
  ) => {
    setBucket(
      nextBucket,
    );

    setPage(1);

    setExpanded(true);
  };

  const countButtonClass =
    `
      cursor-pointer
      rounded-lg
      px-2
      py-1
      font-bold
      transition-colors
      hover:bg-emerald-100
      hover:text-emerald-800
      dark:hover:bg-emerald-950/40
      dark:hover:text-emerald-300
    `;

  return (
    <>
      <tr
        className="
          border-b
          border-slate-100
          transition-colors
          hover:bg-slate-50
          dark:border-[#214234]
          dark:hover:bg-[#173227]
        "
      >
        {/* OFFICE */}

        <td className="px-4 py-4">
          <button
            type="button"
            onClick={
              handleRowClick
            }
            className="
              flex
              cursor-pointer
              items-center
              gap-3
              text-left
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-100
                text-emerald-700
                dark:bg-emerald-950/40
                dark:text-emerald-300
              "
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>

            <div>
              <p
                className="
                  font-bold
                  text-[#102418]
                  dark:text-[#F3F8F3]
                "
              >
                {
                  office.officeName
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  font-medium
                  text-slate-500
                  dark:text-[#A9C5B6]
                "
              >
                {
                  office.officeCode
                }
              </p>
            </div>
          </button>
        </td>

        {/* TOTAL */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'ALL',
              )
            }
            className={
              countButtonClass
            }
          >
            {office.total}
          </button>
        </td>

        {/* INTERNAL */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'INTERNAL',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.internal
            }
          </button>
        </td>

        {/* EXTERNAL */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'EXTERNAL',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.external
            }
          </button>
        </td>

        {/* PERMIT */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'PERMIT',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.permits
            }
          </button>
        </td>

        {/* SURVEY */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'SURVEY_RETURN',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.surveyReturns
            }
          </button>
        </td>

        {/* PENDING */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'PENDING',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.pending
            }
          </button>
        </td>

        {/* PROCESS */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'ON_PROCESS',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.onProcess
            }
          </button>
        </td>

        {/* REVIEW */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'FOR_REVIEW',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.forReview
            }
          </button>
        </td>

        {/* APPROVAL */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'FOR_APPROVAL',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.forApproval
            }
          </button>
        </td>

        {/* OVERDUE */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'OVERDUE',
              )
            }
            className="
              cursor-pointer
              rounded-lg
              bg-red-50
              px-2
              py-1
              font-black
              text-red-700
              transition-colors
              hover:bg-red-100
              dark:bg-red-950/30
              dark:text-red-300
              dark:hover:bg-red-950/50
            "
          >
            {
              office.overdue
            }
          </button>
        </td>

        {/* ACTED */}

        <td className="px-3 py-4 text-center">
          <button
            type="button"
            onClick={() =>
              openBucket(
                'ACTED',
              )
            }
            className={
              countButtonClass
            }
          >
            {
              office.acted
            }
          </button>
        </td>
      </tr>

      {/* EXPANDED */}

      {expanded && (
        <tr>
          <td
            colSpan={12}
            className="
              border-b
              border-emerald-100
              bg-emerald-50/30
              p-0
              dark:border-[#214234]
              dark:bg-[#0D1F15]
            "
          >
            <div className="p-4 md:p-5">
              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  dark:border-[#214234]
                  dark:bg-[#102418]
                "
              >
                {/* EXPANDED HEADER */}

                <div
                  className="
                    flex
                    flex-col
                    gap-2
                    border-b
                    border-slate-100
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    dark:border-[#214234]
                  "
                >
                  <div>
                    <p
                      className="
                        font-bold
                        text-[#102418]
                        dark:text-[#F3F8F3]
                      "
                    >
                      {
                        office.officeName
                      }{' '}
                      Documents
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                        dark:text-[#A9C5B6]
                      "
                    >
                      Filter:{' '}
                      <strong>
                        {
                          bucket.replaceAll(
                            '_',
                            ' ',
                          )
                        }
                      </strong>
                    </p>
                  </div>

                  {isLoading && (
                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                        text-emerald-600
                      "
                    />
                  )}
                </div>

                {error ? (
                  <div
                    className="
                      px-5
                      py-10
                      text-center
                      text-sm
                      text-red-600
                      dark:text-red-400
                    "
                  >
                    {error}
                  </div>
                ) : data ? (
                  <OfficeDocumentsTable
                    data={data}
                    isLoading={
                      isLoading
                    }
                    onDocumentClick={
                      onDocumentClick
                    }
                    onPageChange={
                      setPage
                    }
                  />
                ) : (
                  <div
                    className="
                      py-10
                      text-center
                      text-sm
                      text-slate-500
                      dark:text-[#A9C5B6]
                    "
                  >
                    Loading office
                    documents...
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}