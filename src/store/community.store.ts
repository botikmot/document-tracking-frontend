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
  directCommunityId?: string | null;
  unreadCount: number;
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
      memberIds?: string[];
    },
  ) => Promise<void>;

  updateCommunity: (
      id: string,
      data: {
          name?: string;
          description?: string;
          isPrivate?: boolean;
      },
  ) => Promise<void>;

  addMembers: (
      id: string,
      memberIds: string[],
  ) => Promise<void>;

  removeMember: (
      communityId: string,
      memberId: string,
  ) => Promise<void>;

  removeCommunity: (
    id: string,
  ) => Promise<void>;

  startDirectConversation: (
    targetUserId: string,
  ) => Promise<void>;

  updateUnread: (
      communityId: string,
      unread: number,
  ) => void;

  incrementUnread: (
    communityId: string,
  ) => void;

  clearUnread: (
    communityId: string,
  ) => void;

  setUnread: (
    communityId: string,
    unreadCount: number,
  ) => void;

  updateMessage: (
    message: CommunityMessage,
  ) => void;

  deleteMessage: (
    message: CommunityMessage,
  ) => void;
  
  updateMessageApi: (
      id: string,
      message: string,
  ) => Promise<void>;

  deleteMessageApi: (
      id: string,
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

    createCommunity: async (data) => {
      const community =
        await communityService.createCommunity(data);

      await get().fetchCommunities();

      const created =
        get().communities.find(
          (c) => c.id === community.id,
        );

      if (created) {
        set({
          selectedCommunity: created,
        });

        await get().fetchMessages(
          created.id,
        );
      }
    },

    updateCommunity: async (
        id,
        data,
    ) => {

        const updated =
            await communityService.updateCommunity(
                id,
                data,
            );

        set((state) => ({

            communities:
                state.communities.map((c) =>
                    c.id === id
                        ? updated
                        : c
                ),

            selectedCommunity:
                state.selectedCommunity?.id === id
                    ? updated
                    : state.selectedCommunity,

        }));

    },

    addMembers: async (
        id,
        memberIds,
    ) => {

        const updated =
            await communityService.addMembers(
                id,
                memberIds,
            );

        set((state) => ({

            communities:
                state.communities.map((c) =>
                    c.id === id
                        ? updated
                        : c
                ),

            selectedCommunity:
                state.selectedCommunity?.id === id
                    ? updated
                    : state.selectedCommunity,

        }));

    },

    removeMember: async (
        communityId,
        memberId,
    ) => {

        await communityService.removeMember(
            communityId,
            memberId,
        );

        const updated =
            await communityService.getCommunity(
                communityId,
            );

        set((state) => ({

            communities:
                state.communities.map((c) =>
                    c.id === communityId
                        ? updated
                        : c
                ),

            selectedCommunity:
                updated,

        }));

    },

    removeCommunity: async (id) => {
      await communityService.deleteCommunity(id);

      const state = get();

      const communities = state.communities.filter(
        (c) => c.id !== id,
      );

      const general =
        communities.find((c) => c.isGeneral) ??
        communities[0];

      set({
        communities,
        selectedCommunity: general,
      });

      if (general) {
        await get().fetchMessages(
          general.id,
        );
      }
    },

    selectCommunity: async (
      community,
    ) => {
      set({
        selectedCommunity:
          community,
      });

      await communityService.markAsRead(
        community.id,
      );

      set((state) => ({
        communities:
          state.communities.map((c) =>
            c.id === community.id
              ? {
                  ...c,
                  unreadCount: 0,
                }
              : c,
          ),
      }));

      await get().fetchMessages(
        community.id,
      );
      
      await communityService.markAsRead(
        community.id,
      );

      get().clearUnread(
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

      await communityService.markAsRead(
        community.id,
      );

      get().clearUnread(community.id);

      set({
        selectedCommunity: community,
      });

      await get().fetchMessages(
        community.id,
      );
    },

    updateUnread: (
        communityId,
        unread,
    ) =>
        set((state) => ({
            communities:
                state.communities.map((c) =>
                    c.id === communityId
                        ? {
                              ...c,
                              unreadCount: unread,
                          }
                        : c,
                ),
        })),

    incrementUnread: (communityId) =>
      set((state) => ({
        communities: state.communities.map((community) =>
          community.id === communityId
            ? {
                ...community,
                unreadCount:
                  (community.unreadCount ?? 0) + 1,
              }
            : community,
        ),
      })),

    clearUnread: (communityId) =>
      set((state) => ({
        communities: state.communities.map((community) =>
          community.id === communityId
            ? {
                ...community,
                unreadCount: 0,
              }
            : community,
        ),

        chatUsers: state.chatUsers.map((user) =>
          user.directCommunityId === communityId
            ? {
                ...user,
                unreadCount: 0,
              }
            : user,
        ),
      })),

    setUnread: (
      communityId,
      unreadCount,
    ) =>
      set((state) => ({
        communities: state.communities.map((community) =>
          community.id === communityId
            ? {
                ...community,
                unreadCount,
              }
            : community,
        ),

        chatUsers: state.chatUsers.map((user) =>
          user.directCommunityId === communityId
            ? {
                ...user,
                unreadCount,
              }
            : user,
        ),
      })),

      updateMessage: (
        updatedMessage,
      ) =>

        set((state) => ({
          messages:
            state.messages.map((message) =>
              message.id ===
              updatedMessage.id
                ? updatedMessage
                : message,
            ),
        })),

        deleteMessage: (
          deletedMessage,
        ) =>
          set((state) => ({
            messages:
              state.messages.map((message) =>
                message.id ===
                deletedMessage.id
                  ? deletedMessage
                  : message,
              ),
          })),

      updateMessageApi: async (
            id,
            message,
        ) => {

            await communityService.updateMessage(
                id,
                message,
            );
        },

        deleteMessageApi: async (
            id,
        ) => {
            await communityService.deleteMessage(
                id,
            );
        },
    
}));