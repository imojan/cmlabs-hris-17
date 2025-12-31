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

// Attendance pages for user
import { AttendanceUser } from "../../attendance/pages/AttendanceUser";
import FaqHelpUser from "../../faq-help/pages/FaqHelpUser";

// Settings pages (universal - works for both admin and user)
import Settings from "../../settings/pages/Settings";
import ProfileSettings from "../../settings/pages/ProfileSettings";

// Lazy load AddCheckclockUser
const AddCheckclockUser = lazy(() =>
  import("../../attendance/pages/AddCheckclockUser")
);

// ====================== CONSTANTS ======================

// mapping nama page → judul yang muncul di header & tab browser
const PAGE_TITLES = {
  dashboard: "Dashboard",
  checkclock: "Checkclock",
  "checkclock-add": "Check In/Out",
  "faq-help": "FAQ & Help",
  settings: "Pengaturan",
  "settings-profile": "Pengaturan Profil",
};

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

  // default fallback
  return "dashboard";
}

// ====================== COMPONENT ======================

export default function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // currentPage diambil dari URL
  const currentPage = getCurrentPage(location.pathname);

  // === UPDATE <title> BERDASARKAN currentPage ===
  useEffect(() => {
    const pageTitle = PAGE_TITLES[currentPage] ?? "Dashboard";
    document.title = `${pageTitle} | HRIS`;
  }, [currentPage]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // dipanggil dari Sidebar, lalu kita ganti URL-nya
  const handleNavigate = (page) => {
    const path = PAGE_TO_PATH[page] ?? "/user/dashboard";
    navigate(path);
  };

  const headerTitle = PAGE_TITLES[currentPage] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50">
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
              fallback={<div className="p-8 text-center">Loading...</div>}
            >
              <AddCheckclockUser />
            </Suspense>
          )}

          {/* ================= FAQ & HELP ================= */}
          {currentPage === "faq-help" && <FaqHelpUser />}

          {/* ================= SETTINGS ================= */}
          {currentPage === "settings" && <Settings />}
          {currentPage === "settings-profile" && <ProfileSettings />}
        </div>
      </div>
    </div>
  );
}

