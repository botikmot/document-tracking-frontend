export type UserRole = {
  id: string;
  role: {
    id: string;
    name: string;
  };
};

export type UserOffice = {
  id: string;
  designation?: string;
  isOfficeAdmin: boolean;
  office: {
    id: string;
    officeName: string;
    officeCode: string;
  };
};

export type User = {
  id: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: 'ACTIVE' | 'INACTIVE';
  roles: UserRole[];
  offices: UserOffice[];
  createdAt: string;
};