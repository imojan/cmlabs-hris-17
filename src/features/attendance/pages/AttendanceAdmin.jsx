// src/features/attendance/pages/AttendanceAdmin.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  Download,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "@/app/services/attendance.api";
import { Notification } from "@/components/ui/Notification";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ImportModal } from "@/components/ui/ImportModal";
import { exportToExcel } from "@/lib/exportExcel";
import { useTheme } from "@/app/hooks/useTheme";

const initialData = [
  {
    id: 1,
    name: "Juanita",
    role: "CEO",
    clockIn: "08.00",
    clockOut: "16.30",
    workHours: "10h 5m",
    status: "Waiting Approval",
    actualStatus: "On Time", // status setelah approved
    approvalStatus: "pending", // "pending" | "approved" | "rejected"

    // detail tambahan
    date: "1 March 2025",
    location: "Kantor Pusat",
    address: "Jl. Veteran No.1, Kota Malang",
    lat: "-7.983908",
    long: "112.621381",
    proofFile: "Proof of Attendance - Juanita.jpeg",
  },
  {
    id: 2,
    name: "Shane",
    role: "OB",
    clockIn: "08.00",
    clockOut: "17.15",
    workHours: "9h 50m",
    status: "Waiting Approval",
    actualStatus: "On Time",
    approvalStatus: "pending",

    date: "1 March 2025",
    location: "Kantor Pusat",
    address: "Jl. Veteran No.1, Kota Malang",
    lat: "-7.983908",
    long: "112.621381",
    proofFile: "Proof of Attendance - Shane.jpeg",
  },
  {
    id: 3,
    name: "Miles",
    role: "Head of HR",
    clockIn: "09.00",
    clockOut: "16.45",
    workHours: "10h 30m",
    status: "On Time",
    actualStatus: "On Time",
    approvalStatus: "approved",

    date: "1 March 2025",
    location: "Kantor Pusat",
    address: "Jl. Veteran No.1, Kota Malang",
    lat: "-7.983908",
    long: "112.621381",
    proofFile: "Proof of Attendance - Miles.jpeg",
  },
  {
    id: 4,
    name: "Flores",
    role: "Manager",
    clockIn: "09.15",
    clockOut: "15.30",
    workHours: "6h 15m",
    status: "Waiting Approval",
    actualStatus: "Late",
    approvalStatus: "pending",

    date: "1 March 2025",
    location: "Kantor Pusat",
    address: "Jl. Veteran No.1, Kota Malang",
    lat: "-7.983908",
    long: "112.621381",
    proofFile: "Proof of Attendance - Flores.jpeg",
  },
  {
    id: 5,
    name: "Henry",
    role: "CPO",
    clockIn: "0",
    clockOut: "0",
    workHours: "0",
    status: "Waiting Approval",
    actualStatus: "Annual Leave",
    approvalStatus: "pending",

    date: "1 March 2025",
    location: "Kantor Pusat",
    address: "Jl. Veteran No.1, Kota Malang",
    lat: "-7.983908",
    long: "112.621381",
    proofFile: "Proof of Attendance - Henry.jpeg",
  },
  {
    id: 6,
    name: "Sarah",
    role: "Manager",
    clockIn: "08.30",
    clockOut: "17.00",
    workHours: "8h 30m",
    status: "On Time",
    actualStatus: "On Time",
    approvalStatus: "approved",

    date: "1 March 2025",
    location: "Kantor Pusat",
    address: "Jl. Veteran No.1, Kota Malang",
    lat: "-7.983908",
    long: "112.621381",
    proofFile: "Proof of Attendance - Sarah.jpeg",
  },
  {
    id: 7,
    name: "Michael",
    role: "Staff",
    clockIn: "09.30",
    clockOut: "17.30",
    workHours: "8h 0m",
    status: "Waiting Approval",
    actualStatus: "Late",
    approvalStatus: "pending",

    date: "1 March 2025",
    location: "Kantor Pusat",
    address: "Jl. Veteran No.1, Kota Malang",
    lat: "-7.983908",
    long: "112.621381",
    proofFile: "Proof of Attendance - Michael.jpeg",
  },
  {
    id: 8,
    name: "Lisa",
    role: "Supervisor",
    clockIn: "0",
    clockOut: "0",
    workHours: "0",
    status: "Waiting Approval",
    actualStatus: "Sick",
    approvalStatus: "pending",

    date: "1 March 2025",
    location: "Kantor Pusat",
    address: "Jl. Veteran No.1, Kota Malang",
    lat: "-7.983908",
    long: "112.621381",
    proofFile: "Proof of Attendance - Lisa.jpeg",
  },
];

