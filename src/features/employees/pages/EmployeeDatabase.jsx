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
} from "lucide-react";
import { employeeService } from "@/app/services/employee.api";
import { Notification } from "@/components/ui/Notification";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ImportModal } from "@/components/ui/ImportModal";
import { exportToExcel } from "@/lib/exportExcel";

export function EmployeeDatabase() {
  const navigate = useNavigate();
  
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
    { key: "contractType", label: "Status" },
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
      const res = await employeeService.getAll({
        page: currentPage,
        limit: recordsPerPage,
        search: debouncedSearch,
        month: selectedMonth,
        year: selectedYear,
      });
      
      const data = res?.data || [];
      setEmployees(data);
      
      // Hitung stats dari data (atau bisa fetch terpisah via /stats endpoint)
      const total = data.length;
      const newHire = data.filter(emp => emp.isNew).length;
      const fullTime = data.filter(emp => emp.contractType === 'permanent').length;
      
      setStats({ total, newHire, fullTime });
      setTotalRecords(res?.pagination?.total || data.length);
      
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

  // Toggle status employee (local only - bisa dikembangkan untuk call API)
  const toggleEmployeeStatus = (employeeId) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, status: !emp.status } : emp
      )
    );
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
        {/* Card 1: Periode */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Periode
            </p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">{periodDisplay}</p>
          </div>
        </div>

        {/* Card 2: Total Employee */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Total Employee
            </p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">
              {loading ? "..." : stats.total}
            </p>
          </div>
        </div>

        {/* Card 3: Total New Hire */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Total New Hire
            </p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">
              {loading ? "..." : stats.newHire}
            </p>
          </div>
        </div>

        {/* Card 4: Full Time Employee */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Full Time Employee
            </p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">
              {loading ? "..." : stats.fullTime}
            </p>
          </div>
        </div>
      </div>

      {/* ===== WRAPPER TABEL EMPLOYEE ===== */}
      <section className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-6">
        {/* Header tabel + action bar */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <h2 className="text-xl lg:text-2xl font-semibold text-[#1D395E]">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#7CA6BF] bg-[rgba(124,166,191,0.08)] text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D395E]" />
              </div>

              {/* Buttons: Filter, Export, Import, Tambah Data */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button 
                  onClick={fetchEmployees}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Import</span>
                </button>

                <button 
                  onClick={handleExport}
                  disabled={exporting || employees.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50"
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
            <Loader2 className="w-10 h-10 text-[#1D395E] animate-spin mb-3" />
            <p className="text-gray-500">Memuat data karyawan...</p>
          </div>
        )}

        {/* ===== ERROR STATE ===== */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-gray-700 font-medium mb-2">Gagal Memuat Data</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchEmployees}
              className="px-4 py-2 bg-[#1D395E] text-white rounded-lg hover:bg-[#2a4a73] transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!loading && !error && employees.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium mb-2">Belum Ada Data Karyawan</p>
            <p className="text-gray-500 text-sm mb-4">
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
            <div className="overflow-x-auto rounded-xl border border-gray-200/70">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F7FA] text-gray-700">
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
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className={`border-t border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100/60 transition-colors`}
                    >
                      <td className="px-4 py-3 text-gray-700">{startIndex + index + 1}</td>

                      {/* Avatar bulat + huruf depan atau gambar */}
                      <td className="px-4 py-3">
                        {employee.avatar ? (
                          <img 
                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${employee.avatar}`}
                            alt={employee.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {employee.firstName?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-gray-800">
                        <div className="flex items-center gap-2">
                          {employee.firstName} {employee.lastName || ""}
                          {employee.isNew && (
                            <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-mono text-xs">
                        {employee.employeeId || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {employee.gender === "M" || employee.gender === "Laki-Laki" 
                          ? "Laki-Laki" 
                          : employee.gender === "F" || employee.gender === "Perempuan"
                          ? "Perempuan"
                          : employee.gender || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-800">{employee.phone || "-"}</td>
                      <td className="px-4 py-3 text-gray-800">{employee.branch || "-"}</td>
                      <td className="px-4 py-3 text-gray-800">{employee.jobdesk || "-"}</td>

                      {/* Contract Type Badge */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          employee.contractType === 'permanent' 
                            ? 'bg-blue-100 text-blue-700'
                            : employee.contractType === 'contract'
                            ? 'bg-amber-100 text-amber-700'
                            : employee.contractType === 'intern'
                            ? 'bg-purple-100 text-purple-700'
                            : employee.contractType === 'resign'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {employee.contractType || "N/A"}
                        </span>
                      </td>

                      {/* Action icons */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* VIEW */}
                          <button
                            type="button"
                            onClick={() => handleViewEmployee(employee)}
                            className="p-2 rounded-lg bg-[rgba(124,166,191,0.15)] text-[#1D395E] hover:bg-[rgba(124,166,191,0.25)] transition"
                            title="View Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() => handleEditEmployee(employee)}
                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(employee)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
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
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
              {/* Left: Show entries dropdown */}
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Center: Info text */}
              <div className="text-gray-500">
                Showing {employees.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalRecords)}{" "}
                of {totalRecords} records
              </div>

              {/* Right: Pagination buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                          ? "bg-[#1D395E] text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-rose-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Hapus Data Karyawan?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-5">
              Apakah kamu yakin ingin menghapus data karyawan{" "}
              <span className="font-semibold">
                {selectedEmployee?.firstName} {selectedEmployee?.lastName || ""}
              </span>{" "}
              dari database? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-5 text-sm text-gray-700">
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
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
    </div>
  );
}