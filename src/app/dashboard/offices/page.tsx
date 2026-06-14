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

type OrganizationUnit = {
  id: string;
  name: string;
  code: string;
  type: string;
};

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

          {/* LIST */}
          <OfficeList
            offices={offices}
            loading={loading}
          />
        </div>
      </main>
    </RoleGuard>
  );
}