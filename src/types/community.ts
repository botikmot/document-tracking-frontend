export type Community = {
  id: string;
  name: string;
  description?: string | null;
  isGeneral: boolean;
  isPrivate: boolean;
  ownerId?: string | null;
  createdAt: string;
  active: boolean;

  members: CommunityMember[];
  _count?: {
    members: number;
    messages: number;
  };
};

export type Office = {
  id: string;
  officeName: string;
  officeCode: string;
};

export type OfficeUser = {
  office: Office;
};

export type CommunityMember = {
  id: string;

  userId: string;

  communityId: string;

  role: 'OWNER' | 'ADMIN' | 'MEMBER';

  joinedAt: string;

  user: User;
};

export type CommunityMessage = {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  communityId: string;
  userId: string;
  user: User;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string | null;
  offices: OfficeUser[];
};

export interface OnlineUser {
  userId: string;
  firstName: string;
  lastName: string;
  office?: string;
  profileImage?: string;
}

export type SendMessageDto = {
  communityId: string;
  message: string;
};

export type CreateCommunityDto = {
  name: string;

  description?: string;

  isPrivate: boolean;
};