// ====================== USER DASHBOARD CONTENT ======================
function UserDashboardContent() {
  const [attendanceFilter, setAttendanceFilter] = useState("month");
  const [_leaveFilter, setLeaveFilter] = useState("year");
  const [workHoursFilter, setWorkHoursFilter] = useState("week");
  const [showAttendanceDropdown, setShowAttendanceDropdown] = useState(false);
  const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
  const [showWorkHoursDropdown, setShowWorkHoursDropdown] = useState(false);

  // Sample data for attendance donut chart
  const attendanceData = {
    ontime: 142,
    late: 4,
    absent: 9,
    total: 155
  };

  // Sample data for leave (used in UI)
  const LEAVE_DATA = {
    totalQuota: 12,
    taken: 3,
    remaining: 9
  };

  // Sample data for work hours bar chart (monthly)
  const workHoursData = [
    { month: "Jan", hours: 45 },
    { month: "Feb", hours: 52 },
    { month: "Mar", hours: 48 },
    { month: "Apr", hours: 55 },
    { month: "May", hours: 58 },
    { month: "Jun", hours: 72 },
    { month: "Jul", hours: 42 },
    { month: "Aug", hours: 50 },
    { month: "Sep", hours: 35 },
    { month: "Oct", hours: 38 },
    { month: "Nov", hours: 48 },
    { month: "Dec", hours: 55 },
  ];

  const maxHours = Math.max(...workHoursData.map(d => d.hours));

  // Calculate donut chart angles
  const total = attendanceData.ontime + attendanceData.late + attendanceData.absent;
  const ontimePercent = (attendanceData.ontime / total) * 100;
  const latePercent = (attendanceData.late / total) * 100;
  const absentPercent = (attendanceData.absent / total) * 100;

  return (
    <>
      {/* STAT CARDS - 4 cards like admin dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Work Hours"
          value="145"
          icon={Clock}
          iconColor="bg-[#1D395E]"
          updateDate="Desember 2025"
        />
        <StatCard
          title="On Time"
          value="145"
          icon={CheckCircle}
          iconColor="bg-[#2D5F3F]"
          updateDate="Desember 2025"
        />
        <StatCard
          title="Late"
          value="145"
          icon={AlertCircle}
          iconColor="bg-[#D4AF37]"
          updateDate="Desember 2025"
        />
        <StatCard
          title="Absent"
          value="145"
          icon={XCircle}
          iconColor="bg-[#8B3A3A]"
          updateDate="Desember 2025"
        />
      </div>

      {/* Attendance Summary & Leave Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        {/* Attendance Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#1D395E]">Attendance Summary</h3>
            <div className="relative">
              <button
                onClick={() => {
                  setShowAttendanceDropdown(!showAttendanceDropdown);
                  setShowLeaveDropdown(false);
                  setShowWorkHoursDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#1D395E] text-white rounded-full text-sm font-medium"
              >
                {attendanceFilter === "month" ? "Month" : attendanceFilter === "week" ? "Week" : "Year"}
                <ChevronDown className={`w-4 h-4 transition-transform ${showAttendanceDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showAttendanceDropdown && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                  {["week", "month", "year"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setAttendanceFilter(opt);
                        setShowAttendanceDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize ${
                        attendanceFilter === opt ? "text-[#1D395E] font-medium" : "text-gray-700"
                      }`}
                    >
                      {opt}
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
                <span className="text-xs text-gray-500">Total</span>
                <span className="text-lg font-bold text-[#1D395E]">Presensi</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2D5F3F]" />
                <span className="text-sm text-gray-700">Ontime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
                <span className="text-sm text-gray-700">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="text-sm text-gray-700">Absent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#1D395E]">Leave Summary</h3>
            <div className="relative">
              <button
                onClick={() => {
                  setShowLeaveDropdown(!showLeaveDropdown);
                  setShowAttendanceDropdown(false);
                  setShowWorkHoursDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#1D395E] text-white rounded-full text-sm font-medium"
              >
                Rentang Waktu
                <ChevronDown className={`w-4 h-4 transition-transform ${showLeaveDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showLeaveDropdown && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                  {["This Month", "This Year", "All Time"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setLeaveFilter(opt);
                        setShowLeaveDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Total Quota */}
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="text-sm font-medium text-gray-700">Total Quota Annual Leave</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-3">{LEAVE_DATA.totalQuota} <span className="text-sm font-normal text-gray-500">hari</span></p>
            <button className="text-sm text-[#1D395E] hover:underline font-medium">
              Request Leave
            </button>
          </div>

          {/* Taken & Remaining */}
          <div className="grid grid-cols-2 gap-4">
            {/* Taken */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <span className="text-sm font-medium text-gray-700">Taken</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-4">{LEAVE_DATA.taken} <span className="text-sm font-normal text-gray-500">hari</span></p>
              <button className="flex items-center gap-1.5 text-sm text-[#1D395E] hover:underline font-medium">
                <Eye className="w-4 h-4" />
                See Details
              </button>
            </div>

            {/* Remaining */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2D5F3F]" />
                <span className="text-sm font-medium text-gray-700">Remaining</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-4">{LEAVE_DATA.remaining} <span className="text-sm font-normal text-gray-500">hari</span></p>
              <button className="flex items-center gap-1.5 text-sm text-[#1D395E] hover:underline font-medium">
                <Send className="w-4 h-4" />
                Request Leave
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Your Work Hours */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1D395E]">Your Work Hours</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">120h 54m</p>
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
              view by {workHoursFilter}
              <ChevronDown className={`w-4 h-4 transition-transform ${showWorkHoursDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showWorkHoursDropdown && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                {["day", "week", "month"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setWorkHoursFilter(opt);
                      setShowWorkHoursDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize ${
                      workHoursFilter === opt ? "text-[#1D395E] font-medium" : "text-gray-700"
                    }`}
                  >
                    view by {opt}
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
            <div className="border-t border-dashed border-gray-300" />
            <div className="border-t border-dashed border-gray-300" />
            <div className="border-t border-dashed border-gray-300" />
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-4">
            {workHoursData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full max-w-[40px] bg-[#A8C5DA] rounded-t-lg transition-all hover:bg-[#7BA3C0]"
                  style={{ height: `${(item.hours / maxHours) * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
