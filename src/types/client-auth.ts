export interface ClientUser {
  id: string;

  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;

  email: string;
  mobileNumber: string | null;

  address: string | null;
  organizationName: string | null;

  status:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'PENDING_VERIFICATION';

  createdAt: string;
  updatedAt: string;
}

export interface ClientLoginDto {
  email: string;
  password: string;
}

export interface ClientLoginResponse {
  message: string;
  accessToken: string;
  client: ClientUser;
}