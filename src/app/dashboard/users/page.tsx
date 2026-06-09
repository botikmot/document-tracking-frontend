'use client';

import { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { api } from '@/lib/axios';
import type { User } from '@/types/user';
import { UsersHeader } from './components/users-header';
import { UsersStats } from './components/users-stats';
import { UsersTable } from './components/users-table';

export default function UsersPage() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchUsers =
    async () => {
      try {
        const response =
          await api.get('/users');
        console.log('users', response)
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        const load = async () => {
        await fetchUsers();
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
        <UsersHeader
          onCreated={
            fetchUsers
          }
        />

        <div className="space-y-8 p-8">
          <UsersStats
            users={users}
          />

          <UsersTable
            users={users}
            loading={loading}
            onSuccess={fetchUsers}
          />
        </div>
      </main>
    </RoleGuard>
  );
}