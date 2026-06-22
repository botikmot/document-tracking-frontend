import { create } from 'zustand';

export type NotificationType =
  | 'DEADLINE'
  | 'ROUTED'
  | 'APPROVED';

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  documentId: string;
  createdAt: string;
};

type UnreadCounts = {
  DEADLINE: number;
  ROUTED: number;
  APPROVED: number;
};

type NotificationState = {
  notifications: Notification[];

  unreadCounts: UnreadCounts;

  setNotifications: (
    notifications: Notification[],
  ) => void;

  addNotification: (
    notification: Notification,
  ) => void;

  markAsRead: (
    id: string,
  ) => void;

  markAllAsRead: () => void;

  clearNotifications: () => void;
};

/*
|--------------------------------------------------------------------------
| HELPER
|--------------------------------------------------------------------------
*/

const getUnreadCounts = (
  notifications: Notification[],
): UnreadCounts => ({
  DEADLINE: notifications.filter(
    (n) =>
      !n.isRead &&
      n.type === 'DEADLINE',
  ).length,

  ROUTED: notifications.filter(
    (n) =>
      !n.isRead &&
      n.type === 'ROUTED',
  ).length,

  APPROVED: notifications.filter(
    (n) =>
      !n.isRead &&
      n.type === 'APPROVED',
  ).length,
});

export const useNotificationStore =
  create<NotificationState>(
    (set) => ({
      notifications: [],

      unreadCounts: {
        DEADLINE: 0,
        ROUTED: 0,
        APPROVED: 0,
      },

      /*
      |--------------------------------------------------------------------------
      | SET NOTIFICATIONS
      |--------------------------------------------------------------------------
      */

      setNotifications: (
        notifications,
      ) =>
        set({
          notifications,
          unreadCounts:
            getUnreadCounts(
              notifications,
            ),
        }),

      /*
      |--------------------------------------------------------------------------
      | ADD NOTIFICATION
      |--------------------------------------------------------------------------
      */

      addNotification: (
        notification,
      ) =>
        set((state) => {
          const notifications = [
            notification,
            ...state.notifications,
          ];

          return {
            notifications,
            unreadCounts:
              getUnreadCounts(
                notifications,
              ),
          };
        }),

      /*
      |--------------------------------------------------------------------------
      | MARK AS READ
      |--------------------------------------------------------------------------
      */

      markAsRead: (
        id,
      ) =>
        set((state) => {
          const notifications =
            state.notifications.map(
              (
                notification,
              ) =>
                notification.id ===
                id
                  ? {
                      ...notification,
                      isRead: true,
                    }
                  : notification,
            );

          return {
            notifications,
            unreadCounts:
              getUnreadCounts(
                notifications,
              ),
          };
        }),

      /*
      |--------------------------------------------------------------------------
      | MARK ALL AS READ
      |--------------------------------------------------------------------------
      */

      markAllAsRead: () =>
        set((state) => {
          const notifications =
            state.notifications.map(
              (
                notification,
              ) => ({
                ...notification,
                isRead: true,
              }),
            );

          return {
            notifications,
            unreadCounts:
              getUnreadCounts(
                notifications,
              ),
          };
        }),

      /*
      |--------------------------------------------------------------------------
      | CLEAR
      |--------------------------------------------------------------------------
      */

      clearNotifications:
        () =>
          set({
            notifications: [],
            unreadCounts: {
              DEADLINE: 0,
              ROUTED: 0,
              APPROVED: 0,
            },
          }),
    }),
  );
