import { create } from 'zustand';

import communityService from '@/services/community.service';

import type {
  Community,
  CommunityMessage,
  OnlineUser,
} from '@/types/community';

type ChatUser = {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offices?: any;
};

type CommunityState = {
  communities: Community[];

  selectedCommunity?: Community;

  messages: CommunityMessage[];
  hasMoreMessages: boolean;
  loadingMessages: boolean;
  shouldScrollToBottom: boolean;

  onlineUsers: OnlineUser[];
  chatUsers: ChatUser[];

  loading: boolean;

  fetchCommunities: () => Promise<void>;

  fetchChatUsers: () => Promise<void>;

  selectCommunity: (
    community: Community,
  ) => Promise<void>;

  fetchMessages: (
    communityId: string,
  ) => Promise<void>;

  loadOlderMessages: (
    communityId: string,
  ) => Promise<void>;

  addMessage: (
    message: CommunityMessage,
  ) => void;

  resetScrollFlag: () => void;

  setMessages: (
    messages: CommunityMessage[],
  ) => void;

  setOnlineUsers: (
    users: OnlineUser[],
  ) => void;

  createCommunity: (
    data: {
      name: string;
      description?: string;
      isPrivate: boolean;
    },
  ) => Promise<void>;

  removeCommunity: (
    id: string,
  ) => Promise<void>;

  startDirectConversation: (
    targetUserId: string,
  ) => Promise<void>;
  
};

export const useCommunityStore =
  create<CommunityState>((set, get) => ({
    communities: [],
    chatUsers: [],
    selectedCommunity: undefined,
    messages: [],
    hasMoreMessages: true,
    loadingMessages: false,
    shouldScrollToBottom: true,
    onlineUsers: [],
    loading: false,

    // ======================================
    // COMMUNITIES
    // ======================================

    fetchCommunities: async () => {
      set({
        loading: true,
      });

      try {
        const communities =
          await communityService.getCommunities();

        console.log('community:', communities)
        set({
          communities,
        });

        const general =
            communities.find(
                (c) => c.isGeneral,
            ) ?? communities[0];

        if (general) {
            set({
                selectedCommunity: general,
            });

            await get().fetchMessages(
                general.id,
            );
        }
      } finally {
        set({
          loading: false,
        });
      }
    },

    fetchChatUsers: async () => {
        const users =
          await communityService.getChatUsers();
        console.log('chat-users::', users)
        set({
          chatUsers: users,
        });
    },

    createCommunity: async (
      data,
    ) => {
      const community =
        await communityService.createCommunity(
          data,
        );

      set((state) => ({
        communities: [
          ...state.communities,
          community,
        ],
      }));
    },

    removeCommunity: async (
      id,
    ) => {
      await communityService.deleteCommunity(
        id,
      );

      set((state) => ({
        communities:
          state.communities.filter(
            (c) => c.id !== id,
          ),
      }));
    },

    selectCommunity: async (
      community,
    ) => {
      set({
        selectedCommunity:
          community,
      });

      await get().fetchMessages(
        community.id,
      );
    },

    // ======================================
    // MESSAGES
    // ======================================

    fetchMessages: async (communityId) => {
      set({
        loadingMessages: true,
      });

      try {
        const messages =
          await communityService.getMessages(
            communityId,
            1,
          );

        set({
          messages,
          hasMoreMessages:
            messages.length === 20,
          shouldScrollToBottom: true,
        });
      } finally {
        set({
          loadingMessages: false,
        });
      }
    },

    loadOlderMessages: async (
      communityId,
    ) => {
      const state = get();

      if (
        state.loadingMessages ||
        !state.hasMoreMessages
      ) {
        return;
      }

      set({
        loadingMessages: true,
      });

      try {
        const nextPage =
          Math.floor(
            state.messages.length / 20,
          ) + 1;

        const older =
          await communityService.getMessages(
            communityId,
            nextPage,
          );

        if (!older.length) {
          set({
            hasMoreMessages: false,
          });

          return;
        }

        const merged = [
          ...older,
          ...state.messages,
        ];

        const unique = Array.from(
          new Map(
            merged.map((m) => [m.id, m]),
          ).values(),
        );

        set({
          messages: unique,

          hasMoreMessages:
            older.length === 20,
        });
      } finally {
        set({
          loadingMessages: false,
        });
      }
    },

    addMessage: (message) =>
      set((state) => {
        const exists = state.messages.some(
          (m) => m.id === message.id,
        );

        if (exists) {
          return state;
        }

        return {
          messages: [
            ...state.messages,
            message,
          ],
          shouldScrollToBottom: true,
        };
      }),

    resetScrollFlag: () =>
      set({
        shouldScrollToBottom: false,
      }),

    setMessages: (
      messages,
    ) =>
      set({
        messages,
      }),

    // ======================================
    // ONLINE USERS
    // ======================================

    setOnlineUsers: (
      users,
    ) =>
      set({
        onlineUsers: users,
      }),

    startDirectConversation: async (
      targetUserId,
    ) => {
      const community =
        await communityService.createDirect(
          targetUserId,
        );

      set({
        selectedCommunity: community,
      });

      await get().fetchMessages(
        community.id,
      );
    },
    

  }));