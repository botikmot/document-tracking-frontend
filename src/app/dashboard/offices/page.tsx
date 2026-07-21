'use client';

import {
  useEffect,
  useState,
} from 'react';
import { api } from '@/lib/axios';
import type {
  Office,
} from '@/types/office';
import {
  RoleGuard,
} from '@/components/auth/role-guard';
import { OfficeHeader } from './components/office-header';
import { OfficeStats } from './components/office-stats';
import { OfficeList } from './components/office-list';
import { OrganizationChart } from './components/organization-chart';
import type { OrganizationUnit } from './components/organization-chart';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Building2,
  GitBranch,
} from "lucide-react";

export default function OfficesPage() {
  const [offices, setOffices] =
    useState<Office[]>([]);

  const [
    organizationUnits,
    setOrganizationUnits,
  ] = useState<
    OrganizationUnit[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const fetchData =
    async () => {
      try {
        const [
          officesRes,
          organizationsRes,
        ] =
          await Promise.all([
            api.get('/offices'),
            api.get(
              '/organization-units',
            ),
          ]);

        setOffices(
          officesRes.data,
        );
        console.log(' officesRes:',officesRes)
        console.log(' organizationsRes:',organizationsRes)
        setOrganizationUnits(
          organizationsRes.data,
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };

    void load();
  }, []);

  return (
    <RoleGuard
      allowedRoles={[
        'SUPER_ADMIN',
      ]}
    >
      <main className="flex-1 overflow-hidden">
        {/* HEADER */}
        <OfficeHeader
          offices={offices}
          organizationUnits={
            organizationUnits
          }
          onRefresh={
            fetchData
          }
        />

        <div className="space-y-8 p-8">
          {/* STATS */}
          <OfficeStats
            offices={offices}
            organizationUnits={
              organizationUnits
            }
          />

            <Tabs
              defaultValue="list"
              className="w-full"
            >
              <TabsList className="mb-6 grid w-full max-w-md grid-cols-2 rounded-2xl">
                <TabsTrigger
                  value="list"
                  className="gap-2 cursor-pointer"
                >
                  <Building2 className="h-4 w-4" />
                  Office List
                </TabsTrigger>

                <TabsTrigger
                  value="hierarchy"
                  className="gap-2 cursor-pointer"
                >
                  <GitBranch className="h-4 w-4" />
                  Organization Hierarchy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list">

                <OfficeList
                  offices={offices}
                  loading={loading}
                  onRefresh={fetchData}
                />

              </TabsContent>

              <TabsContent value="hierarchy">

                <OrganizationChart
                  organizations={organizationUnits}
                />

              </TabsContent>

            </Tabs>

        </div>
      </main>
    </RoleGuard>
  );
}