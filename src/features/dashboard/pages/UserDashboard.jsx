// src/features/dashboard/pages/UserDashboard.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  ChevronDown,
  Eye,
  Send
} from "lucide-react";

import { Header } from "../../../components/ui/Header";
import { Sidebar } from "../../../components/ui/Sidebar";
import { StatCard } from "../../../components/ui/StatCard";
import dashboardService from "../../../app/services/dashboard.api";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useTheme } from "@/app/hooks/useTheme";

// Attendance pages for user
import { AttendanceUser } from "../../attendance/pages/AttendanceUser";
import FaqHelpUser from "../../faq-help/pages/FaqHelpUser";

// Settings pages (universal - works for both admin and user)
import Settings from "../../settings/pages/Settings";
import ProfileSettings from "../../settings/pages/ProfileSettings";

// Notifications page
import NotificationsPage from "../../notifications/pages/NotificationsPage";

// Lazy load AddCheckclockUser
const AddCheckclockUser = lazy(() =>
  import("../../attendance/pages/AddCheckclockUser")
);

// ====================== CONSTANTS ======================

// mapping nama page → URL path (hanya yang diakses lewat sidebar)
const PAGE_TO_PATH = {
  dashboard: "/user/dashboard",
  checkclock: "/user/checkclock",
  "checkclock-add": "/user/checkclock/add",
  "faq-help": "/user/faq-help",
  settings: "/user/settings",
  "settings-profile": "/user/settings/profile",
};

// helper untuk menentukan nama page dari pathname
function getCurrentPage(pathname) {
  if (pathname === "/user/dashboard") return "dashboard";
  if (pathname === "/user/checkclock") return "checkclock";
  if (pathname === "/user/checkclock/add") return "checkclock-add";
  if (pathname === "/user/faq-help") return "faq-help";
  if (pathname === "/user/settings/profile") return "settings-profile";
  if (pathname === "/user/settings") return "settings";
  if (pathname === "/user/notifications") return "notifications";

  // default fallback
  return "dashboard";
}

// ====================== COMPONENT ======================

export default function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dynamic page titles based on language
  const getPageTitles = () => ({
    dashboard: t("nav.dashboard"),
    checkclock: t("nav.attendance"),
    "checkclock-add": t("attendance.checkInOut"),
    "faq-help": t("nav.faqHelp"),
    settings: t("nav.settings"),
    "settings-profile": t("settings.profileSettings"),
    notifications: t("nav.notifications"),
  });

  const PAGE_TITLES = getPageTitles();

  // currentPage diambil dari URL
  const currentPage = getCurrentPage(location.pathname);

  // === UPDATE <title> BERDASARKAN currentPage ===
  useEffect(() => {
    const titles = {
      dashboard: t("nav.dashboard"),
      checkclock: t("nav.attendance"),
      "checkclock-add": t("attendance.checkInOut"),
      "faq-help": t("nav.faqHelp"),
      settings: t("nav.settings"),
      "settings-profile": t("settings.profileSettings"),
      notifications: t("nav.notifications"),
    };
    const pageTitle = titles[currentPage] ?? t("nav.dashboard");
    document.title = `${pageTitle} | HRIS`;
  }, [currentPage, t]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // dipanggil dari Sidebar, lalu kita ganti URL-nya
  const handleNavigate = (page) => {
    const path = PAGE_TO_PATH[page] ?? "/user/dashboard";
    navigate(path);
  };

  const headerTitle = PAGE_TITLES[currentPage] ?? t("nav.dashboard");

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        role="user"
      />

      {/* Main content */}
      <div
        className={`transition-all duration-300 min-h-screen ${
          isSidebarOpen ? "md:pl-80" : "md:pl-28"
        } pl-20`}
      >
        {/* Header selalu ada, judulnya dinamis */}
        <Header title={headerTitle} />

        {/* Konten utama */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          
          {/* ================= DASHBOARD DEFAULT ================= */}
          {currentPage === "dashboard" && (
            <UserDashboardContent />
          )}

          {/* ================= CHECKCLOCK PAGES ================= */}
          {currentPage === "checkclock" && <AttendanceUser />}

          {currentPage === "checkclock-add" && (
            <Suspense
              fallback={<div className={`p-8 text-center ${isDark ? 'text-gray-400' : ''}`}>{t("common.loading")}</div>}
            >
              <AddCheckclockUser />
            </Suspense>
          )}

          {/* ================= FAQ & HELP ================= */}
          {currentPage === "faq-help" && <FaqHelpUser />}

          {/* ================= SETTINGS ================= */}
          {currentPage === "settings" && <Settings />}
          {currentPage === "settings-profile" && <ProfileSettings />}

          {/* ================= NOTIFICATIONS ================= */}
          {currentPage === "notifications" && <NotificationsPage />}
        </div>
      </div>
    </div>
  );
}

