'use client';

import { memo, useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Handle,
  NodeProps,
  Position,
} from 'reactflow';

import {
  Building2,
  Building,
  Landmark,
  Briefcase,
  Archive,
} from 'lucide-react';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Card,
} from '@/components/ui/card';

import type {
  OrganizationNodeData,
} from './types';

function getNodeColor(type: string) {
  switch (type) {
    case 'REGIONAL':
      return {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        badge:
          'bg-blue-600 text-white',
        icon: (
          <Landmark className="h-5 w-5" />
        ),
      };

    case 'PENRO':
      return {
        border: 'border-green-500',
        bg: 'bg-green-50',
        badge:
          'bg-green-600 text-white',
        icon: (
          <Building2 className="h-5 w-5" />
        ),
      };

    default:
      return {
        border:
          'border-orange-500',
        bg: 'bg-orange-50',
        badge:
          'bg-orange-500 text-white',
        icon: (
          <Building className="h-5 w-5" />
        ),
      };
  }
}

function OrganizationNode({
  data,
}: NodeProps<OrganizationNodeData>) {

  const [expanded, setExpanded] = useState(false);
  
  const {
    organization,
  } = data;

  const style =
    getNodeColor(
      organization.type,
    );

  const visibleOffices = expanded
    ? organization.offices
    : organization.offices.slice(0, 4);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />

      <Card
        className={`w-[280px] overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${style.border}`}
      >
        {/* HEADER */}

        <div
          className={`flex items-center justify-between px-5 py-4 ${style.bg}`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2 shadow">
              {style.icon}
            </div>

            <div>
              <p className="text-lg font-bold leading-tight">
                {
                  organization.name
                }
              </p>

              <p className="text-xs text-slate-500">
                {
                  organization.code
                }
              </p>
            </div>
          </div>

          <Badge
            className={
              style.badge
            }
          >
            {
              organization.type
            }
          </Badge>
        </div>

        {/* BODY */}

        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Offices
            </span>

            <Badge variant="secondary">
              {
                organization.offices
                  ?.length ?? 0
              }
            </Badge>
          </div>

          <div className="space-y-2">
            {visibleOffices.map(
                (
                  office,
                ) => (
                  <div
                    key={
                      office.id
                    }
                    className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2"
                  >
                    {office.category ===
                    'RECORDS' ? (
                      <Archive className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Briefcase className="h-4 w-4 text-slate-500" />
                    )}

                    <span className="truncate text-sm">
                      {
                        office.officeName
                      }
                    </span>
                  </div>
                ),
              )}

            {organization.offices &&
              organization.offices
                .length > 4 && (
                <Popover>
                    <PopoverTrigger asChild>
                    <button
                        className="w-full rounded-lg border border-dashed border-blue-200 bg-blue-50 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                        +{organization.offices.length - 4} more offices
                    </button>
                    </PopoverTrigger>

                    <PopoverContent
                    align="start"
                    side="right"
                    className="w-80 rounded-2xl"
                    >
                    <div className="space-y-3">
                        {/* <h4 className="font-semibold">
                        Remaining Offices
                        </h4> */}

                        <div className="space-y-2">

                        {organization.offices
                            .slice(4)
                            .map((office) => (
                            <div
                                key={office.id}
                                className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3"
                            >
                                {office.category === "RECORDS" ? (
                                <Archive className="h-4 w-4 text-purple-600" />
                                ) : (
                                <Briefcase className="h-4 w-4 text-slate-500" />
                                )}

                                <div>
                                <p className="text-sm font-medium">
                                    {office.officeName}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {office.officeCode}
                                </p>
                                </div>
                            </div>
                            ))}

                        </div>
                    </div>
                    </PopoverContent>
                </Popover>
              )}
          </div>
        </div>
      </Card>

      <Handle
        type="source"
        position={
          Position.Bottom
        }
      />
    </>
  );
}

export default memo(
  OrganizationNode,
);