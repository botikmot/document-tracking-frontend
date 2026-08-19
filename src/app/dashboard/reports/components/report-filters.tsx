'use client';

import {
  useMemo,
} from 'react';

import {
  CalendarDays,
  FileBarChart2,
  RotateCcw,
  Search,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import {
  Input,
} from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type {
  ReportFilters as ReportFiltersType,
} from '@/types/report';

import {
  useAuthStore,
} from '@/store/auth.store';

import {
  useAccessibleOffices,
} from '@/hooks/useAccessibleOffices';

import {
  useDocumentTypes,
} from '../hooks/useDocumentTypes';

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

type Props = {
  filters: ReportFiltersType;

  setFilters: React.Dispatch<
    React.SetStateAction<ReportFiltersType>
  >;

  loading: boolean;

  onGenerate: () => Promise<void>;
};

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const STATUS_OPTIONS = [
  {
    value: 'DRAFT',
    label: 'Draft',
  },
  {
    value: 'PENDING',
    label: 'Pending',
  },
  {
    value: 'IN_TRANSIT',
    label: 'In Transit',
  },
  {
    value: 'FOR_REVIEW',
    label: 'For Review',
  },
  {
    value: 'FOR_APPROVAL',
    label: 'For Approval',
  },
  {
    value: 'ON_PROCESS',
    label: 'On Process',
  },
  {
    value: 'FOR_RELEASE',
    label: 'For Release',
  },
  {
    value: 'APPROVED',
    label: 'Approved',
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
  },
];

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export function ReportFilters({
  filters,
  setFilters,
  loading,
  onGenerate,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Current User
  |--------------------------------------------------------------------------
  */

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const currentUserOffice =
    user?.offices?.[0];

  /*
   * Support both possible auth shapes:
   *
   * {
   *   officeId,
   *   officeCode,
   *   officeName
   * }
   *
   * or:
   *
   * {
   *   officeId,
   *   office: {...}
   * }
   */

  const defaultOfficeId =
    currentUserOffice?.officeId ??
    currentUserOffice?.office?.id;

  const defaultOfficeCode =
    currentUserOffice?.officeCode ??
    currentUserOffice?.office
      ?.officeCode;

  const defaultOfficeName =
    currentUserOffice?.officeName ??
    currentUserOffice?.office
      ?.officeName;

  /*
   |--------------------------------------------------------------------------
   | ORD Permission
   |--------------------------------------------------------------------------
   */

  const isORD =
    defaultOfficeCode ===
    'ORD';

  /*
  |--------------------------------------------------------------------------
  | Lookup Data
  |--------------------------------------------------------------------------
  */

  const documentTypes =
    useDocumentTypes();

  const {
    offices,
    loading: loadingOffices,
  } = useAccessibleOffices();

  /*
  |--------------------------------------------------------------------------
  | Office Options
  |--------------------------------------------------------------------------
  |
  | Important:
  |
  | The current/default office is inserted immediately if the accessible
  | offices API has not finished loading yet.
  |
  | This means SelectValue always has a matching SelectItem and therefore
  | will not render blank.
  |
  */

  const officeOptions =
    useMemo(() => {
      const officeMap =
        new Map(
          offices.map(
            (office) => [
              office.id,
              office,
            ],
          ),
        );

      if (
        defaultOfficeId &&
        !officeMap.has(
          defaultOfficeId,
        )
      ) {
        officeMap.set(
          defaultOfficeId,
          {
            id:
              defaultOfficeId,

            officeCode:
              defaultOfficeCode ??
              '',

            officeName:
              defaultOfficeName ??
              'Office of the Regional Director',
          },
        );
      }

      return Array.from(
        officeMap.values(),
      );
    }, [
      offices,
      defaultOfficeId,
      defaultOfficeCode,
      defaultOfficeName,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Selected Reporting Office
  |--------------------------------------------------------------------------
  |
  | undefined
  |   = use logged-in user's default office
  |
  | []
  |   = All Accessible Offices
  |
  | [officeId]
  |   = explicitly selected office
  |
  */

  const selectedOfficeValue =
    filters.officeIds ===
    undefined
      ? defaultOfficeId ??
        'ALL'
      : filters.officeIds
            .length === 0
        ? 'ALL'
        : filters.officeIds[0];

  /*
  |--------------------------------------------------------------------------
  | Selected Office Label
  |--------------------------------------------------------------------------
  */

  const selectedOffice =
    selectedOfficeValue ===
    'ALL'
      ? undefined
      : officeOptions.find(
          (office) =>
            office.id ===
            selectedOfficeValue,
        );

  const selectedOfficeLabel =
    selectedOfficeValue ===
    'ALL'
      ? 'All Accessible Offices'
      : selectedOffice
        ? `${
            selectedOffice.officeName
          }${
            selectedOffice.officeCode
              ? ` (${selectedOffice.officeCode})`
              : ''
          }`
        : defaultOfficeName
          ? `${defaultOfficeName}${
              defaultOfficeCode
                ? ` (${defaultOfficeCode})`
                : ''
            }`
          : 'Select office';

  /*
  |--------------------------------------------------------------------------
  | Current Date
  |--------------------------------------------------------------------------
  */

  const currentYear =
    new Date().getFullYear();

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

  const resetFilters = () => {
    setFilters({
      type: 'monthly',

      month:
        new Date().getMonth() +
        1,

      quarter: 1,

      year:
        currentYear,

      documentTypeId:
        undefined,

      status:
        undefined,

      /*
       * Return to logged-in
       * user's default office.
       */
      officeIds:
        defaultOfficeId
          ? [defaultOfficeId]
          : undefined,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <Card
      className="
        overflow-hidden
        rounded-[32px]
        border-0
        bg-white
        shadow-xl
        transition-colors
        dark:bg-[#102418]
        dark:shadow-[0_0_35px_rgba(34,197,94,0.12)]
      "
    >
      <CardContent
        className="
          p-6
          md:p-8
        "
      >

        {/* ================================================================
            HEADER
        ================================================================= */}

        <div
          className="
            mb-8
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-blue-100
                to-indigo-100
                transition-colors
                dark:from-blue-900/30
                dark:to-indigo-900/30
              "
            >
              <FileBarChart2
                className="
                  h-7
                  w-7
                  text-indigo-600
                  dark:text-indigo-300
                "
              />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-black
                  text-[#102418]
                  dark:text-[#F3F8F3]
                "
              >
                Reports Generator
              </h2>

              <p
                className="
                  mt-0.5
                  text-sm
                  text-slate-500
                  dark:text-[#A9C5B6]
                "
              >
                Generate document tracking
                analytics and export reports.
              </p>
            </div>
          </div>

          <div
            className="
              hidden
              rounded-full
              bg-green-50
              px-4
              py-2
              text-sm
              font-medium
              text-green-700
              transition-colors
              dark:bg-green-900/30
              dark:text-green-300
              md:block
            "
          >
            Analytics Report
          </div>
        </div>

        {/* ================================================================
            PRIMARY FILTERS
        ================================================================= */}

        <div
          className="
            grid
            gap-x-4
            gap-y-5
            md:grid-cols-2
            lg:grid-cols-12
          "
        >

          {/* Report Type */}

          <div className="lg:col-span-3">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-[#D7E8DD]
              "
            >
              Report Type
            </label>

            <Select
              value={
                filters.type
              }
              onValueChange={(
                value,
              ) =>
                setFilters(
                  (prev) => ({
                    ...prev,

                    type:
                      value as ReportFiltersType['type'],
                  }),
                )
              }
            >
              <SelectTrigger
                className="
                  w-full
                  border-slate-200
                  bg-white
                  dark:border-[#214234]
                  dark:bg-[#173227]
                  dark:text-[#F3F8F3]
                "
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="
                  z-[100]
                  border-slate-200
                  bg-white
                  dark:border-[#214234]
                  dark:bg-[#102418]
                "
              >
                <SelectItem
                  value="monthly"
                  className="
                    cursor-pointer
                    dark:text-[#F3F8F3]
                    dark:focus:bg-[#173227]
                    dark:focus:text-white
                  "
                >
                  Monthly
                </SelectItem>

                <SelectItem
                  value="quarterly"
                  className="
                    cursor-pointer
                    dark:text-[#F3F8F3]
                    dark:focus:bg-[#173227]
                    dark:focus:text-white
                  "
                >
                  Quarterly
                </SelectItem>

                <SelectItem
                  value="annual"
                  className="
                    cursor-pointer
                    dark:text-[#F3F8F3]
                    dark:focus:bg-[#173227]
                    dark:focus:text-white
                  "
                >
                  Annual
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Year */}

          <div className="lg:col-span-2">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-[#D7E8DD]
              "
            >
              Year
            </label>

            <Input
              type="number"
              value={
                filters.year
              }
              onChange={(e) =>
                setFilters(
                  (prev) => ({
                    ...prev,

                    year:
                      Number(
                        e.target
                          .value,
                      ),
                  }),
                )
              }
              className="
                border-slate-200
                bg-white
                dark:border-[#214234]
                dark:bg-[#173227]
                dark:text-[#F3F8F3]
              "
            />
          </div>

          {/* Month */}

          {filters.type ===
            'monthly' && (
            <div className="lg:col-span-3">
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-[#D7E8DD]
                "
              >
                Month
              </label>

              <Select
                value={String(
                  filters.month ??
                    new Date()
                      .getMonth() +
                      1,
                )}
                onValueChange={(
                  value,
                ) =>
                  setFilters(
                    (prev) => ({
                      ...prev,

                      month:
                        Number(
                          value,
                        ),
                    }),
                  )
                }
              >
                <SelectTrigger
                  className="
                    w-full
                    border-slate-200
                    bg-white
                    dark:border-[#214234]
                    dark:bg-[#173227]
                    dark:text-[#F3F8F3]
                  "
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={6}
                  className="
                    z-[100]
                    max-h-[320px]
                    border-slate-200
                    bg-white
                    dark:border-[#214234]
                    dark:bg-[#102418]
                  "
                >
                  {MONTHS.map(
                    (
                      month,
                      index,
                    ) => (
                      <SelectItem
                        key={
                          month
                        }
                        value={String(
                          index +
                            1,
                        )}
                        className="
                          cursor-pointer
                          dark:text-[#F3F8F3]
                          dark:focus:bg-[#173227]
                          dark:focus:text-white
                        "
                      >
                        {month}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quarter */}

          {filters.type ===
            'quarterly' && (
            <div className="lg:col-span-3">
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-[#D7E8DD]
                "
              >
                Quarter
              </label>

              <Select
                value={String(
                  filters.quarter ??
                    1,
                )}
                onValueChange={(
                  value,
                ) =>
                  setFilters(
                    (prev) => ({
                      ...prev,

                      quarter:
                        Number(
                          value,
                        ),
                    }),
                  )
                }
              >
                <SelectTrigger
                  className="
                    w-full
                    border-slate-200
                    bg-white
                    dark:border-[#214234]
                    dark:bg-[#173227]
                    dark:text-[#F3F8F3]
                  "
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={6}
                  className="
                    z-[100]
                    border-slate-200
                    bg-white
                    dark:border-[#214234]
                    dark:bg-[#102418]
                  "
                >
                  <SelectItem value="1">
                    Q1
                  </SelectItem>

                  <SelectItem value="2">
                    Q2
                  </SelectItem>

                  <SelectItem value="3">
                    Q3
                  </SelectItem>

                  <SelectItem value="4">
                    Q4
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Annual Spacer */}

          {filters.type ===
            'annual' && (
            <div
              className="
                hidden
                lg:col-span-3
                lg:block
              "
            />
          )}

          {/* Actions */}

          <div
            className="
              flex
              items-end
              justify-start
              gap-3
              md:col-span-2
              lg:col-span-4
              lg:justify-end
            "
          >
            <Button
              type="button"
              variant="outline"
              onClick={
                resetFilters
              }
              className="
                cursor-pointer
                rounded-xl
                border-slate-200
                dark:border-[#214234]
                dark:bg-[#173227]
                dark:text-[#F3F8F3]
                dark:hover:bg-[#214234]
              "
            >
              <RotateCcw
                className="
                  mr-2
                  h-4
                  w-4
                "
              />

              Reset
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={() => {
                void onGenerate();
              }}
              className="
                cursor-pointer
                rounded-xl
                bg-gradient-to-r
                from-green-600
                to-emerald-600
                hover:from-green-700
                hover:to-emerald-700
                dark:shadow-[0_0_20px_rgba(34,197,94,0.25)]
              "
            >
              <Search
                className="
                  mr-2
                  h-4
                  w-4
                "
              />

              {loading
                ? 'Generating...'
                : 'Generate Report'}
            </Button>
          </div>
        </div>

        {/* ================================================================
            SECONDARY FILTERS
        ================================================================= */}

        <div
          className="
            mt-6
            grid
            gap-x-4
            gap-y-5
            md:grid-cols-2
            lg:grid-cols-12
          "
        >

          {/* Document Type */}

          <div
            className={
              isORD
                ? 'lg:col-span-4'
                : 'lg:col-span-6'
            }
          >
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-[#D7E8DD]
              "
            >
              Document Type
            </label>

            <Select
              value={
                filters.documentTypeId ??
                'ALL'
              }
              onValueChange={(
                value,
              ) =>
                setFilters(
                  (prev) => ({
                    ...prev,

                    documentTypeId:
                      value ===
                      'ALL'
                        ? undefined
                        : value,
                  }),
                )
              }
            >
              <SelectTrigger
                className="
                  w-full
                  border-slate-200
                  bg-white
                  dark:border-[#214234]
                  dark:bg-[#173227]
                  dark:text-[#F3F8F3]
                "
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="
                  z-[100]
                  max-h-[320px]
                  border-slate-200
                  bg-white
                  dark:border-[#214234]
                  dark:bg-[#102418]
                "
              >
                <SelectItem
                  value="ALL"
                  className="
                    cursor-pointer
                    dark:text-[#F3F8F3]
                    dark:focus:bg-[#173227]
                    dark:focus:text-white
                  "
                >
                  All Document Types
                </SelectItem>

                {documentTypes.map(
                  (type) => (
                    <SelectItem
                      key={
                        type.id
                      }
                      value={
                        type.id
                      }
                      className="
                        cursor-pointer
                        dark:text-[#F3F8F3]
                        dark:focus:bg-[#173227]
                        dark:focus:text-white
                      "
                    >
                      {
                        type.name
                      }
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}

          <div
            className={
              isORD
                ? 'lg:col-span-4'
                : 'lg:col-span-6'
            }
          >
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-[#D7E8DD]
              "
            >
              Status
            </label>

            <Select
              value={
                filters.status ??
                'ALL'
              }
              onValueChange={(
                value,
              ) =>
                setFilters(
                  (prev) => ({
                    ...prev,

                    status:
                      value ===
                      'ALL'
                        ? undefined
                        : value,
                  }),
                )
              }
            >
              <SelectTrigger
                className="
                  w-full
                  border-slate-200
                  bg-white
                  dark:border-[#214234]
                  dark:bg-[#173227]
                  dark:text-[#F3F8F3]
                "
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="
                  z-[100]
                  max-h-[320px]
                  border-slate-200
                  bg-white
                  dark:border-[#214234]
                  dark:bg-[#102418]
                "
              >
                <SelectItem
                  value="ALL"
                  className="
                    cursor-pointer
                    dark:text-[#F3F8F3]
                    dark:focus:bg-[#173227]
                    dark:focus:text-white
                  "
                >
                  All Status
                </SelectItem>

                {STATUS_OPTIONS.map(
                  (status) => (
                    <SelectItem
                      key={
                        status.value
                      }
                      value={
                        status.value
                      }
                      className="
                        cursor-pointer
                        dark:text-[#F3F8F3]
                        dark:focus:bg-[#173227]
                        dark:focus:text-white
                      "
                    >
                      {
                        status.label
                      }
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ================================================================
              REPORTING OFFICE
              ORD ONLY
          ================================================================= */}

          {isORD && (
            <div className="lg:col-span-4">
              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                "
              >
                <label
                  className="
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-[#D7E8DD]
                  "
                >
                  Reporting Office
                </label>

                <span
                  className="
                    rounded-full
                    bg-emerald-50
                    px-2
                    py-0.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-emerald-700
                    dark:bg-emerald-900/30
                    dark:text-emerald-300
                  "
                >
                  ORD
                </span>
              </div>

              <Select
                value={
                  selectedOfficeValue
                }
                onValueChange={(
                  value,
                ) => {
                  setFilters(
                    (prev) => ({
                      ...prev,

                      officeIds:
                        value ===
                        'ALL'
                          ? []
                          : [
                              value,
                            ],
                    }),
                  );
                }}
              >
                <SelectTrigger
                  className="
                    w-full
                    border-slate-200
                    bg-white
                    dark:border-[#214234]
                    dark:bg-[#173227]
                    dark:text-[#F3F8F3]
                  "
                >
                  {/*
                    IMPORTANT:

                    Keep SelectValue here.

                    Radix uses the selected SelectItem to position
                    the SelectContent correctly.
                  */}

                  <SelectValue
                    placeholder={
                      loadingOffices
                        ? 'Loading offices...'
                        : 'Select reporting office'
                    }
                  />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={6}
                  avoidCollisions
                  className="
                    z-[100]
                    max-h-[320px]
                    w-[var(--radix-select-trigger-width)]
                    overflow-y-auto
                    border-slate-200
                    bg-white
                    shadow-xl
                    dark:border-[#214234]
                    dark:bg-[#102418]
                  "
                >
                  <SelectItem
                    value="ALL"
                    className="
                      cursor-pointer
                      dark:text-[#F3F8F3]
                      dark:focus:bg-[#173227]
                      dark:focus:text-white
                    "
                  >
                    All Accessible Offices
                  </SelectItem>

                  {officeOptions.map(
                    (office) => (
                      <SelectItem
                        key={
                          office.id
                        }
                        value={
                          office.id
                        }
                        className="
                          cursor-pointer
                          dark:text-[#F3F8F3]
                          dark:focus:bg-[#173227]
                          dark:focus:text-white
                        "
                      >
                        {
                          office.officeName
                        }

                        {office.officeCode
                          ? ` (${office.officeCode})`
                          : ''}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <p
                className="
                  mt-1.5
                  text-xs
                  text-slate-500
                  dark:text-[#7FA18E]
                "
              >
                Scope report statistics
                and document handling by
                office.
              </p>
            </div>
          )}
        </div>

        {/* ================================================================
            REPORTING PERIOD
        ================================================================= */}

        <div
          className="
            mt-6
            flex
            flex-wrap
            items-center
            gap-x-3
            gap-y-1
            rounded-2xl
            bg-slate-50
            px-4
            py-3
            text-sm
            text-slate-600
            transition-colors
            dark:bg-[#173227]
            dark:text-[#A9C5B6]
          "
        >
          <CalendarDays
            className="
              h-4
              w-4
              shrink-0
              text-slate-500
              dark:text-[#A9C5B6]
            "
          />

          <span>
            Reporting Period:
          </span>

          <span
            className="
              font-semibold
              text-slate-900
              dark:text-[#F3F8F3]
            "
          >
            {filters.type ===
              'monthly' &&
              `${
                MONTHS[
                  (filters.month ??
                    1) - 1
                ]
              } ${
                filters.year
              }`}

            {filters.type ===
              'quarterly' &&
              `Q${
                filters.quarter
              } ${
                filters.year
              }`}

            {filters.type ===
              'annual' &&
              filters.year}

            {filters.type ===
              'custom' &&
              `${
                filters.startDate ??
                '-'
              } → ${
                filters.endDate ??
                '-'
              }`}
          </span>

          {isORD && (
            <>
              <span
                className="
                  hidden
                  h-4
                  w-px
                  bg-slate-300
                  sm:block
                  dark:bg-[#315343]
                "
              />

              <span
                className="
                  text-slate-500
                  dark:text-[#7FA18E]
                "
              >
                Office:
              </span>

              <span
                className="
                  font-semibold
                  text-slate-900
                  dark:text-[#F3F8F3]
                "
              >
                {
                  selectedOfficeLabel
                }
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}