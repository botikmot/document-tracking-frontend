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
    dto: Partial<CreateCommunityDto>,
  ) {
    const { data } =
      await api.patch(
        `/communities/${id}`,
        dto,
      );

    return data;
  }

  async deleteCommunity(
    id: string,
  ) {
    return api.delete(
      `/communities/${id}`,
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

  async removeMember(
    communityId: string,
    userId: string,
  ) {
    return api.delete(
      `/communities/${communityId}/member/${userId}`,
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