// ====================== USER DASHBOARD CONTENT ======================
function UserDashboardContent() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [attendanceFilter, setAttendanceFilter] = useState("month");
  const [_leaveFilter, setLeaveFilter] = useState("year");
  const [workHoursFilter, setWorkHoursFilter] = useState("week");
  const [showAttendanceDropdown, setShowAttendanceDropdown] = useState(false);
  const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
  const [showWorkHoursDropdown, setShowWorkHoursDropdown] = useState(false);

  // API data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current month in format "2026-01"
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        const data = await dashboardService.getUserDashboard(month);
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch user dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Default data structure if API fails
  const attendanceData = dashboardData?.attendance ? {
    ontime: dashboardData.attendance.ON_TIME,
    late: dashboardData.attendance.LATE,
    absent: dashboardData.attendance.ABSENT,
    total: dashboardData.attendance.ON_TIME + dashboardData.attendance.LATE + dashboardData.attendance.ABSENT
  } : {
    ontime: 0,
    late: 0,
    absent: 0,
    total: 0
  };

  const LEAVE_DATA = dashboardData?.leave ? {
    totalQuota: dashboardData.leave.quotaDays,
    taken: dashboardData.leave.takenDays,
    remaining: dashboardData.leave.remainingDays
  } : {
    totalQuota: 12,
    taken: 0,
    remaining: 12
  };

  const workHoursData = dashboardData?.workHoursChart || [
    { month: "Jan", hours: 0 },
    { month: "Feb", hours: 0 },
    { month: "Mar", hours: 0 },
    { month: "Apr", hours: 0 },
    { month: "May", hours: 0 },
    { month: "Jun", hours: 0 },
    { month: "Jul", hours: 0 },
    { month: "Aug", hours: 0 },
    { month: "Sep", hours: 0 },
    { month: "Oct", hours: 0 },
    { month: "Nov", hours: 0 },
    { month: "Dec", hours: 0 },
  ];

  const stats = dashboardData?.stats || {
    workHours: 0,
    workMinutes: 0,
    onTime: 0,
    late: 0,
    absent: 0
  };

  const displayMonth = dashboardData?.displayMonth || 'Loading...';
  const totalWorkDisplay = `${stats.workHours}h ${stats.workMinutes}m`;

  const maxHours = Math.max(...workHoursData.map(d => d.hours), 1);

  // Calculate donut chart angles
  const total = attendanceData.ontime + attendanceData.late + attendanceData.absent || 1;
  const ontimePercent = (attendanceData.ontime / total) * 100;
  const latePercent = (attendanceData.late / total) * 100;
  const absentPercent = (attendanceData.absent / total) * 100;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D395E]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-lg p-4 border ${isDark ? 'bg-red-900/20 border-red-700/50 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
        <p className="font-medium">{t("dashboard.errorLoading")}</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* STAT CARDS - 4 cards like admin dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title={t("dashboard.workHours")}
          value={totalWorkDisplay}
          icon={Clock}
          iconColor="bg-[#1D395E]"
          updateDate={displayMonth}
        />
        <StatCard
          title={t("dashboard.onTime")}
          value={String(stats.onTime)}
          icon={CheckCircle}
          iconColor="bg-[#2D5F3F]"
          updateDate={displayMonth}
        />
        <StatCard
          title={t("dashboard.late")}
          value={String(stats.late)}
          icon={AlertCircle}
          iconColor="bg-[#D4AF37]"
          updateDate={displayMonth}
        />
        <StatCard
          title={t("dashboard.absent")}
          value={String(stats.absent)}
          icon={XCircle}
          iconColor="bg-[#8B3A3A]"
          updateDate={displayMonth}
        />
      </div>

      {/* Attendance Summary & Leave Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        {/* Attendance Summary */}
        <div className={`rounded-2xl shadow-sm border p-5 lg:p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{t("dashboard.attendanceSummary")}</h3>
            <div className="relative">
              <button
                onClick={() => {
                  setShowAttendanceDropdown(!showAttendanceDropdown);
                  setShowLeaveDropdown(false);
                  setShowWorkHoursDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#1D395E] text-white rounded-full text-sm font-medium"
              >
                {attendanceFilter === "month" ? t("time.month") : attendanceFilter === "week" ? t("time.week") : t("time.year")}
                <ChevronDown className={`w-4 h-4 transition-transform ${showAttendanceDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showAttendanceDropdown && (
                <div className={`absolute right-0 top-full mt-2 w-32 rounded-xl shadow-lg border py-1 z-20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {[{key: "week", label: t("time.week")}, {key: "month", label: t("time.month")}, {key: "year", label: t("time.year")}].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setAttendanceFilter(opt.key);
                        setShowAttendanceDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${
                        attendanceFilter === opt.key ? (isDark ? "text-blue-400 font-medium" : "text-[#1D395E] font-medium") : (isDark ? "text-gray-300" : "text-gray-700")
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              {/* SVG Donut Chart */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Ontime - Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#2D5F3F"
                  strokeWidth="20"
                  strokeDasharray={`${ontimePercent * 2.51} ${251 - ontimePercent * 2.51}`}
                  strokeDashoffset="0"
                />
                {/* Late - Red */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="20"
                  strokeDasharray={`${latePercent * 2.51} ${251 - latePercent * 2.51}`}
                  strokeDashoffset={`${-ontimePercent * 2.51}`}
                />
                {/* Absent - Yellow/Orange */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="20"
                  strokeDasharray={`${absentPercent * 2.51} ${251 - absentPercent * 2.51}`}
                  strokeDashoffset={`${-(ontimePercent + latePercent) * 2.51}`}
                />
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t("common.total")}</span>
                <span className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{t("dashboard.attendance")}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2D5F3F]" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t("dashboard.onTime")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t("dashboard.late")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t("dashboard.absent")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Summary */}
        <div className={`rounded-2xl shadow-sm border p-5 lg:p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{t("dashboard.leaveSummary")}</h3>
            <div className="relative">
              <button
                onClick={() => {
                  setShowLeaveDropdown(!showLeaveDropdown);
                  setShowAttendanceDropdown(false);
                  setShowWorkHoursDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#1D395E] text-white rounded-full text-sm font-medium"
              >
                {t("time.timeRange")}
                <ChevronDown className={`w-4 h-4 transition-transform ${showLeaveDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showLeaveDropdown && (
                <div className={`absolute right-0 top-full mt-2 w-40 rounded-xl shadow-lg border py-1 z-20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {[{key: "thisMonth", label: t("time.thisMonth")}, {key: "thisYear", label: t("time.thisYear")}, {key: "allTime", label: t("time.allTime")}].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setLeaveFilter(opt.key);
                        setShowLeaveDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Total Quota */}
          <div className={`border rounded-xl p-4 mb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-300'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t("dashboard.totalQuotaAnnualLeave")}</span>
            </div>
            <p className={`text-2xl font-bold mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{LEAVE_DATA.totalQuota} <span className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t("time.days")}</span></p>
            <button className={`text-sm font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`}>
              {t("dashboard.requestLeave")}
            </button>
          </div>

          {/* Taken & Remaining */}
          <div className="grid grid-cols-2 gap-4">
            {/* Taken */}
            <div className={`border rounded-xl p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t("dashboard.taken")}</span>
              </div>
              <p className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{LEAVE_DATA.taken} <span className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t("time.days")}</span></p>
              <button className={`flex items-center gap-1.5 text-sm font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`}>
                <Eye className="w-4 h-4" />
                {t("common.seeDetails")}
              </button>
            </div>

            {/* Remaining */}
            <div className={`border rounded-xl p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2D5F3F]" />
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t("dashboard.remaining")}</span>
              </div>
              <p className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{LEAVE_DATA.remaining} <span className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t("time.days")}</span></p>
              <button className={`flex items-center gap-1.5 text-sm font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`}>
                <Send className="w-4 h-4" />
                {t("dashboard.requestLeave")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Your Work Hours */}
      <div className={`rounded-2xl shadow-sm border p-5 lg:p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{t("dashboard.yourWorkHours")}</h3>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{totalWorkDisplay}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setShowWorkHoursDropdown(!showWorkHoursDropdown);
                setShowAttendanceDropdown(false);
                setShowLeaveDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1D395E] text-white rounded-full text-sm font-medium"
            >
              {t("dashboard.viewBy")} {workHoursFilter === "day" ? t("time.day") : workHoursFilter === "week" ? t("time.week") : t("time.month")}
              <ChevronDown className={`w-4 h-4 transition-transform ${showWorkHoursDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showWorkHoursDropdown && (
              <div className={`absolute right-0 top-full mt-2 w-40 rounded-xl shadow-lg border py-1 z-20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {[{key: "day", label: t("time.day")}, {key: "week", label: t("time.week")}, {key: "month", label: t("time.month")}].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setWorkHoursFilter(opt.key);
                      setShowWorkHoursDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${
                      workHoursFilter === opt.key ? (isDark ? "text-blue-400 font-medium" : "text-[#1D395E] font-medium") : (isDark ? "text-gray-300" : "text-gray-700")
                    }`}
                  >
                    {t("dashboard.viewBy")} {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="relative">
          {/* Dashed guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className={`border-t border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
            <div className={`border-t border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
            <div className={`border-t border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-4">
            {workHoursData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full max-w-[40px] rounded-t-lg transition-all ${isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#A8C5DA] hover:bg-[#7BA3C0]'}`}
                  style={{ height: `${(item.hours / maxHours) * 100}%` }}
                />
                <span className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
