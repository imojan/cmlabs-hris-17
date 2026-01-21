// src/features/notifications/pages/NotificationsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  ArrowLeft,
  Clock,
  X,
  Search,
} from "lucide-react";
import { notificationService } from "@/app/services/notification.api";
import { useAuth } from "@/app/store/authStore";

// Format full date
function formatFullDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get notification link based on type
function getNotificationLink(notification, isAdmin) {
  const basePath = isAdmin ? "/admin" : "/user";
  const type = notification.type;

  switch (type) {
    case "CHECKCLOCK_APPROVED":
    case "CHECKCLOCK_REJECTED":
      return `${basePath}/attendance`;
    case "CHECKCLOCK_SUBMITTED":
      return isAdmin ? "/admin/attendance" : "/user/attendance";
    case "EMPLOYEE_ADDED":
    case "EMPLOYEE_UPDATED":
      return "/admin/employees";
    case "SCHEDULE_UPDATED":
      return `${basePath}/work-schedule`;
    default:
      return null;
  }
}

// Get notification icon config
function getNotificationConfig(type) {
  switch (type) {
    case "CHECKCLOCK_APPROVED":
      return { icon: Check, bgColor: "bg-emerald-100", iconColor: "text-emerald-600" };
    case "CHECKCLOCK_REJECTED":
      return { icon: X, bgColor: "bg-rose-100", iconColor: "text-rose-600" };
    case "CHECKCLOCK_SUBMITTED":
      return { icon: Clock, bgColor: "bg-amber-100", iconColor: "text-amber-600" };
    default:
      return { icon: Bell, bgColor: "bg-blue-100", iconColor: "text-blue-600" };
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" or "unread"
  const [searchQuery, setSearchQuery] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getAll({ limit: 100 });
      setNotifications(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to related page
    const link = getNotificationLink(notification, isAdmin);
    if (link) {
      navigate(link);
    }
  };

  // Filter and search notifications
  const filteredNotifications = notifications
    .filter((n) => (filter === "unread" ? !n.isRead : true))
    .filter(
      (n) =>
        searchQuery === "" ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4 sm:space-y-6 px-1">
      {/* Header Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-[#1D395E]">Notifications</h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-[#1D395E] hover:bg-[#2a4a6e] rounded-lg transition-colors"
              >
                {markingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Mark all as read</span>
                <span className="sm:hidden">Read all</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 sm:px-6 py-3 bg-gray-50/50 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  filter === "unread"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[10px] font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm text-black bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D395E]/20 focus:border-[#1D395E]"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 sm:py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400 px-4">
              <Bell className="w-10 h-10 sm:w-12 sm:h-12 mb-3" />
              <p className="font-medium text-gray-600 text-sm sm:text-base">No notifications</p>
              <p className="text-xs sm:text-sm text-center">
                {filter === "unread"
                  ? "You've read all your notifications"
                  : "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => {
                const config = getNotificationConfig(notification.type);
                const IconComponent = config.icon;
                const link = getNotificationLink(notification, isAdmin);

                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full ${config.bgColor} flex items-center justify-center`}
                    >
                      <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${config.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 min-w-0 ${link ? "cursor-pointer" : ""}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className={!notification.isRead ? "font-semibold" : "font-medium"}>
                              {notification.title}
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                            {formatFullDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        disabled={deletingId === notification.id}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        {deletingId === notification.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
