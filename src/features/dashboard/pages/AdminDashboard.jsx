// src/features/dashboard/pages/AdminDashboard.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

import { Header } from "../../../components/ui/Header";
import { Sidebar } from "../../../components/ui/Sidebar";
import { StatCard } from "../../../components/ui/StatCard";

import { EmployeeChart } from "../../../components/charts/EmployeeChart";
import { EmployeeStatusChart } from "../../../components/charts/EmployeeStatusChart";
import { AttendanceChart } from "../../../components/charts/AttendanceChart";
import { AttendanceTable } from "../../../components/ui/AttendanceTable";

import dashboardService from "../../../app/services/dashboard.api";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useTheme } from "@/app/hooks/useTheme";

// Pages (employees & attendance)
import { EmployeeDatabase } from "../../employees/pages/EmployeeDatabase";
import { AddEmployeeAdmin } from "../../employees/pages/AddEmployeeAdmin";
import { ViewEmployeeAdmin } from "../../employees/pages/ViewEmployeeAdmin";
import { EditEmployeeAdmin } from "../../employees/pages/EditEmployeeAdmin";
import { AttendanceAdmin } from "../../attendance/pages/AttendanceAdmin";
import { WorkScheduleAdmin } from "../../work-schedule/pages/WorkScheduleAdmin";
import FaqHelpAdmin from "../../faq-help/pages/FaqHelpAdmin";

// Settings pages (universal - works for both admin and user)
import Settings from "../../settings/pages/Settings";
import ProfileSettings from "../../settings/pages/ProfileSettings";
import LocationSettings from "../../settings/pages/LocationSettings";

// Notifications page
import NotificationsPage from "../../notifications/pages/NotificationsPage";

// Lazy load AddCheckclockAdmin to fix HMR blocking issue
const AddCheckclockAdmin = lazy(() =>
  import("../../attendance/pages/AddCheckClockAdmin")
);

// ====================== CONSTANTS ======================

// mapping nama page → URL path (hanya yang diakses lewat sidebar)
const PAGE_TO_PATH = {
  dashboard: "/admin/dashboard",
  "employee-database": "/admin/employees-database",
  "employee-add": "/admin/employees/add",
  checkclock: "/admin/checkclock",
  "checkclock-add-admin": "/admin/checkclock/add",
  "work-schedule": "/admin/work-schedule",
  "faq-help": "/admin/faq-help",
  settings: "/admin/settings",
  "settings-profile": "/admin/settings/profile",
  "settings-locations": "/admin/settings/locations",
};

// helper untuk menentukan nama page dari pathname
function getCurrentPage(pathname) {
  if (pathname === "/admin/dashboard") return "dashboard";
  if (pathname === "/admin/employees-database") return "employee-database";
  if (pathname === "/admin/employees/add") return "employee-add";

  // /admin/employees/:id/edit → employee-edit
  if (
    pathname.startsWith("/admin/employees/") &&
    pathname.endsWith("/edit")
  ) {
    return "employee-edit";
  }

  // /admin/employees/:id → employee-view
  if (pathname.startsWith("/admin/employees/")) {
    return "employee-view";
  }

  if (pathname === "/admin/checkclock") return "checkclock";
  if (pathname === "/admin/checkclock/add") return "checkclock-add-admin";
  if (pathname === "/admin/work-schedule") return "work-schedule";
  if (pathname === "/admin/faq-help") return "faq-help";
  if (pathname === "/admin/settings/profile") return "settings-profile";
  if (pathname === "/admin/settings/locations") return "settings-locations";
  if (pathname === "/admin/settings") return "settings";
  if (pathname === "/admin/notifications") return "notifications";

  // default fallback
  return "dashboard";
}

