// src/features/attendance/pages/AttendanceUser.jsx
import { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample data for current user's attendance
const initialData = [
  {
    id: 1,
    date: "March 01, 2025",
    clockIn: "08.00",
    clockOut: "16.30",
    workHours: "10h. 5m",
    status: "Waiting Approval",
  },
  {
    id: 2,
    date: "March 02, 2025",
    clockIn: "08.00",
    clockOut: "17.15",
    workHours: "9h. 50m",
    status: "On Time",
  },
  {
    id: 3,
    date: "March 03, 2025",
    clockIn: "09.00",
    clockOut: "16.45",
    workHours: "10h. 30m",
    status: "On Time",
  },
  {
    id: 4,
    date: "March 04, 2025",
    clockIn: "09.15",
    clockOut: "15.30",
    workHours: "6h. 15m",
    status: "Late",
  },
  {
    id: 5,
    date: "March 05, 2025",
    clockIn: "0",
    clockOut: "0",
    workHours: "0",
    status: "Annual Leave",
  },
  {
    id: 6,
    date: "March 06, 2025",
    clockIn: "0",
    clockOut: "0",
    workHours: "0",
    status: "Sick",
  },
  {
    id: 7,
    date: "March 07, 2025",
    clockIn: "08.00",
    clockOut: "16.00",
    workHours: "8h. 30m",
    status: "Waiting Approval",
  },
];

export function AttendanceUser() {
  const navigate = useNavigate();
  const [data] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRecordsDropdown, setShowRecordsDropdown] = useState(false);

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch = item.date.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalRecords = 25; // Simulated total
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + recordsPerPage);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "on time":
        return (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 min-w-[100px]">
            On Time
          </span>
        );
      case "late":
        return (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-200 text-gray-700 min-w-[100px]">
            Late
          </span>
        );
      case "annual leave":
        return (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-300 text-gray-700 min-w-[100px]">
            Annual Leave
          </span>
        );
      case "sick":
        return (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 min-w-[100px]">
            Sick
          </span>
        );
      case "waiting approval":
        return (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[#E8F4EA] text-[#2D5F3F] border border-[#2D5F3F]/20 min-w-[100px]">
            Waiting Approval
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 min-w-[100px]">
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
      {/* ===== STAT CARDS - Style like Employee Database ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Card 1: Work Hours */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium">Work Hours</p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">145</p>
          </div>
        </div>

        {/* Card 2: On Time */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#2D5F3F] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#2D5F3F]" />
            </div>
            <p className="text-white font-medium">On Time</p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">145</p>
          </div>
        </div>

        {/* Card 3: Late */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#D4AF37] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <p className="text-white font-medium">Late</p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">145</p>
          </div>
        </div>

        {/* Card 4: Absent */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#8B3A3A] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <XCircle className="w-5 h-5 text-[#8B3A3A]" />
            </div>
            <p className="text-white font-medium">Absent</p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">145</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm">
        {/* Header with Search & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#1D395E]">Checkclock Overview</h2>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-4 pr-10 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#1D395E] focus:ring-2 focus:ring-[#1D395E]/20"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowRecordsDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                  {["all", "on time", "late", "annual leave", "sick", "waiting approval"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFilterStatus(opt);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize ${
                        filterStatus === opt ? "text-[#1D395E] font-medium bg-gray-50" : "text-gray-700"
                      }`}
                    >
                      {opt === "all" ? "All Status" : opt}
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
              Tambah Data
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#1D395E]">Date</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#1D395E]">Clock In</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#1D395E]">Clock Out</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#1D395E]">Work Hours</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#1D395E]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">{item.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">{item.clockIn}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">{item.clockOut}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">{item.workHours}</td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4">
          {/* Records per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Showing</span>
            <div className="relative">
              <button
                onClick={() => {
                  setShowRecordsDropdown(!showRecordsDropdown);
                  setShowFilterDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
              >
                {recordsPerPage}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {showRecordsDropdown && (
                <div className="absolute left-0 bottom-full mb-2 w-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setRecordsPerPage(num);
                        setShowRecordsDropdown(false);
                      }}
                      className={`w-full text-center px-3 py-1.5 text-sm hover:bg-gray-50 ${
                        recordsPerPage === num ? "text-[#1D395E] font-medium" : "text-gray-700"
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
          <p className="text-sm text-gray-500">
            Showing 1 to {Math.min(recordsPerPage, filteredData.length)} out of {totalRecords} records
          </p>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
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
                    : "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
