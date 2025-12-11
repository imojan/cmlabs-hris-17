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

// Pages (employees & attendance)
import { EmployeeDatabase } from "../../employees/pages/EmployeeDatabase";
import { AddEmployeeAdmin } from "../../employees/pages/AddEmployeeAdmin";
import { ViewEmployeeAdmin } from "../../employees/pages/ViewEmployeeAdmin";
import { EditEmployeeAdmin } from "../../employees/pages/EditEmployeeAdmin";
import { AttendanceAdmin } from "../../attendance/pages/AttendanceAdmin";

// Lazy load AddCheckclockAdmin to fix HMR blocking issue
const AddCheckclockAdmin = lazy(() =>
  import("../../attendance/pages/AddCheckClockAdmin")
);

// ====================== CONSTANTS ======================

// mapping nama page → judul yang muncul di header & tab browser
const PAGE_TITLES = {
  dashboard: "Dashboard",
  "employee-database": "Employee Database",
  "employee-add": "Add Employee Database",
  "employee-view": "View Employee Database",
  "employee-edit": "Edit Employee Database",
  checkclock: "Checkclock",
  "checkclock-add-admin": "Add Checkclock Admin",
  "work-schedule": "Work Schedule",
};

// mapping nama page → URL path (hanya yang diakses lewat sidebar)
const PAGE_TO_PATH = {
  dashboard: "/admin/dashboard",
  "employee-database": "/admin/employees-database",
  "employee-add": "/admin/employees/add",
  checkclock: "/admin/checkclock",
  "checkclock-add-admin": "/admin/checkclock/add",
  "work-schedule": "/admin/work-schedule",
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

  // default fallback
  return "dashboard";
}

// ====================== COMPONENT ======================

export default function AdminDashboard() {
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
    const path = PAGE_TO_PATH[page] ?? "/admin/dashboard";
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
                  title="Total Employees"
                  value={145}
                  icon={Users}
                  iconColor="bg-[#1D395E]"
                  updateDate="March 16, 2025"
                />
                <StatCard
                  title="New Employees"
                  value={145}
                  icon={UserPlus}
                  iconColor="bg-[#D4AF37]"
                  updateDate="March 16, 2025"
                />
                <StatCard
                  title="Active Employees"
                  value={145}
                  icon={UserCheck}
                  iconColor="bg-[#2D5F3F]"
                  updateDate="March 16, 2025"
                />
                <StatCard
                  title="Past Employees"
                  value={145}
                  icon={UserX}
                  iconColor="bg-[#8B3A3A]"
                  updateDate="March 16, 2025"
                />
              </div>

              {/* EMPLOYEE CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                <EmployeeChart />
                <EmployeeStatusChart />
              </div>

              {/* ATTENDANCE (PIE + TABLE) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                <AttendanceChart />
                <AttendanceTable />
              </div>
            </>
          )}

          {/* ================= CHECKCLOCK PAGES ================= */}
          {currentPage === "checkclock" && <AttendanceAdmin />}

          {currentPage === "checkclock-add-admin" && (
            <Suspense
              fallback={<div className="p-8 text-center">Loading...</div>}
            >
              <AddCheckclockAdmin />
            </Suspense>
          )}

          {/* ================= WORK SCHEDULE ================= */}
          {currentPage === "work-schedule" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-[#1D395E] mb-2">
                Work Schedule
              </h2>
              <p className="text-sm text-gray-600">
                Halaman Work Schedule nanti kamu isi di sini (component khusus
                bisa kamu buat dan import, lalu ganti placeholder ini).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
