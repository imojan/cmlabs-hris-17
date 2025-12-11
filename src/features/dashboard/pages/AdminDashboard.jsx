// src/features/dashboard/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

import { Header } from "../../../components/ui/Header";
import { Sidebar } from "../../../components/ui/Sidebar";
import { StatCard } from "../../../components/ui/StatCard";

import { EmployeeChart } from "../../../components/charts/EmployeeChart";
import { EmployeeStatusChart } from "../../../components/charts/EmployeeStatusChart";
import { AttendanceChart } from "../../../components/charts/AttendanceChart";
import { AttendanceTable } from "../../../components/ui/AttendanceTable";


// kalau kamu taruh EmployeeDatabase di
// src/features/employees/pages/EmployeeDatabase.jsx
import { EmployeeDatabase } from "../../employees/pages/EmployeeDatabase";
import { AttendanceAdmin } from "../../attendance/pages/AttendanceAdmin";
import { AddCheckclockAdmin } from "../../attendance/pages/AddCheckClockAdmin";

// mapping nama page → judul yang muncul di header & tab browser
const PAGE_TITLES = {
  dashboard: "Dashboard",
  "employee-database": "Employee Database",
  checkclock: "Checkclock",
  "checkclock-add-admin": "Add Checkclock Admin",
  "work-schedule": "Work Schedule",
};

// mapping URL path → nama page
const PATH_TO_PAGE = {
  "/admin/dashboard": "dashboard",
  "/admin/employees-database": "employee-database",
  "/admin/checkclock": "checkclock",
  "/admin/checkclock/add": "checkclock-add-admin",
  "/admin/work-schedule": "work-schedule",
};

// mapping nama page → URL path
const PAGE_TO_PATH = {
  dashboard: "/admin/dashboard",
  "employee-database": "/admin/employees-database",
  checkclock: "/admin/checkclock",
  "checkclock-add-admin": "/admin/checkclock/add",
  "work-schedule": "/admin/work-schedule",
};

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // currentPage diambil dari URL, bukan dari state
  const currentPage = PATH_TO_PAGE[location.pathname] ?? "dashboard";

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
          {currentPage === "employee-database" && (
            // ===== HALAMAN EMPLOYEE DATABASE =====
            <EmployeeDatabase />
          )}

          {currentPage === "dashboard" && (
            // ===== HALAMAN DASHBOARD DEFAULT =====
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

          {currentPage === "checkclock" && <AttendanceAdmin />}
          {currentPage === "checkclock-add-admin" && <AddCheckclockAdmin />}

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