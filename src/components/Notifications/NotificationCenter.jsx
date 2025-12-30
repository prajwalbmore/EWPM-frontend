import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bell, X, CheckCircle2, UserPlus, AlertCircle, Users, Shield } from 'lucide-react';
import { getSocket } from '../../services/socket';
import { format } from 'date-fns';
import { toast } from 'sonner';

const NotificationCenter = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const setupNotificationListener = () => {
      const socket = getSocket();
      if (!socket) {
        console.warn('Socket not initialized, will retry...');
        // Retry after a short delay
        setTimeout(setupNotificationListener, 1000);
        return;
      }

      // Wait for socket to be connected
      if (!socket.connected) {
        console.log('Socket not connected yet, waiting for connection...');
        socket.once('connect', () => {
          console.log('Socket connected, setting up notification listener');
          setupNotificationListener();
        });
        return;
      }

      console.log('✅ Setting up notification listener for user:', user._id);
      console.log('Socket ID:', socket.id);
      console.log('Socket connected:', socket.connected);

      // Track shown notifications to prevent duplicates
      const shownNotificationIds = new Set();

      const handleNotification = (data) => {
        console.log('🔔 Notification received:', data);
        
        // If notification has targetUserId, only show if it's for this user
        if (data.targetUserId && user?._id) {
          const targetUserId = data.targetUserId.toString();
          const currentUserId = user._id.toString();
          if (targetUserId !== currentUserId) {
            console.log('⚠️ Notification filtered out - not for this user');
            return; // Ignore notification not meant for this user
          }
        }

        // Prevent employee from seeing notifications about their own actions
        if (data.type === 'TASK_STATUS_CHANGED' && data.changedBy?.id && user?._id) {
          const changedById = data.changedBy.id.toString();
          const currentUserId = user._id.toString();
          if (changedById === currentUserId && user.role === 'EMPLOYEE') {
            console.log('⚠️ Employee filtered out - notification about own action');
            return; // Employee shouldn't see notifications about their own status changes
          }
        }
        
        // Create unique notification ID to prevent duplicates
        const notificationId = `${data.type}-${data.taskId || data.projectId || 'unknown'}-${data.timestamp || Date.now()}`;
        
        // Check if we've already shown this notification
        if (shownNotificationIds.has(notificationId)) {
          console.log('⚠️ Duplicate notification filtered out:', notificationId);
          return;
        }
        shownNotificationIds.add(notificationId);
        
        // Clean up old IDs (keep only last 100)
        if (shownNotificationIds.size > 100) {
          const firstId = shownNotificationIds.values().next().value;
          shownNotificationIds.delete(firstId);
        }
        
        const newNotification = {
          id: Date.now(),
          ...data,
          read: false,
        };

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show live toast notification using sonner
        const getToastAction = () => {
          if (data.taskId) {
            return {
              label: 'View Task',
              onClick: () => {
                // Navigate to task details page
                window.location.href = `/tasks/${data.taskId}`;
              }
            };
          }
          if (data.projectId) {
            return {
              label: 'View Project',
              onClick: () => {
                // Navigate to project details page
                window.location.href = `/projects/${data.projectId}`;
              }
            };
          }
          return undefined;
        };

        // Show toast based on notification type using sonner
        if (data.type === 'TASK_ASSIGNED') {
          toast.success(data.title, {
            description: data.message,
            duration: 5000,
            action: getToastAction(),
          });
        } else if (data.type === 'TASK_STATUS_CHANGED') {
          toast.info(data.title, {
            description: data.message,
            duration: 5000,
            action: getToastAction(),
          });
        } else if (data.type === 'PROJECT_MEMBER_ADDED') {
          toast.success(data.title, {
            description: data.message,
            duration: 5000,
            action: data.projectId ? {
              label: 'View Project',
              onClick: () => {
                window.location.href = `/projects/${data.projectId}`;
              }
            } : undefined,
          });
        } else if (data.type === 'PERMISSION_UPDATED' || data.type === 'PERMISSION_RESET') {
          toast.info(data.title || 'Permissions Updated', {
            description: data.message || 'Your permissions have been updated. Please refresh if you notice any access issues.',
            duration: 8000,
            icon: <Shield className="w-5 h-5" />,
          });
        } else {
          toast(data.title, {
            description: data.message,
            duration: 5000,
            action: getToastAction(),
          });
        }

        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/favicon.ico',
          });
        }
      };

      // Remove any existing listeners first
      socket.off('notification');
      
      // Register the listener
      socket.on('notification', handleNotification);
      console.log('✅ Notification listener registered on socket:', socket.id);

      // Handle force join event from backend
      socket.on('force:join:user', (userId) => {
        console.log('🔄 Force join user room received:', userId);
        socket.emit('join:user', userId);
      });

      // Test listener - listen to all events for debugging
      const debugHandler = (eventName, ...args) => {
        console.log('📡 Socket event received:', eventName, args);
        if (eventName === 'notification') {
          console.log('✅ Notification event detected!', args);
        }
      };
      socket.onAny(debugHandler);

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      return () => {
        console.log('Cleaning up notification listener');
        socket.off('notification', handleNotification);
        socket.offAny(debugHandler);
      };
    };

    // Initial setup
    setupNotificationListener();

    // Also set up listener when socket connects (in case it connects later)
    const socket = getSocket();
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket connected event in NotificationCenter');
        setupNotificationListener();
      });
    }

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off('notification');
        socket.off('connect');
      }
    };
  }, [user]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif && !notif.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <UserPlus className="w-5 h-5 text-blue-300" />;
      case 'TASK_STATUS_CHANGED':
        return <CheckCircle2 className="w-5 h-5 text-green-300" />;
      case 'PROJECT_MEMBER_ADDED':
        return <Users className="w-5 h-5 text-purple-300" />;
      case 'PERMISSION_UPDATED':
      case 'PERMISSION_RESET':
        return <Shield className="w-5 h-5 text-orange-300" />;
      default:
        return <AlertCircle className="w-5 h-5 text-white/60" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'TASK_STATUS_CHANGED':
        return 'bg-green-500/10 border-green-500/20';
      case 'PROJECT_MEMBER_ADDED':
        return 'bg-purple-500/10 border-purple-500/20';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  if (!user) return null;

  // Debug: Check socket status
  const checkSocketStatus = () => {
    const socket = getSocket();
    if (socket) {
      console.log('🔍 Socket Status Check:', {
        connected: socket.connected,
        id: socket.id,
        rooms: Array.from(socket.rooms),
        userId: user?._id
      });
    } else {
      console.warn('⚠️ Socket is null');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          checkSocketStatus(); // Debug on click
        }}
        className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl border border-white/10 bg-slate-950 backdrop-blur-xl shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs sm:text-sm text-primary-300 hover:text-primary-200"
                  >
                    <span className="hidden sm:inline">Mark all read</span>
                    <span className="sm:hidden">Read all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar-dark">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-white/60">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-white/40" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 sm:p-4 hover:bg-white/5 transition-colors ${
                        !notification.read ? getNotificationColor(notification.type) : ''
                      } border-l-4 ${
                        !notification.read
                          ? notification.type === 'TASK_ASSIGNED'
                            ? 'border-blue-500/50'
                            : notification.type === 'TASK_STATUS_CHANGED'
                            ? 'border-green-500/50'
                            : notification.type === 'PROJECT_MEMBER_ADDED'
                            ? 'border-purple-500/50'
                            : 'border-white/20'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-white truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs sm:text-sm text-white/60 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-white/50 mt-1">
                                {format(
                                  new Date(notification.timestamp),
                                  'MMM dd, yyyy HH:mm'
                                )}
                              </p>
                              {(notification.taskId || notification.projectId) && (
                                <button
                                  onClick={() => {
                                    if (notification.taskId) {
                                      window.location.href = `/tasks/${notification.taskId}`;
                                    } else if (notification.projectId) {
                                      window.location.href = `/projects/${notification.projectId}`;
                                    }
                                  }}
                                  className="text-xs sm:text-sm text-primary-300 hover:text-primary-200 font-medium mt-2"
                                >
                                  {notification.taskId ? 'View Task →' : 'View Project →'}
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-primary-300 hover:text-primary-200"
                                  title="Mark as read"
                                >
                                  Mark read
                                </button>
                              )}
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-white/40 hover:text-white/60"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;

