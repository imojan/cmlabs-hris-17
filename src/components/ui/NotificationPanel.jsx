// src/components/ui/NotificationPanel.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, Loader2 } from "lucide-react";
import { notificationService } from "@/app/services/notification.api";
import { useAuth } from "@/app/store/authStore";
import { useTheme } from "@/app/hooks/useTheme";

// Format time ago
function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

// Get notification link based on type
function getNotificationLink(notification, isAdmin) {
  const basePath = isAdmin ? "/admin" : "/user";
  const type = notification.type;

  switch (type) {
    case "CHECKCLOCK_APPROVED":
    case "CHECKCLOCK_REJECTED":
      return `${basePath}/checkclock`;
    case "CHECKCLOCK_SUBMITTED":
      return isAdmin ? "/admin/checkclock" : "/user/checkclock";
    case "EMPLOYEE_ADDED":
    case "EMPLOYEE_UPDATED":
      return "/admin/employees-database";
    case "SCHEDULE_UPDATED":
      return `${basePath}/work-schedule`;
    default:
      return null;
  }
}

// Get avatar/icon for notification
function getNotificationAvatar(notification) {
  // If fromUser exists, show their initials
  if (notification.fromUser) {
    const name = [notification.fromUser.firstName, notification.fromUser.lastName]
      .filter(Boolean)
      .join(" ") || notification.fromUser.username || "U";
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return { type: "initials", value: initials };
  }
  // System notification
  return { type: "icon", value: "system" };
}

export function NotificationPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" or "unread"
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const isAdmin = user?.role === "admin";
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getAll({ limit: 20 });
      setNotifications(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }

    // Navigate to related page
    const link = getNotificationLink(notification, isAdmin);
    if (link) {
      onClose();
      navigate(link);
    }
  };

  const handleViewAll = () => {
    onClose();
    const basePath = isAdmin ? "/admin" : "/user";
    navigate(`${basePath}/notifications`);
  };

  // Filter notifications
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={`fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full sm:mt-2 w-[calc(100vw-5rem)] sm:w-80 max-w-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border overflow-hidden z-50 transition-colors duration-300`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} text-[10px] sm:text-base`}>Notifications</h3>
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 rounded transition-colors ${
              filter === "all"
                ? isDark ? "text-gray-100 font-medium" : "text-gray-900 font-medium"
                : isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-2 py-1 rounded transition-colors ${
              filter === "unread"
                ? isDark ? "text-gray-100 font-medium" : "text-gray-900 font-medium"
                : isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="overflow-y-auto max-h-[300px] sm:max-h-[360px] overscroll-contain">
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-10">
            <Loader2 className={`w-5 h-5 animate-spin ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-8 sm:py-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Bell className="w-7 h-7 sm:w-8 sm:h-8 mb-2" />
            <p className="text-xs sm:text-sm">No notifications</p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => {
              const avatar = getNotificationAvatar(notification);
              const link = getNotificationLink(notification, isAdmin);

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors ${
                    link ? "cursor-pointer" : ""
                  } ${!notification.isRead ? isDark ? "bg-blue-900/20" : "bg-blue-50/40" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center overflow-hidden`}>
                    {avatar.type === "initials" ? (
                      <span className={`text-[10px] sm:text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {avatar.value}
                      </span>
                    ) : (
                      <Bell className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] sm:text-xs ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                          <span className={!notification.isRead ? "font-semibold" : "font-medium"}>
                            {notification.title}
                          </span>
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ml-1`}>
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </p>
                        <p className={`text-[11px] sm:text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5 line-clamp-2`}>
                          {notification.message}
                        </p>
                      </div>
                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <button
          onClick={handleViewAll}
          className={`w-full px-4 py-2.5 text-xs text-center ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} transition-colors font-medium`}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}

// Bell icon with unread count badge
export function NotificationBell({ onClick, unreadCount = 0 }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-medium rounded-full px-1">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
