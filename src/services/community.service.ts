import { api } from '@/lib/axios';

import {
  Community,
  CommunityMessage,
  CreateCommunityDto,
} from '@/types/community';

class CommunityService {
  async getCommunities() {
    const { data } =
      await api.get<Community[]>(
        '/communities',
      );

    return data;
  }

  async getCommunity(
    id: string,
  ): Promise<Community> {
    const response = await api.get(
      `/communities/${id}`,
    );

    return response.data;
  }

  async getChatUsers() {
    const { data } =
      await api.get(
        '/communities/users',
      );

    return data;
  }

  async createCommunity(
    dto: CreateCommunityDto,
  ) {
    const { data } =
      await api.post(
        '/communities',
        dto,
      );

    return data;
  }

  async updateCommunity(
    id: string,
    data: {
      name?: string;
      description?: string;
      isPrivate?: boolean;
    },
  ): Promise<Community> {
    const response = await api.patch(
      `/communities/${id}`,
      data,
    );

    return response.data;
  }

  deleteCommunity(id: string) {
      return api.delete(
          `/communities/${id}`,
      );
  }

  markAsRead(
    communityId: string,
  ) {
    return api.post(
      `/communities/${communityId}/read`,
    );
  }

  async getMessages(
    communityId: string,
    page = 1,
  ) {
    const { data } =
      await api.get<
        CommunityMessage[]
      >(
        `/communities/${communityId}/messages?page=${page}&limit=20`,
      );

    return data;
  }

  async joinCommunity(
    communityId: string,
  ) {
    return api.post(
      `/communities/${communityId}/join`,
    );
  }

  async leaveCommunity(
    communityId: string,
  ) {
    return api.post(
      `/communities/${communityId}/leave`,
    );
  }

  async invite(
    communityId: string,
    userId: string,
  ) {
    return api.post(
      `/communities/${communityId}/invite`,
      {
        userId,
      },
    );
  }

  async addMembers(
    id: string,
    memberIds: string[],
  ): Promise<Community> {
    const response = await api.post(
      `/communities/${id}/members`,
      {
        memberIds,
      },
    );

    return response.data;
  }

  async removeMember(
    communityId: string,
    memberId: string,
  ): Promise<void> {
    await api.delete(
      `/communities/${communityId}/member/${memberId}`,
    );
  }

  async createDirect(
    targetUserId: string,
  ) {
    const { data } =
      await api.post(
        '/communities/direct',
        {
          targetUserId,
        },
      );

    return data;
  }

}

export default new CommunityService();