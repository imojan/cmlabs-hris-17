// src/features/employees/pages/EmployeeDatabase.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  UserPlus,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import { employeeService } from "@/app/services/employee.api";
import { Notification } from "@/components/ui/Notification";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ImportModal } from "@/components/ui/ImportModal";
import { exportToExcel } from "@/lib/exportExcel";
import { useTheme } from "@/app/hooks/useTheme";

export function EmployeeDatabase() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Data & loading states
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    newHire: 0,
    fullTime: 0,
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Search & filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Terminate modal
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [terminateType, setTerminateType] = useState("resign");
  const [terminating, setTerminating] = useState(false);

  // Toggle status loading
  const [togglingStatus, setTogglingStatus] = useState(null);

  // Sort & Filter
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  
  // Import modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Filter columns for sorting
  const filterColumns = [
    { key: "name", label: "Nama" },
    { key: "employeeId", label: "Employee ID" },
    { key: "phone", label: "Nomor Telepon" },
    { key: "branch", label: "Cabang" },
    { key: "jobdesk", label: "Jabatan" },
    { key: "grade", label: "Grade" },
    { key: "contractType", label: "Status Kontrak" },
  ];

  // Import columns definition
  const importColumns = [
    { header: "Nama Depan", key: "firstName", sample: "John", width: 15 },
    { header: "Nama Belakang", key: "lastName", sample: "Doe", width: 15 },
    { header: "Employee ID", key: "employeeId", sample: "EMP001", width: 12 },
    { header: "Email", key: "email", sample: "john@example.com", width: 25 },
    { header: "Telepon", key: "phone", sample: "081234567890", width: 15 },
    { header: "Jenis Kelamin", key: "gender", sample: "M/F", width: 12 },
    { header: "Jabatan", key: "jobdesk", sample: "Manager", width: 15 },
    { header: "Cabang", key: "branch", sample: "Jakarta", width: 15 },
    { header: "Tipe Kontrak", key: "contractType", sample: "permanent/contract", width: 15 },
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset page saat search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch employees dan stats secara paralel
      const [empRes, statsRes] = await Promise.all([
        employeeService.getAll({
          page: currentPage,
          limit: recordsPerPage,
          search: debouncedSearch,
          month: selectedMonth,
          year: selectedYear,
        }),
        employeeService.getStats({
          month: selectedMonth,
          year: selectedYear,
        }),
      ]);
      
      const data = empRes?.data || [];
      setEmployees(data);
      
      // Set stats dari API
      if (statsRes?.stats) {
        setStats({
          total: statsRes.stats.total || 0,
          newHire: statsRes.stats.new || 0,
          fullTime: statsRes.stats.fullTime || 0,
        });
      } else {
        // Fallback: hitung dari data lokal
        const total = data.length;
        const newHire = data.filter(emp => emp.isNew).length;
        const fullTime = data.filter(emp => emp.contractType === 'permanent' && !emp.terminationType).length;
        setStats({ total, newHire, fullTime });
      }
      
      setTotalRecords(empRes?.pagination?.total || data.length);
      
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err?.message || "Gagal memuat data karyawan");
      setNotification({
        type: "error",
        message: err?.message || "Gagal memuat data karyawan",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage, debouncedSearch, selectedMonth, selectedYear]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Toggle status employee (call API)
  const handleToggleStatus = async (employee) => {
    // Jika sudah terminated, tidak bisa toggle
    if (employee.terminationType) {
      setNotification({
        type: "error",
        message: "Karyawan yang sudah resign/terminated tidak bisa diaktifkan kembali",
      });
      return;
    }

    setTogglingStatus(employee.id);
    try {
      await employeeService.toggleStatus(employee.id);
      
      // Update local state
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employee.id ? { ...emp, isActive: !emp.isActive } : emp
        )
      );
      
      setNotification({
        type: "success",
        message: `Karyawan ${employee.firstName} berhasil ${employee.isActive ? 'dinonaktifkan' : 'diaktifkan'}`,
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err?.message || "Gagal mengubah status karyawan",
      });
    } finally {
      setTogglingStatus(null);
    }
  };

  // ====== ACTION HANDLERS ======
  const handleViewEmployee = (employee) => {
    navigate(`/admin/employees/${employee.id}`, { state: { employee } });
  };

  const handleEditEmployee = (employee) => {
    navigate(`/admin/employees/${employee.id}/edit`, { state: { employee } });
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    
    setDeleting(true);
    try {
      await employeeService.delete(selectedEmployee.id);
      
      setNotification({
        type: "success",
        message: `Karyawan ${selectedEmployee.firstName} berhasil dihapus`,
      });
      
      // Refresh list
      fetchEmployees();
    } catch (err) {
      setNotification({
        type: "error",
        message: err?.message || "Gagal menghapus karyawan",
      });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  // ====== TERMINATE HANDLERS ======
  const handleTerminateClick = (employee) => {
    setSelectedEmployee(employee);
    setTerminateType("resign");
    setShowTerminateModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedEmployee) return;
    
    setTerminating(true);
    try {
      await employeeService.terminate(selectedEmployee.id, terminateType);
      
      setNotification({
        type: "success",
        message: terminateType === "resign" 
          ? `Karyawan ${selectedEmployee.firstName} telah diresignkan`
          : `Karyawan ${selectedEmployee.firstName} telah di-terminate (PHK)`,
      });
      
      // Refresh list
      fetchEmployees();
    } catch (err) {
      setNotification({
        type: "error",
        message: err?.message || "Gagal terminate karyawan",
      });
    } finally {
      setTerminating(false);
      setShowTerminateModal(false);
      setSelectedEmployee(null);
    }
  };

  const handleCancelTerminate = () => {
    setShowTerminateModal(false);
    setSelectedEmployee(null);
  };

  // ====== SEARCH, SORT & FILTER ======
  // Sort and filter employees
  const processedEmployees = useMemo(() => {
    let result = [...employees];
    
    // Apply search filter (searches across multiple fields)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((emp) => {
        const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          (emp.employeeId && emp.employeeId.toLowerCase().includes(searchLower)) ||
          (emp.phone && emp.phone.includes(searchLower)) ||
          (emp.email && emp.email.toLowerCase().includes(searchLower)) ||
          (emp.branch && emp.branch.toLowerCase().includes(searchLower)) ||
          (emp.jobdesk && emp.jobdesk.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        let aVal, bVal;
        
        if (sortConfig.key === "name") {
          aVal = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
          bVal = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
        } else {
          aVal = a[sortConfig.key] ? String(a[sortConfig.key]).toLowerCase() : "";
          bVal = b[sortConfig.key] ? String(b[sortConfig.key]).toLowerCase() : "";
        }
        
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [employees, debouncedSearch, sortConfig]);

  // ====== EXPORT HANDLER ======
  const handleExport = () => {
    setExporting(true);
    
    try {
      const exportData = processedEmployees.map((emp) => ({
        nama: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
        employeeId: emp.employeeId || "-",
        email: emp.email || "-",
        gender: emp.gender === "M" || emp.gender === "Laki-Laki" ? "Laki-Laki" : emp.gender === "F" || emp.gender === "Perempuan" ? "Perempuan" : emp.gender || "-",
        phone: emp.phone || "-",
        branch: emp.branch || "-",
        jobdesk: emp.jobdesk || "-",
        contractType: emp.contractType || "-",
      }));

      exportToExcel({
        title: "DATA KARYAWAN",
        companyName: "CMLABS INDONESIA",
        reportDate: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        columns: [
          { header: "No.", key: "no", width: 5 },
          { header: "Nama Lengkap", key: "nama", width: 25 },
          { header: "Employee ID", key: "employeeId", width: 15 },
          { header: "Email", key: "email", width: 30 },
          { header: "Jenis Kelamin", key: "gender", width: 15 },
          { header: "Nomor Telepon", key: "phone", width: 18 },
          { header: "Cabang", key: "branch", width: 15 },
          { header: "Jabatan", key: "jobdesk", width: 18 },
          { header: "Status Kontrak", key: "contractType", width: 15 },
        ],
        data: exportData,
        filename: "data_karyawan",
      });

      setNotification({
        type: "success",
        message: `Berhasil mengekspor ${exportData.length} data karyawan`,
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

  // ====== IMPORT HANDLER ======
  const handleImport = async (parsedData) => {
    // Map parsed Excel data to employee format
    const employeesToCreate = parsedData.map((row) => ({
      firstName: row.data["Nama Depan"] || "",
      lastName: row.data["Nama Belakang"] || "",
      employeeId: row.data["Employee ID"] || "",
      email: row.data["Email"] || "",
      phone: row.data["Telepon"] || "",
      gender: row.data["Jenis Kelamin"] || "",
      jobdesk: row.data["Jabatan"] || "",
      branch: row.data["Cabang"] || "",
      contractType: row.data["Tipe Kontrak"] || "permanent",
    }));

    // In real implementation, call API to bulk create
    // For now, create one by one
    let successCount = 0;
    let errorCount = 0;

    for (const emp of employeesToCreate) {
      try {
        if (emp.firstName && emp.email) {
          await employeeService.create(emp);
          successCount++;
        }
      } catch (err) {
        errorCount++;
        console.error("Import error for row:", emp, err);
      }
    }

    if (errorCount > 0) {
      setNotification({
        type: "warning",
        message: `Berhasil import ${successCount} data, gagal ${errorCount} data`,
      });
    } else {
      setNotification({
        type: "success",
        message: `Berhasil mengimport ${successCount} data karyawan`,
      });
    }

    // Refresh list
    fetchEmployees();
  };

  // Pagination calculation (client-side)
  const totalFiltered = processedEmployees.length;
  const totalPages = Math.ceil(totalFiltered / recordsPerPage) || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  
  // Slice for current page
  const currentEmployees = processedEmployees.slice(startIndex, endIndex);

  // Format month/year untuk display
  const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                      "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const periodDisplay = `${monthNames[selectedMonth]} ${selectedYear}`;

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

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Card 1: Periode (Bulan Tahun) */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'} rounded-xl border shadow-sm overflow-hidden transition-colors duration-300`}>
          <div className={`${isDark ? 'bg-blue-900' : 'bg-[#1D395E]'} px-4 py-3 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center`}>
              <Calendar className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`} />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Periode
            </p>
          </div>
          <div className="p-5">
            <p className={`text-2xl font-semibold ${isDark ? 'text-blue-300' : 'text-[#1D395E]'}`}>
              {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Card 2: Total Employee */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'} rounded-xl border shadow-sm overflow-hidden transition-colors duration-300`}>
          <div className="bg-amber-600 px-4 py-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center`}>
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Total Employee
            </p>
          </div>
          <div className="p-5">
            <p className={`text-3xl font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {loading ? "..." : stats.total}
            </p>
          </div>
        </div>

        {/* Card 3: Total New Hire */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'} rounded-xl border shadow-sm overflow-hidden transition-colors duration-300`}>
          <div className="bg-emerald-600 px-4 py-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center`}>
              <UserPlus className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Total New Hire
            </p>
          </div>
          <div className="p-5">
            <p className={`text-3xl font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {loading ? "..." : stats.newHire}
            </p>
          </div>
        </div>

        {/* Card 4: Full Time Employee */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'} rounded-xl border shadow-sm overflow-hidden transition-colors duration-300`}>
          <div className="bg-violet-600 px-4 py-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center`}>
              <Briefcase className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Full Time Employee
            </p>
          </div>
          <div className="p-5">
            <p className={`text-3xl font-semibold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              {loading ? "..." : stats.fullTime}
            </p>
          </div>
        </div>
      </div>

      {/* ===== WRAPPER TABEL EMPLOYEE ===== */}
      <section className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'} rounded-xl border shadow-sm p-6 transition-colors duration-300`}>
        {/* Header tabel + action bar */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <h2 className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-blue-300' : 'text-[#1D395E]'}`}>
              All Employees Information
            </h2>

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

              {/* Buttons: Filter, Export, Import, Tambah Data */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button 
                  onClick={fetchEmployees}
                  disabled={loading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'} text-sm transition-all shadow-sm disabled:opacity-50`}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                {/* Filter Dropdown */}
                <FilterDropdown
                  columns={filterColumns}
                  sortConfig={sortConfig}
                  onSortChange={setSortConfig}
                />

                <button 
                  onClick={() => setShowImportModal(true)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'} text-sm transition-all shadow-sm`}
                >
                  <Download className="w-4 h-4" />
                  <span>Import</span>
                </button>

                <button 
                  onClick={handleExport}
                  disabled={exporting || employees.length === 0}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'} text-sm transition-all shadow-sm disabled:opacity-50`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => navigate("/admin/employees/add")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-600 bg-emerald-600 text-white text-sm hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:border-emerald-800 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== LOADING STATE ===== */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-[#1D395E]'} animate-spin mb-3`} />
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Memuat data karyawan...</p>
          </div>
        )}

        {/* ===== ERROR STATE ===== */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-rose-900/30' : 'bg-rose-50'} flex items-center justify-center mb-4`}>
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>Gagal Memuat Data</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4`}>{error}</p>
            <button
              onClick={fetchEmployees}
              className={`px-4 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1D395E] hover:bg-[#2a4a73]'} text-white rounded-lg transition`}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!loading && !error && employees.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
              <Users className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>Belum Ada Data Karyawan</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4`}>
              {debouncedSearch 
                ? `Tidak ditemukan karyawan dengan kata kunci "${debouncedSearch}"`
                : "Mulai dengan menambahkan karyawan pertama"
              }
            </p>
            {!debouncedSearch && (
              <button
                onClick={() => navigate("/admin/employees/add")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Tambah Karyawan
              </button>
            )}
          </div>
        )}

        {/* ===== TABLE ===== */}
        {!loading && !error && employees.length > 0 && (
          <>
            <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200/70'}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className={`${isDark ? 'bg-gray-700 text-gray-200' : 'bg-[#F5F7FA] text-gray-700'}`}>
                    <th className="px-4 py-3 text-left font-medium">No.</th>
                    <th className="px-4 py-3 text-left font-medium">Avatar</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Nama <span className="text-xs">↕</span>
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Employee ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Jenis Kelamin
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Nomor Telepon
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Cabang</th>
                    <th className="px-4 py-3 text-left font-medium">Jabatan</th>
                    <th className="px-4 py-3 text-left font-medium">Grade</th>
                    <th className="px-4 py-3 text-left font-medium">Status Kontrak</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} ${
                        index % 2 === 0 
                          ? isDark ? 'bg-gray-800' : 'bg-white' 
                          : isDark ? 'bg-gray-750' : 'bg-gray-50'
                      } ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100/60'} transition-colors`}
                    >
                      <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{startIndex + index + 1}</td>

                      {/* Avatar bulat + huruf depan atau gambar */}
                      <td className="px-4 py-3">
                        {employee.avatar ? (
                          <img 
                            src={employee.avatar.startsWith('http') 
                              ? employee.avatar 
                              : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${employee.avatar}`}
                            alt={employee.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`}>
                            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                              {employee.firstName?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        <div className="flex items-center gap-2">
                          {employee.firstName} {employee.lastName || ""}
                          {employee.isNew && (
                            <span className={`px-2 py-0.5 text-xs ${isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'} rounded-full`}>
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'} font-mono text-xs`}>
                        {employee.employeeId || "-"}
                      </td>
                      <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {employee.gender === "M" || employee.gender === "Laki-Laki" 
                          ? "Laki-Laki" 
                          : employee.gender === "F" || employee.gender === "Perempuan"
                          ? "Perempuan"
                          : employee.gender || "-"}
                      </td>
                      <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{employee.phone || "-"}</td>
                      <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{employee.branch || "-"}</td>
                      <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{employee.jobdesk || "-"}</td>

                      {/* Grade */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          employee.grade === 'Lead' 
                            ? isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700'
                            : employee.grade === 'Management'
                            ? isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                            : employee.grade === 'Staff'
                            ? isDark ? 'bg-cyan-900/50 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                            : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {employee.grade || "-"}
                        </span>
                      </td>

                      {/* Contract Type Badge (5 tipe) */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          employee.contractType === 'permanent' 
                            ? isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                            : employee.contractType === 'trial'
                            ? isDark ? 'bg-teal-900/50 text-teal-400' : 'bg-teal-100 text-teal-700'
                            : employee.contractType === 'contract'
                            ? isDark ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-700'
                            : employee.contractType === 'intern'
                            ? isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700'
                            : employee.contractType === 'freelance'
                            ? isDark ? 'bg-pink-900/50 text-pink-400' : 'bg-pink-100 text-pink-700'
                            : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {employee.contractType === 'permanent' ? 'Permanen'
                            : employee.contractType === 'trial' ? 'Trial'
                            : employee.contractType === 'contract' ? 'PKWT'
                            : employee.contractType === 'intern' ? 'Magang'
                            : employee.contractType === 'freelance' ? 'Freelance'
                            : employee.contractType || "N/A"}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-3">
                        {employee.terminationType ? (
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            isDark ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600'
                          }`}>
                            {employee.terminationType === 'resign' ? 'Resigned' : 'Terminated'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(employee)}
                            disabled={togglingStatus === employee.id}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              employee.isActive !== false
                                ? 'bg-emerald-500 focus:ring-emerald-500'
                                : isDark ? 'bg-gray-600 focus:ring-gray-500' : 'bg-gray-300 focus:ring-gray-400'
                            } ${togglingStatus === employee.id ? 'opacity-50 cursor-wait' : ''}`}
                            title={employee.isActive !== false ? 'Nonaktifkan karyawan' : 'Aktifkan karyawan'}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                employee.isActive !== false ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </td>

                      {/* Action icons */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* VIEW */}
                          <button
                            type="button"
                            onClick={() => handleViewEmployee(employee)}
                            className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-[rgba(124,166,191,0.15)] text-[#1D395E] hover:bg-[rgba(124,166,191,0.25)]'} transition`}
                            title="View Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() => handleEditEmployee(employee)}
                            className={`p-2 rounded-lg ${isDark ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'} transition`}
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* TERMINATE (only if not already terminated) */}
                          {!employee.terminationType && (
                            <button
                              type="button"
                              onClick={() => handleTerminateClick(employee)}
                              className={`p-2 rounded-lg ${isDark ? 'bg-amber-900/30 text-amber-400 hover:bg-amber-900/50' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'} transition`}
                              title="Resign / Terminate"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(employee)}
                            className={`p-2 rounded-lg ${isDark ? 'bg-rose-900/30 text-rose-400 hover:bg-rose-900/50' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'} transition`}
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                Showing {employees.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalRecords)}{" "}
                of {totalRecords} records
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

                {/* Page numbers - show max 5 pages */}
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }
                  
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

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full p-6`}>
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full ${isDark ? 'bg-rose-900/30' : 'bg-rose-50'} flex items-center justify-center`}>
                <Trash2 className={`w-7 h-7 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
              </div>
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} text-center mb-2`}>
              Hapus Data Karyawan?
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center mb-5`}>
              Apakah kamu yakin ingin menghapus data karyawan{" "}
              <span className="font-semibold">
                {selectedEmployee?.firstName} {selectedEmployee?.lastName || ""}
              </span>{" "}
              dari database? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-5 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex justify-between">
                <span>Employee ID:</span>
                <span className="font-medium font-mono">
                  {selectedEmployee?.employeeId ?? "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Jabatan:</span>
                <span className="font-medium">
                  {selectedEmployee?.jobdesk ?? "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cabang:</span>
                <span className="font-medium">
                  {selectedEmployee?.branch ?? "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium">
                  {selectedEmployee?.contractType || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={deleting}
                className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium disabled:opacity-50`}
              >
                Tidak, Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== IMPORT MODAL ===== */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        columns={importColumns}
        title="Import Data Karyawan"
        templateFilename="template_import_karyawan"
      />

      {/* ===== TERMINATE MODAL ===== */}
      {showTerminateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full p-6`}>
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full ${isDark ? 'bg-amber-900/30' : 'bg-amber-50'} flex items-center justify-center`}>
                <UserX className={`w-7 h-7 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} text-center mb-2`}>
              Resign / Terminate Karyawan
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center mb-5`}>
              Pilih tipe terminasi untuk karyawan{" "}
              <span className="font-semibold">
                {selectedEmployee?.firstName} {selectedEmployee?.lastName || ""}
              </span>
            </p>

            {/* Employee Info */}
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-5 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex justify-between mb-2">
                <span>Employee ID:</span>
                <span className="font-medium font-mono">
                  {selectedEmployee?.employeeId ?? "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Jabatan:</span>
                <span className="font-medium">
                  {selectedEmployee?.jobdesk ?? "-"}
                </span>
              </div>
            </div>

            {/* Terminate Type Selection */}
            <div className="mb-5 space-y-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                terminateType === 'resign'
                  ? isDark ? 'border-amber-500 bg-amber-900/20' : 'border-amber-500 bg-amber-50'
                  : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="terminateType"
                  value="resign"
                  checked={terminateType === 'resign'}
                  onChange={(e) => setTerminateType(e.target.value)}
                  className="w-4 h-4 text-amber-500"
                />
                <div>
                  <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Resign</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Karyawan mengundurkan diri secara sukarela</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                terminateType === 'terminated'
                  ? isDark ? 'border-rose-500 bg-rose-900/20' : 'border-rose-500 bg-rose-50'
                  : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="terminateType"
                  value="terminated"
                  checked={terminateType === 'terminated'}
                  onChange={(e) => setTerminateType(e.target.value)}
                  className="w-4 h-4 text-rose-500"
                />
                <div>
                  <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Terminated (PHK)</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Karyawan diberhentikan oleh perusahaan</p>
                </div>
              </label>
            </div>

            <div className={`p-3 rounded-lg ${isDark ? 'bg-rose-900/20 border border-rose-800' : 'bg-rose-50 border border-rose-200'} mb-5`}>
              <p className={`text-xs ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                ⚠️ <strong>Perhatian:</strong> Tindakan ini bersifat permanen. Karyawan yang sudah di-terminate tidak bisa diaktifkan kembali.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelTerminate}
                disabled={terminating}
                className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium disabled:opacity-50`}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmTerminate}
                disabled={terminating}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2 ${
                  terminateType === 'resign'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {terminating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  terminateType === 'resign' ? 'Ya, Resign' : 'Ya, Terminate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}