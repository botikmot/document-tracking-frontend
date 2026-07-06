export type Community = {
  id: string;
  name: string;
  description?: string | null;
  isGeneral: boolean;
  isPrivate: boolean;
  ownerId?: string | null;
  createdAt: string;
  active: boolean;
  type: CommunityType;

  members: CommunityMember[];
  _count?: {
    members: number;
    messages: number;
  };
  unreadCount: number;
};

export type CommunityType =
  | 'CHANNEL'
  | 'DIRECT';

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

export type MessageReaction = {
  id: string;
  emoji: string;
  userId: string;

  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export type CommunityAttachment = {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  path: string;
  createdAt: string;
};

export type CommunityMessage = {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  communityId: string;
  userId: string;
  user: User;
  isDeleted: boolean;
  editedAt: string;
  reactions: MessageReaction[];
  attachments: CommunityAttachment[];
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