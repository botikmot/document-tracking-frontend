'use client';

import {
  Bell,
  CheckCheck,
  Clock3,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { socket } from '@/lib/socket';
import { Button } from '@/components/ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotificationStore } from '@/store/notification.store';

type NotificationType =
  | 'DEADLINE'
  | 'ROUTED'
  | 'APPROVED';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  documentId: string;
  createdAt: string;
};

export function NotificationBell() {
  const {
    notifications,
    unreadCounts,
    setNotifications,
    addNotification,
    markAsRead: removeNotification,
    markAllAsRead: markAllNotificationsAsRead,
  } = useNotificationStore();

  const notificationAudio =
    useRef<HTMLAudioElement | null>(
        null,
    );

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  /*
   |-------------------------------------------------------------
   | FETCH NOTIFICATIONS
   |-------------------------------------------------------------
   */

  const fetchNotifications =
    async () => {
      try {
        const response =
          await api.get(
            '/notifications',
          );

        console.log('notifications', response.data)

        setNotifications(
          response.data,
        );
      } catch (error) {
        console.error(error);
      }
    };

  /*
   |-------------------------------------------------------------
   | INITIAL LOAD
   |-------------------------------------------------------------
   */

  useEffect(() => {
      const load =
        async () => {
          await fetchNotifications();
        };
  
      void load();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | INIT AUDIO
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        notificationAudio.current = new Audio('/sounds/notification.mp3');
        notificationAudio.current.volume = 0.7;
    }, []);

  /*
   |-------------------------------------------------------------
   | MARK AS READ
   |-------------------------------------------------------------
   */

  const markAsRead =
    async (
      id: string,
    ) => {
      try {
        await api.patch(
          `/notifications/${id}/read`,
        );

        /*
        |-------------------------------------------------------
        | REMOVE FROM STATE
        |-------------------------------------------------------
        */
         removeNotification(id);

      } catch (error) {
        console.error(error);
      }
    };

  /*
   |-------------------------------------------------------------
   | MARK ALL AS READ
   |-------------------------------------------------------------
   */

  const markAllAsRead =
    async () => {
      try {
        await api.patch(
          '/notifications/read-all',
        );
        markAllNotificationsAsRead();

        toast.success(
          'All notifications marked as read',
        );
      } catch (error) {
        console.error(error);
      }
    };

  /*
   |-------------------------------------------------------------
   | UNREAD COUNT
   |-------------------------------------------------------------
   */

  const unreadCount =
    unreadCounts.DEADLINE +
    unreadCounts.ROUTED +
    unreadCounts.APPROVED;

    useEffect(() => {
        const unlockAudio =
            async () => {
            try {
                if (notificationAudio.current) {
                    await notificationAudio.current.play();
                    notificationAudio.current.pause();
                    notificationAudio.current.currentTime = 0;
                    setAudioEnabled(true);
                    console.log('Audio unlocked',);
                }
            } catch (error) {
                console.error(
                'Audio unlock failed',
                error,
                );
            }
            };

        window.addEventListener(
            'click',
            unlockAudio,
            {
            once: true,
            },
        );

        return () => {
            window.removeEventListener(
            'click',
            unlockAudio,
            );
        };
        }, []);



  /*
   |-------------------------------------------------------------
   | ICON HELPER
   |-------------------------------------------------------------
   */

  const renderNotificationIcon =
    (
      type: string,
    ) => {
      switch (type) {
        case 'DEADLINE':
          return (
            <div className="rounded-2xl bg-red-100 p-2 text-red-600">
              <Clock3 className="h-5 w-5" />
            </div>
          );

        case 'ROUTED':
          return (
            <div className="rounded-2xl bg-blue-100 p-2 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
          );

        case 'APPROVED':
          return (
            <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          );

        default:
          return (
            <div className="rounded-2xl bg-amber-100 p-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          );
      }
    };

  return (
    <Popover>
      <PopoverTrigger
        asChild
      >
        <Button
          size="icon"
          variant="outline"
          className="relative h-12 w-12 rounded-2xl border-slate-200 bg-white shadow-sm"
        >
          <Bell className="h-5 w-5 text-slate-700" />

          {unreadCount >
            0 && (
            <div className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[420px] rounded-3xl border-0 p-0 shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Notifications
            </h3>

            <p className="text-sm text-slate-500">
              Real-time document updates
            </p>
          </div>

          {notifications.length >
            0 && (
            <Button
              size="sm"
              variant="ghost"
              className="rounded-xl"
              onClick={
                markAllAsRead
              }
            >
              <CheckCheck className="mr-2 h-4 w-4" />

              Mark all
            </Button>
          )}
        </div>

        {/* LIST */}
        <div className="max-h-[500px] overflow-y-auto">
          {notifications.length ===
          0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Bell className="mb-3 h-10 w-10 text-slate-300" />

              <h4 className="font-bold text-slate-700">
                No notifications yet
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                You&apos;re all caught up
              </p>
            </div>
          ) : (
            displayedNotifications.map(
              (
                notification,
              ) => (
                <button
                  key={
                    notification.id
                  }
                  onClick={() =>
                    void markAsRead(
                      notification.id,
                    )
                  }
                  className={`flex w-full items-start gap-4 border-b border-slate-100 p-5 text-left transition hover:bg-slate-50 ${
                    !notification.isRead
                      ? 'bg-blue-50/40'
                      : ''
                  }`}
                >
                  {/* ICON */}
                  {
                    renderNotificationIcon(
                      notification.type,
                    )
                  }

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-slate-900">
                        {
                          notification.title
                        }
                      </h4>

                      {!notification.isRead && (
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {
                        notification.message
                      }
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      {new Date(
                        notification.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>
                </button>
              ),
            )
          )}
        </div>

          {/* SEE MORE */}
          {notifications.length > 5 && (
            <div className="border-t border-slate-100 p-3">
              <Button
                variant="ghost"
                className="w-full rounded-2xl"
                onClick={() =>
                  setShowAll(!showAll)
                }
              >
                {showAll
                  ? 'See Less'
                  : `See More (${notifications.length - 5} more)`}
              </Button>
            </div>
          )}

      </PopoverContent>
    </Popover>
  );
}