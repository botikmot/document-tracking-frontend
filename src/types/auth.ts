export type AuthUser = {
  userId: string;
  username: string;
  roles: string[];
  officeIds: string[];
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};