function statusClass(status) {
  switch (status) {
    case "On Time":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Late":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "ANNUAL LEAVE":
    case "Annual Leave":
      return "bg-sky-50 text-sky-700 border border-sky-200";
    case "SICK LEAVE":
    case "Sick Leave":
    case "Sick":
      return "bg-violet-50 text-violet-700 border border-violet-200";
    case "ABSENT":
    case "Absent":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Pending":
    case "Waiting Approval":
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

export function AttendanceAdmin() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Data & loading states
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Sort & Filter
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [exporting, setExporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Filter columns
  const filterColumns = [
    { key: "name", label: "Nama Karyawan" },
    { key: "role", label: "Jabatan" },
    { key: "clockIn", label: "Clock In" },
    { key: "clockOut", label: "Clock Out" },
    { key: "status", label: "Status" },
    { key: "approvalStatus", label: "Approval" },
  ];

  // modal approve / reject
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [decisionType, setDecisionType] = useState(""); // "approve" | "reject"
  const [approving, setApproving] = useState(false);

  // panel detail
  const [detailEmployee, setDetailEmployee] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch attendance data
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.getAll({
        page: currentPage,
        limit: recordsPerPage,
      });
      
      // Backend returns array directly
      const data = Array.isArray(response) ? response : (response?.data || []);
      
      // Map backend data to frontend format
      const mappedData = data.map((item) => ({
        id: item.id,
        employeeId: item.employeeId,
        name: item.employeeName || "Unknown",
        role: item.jobdesk || "-",
        avatar: item.avatar,
        clockIn: item.clockIn || "-",
        clockOut: item.clockOut || "-",
        workHours: item.workHours || "-",
        status: item.status || "-",
        actualStatus: item.status || "-",
        approvalStatus: item.approval?.toLowerCase() === "approved" 
          ? "approved" 
          : item.approval?.toLowerCase() === "rejected" 
          ? "rejected" 
          : "pending",
        attendanceType: item.attendanceType,
        createdByRole: item.createdByRole,
        canClockOut: item.canClockOut,
        // Detail info
        date: item.startDate 
          ? new Date(item.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
          : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        location: item.locationName || "-",
        address: item.address || "-",
        lat: item.latitude || "-",
        long: item.longitude || "-",
        // Clock In proof
        proofFile: item.proofName || (item.proofUrl ? "Clock In Proof" : null),
        proofUrl: item.proofUrl,
        // Clock Out proof (NEW)
        clockOutProofFile: item.clockOutProofName || (item.clockOutProofUrl ? "Clock Out Proof" : null),
        clockOutProofUrl: item.clockOutProofUrl,
        notes: item.notes,
        startDate: item.startDate,
        endDate: item.endDate,
      }));
      
      setAttendanceData(mappedData);
      setTotalRecords(response?.pagination?.total || mappedData.length);
      
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError(err?.message || "Gagal memuat data attendance");
      setNotification({
        type: "error",
        message: err?.message || "Gagal memuat data attendance",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Search, Sort & Filter data (client-side)
  const processedData = useMemo(() => {
    let result = [...attendanceData];
    
    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((item) => 
        (item.name && item.name.toLowerCase().includes(searchLower)) ||
        (item.role && item.role.toLowerCase().includes(searchLower)) ||
        (item.status && item.status.toLowerCase().includes(searchLower)) ||
        (item.employeeId && String(item.employeeId).toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key] ? String(a[sortConfig.key]).toLowerCase() : "";
        let bVal = b[sortConfig.key] ? String(b[sortConfig.key]).toLowerCase() : "";
        
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [attendanceData, debouncedSearch, sortConfig]);

  // Pagination calculation
  const totalPages = Math.ceil(processedData.length / recordsPerPage) || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = processedData.slice(startIndex, endIndex);

  // ====== EXPORT HANDLER ======
  const handleExport = () => {
    setExporting(true);
    
    try {
      const exportData = processedData.map((item) => ({
        nama: item.name,
        jabatan: item.role,
        tanggal: item.date,
        clockIn: item.clockIn,
        clockOut: item.clockOut,
        workHours: item.workHours,
        lokasi: item.location,
        status: item.status,
        approval: item.approvalStatus === "approved" ? "Approved" : item.approvalStatus === "rejected" ? "Rejected" : "Pending",
      }));

      exportToExcel({
        title: "DATA ABSENSI KARYAWAN",
        companyName: "CMLABS INDONESIA",
        reportDate: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        columns: [
          { header: "No.", key: "no", width: 5 },
          { header: "Nama Karyawan", key: "nama", width: 20 },
          { header: "Jabatan", key: "jabatan", width: 15 },
          { header: "Tanggal", key: "tanggal", width: 20 },
          { header: "Clock In", key: "clockIn", width: 10 },
          { header: "Clock Out", key: "clockOut", width: 10 },
          { header: "Jam Kerja", key: "workHours", width: 12 },
          { header: "Lokasi", key: "lokasi", width: 20 },
          { header: "Status", key: "status", width: 15 },
          { header: "Approval", key: "approval", width: 12 },
        ],
        data: exportData,
        filename: "data_absensi",
      });

      setNotification({
        type: "success",
        message: `Berhasil mengekspor ${exportData.length} data absensi`,
      });
    } catch (err) {
      console.error("Export error:", err);
      setNotification({
        type: "error",
        message: "Gagal mengekspor data",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleApprovalClick = (employee, type) => {
    setSelectedEmployee(employee);
    setDecisionType(type); // "approve" atau "reject"
    setShowModal(true);
  };

  const handleConfirmDecision = async () => {
    if (!selectedEmployee || !decisionType) return;

    setApproving(true);
    
    try {
      const action = decisionType === "approve" ? "APPROVED" : "REJECTED";
      await attendanceService.approve(selectedEmployee.id, action);
      
      setNotification({
        type: "success",
        message: `Attendance berhasil ${decisionType === "approve" ? "disetujui" : "ditolak"}`,
      });
      
      // Refresh data
      fetchAttendance();
      
    } catch (err) {
      console.error("Error approving attendance:", err);
      setNotification({
        type: "error",
        message: err?.message || `Gagal ${decisionType === "approve" ? "menyetujui" : "menolak"} attendance`,
      });
    } finally {
      setApproving(false);
      setShowModal(false);
      setSelectedEmployee(null);
      setDecisionType("");
    }
  };

  const handleCancelDecision = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setDecisionType("");
  };

  const handleViewDetails = (employee) => {
    setDetailEmployee(employee);
  };

  const closeDetailPanel = () => {
    setDetailEmployee(null);
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}

      {/* ===== WRAPPER TABEL ATTENDANCE ===== */}
      <section className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'} rounded-xl border shadow-sm p-6 transition-colors duration-300`}>
        {/* Header tabel + action bar */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <div>
              <h2 className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-blue-300' : 'text-[#1D395E]'}`}>
                Checkclock Overview
              </h2>
            </div>

            {/* Right side: search + buttons */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {/* Search */}
              <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                <input
                  type="text"
                  placeholder="Search Employee"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' : 'border-[#7CA6BF] bg-[rgba(124,166,191,0.08)] text-black'} text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E]`}
                />
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-[#1D395E]'}`} />
              </div>

              {/* Buttons: Refresh, Filter, Export, Tambah Data */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button 
                  onClick={fetchAttendance}
                  disabled={loading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'} text-sm transition-all shadow-sm disabled:opacity-50`}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>

                {/* Filter Dropdown */}
                <FilterDropdown
                  columns={filterColumns}
                  sortConfig={sortConfig}
                  onSortChange={setSortConfig}
                />

                <button 
                  onClick={handleExport}
                  disabled={exporting || attendanceData.length === 0}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'} text-sm transition-all shadow-sm disabled:opacity-50`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => navigate("/admin/checkclock/add")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-600 bg-emerald-600 text-white text-sm hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:border-emerald-800 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-[#1D395E]'} animate-spin mb-4`} />
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Memuat data attendance...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{error}</p>
            <button
              onClick={fetchAttendance}
              className={`px-4 py-2 rounded-lg ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1D395E] hover:bg-[#142848]'} text-white text-sm`}
            >
              Coba Lagi
            </button>
          </div>
        ) : (
        <>
        {/* ===== TABLE ===== */}
        <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200/70'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`${isDark ? 'bg-gray-700 text-gray-200' : 'bg-[#F5F7FA] text-gray-700'}`}>
                <th className="px-4 py-3 text-left font-medium">
                  Employee Name
                </th>
                <th className="px-4 py-3 text-left font-medium">Jabatan</th>
                <th className="px-4 py-3 text-center font-medium">Clock In</th>
                <th className="px-4 py-3 text-center font-medium">Clock Out</th>
                <th className="px-4 py-3 text-center font-medium">
                  Work Hours
                </th>
                <th className="px-4 py-3 text-center font-medium">Approve</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Details</th>
              </tr>
            </thead>

            <tbody>
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className={`w-10 h-10 ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-4`} />
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {debouncedSearch ? "Tidak ada data yang cocok dengan pencarian" : "Belum ada data attendance"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
              currentData.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} ${
                    index % 2 === 0 
                      ? isDark ? 'bg-gray-800' : 'bg-white' 
                      : isDark ? 'bg-gray-750' : 'bg-gray-50'
                  } ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100/60'} transition-colors`}
                >
                  {/* Employee Name with Avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center overflow-hidden`}>
                        {employee.avatar ? (
                          <img 
                            src={employee.avatar.startsWith("http") ? employee.avatar : `${import.meta.env.VITE_API_URL}${employee.avatar}`}
                            alt={employee.name || "Employee"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                            {employee.name ? employee.name.charAt(0) : "?"}
                          </span>
                        )}
                      </div>
                      <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {employee.name || "Unknown"}
                      </span>
                    </div>
                  </td>

                  <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{employee.role || "-"}</td>
                  <td className={`px-4 py-3 text-center ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {employee.clockIn}
                  </td>
                  <td className={`px-4 py-3 text-center ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {employee.clockOut}
                  </td>
                  <td className={`px-4 py-3 text-center ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {employee.workHours}
                  </td>

                  {/* Approve Column */}
                  <td className="px-4 py-3 text-center">
                    {employee.approvalStatus === "pending" && (
                      <div className="flex items-center justify-center gap-2">
                        {/* Reject chip */}
                        <button
                          onClick={() =>
                            handleApprovalClick(employee, "reject")
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDark ? 'bg-rose-900/30 text-rose-400 border-rose-800 hover:bg-rose-900/50' : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'} text-xs font-medium border transition`}
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>

                        {/* Approve chip */}
                        <button
                          onClick={() =>
                            handleApprovalClick(employee, "approve")
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800 hover:bg-emerald-900/50' : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'} text-xs font-medium border transition`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                      </div>
                    )}

                    {employee.approvalStatus === "approved" && (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-100'} text-xs font-semibold border justify-center`}>
                        <CheckCircle className="w-4 h-4" />
                        <span>Approved</span>
                      </div>
                    )}

                    {employee.approvalStatus === "rejected" && (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDark ? 'bg-rose-900/30 text-rose-400 border-rose-800' : 'bg-rose-50 text-rose-700 border-rose-100'} text-xs font-semibold border justify-center`}>
                        <XCircle className="w-4 h-4" />
                        <span>Rejected</span>
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                        employee.status || "Pending"
                      )}`}
                    >
                      {employee.status || "-"}
                    </span>
                  </td>

                  {/* Details Button */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewDetails(employee)}
                      className={`px-3 py-1.5 rounded-lg border-2 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} text-xs font-semibold transition-all`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        <div className={`mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {/* Left: Show entries dropdown */}
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 border ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D395E]`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Center: Info text */}
          <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Showing {processedData.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(endIndex, processedData.length)} of{" "}
            {processedData.length} records
          </div>

          {/* Right: Pagination buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed transition`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    currentPage === pageNumber
                      ? isDark ? "bg-blue-600 text-white" : "bg-[#1D395E] text-white"
                      : isDark ? "border border-gray-600 hover:bg-gray-700" : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed transition`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        </>
        )}
      </section>

      {/* ===== MODAL APPROVAL (CENTER) ===== */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {decisionType === "approve"
                  ? "Approve Attendance"
                  : "Reject Attendance"}
              </h3>
              <button
                onClick={handleCancelDecision}
                className="p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-semibold text-xl">
                    {selectedEmployee.name.charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Are you sure you want to{" "}
                    <span className="font-semibold">
                      {decisionType === "approve" ? "approve" : "reject"}
                    </span>{" "}
                    attendance for{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedEmployee.name}
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleCancelDecision}
                disabled={approving}
                className="px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                disabled={approving}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 ${
                  decisionType === "approve"
                    ? "bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700"
                    : "bg-rose-600 border-rose-600 hover:bg-rose-700 hover:border-rose-700"
                }`}
              >
                {approving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  decisionType === "approve" ? "Approve" : "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SIDE PANEL DETAIL (RIGHT OVERLAY) ===== */}
      {detailEmployee && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
          {/* klik backdrop untuk close */}
          <button
            className="flex-1 cursor-default"
            onClick={closeDetailPanel}
            aria-label="Close details overlay"
          />

          <aside className="w-full max-w-lg h-full bg-white shadow-xl border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1D395E]">
                Attendance Details
              </h2>
              <button
                onClick={closeDetailPanel}
                className="p-1.5 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* ==== PROFILE + STATUS APPROVE (CARD ATAS) ==== */}
              <div className="border border-gray-200 rounded-xl px-4 py-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {detailEmployee.avatar ? (
                    <img
                      src={detailEmployee.avatar.startsWith("http") 
                        ? detailEmployee.avatar 
                        : `${import.meta.env.VITE_API_URL}${detailEmployee.avatar}`}
                      alt={detailEmployee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-semibold text-xl">
                      {detailEmployee.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {detailEmployee.name}
                  </p>
                  <p className="text-xs text-gray-500">{detailEmployee.role}</p>
                </div>

                {/* pill status di sisi kanan */}
                <div>
                  {detailEmployee.approvalStatus === "approved" && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-500 bg-green-50 px-4 py-1.5 text-[11px] font-semibold text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-600" />
                      Status Approve
                    </span>
                  )}

                  {detailEmployee.approvalStatus === "rejected" && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-4 py-1.5 text-[11px] font-semibold text-rose-700">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Rejected
                    </span>
                  )}

                  {detailEmployee.approvalStatus === "pending" && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 py-1.5 text-[11px] font-semibold text-gray-600">
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                      Waiting Approval
                    </span>
                  )}
                </div>
              </div>

              {/* ==== ATTENDANCE INFORMATION ==== */}
              <div className="border border-[#7CA6BF] rounded-xl px-5 py-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Attendance Information
                  </p>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Baris 1: Date, Check In, Check Out */}
                <div className="grid grid-cols-3 gap-x-4 gap-y-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-gray-500">
                      Date
                    </p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.date}
                    </p>
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="text-[11px] font-medium text-gray-500">
                      Check In
                    </p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.clockIn}
                    </p>
                  </div>

                  <div className="space-y-1 text-right">
                    <p className="text-[11px] font-medium text-gray-500">
                      Check Out
                    </p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.clockOut}
                    </p>
                  </div>
                </div>

                {/* Baris 2: Status + Work Hours */}
                <div className="grid grid-cols-3 gap-x-4 gap-y-3 text-xs">
                  <div className="space-y-1 col-span-2">
                    <p className="text-[11px] font-medium text-gray-500">
                      Status
                    </p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.status}
                    </p>
                  </div>

                  <div className="space-y-1 text-right">
                    <p className="text-[11px] font-medium text-gray-500">
                      Work Hours
                    </p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.workHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==== LOCATION INFORMATION ==== */}
              <div className="border border-[#7CA6BF] rounded-xl px-5 py-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Location Information
                  </p>
                </div>

                <div className="h-px bg-gray-200" />

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-gray-500">
                      Location
                    </p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.location}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-gray-500">
                      Detail Address
                    </p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.address}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-gray-500">Lat</p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.lat}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-gray-500">
                      Long
                    </p>
                    <p className="text-[12px] text-gray-900">
                      {detailEmployee.long}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==== PROOF OF ATTENDANCE ==== */}
              <div className="border border-[#7CA6BF] rounded-xl px-5 py-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Proof of Attendance
                  </p>
                </div>

                {/* Check if any proof exists */}
                {(detailEmployee.proofUrl || detailEmployee.clockOutProofUrl) ? (
                  <div className="space-y-4">
                    {/* ========== CLOCK IN PROOF ========== */}
                    {detailEmployee.proofUrl && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-blue-600 flex items-center gap-1">
                          🟢 Clock In Proof
                        </p>
                        
                        {/* Preview Image if proof is an image */}
                        {detailEmployee.proofUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                          <div className="rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={detailEmployee.proofUrl.startsWith("http") 
                                ? detailEmployee.proofUrl 
                                : `${import.meta.env.VITE_API_URL}${detailEmployee.proofUrl}`}
                              alt="Clock In Proof"
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        )}

                        {/* File info with actions */}
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50">
                          <span className="truncate text-xs text-gray-800">
                            {detailEmployee.proofFile || "Clock In Proof"}
                          </span>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                const url = detailEmployee.proofUrl.startsWith("http")
                                  ? detailEmployee.proofUrl
                                  : `${import.meta.env.VITE_API_URL}${detailEmployee.proofUrl}`;
                                window.open(url, "_blank");
                              }}
                              className="p-1.5 rounded hover:bg-gray-200 transition"
                              title="View file"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            
                            <a
                              href={detailEmployee.proofUrl.startsWith("http")
                                ? detailEmployee.proofUrl
                                : `${import.meta.env.VITE_API_URL}${detailEmployee.proofUrl}`}
                              download={detailEmployee.proofFile || "clock-in-proof"}
                              className="p-1.5 rounded hover:bg-gray-200 transition"
                              title="Download file"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========== CLOCK OUT PROOF ========== */}
                    {detailEmployee.clockOutProofUrl && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                          🔴 Clock Out Proof
                        </p>
                        
                        {/* Preview Image if proof is an image */}
                        {detailEmployee.clockOutProofUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                          <div className="rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={detailEmployee.clockOutProofUrl.startsWith("http") 
                                ? detailEmployee.clockOutProofUrl 
                                : `${import.meta.env.VITE_API_URL}${detailEmployee.clockOutProofUrl}`}
                              alt="Clock Out Proof"
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        )}

                        {/* File info with actions */}
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50">
                          <span className="truncate text-xs text-gray-800">
                            {detailEmployee.clockOutProofFile || "Clock Out Proof"}
                          </span>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                const url = detailEmployee.clockOutProofUrl.startsWith("http")
                                  ? detailEmployee.clockOutProofUrl
                                  : `${import.meta.env.VITE_API_URL}${detailEmployee.clockOutProofUrl}`;
                                window.open(url, "_blank");
                              }}
                              className="p-1.5 rounded hover:bg-gray-200 transition"
                              title="View file"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            
                            <a
                              href={detailEmployee.clockOutProofUrl.startsWith("http")
                                ? detailEmployee.clockOutProofUrl
                                : `${import.meta.env.VITE_API_URL}${detailEmployee.clockOutProofUrl}`}
                              download={detailEmployee.clockOutProofFile || "clock-out-proof"}
                              className="p-1.5 rounded hover:bg-gray-200 transition"
                              title="Download file"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No proof uploaded
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
