export type AuthUser = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  roles: string[];
  officeIds: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offices: any[];
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};