// ====================== COMPONENT ======================

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Dashboard data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [employeeChartData, setEmployeeChartData] = useState(null);
  const [statusChartData, setStatusChartData] = useState(null);
  const [attendanceChartData, setAttendanceChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic page titles based on language
  const getPageTitles = () => ({
    dashboard: t("nav.dashboard"),
    "employee-database": t("nav.employeeDatabase"),
    "employee-add": t("employee.addEmployee"),
    "employee-view": t("employee.viewEmployee"),
    "employee-edit": t("employee.editEmployee"),
    checkclock: t("nav.attendance"),
    "checkclock-add-admin": t("attendance.addAttendance"),
    "work-schedule": t("nav.workSchedule"),
    "faq-help": t("nav.faqHelp"),
    settings: t("nav.settings"),
    "settings-profile": t("settings.profileSettings"),
    "settings-locations": t("settings.locationSettings"),
    notifications: t("nav.notifications"),
  });

  const PAGE_TITLES = getPageTitles();

  // currentPage diambil dari URL
  const currentPage = getCurrentPage(location.pathname);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      if (currentPage !== "dashboard") return;
      
      setLoading(true);
      try {
        // Fetch all dashboard data in parallel
        const [statsRes, empChartRes, statusChartRes, attChartRes] = await Promise.all([
          dashboardService.getAdminStats(),
          dashboardService.getEmployeeChart(),
          dashboardService.getStatusChart(),
          dashboardService.getAttendanceChart(),
        ]);

        if (statsRes.success) {
          setDashboardStats(statsRes.data);
        }

        if (empChartRes.success) {
          // Store raw data, transform labels in render
          setEmployeeChartData(empChartRes.data);
        }

        if (statusChartRes.success) {
          setStatusChartData(statusChartRes.data);
        }

        if (attChartRes.success) {
          setAttendanceChartData({
            data: attChartRes.data,
            date: attChartRes.date,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [currentPage]);

  // === UPDATE <title> BERDASARKAN currentPage ===
  useEffect(() => {
    const titles = {
      dashboard: t("nav.dashboard"),
      "employee-database": t("nav.employeeDatabase"),
      "employee-add": t("employee.addEmployee"),
      "employee-view": t("employee.viewEmployee"),
      "employee-edit": t("employee.editEmployee"),
      checkclock: t("nav.attendance"),
      "checkclock-add-admin": t("attendance.addAttendance"),
      "work-schedule": t("nav.workSchedule"),
      "faq-help": t("nav.faqHelp"),
      settings: t("nav.settings"),
      "settings-profile": t("settings.profileSettings"),
      "settings-locations": t("settings.locationSettings"),
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
    const path = PAGE_TO_PATH[page] ?? "/admin/dashboard";
    navigate(path);
  };

  const headerTitle = PAGE_TITLES[currentPage] ?? t("nav.dashboard");

  // Dynamic background based on theme
  const mainBg = isDark ? "bg-gray-900" : "bg-gray-50";

  return (
    <div className={`min-h-screen ${mainBg} transition-colors duration-300`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        currentPage={currentPage}
        onNavigate={handleNavigate}
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
          {/* ================= EMPLOYEE PAGES ================= */}
          {currentPage === "employee-database" && <EmployeeDatabase />}

          {currentPage === "employee-add" && <AddEmployeeAdmin />}

          {currentPage === "employee-view" && <ViewEmployeeAdmin />}

          {currentPage === "employee-edit" && <EditEmployeeAdmin />}

          {/* ================= DASHBOARD DEFAULT ================= */}
          {currentPage === "dashboard" && (
            <>
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <StatCard
                  title={t("dashboard.totalEmployees")}
                  value={dashboardStats?.employees?.total ?? 0}
                  icon={Users}
                  iconColor="bg-[#1D395E]"
                  updateDate={new Date().toLocaleDateString(t("common.locale"), { month: "long", day: "numeric", year: "numeric" })}
                />
                <StatCard
                  title={t("dashboard.newEmployees")}
                  value={dashboardStats?.employees?.new ?? 0}
                  icon={UserPlus}
                  iconColor="bg-[#D4AF37]"
                  updateDate={new Date().toLocaleDateString(t("common.locale"), { month: "long", day: "numeric", year: "numeric" })}
                />
                <StatCard
                  title={t("dashboard.activeEmployees")}
                  value={dashboardStats?.employees?.active ?? 0}
                  icon={UserCheck}
                  iconColor="bg-[#2D5F3F]"
                  updateDate={new Date().toLocaleDateString(t("common.locale"), { month: "long", day: "numeric", year: "numeric" })}
                />
                <StatCard
                  title={t("dashboard.pastEmployees")}
                  value={dashboardStats?.employees?.past ?? 0}
                  icon={UserX}
                  iconColor="bg-[#8B3A3A]"
                  updateDate={new Date().toLocaleDateString(t("common.locale"), { month: "long", day: "numeric", year: "numeric" })}
                />
              </div>

              {/* EMPLOYEE CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                <EmployeeChart monthlyData={employeeChartData} loading={loading} />
                <EmployeeStatusChart statusData={statusChartData} loading={loading} />
              </div>

              {/* ATTENDANCE (PIE + TABLE) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                <AttendanceChart 
                  attendanceData={attendanceChartData?.data} 
                  date={attendanceChartData?.date}
                  loading={loading} 
                />
                <AttendanceTable 
                  attendanceData={dashboardStats?.todayAttendance}
                  summary={dashboardStats?.attendance}
                  loading={loading}
                />
              </div>
            </>
          )}

          {/* ================= CHECKCLOCK PAGES ================= */}
          {currentPage === "checkclock" && <AttendanceAdmin />}

          {currentPage === "checkclock-add-admin" && (
            <Suspense
              fallback={<div className="p-8 text-center">{t("common.loading")}</div>}
            >
              <AddCheckclockAdmin />
            </Suspense>
          )}

          {/* ================= WORK SCHEDULE ================= */}
          {currentPage === "work-schedule" && <WorkScheduleAdmin />}

          {/* ================= FAQ & HELP ================= */}
          {currentPage === "faq-help" && <FaqHelpAdmin />}

          {/* ================= SETTINGS ================= */}
          {currentPage === "settings" && <Settings />}
          {currentPage === "settings-profile" && <ProfileSettings />}
          {currentPage === "settings-locations" && <LocationSettings />}

          {/* ================= NOTIFICATIONS ================= */}
          {currentPage === "notifications" && <NotificationsPage />}
        </div>
      </div>
    </div>
  );
}
