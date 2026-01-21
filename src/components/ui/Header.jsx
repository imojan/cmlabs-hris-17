import { Search, Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";
import { NotificationPanel } from "./NotificationPanel";
import { notificationService } from "@/app/services/notification.api";

export function Header({ title = "Dashboard" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  
  const logout = useAuth((s) => s.logout);

  const displayName =
    user?.username ||
    (user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(" ")
      : "User");

  const initials = (displayName || "U")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel = user?.isAdmin ? "Admin" : "User";

  // NEW: ambil avatarUrl dari user
  const avatarUrl = user?.avatarUrl || null;

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        setUnreadCount(response?.unreadCount || 0);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };

    fetchUnreadCount();
    
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh unread count when notification panel closes
  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
    // Refresh count after marking as read
    notificationService.getUnreadCount()
      .then((res) => setUnreadCount(res?.unreadCount || 0))
      .catch(() => {});
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    logout(); // clear token + user
    setIsConfirmOpen(false);
    navigate("/auth/sign-in");
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 w-full rounded-2xl">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-light text-[#1D395E] truncate">
                {title}
              </h1>
            </div>

            {/* Search Bar - Hidden on small screens */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm text-black"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notification */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen((v) => !v)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#1D395E] rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[20px] h-[20px] flex items-center justify-center bg-rose-500 text-white text-xs font-bold rounded-full px-1 border-2 border-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Panel */}
                <NotificationPanel 
                  isOpen={isNotificationOpen} 
                  onClose={handleNotificationClose} 
                />
              </div>

              {/* User Profile with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex-shrink-0 overflow-hidden bg-blue-600 flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm sm:text-base">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500">{roleLabel}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info in Dropdown */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {roleLabel}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            // Navigate to settings profile based on user role
                            const basePath = user?.isAdmin ? "/admin" : "/user";
                            navigate(`${basePath}/settings/profile`);
                          }}
                        >
                          <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                          <span>Account Settings</span>
                        </button>

                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                          onClick={handleLogoutClick}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden px-4 pb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari"
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Confirm Logout Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setIsConfirmOpen(false)}
          />

          {/* Card */}
          <div className="relative z-50 w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-[#1D395E]">
                  Keluar dari akun?
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Kamu akan keluar dari sesi saat ini dan perlu login kembali
                  untuk mengakses dashboard HRIS.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-full bg-red-600 text-sm font-semibold text-white hover:bg-red-700 shadow-sm transition-colors"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
