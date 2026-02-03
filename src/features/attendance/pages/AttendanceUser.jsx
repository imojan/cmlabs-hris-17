// src/features/attendance/pages/AttendanceUser.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Eye,
  X,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "@/app/services/attendance.api";
import { useTheme } from "@/app/hooks/useTheme";
import { useTranslation } from "@/app/hooks/useTranslation";

export function AttendanceUser() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRecordsDropdown, setShowRecordsDropdown] = useState(false);

  // Stats for cards
  const [stats, setStats] = useState({
    workHours: 0,
    onTime: 0,
    late: 0,
    absent: 0,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await attendanceService.getUserAttendance();
        
        // Transform API data to match UI format
        const transformedData = (response || []).map((item) => {
          // Format date
          const dateObj = item.date ? new Date(item.date) : new Date();
          const formattedDate = dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          });

          // Format clock times
          const formatTime = (timeStr) => {
            if (!timeStr) return "-";
            const date = new Date(timeStr);
            const hours = String(date.getHours()).padStart(2, "0");
            const mins = String(date.getMinutes()).padStart(2, "0");
            return `${hours}.${mins}`;
          };

          // Determine status display
          let status = "On Time";
          if (item.approval === "PENDING") {
            status = "Waiting Approval";
          } else if (item.approval === "REJECTED") {
            status = "Rejected";
          } else if (item.type === "ANNUAL_LEAVE") {
            status = "Annual Leave";
          } else if (item.type === "SICK_LEAVE") {
            status = "Sick";
          } else if (item.type === "ABSENT") {
            status = "Absent";
          } else if (item.type === "CLOCK_IN") {
            // Check status from backend (ON_TIME or LATE)
            status = item.approval === "APPROVED" 
              ? (item.status === "LATE" ? "Late" : "On Time")
              : "Waiting Approval";
          }

          return {
            id: item.id,
            date: formattedDate,
            clockIn: item.clockIn ? formatTime(item.clockIn) : "-",
            clockOut: item.clockOut ? formatTime(item.clockOut) : "-",
            workHours: item.workHours || "-",
            status,
            type: item.type,
          };
        });

        setData(transformedData);

        // Calculate stats
        const onTimeCount = transformedData.filter(
          (d) => d.status === "On Time"
        ).length;
        const lateCount = transformedData.filter(
          (d) => d.status === "Late"
        ).length;
        const absentCount = transformedData.filter(
          (d) => d.status === "Absent" || d.status === "Sick" || d.status === "Annual Leave"
        ).length;

        // Calculate total work hours (simplified - just count entries with work hours)
        let totalWorkHours = 0;
        transformedData.forEach((d) => {
          if (d.workHours && d.workHours !== "-") {
            const match = d.workHours.match(/(\d+)/);
            if (match) totalWorkHours += parseInt(match[1], 10);
          }
        });

        setStats({
          workHours: totalWorkHours,
          onTime: onTimeCount,
          late: lateCount,
          absent: absentCount,
        });
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        setError(err.message || "Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch = item.date.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + recordsPerPage);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "on time":
        return (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium min-w-[100px] ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
            On Time
          </span>
        );
      case "late":
        return (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium min-w-[100px] ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-gray-200 text-gray-700'}`}>
            Late
          </span>
        );
      case "annual leave":
        return (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium border min-w-[100px] ${isDark ? 'bg-blue-900/20 border-blue-700/50 text-blue-400' : 'bg-white border-gray-300 text-gray-700'}`}>
            Annual Leave
          </span>
        );
      case "sick":
        return (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium min-w-[100px] ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-200 text-gray-600'}`}>
            Sick
          </span>
        );
      case "waiting approval":
        return (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium border min-w-[100px] ${isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50' : 'bg-[#E8F4EA] text-[#2D5F3F] border-[#2D5F3F]/20'}`}>
            Waiting Approval
          </span>
        );
      case "rejected":
        return (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium min-w-[100px] ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
            Rejected
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium min-w-[100px] ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            {status}
          </span>
        );
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#1D395E]" />
          <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Memuat data absensi...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className={`rounded-xl p-4 border ${isDark ? 'bg-red-900/20 border-red-700/50 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <p className="font-medium">Gagal memuat data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* ===== STAT CARDS - Style like Employee Database ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Card 1: Work Hours */}
            <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
              <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#1D395E]" />
                </div>
                <p className="text-white font-medium">Work Hours</p>
              </div>
              <div className="p-5">
                <p className={`text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{stats.workHours}</p>
              </div>
            </div>

            {/* Card 2: On Time */}
            <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
              <div className="bg-[#2D5F3F] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2D5F3F]" />
                </div>
                <p className="text-white font-medium">On Time</p>
              </div>
              <div className="p-5">
                <p className={`text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{stats.onTime}</p>
              </div>
            </div>

            {/* Card 3: Late */}
            <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
              <div className="bg-[#D4AF37] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <p className="text-white font-medium">Late</p>
              </div>
              <div className="p-5">
                <p className={`text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{stats.late}</p>
              </div>
            </div>

            {/* Card 4: Absent */}
            <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
              <div className="bg-[#8B3A3A] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-[#8B3A3A]" />
                </div>
                <p className="text-white font-medium">Absent</p>
              </div>
              <div className="p-5">
                <p className={`text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{stats.absent}</p>
              </div>
            </div>
          </div>

      {/* Main Table Card */}
      <section className={`rounded-2xl border shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
        {/* Header with Search & Actions */}
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{t("attendance.overview")}</h2>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={t("attendance.searchEmployee")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full sm:w-64 pl-4 pr-10 py-2.5 border rounded-full text-sm focus:outline-none focus:border-[#1D395E] focus:ring-2 focus:ring-[#1D395E]/20 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'border-gray-200'}`}
              />
              <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowRecordsDropdown(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <Filter className="w-4 h-4" />
                {t("common.filter")}
              </button>
              {showFilterDropdown && (
                <div className={`absolute right-0 top-full mt-2 w-40 rounded-xl shadow-lg border py-1 z-20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {["all", "on time", "late", "annual leave", "sick", "waiting approval"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFilterStatus(opt);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm capitalize ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${
                        filterStatus === opt ? (isDark ? "text-blue-400 font-medium bg-gray-700" : "text-[#1D395E] font-medium bg-gray-50") : (isDark ? "text-gray-300" : "text-gray-700")
                      }`}
                    >
                      {opt === "all" ? t("common.all") + " " + t("common.status") : opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Button */}
            <button
              onClick={() => navigate("/user/checkclock/add")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1D395E] text-white rounded-lg hover:bg-[#2a4a6e] transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              {t("attendance.addData")}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <th className={`text-center px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-[#1D395E]'}`}>{t("common.date")}</th>
                <th className={`text-center px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-[#1D395E]'}`}>{t("attendance.clockIn")}</th>
                <th className={`text-center px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-[#1D395E]'}`}>{t("attendance.clockOut")}</th>
                <th className={`text-center px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-[#1D395E]'}`}>{t("attendance.workHours")}</th>
                <th className={`text-center px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-[#1D395E]'}`}>{t("common.status")}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`px-6 py-12 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                      <p className="font-medium">{t("attendance.noAttendanceData")}</p>
                      <p className="text-sm">{t("attendance.clickAddData")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'}`}>
                    <td className={`px-6 py-4 text-sm text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.date}</td>
                    <td className={`px-6 py-4 text-sm text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.clockIn}</td>
                    <td className={`px-6 py-4 text-sm text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.clockOut}</td>
                    <td className={`px-6 py-4 text-sm text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.workHours}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(item.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          {/* Records per page */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Showing</span>
            <div className="relative">
              <button
                onClick={() => {
                  setShowRecordsDropdown(!showRecordsDropdown);
                  setShowFilterDropdown(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm ${isDark ? 'border-gray-600 text-gray-300 bg-gray-700' : 'border-gray-300 text-gray-700 bg-white'}`}
              >
                {recordsPerPage}
                <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
              {showRecordsDropdown && (
                <div className={`absolute left-0 bottom-full mb-2 w-20 rounded-lg shadow-lg border py-1 z-20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setRecordsPerPage(num);
                        setShowRecordsDropdown(false);
                      }}
                      className={`w-full text-center px-3 py-1.5 text-sm ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${
                        recordsPerPage === num ? (isDark ? "text-blue-400 font-medium" : "text-[#1D395E] font-medium") : (isDark ? "text-gray-300" : "text-gray-700")
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Showing {totalRecords === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + recordsPerPage, totalRecords)} out of {totalRecords} records
          </p>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? "bg-[#1D395E] text-white"
                    : isDark ? "border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300" : "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}
