// src/features/work-schedule/pages/WorkScheduleAdmin.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  Building2,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  RefreshCw,
} from "lucide-react";
import { CustomDropdown } from "../../../components/ui/CustomDropdown";
import { Notification } from "../../../components/ui/Notification";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { exportToExcel } from "@/lib/exportExcel";
import scheduleService from "../../../app/services/schedule.api";
import { useTheme } from "@/app/hooks/useTheme";

// Default empty schedule structure
const defaultSchedules = {
  monday: { start: "08:00", end: "17:00", isOff: false },
  tuesday: { start: "08:00", end: "17:00", isOff: false },
  wednesday: { start: "08:00", end: "17:00", isOff: false },
  thursday: { start: "08:00", end: "17:00", isOff: false },
  friday: { start: "08:00", end: "17:00", isOff: false },
  saturday: { start: null, end: null, isOff: true },
  sunday: { start: null, end: null, isOff: true },
};

// Shift type dengan warna
function shiftTypeClass(type, isDark = false) {
  switch (type) {
    case "Regular":
      return isDark ? "bg-blue-900/30 text-blue-400 border border-blue-700" : "bg-blue-50 text-blue-700 border border-blue-200";
    case "Shift Pagi":
      return isDark ? "bg-amber-900/30 text-amber-400 border border-amber-700" : "bg-amber-50 text-amber-700 border border-amber-200";
    case "Shift Siang":
      return isDark ? "bg-emerald-900/30 text-emerald-400 border border-emerald-700" : "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Shift Malam":
      return isDark ? "bg-violet-900/30 text-violet-400 border border-violet-700" : "bg-violet-50 text-violet-700 border border-violet-200";
    case "Flexible":
      return isDark ? "bg-sky-900/30 text-sky-400 border border-sky-700" : "bg-sky-50 text-sky-700 border border-sky-200";
    default:
      return isDark ? "bg-gray-700 text-gray-300 border border-gray-600" : "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

// Helper untuk format jam
function formatTime(schedule) {
  if (schedule.isOff) {
    return "OFF";
  }
  return `${schedule.start} - ${schedule.end}`;
}

// Day label mapping
const dayLabels = {
  monday: "Sen",
  tuesday: "Sel",
  wednesday: "Rab",
  thursday: "Kam",
  friday: "Jum",
  saturday: "Sab",
  sunday: "Min",
};

const dayLabelsFull = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

export function WorkScheduleAdmin() {
  // Theme
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // API data state
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    period: 'Loading...',
    totalEmployees: 0,
    regularShift: 0,
    shiftWorkers: 0
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Sort & Filter state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [exporting, setExporting] = useState(false);

  // Filter columns
  const filterColumns = [
    { key: "employeeName", label: "Nama Karyawan" },
    { key: "employeeId", label: "Employee ID" },
    { key: "shiftType", label: "Tipe Shift" },
  ];

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Add modal state
  const [newSchedule, setNewSchedule] = useState({
    employeeId: '',
    shiftType: 'Regular',
    schedules: { ...defaultSchedules }
  });
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Saving state
  const [saving, setSaving] = useState(false);

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getSchedules({
        search: searchQuery,
        page: currentPage,
        limit: recordsPerPage
      });
      
      if (response.success) {
        setSchedules(response.data || []);
        setTotalRecords(response.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
      setNotification({
        show: true,
        type: 'error',
        message: 'Gagal memuat data jadwal kerja'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await scheduleService.getStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSchedules();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, recordsPerPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchSchedules();
      } else {
        setCurrentPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Search, Sort & Filter (client-side for sorted display)
  const processedSchedules = useMemo(() => {
    let result = [...schedules];
    
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
  }, [schedules, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);

  // ====== EXPORT HANDLER ======
  const handleExport = () => {
    setExporting(true);
    
    try {
      const exportData = processedSchedules.map((schedule) => {
        // Format schedule times for each day
        const formatDayTime = (day) => {
          const sched = schedule.schedules?.[day];
          if (!sched || sched.isOff) return "OFF";
          return `${sched.start || "-"} - ${sched.end || "-"}`;
        };

        return {
          nama: schedule.employeeName,
          employeeId: schedule.employeeId,
          shiftType: schedule.shiftType,
          senin: formatDayTime("monday"),
          selasa: formatDayTime("tuesday"),
          rabu: formatDayTime("wednesday"),
          kamis: formatDayTime("thursday"),
          jumat: formatDayTime("friday"),
          sabtu: formatDayTime("saturday"),
          minggu: formatDayTime("sunday"),
        };
      });

      exportToExcel({
        title: "DATA JADWAL KERJA KARYAWAN",
        companyName: "CMLABS INDONESIA",
        reportDate: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        columns: [
          { header: "No.", key: "no", width: 5 },
          { header: "Nama Karyawan", key: "nama", width: 22 },
          { header: "Employee ID", key: "employeeId", width: 14 },
          { header: "Tipe Shift", key: "shiftType", width: 12 },
          { header: "Senin", key: "senin", width: 14 },
          { header: "Selasa", key: "selasa", width: 14 },
          { header: "Rabu", key: "rabu", width: 14 },
          { header: "Kamis", key: "kamis", width: 14 },
          { header: "Jumat", key: "jumat", width: 14 },
          { header: "Sabtu", key: "sabtu", width: 14 },
          { header: "Minggu", key: "minggu", width: 14 },
        ],
        data: exportData,
        filename: "data_jadwal_kerja",
      });

      setNotification({
        show: true,
        type: "success",
        message: `Berhasil mengekspor ${exportData.length} data jadwal kerja`,
      });
    } catch (err) {
      console.error("Export error:", err);
      setNotification({
        show: true,
        type: "error",
        message: "Gagal mengekspor data",
      });
    } finally {
      setExporting(false);
    }
  };

  // Action handlers
  const handleViewDetail = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDetailModal(true);
  };

  const handleEditClick = (schedule) => {
    // Ensure schedules object has all days
    const fullSchedules = { ...defaultSchedules };
    if (schedule.schedules) {
      Object.keys(schedule.schedules).forEach(day => {
        fullSchedules[day] = schedule.schedules[day];
      });
    }
    setSelectedSchedule({ ...schedule, schedules: fullSchedules });
    setShowEditModal(true);
  };

  const handleDeleteClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSchedule) return;
    
    try {
      setSaving(true);
      const response = await scheduleService.deleteSchedule(selectedSchedule.id);
      
      if (response.success) {
        setNotification({
          show: true,
          type: 'success',
          message: 'Jadwal kerja berhasil dihapus'
        });
        fetchSchedules();
        fetchStats();
      }
    } catch (err) {
      console.error('Delete error:', err);
      setNotification({
        show: true,
        type: 'error',
        message: err.message || 'Gagal menghapus jadwal kerja'
      });
    } finally {
      setSaving(false);
      setShowDeleteModal(false);
      setSelectedSchedule(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedSchedule) return;
    
    try {
      setSaving(true);
      const response = await scheduleService.updateSchedule(selectedSchedule.id, {
        shiftType: selectedSchedule.shiftType,
        schedules: selectedSchedule.schedules
      });
      
      if (response.success) {
        setNotification({
          show: true,
          type: 'success',
          message: 'Jadwal kerja berhasil diperbarui'
        });
        fetchSchedules();
        fetchStats();
      }
    } catch (err) {
      console.error('Update error:', err);
      setNotification({
        show: true,
        type: 'error',
        message: err.message || 'Gagal memperbarui jadwal kerja'
      });
    } finally {
      setSaving(false);
      setShowEditModal(false);
      setSelectedSchedule(null);
    }
  };

  // Open Add Modal and fetch employees
  const handleOpenAddModal = async () => {
    setShowAddModal(true);
    setNewSchedule({
      employeeId: '',
      shiftType: 'Regular',
      schedules: { ...defaultSchedules }
    });
    
    // Fetch employees without schedules for dropdown
    try {
      setLoadingEmployees(true);
      const response = await scheduleService.getUnassignedEmployees();
      if (response.success) {
        // Map the response to match expected format
        setEmployeeOptions(response.data?.map(emp => ({
          id: emp.id,
          employeeId: emp.employeeId,
          employeeName: emp.name
        })) || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      // Fallback: show all employees from current data
      setEmployeeOptions(schedules.map(s => ({
        id: s.id,
        employeeId: s.employeeId,
        employeeName: s.employeeName
      })));
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Handle Add Schedule
  const handleAddSchedule = async () => {
    if (!newSchedule.employeeId) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Pilih karyawan terlebih dahulu'
      });
      return;
    }
    
    try {
      setSaving(true);
      const response = await scheduleService.updateSchedule(newSchedule.employeeId, {
        shiftType: newSchedule.shiftType,
        schedules: newSchedule.schedules
      });
      
      if (response.success) {
        setNotification({
          show: true,
          type: 'success',
          message: 'Jadwal kerja berhasil ditambahkan'
        });
        fetchSchedules();
        fetchStats();
        setShowAddModal(false);
      }
    } catch (err) {
      console.error('Add schedule error:', err);
      setNotification({
        show: true,
        type: 'error',
        message: err.message || 'Gagal menambahkan jadwal kerja'
      });
    } finally {
      setSaving(false);
    }
  };

  // Stats from state
  const totalEmployees = stats.totalEmployees;
  const regularShift = stats.regularShift;
  const shiftWorkers = stats.shiftWorkers;

  // API base URL for avatar
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Card 1: Periode */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Periode
            </p>
          </div>
          <div className="p-5">
            <p className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{stats.period}</p>
          </div>
        </div>

        {/* Card 2: Total Schedule */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Total Karyawan
            </p>
          </div>
          <div className="p-5">
            <p className={`text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{totalEmployees}</p>
          </div>
        </div>

        {/* Card 3: Regular Shift */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Jam Reguler
            </p>
          </div>
          <div className="p-5">
            <p className={`text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{regularShift}</p>
          </div>
        </div>

        {/* Card 4: Shift Workers */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Pekerja Shift
            </p>
          </div>
          <div className="p-5">
            <p className={`text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{shiftWorkers}</p>
          </div>
        </div>
      </div>

      {/* ===== WRAPPER TABEL SCHEDULE ===== */}
      <section className={`rounded-xl border shadow-sm p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
        {/* Header tabel + action bar */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <div>
              <h2 className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>
                Jadwal Kerja Karyawan
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Kelola jadwal kerja mingguan untuk semua karyawan
              </p>
            </div>

            {/* Right side: search + buttons */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {/* Search */}
              <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                <input
                  type="text"
                  placeholder="Cari Karyawan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                      : 'border-[#7CA6BF] bg-[rgba(124,166,191,0.08)] text-black'
                  }`}
                />
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-[#1D395E]'}`} />
              </div>

              {/* Buttons: Refresh, Filter, Export, Tambah Data */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button 
                  onClick={() => { fetchSchedules(); fetchStats(); }}
                  disabled={loading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm transition-all shadow-sm disabled:opacity-50 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
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
                  disabled={exporting || schedules.length === 0}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm transition-all shadow-sm disabled:opacity-50 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Export</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-600 bg-emerald-600 text-white text-sm hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:border-emerald-800 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Jadwal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200/70'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? 'bg-gray-700 text-gray-200' : 'bg-[#F5F7FA] text-gray-700'}>
                <th className="px-4 py-3 text-left font-medium">Karyawan</th>
                <th className="px-4 py-3 text-left font-medium">Cabang</th>
                <th className="px-4 py-3 text-center font-medium">Tipe Shift</th>
                <th className="px-4 py-3 text-center font-medium">Sen</th>
                <th className="px-4 py-3 text-center font-medium">Sel</th>
                <th className="px-4 py-3 text-center font-medium">Rab</th>
                <th className="px-4 py-3 text-center font-medium">Kam</th>
                <th className="px-4 py-3 text-center font-medium">Jum</th>
                <th className="px-4 py-3 text-center font-medium">Sab</th>
                <th className="px-4 py-3 text-center font-medium">Min</th>
                <th className="px-4 py-3 text-center font-medium">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D395E]"></div>
                      <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={11} className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tidak ada data jadwal kerja
                  </td>
                </tr>
              ) : (
                processedSchedules.map((schedule, index) => (
                <tr
                  key={schedule.id}
                  className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} ${
                    index % 2 === 0 
                      ? isDark ? "bg-gray-800" : "bg-white" 
                      : isDark ? "bg-gray-700/50" : "bg-gray-50"
                  } ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100/60'} transition-colors`}
                >
                  {/* Employee Name with Avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {schedule.avatar ? (
                        <img
                          src={`${API_URL}${schedule.avatar}`}
                          alt={schedule.employeeName}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-gray-600' : 'bg-gray-200'} ${schedule.avatar ? 'hidden' : 'flex'}`}
                      >
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {schedule.employeeName?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                          {schedule.employeeName}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{schedule.position}</p>
                      </div>
                    </div>
                  </td>

                  <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{schedule.branch}</td>

                  {/* Shift Type Badge */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${shiftTypeClass(
                        schedule.shiftType, isDark
                      )}`}
                    >
                      {schedule.shiftType}
                    </span>
                  </td>

                  {/* Schedule Days */}
                  {Object.keys(dayLabels).map((day) => (
                    <td key={day} className="px-2 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          schedule.schedules?.[day]?.isOff
                            ? isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                            : isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {schedule.schedules?.[day]?.isOff
                          ? "OFF"
                          : schedule.schedules?.[day]?.start || "-"}
                      </span>
                    </td>
                  ))}

                  {/* Action Buttons */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* VIEW */}
                      <button
                        type="button"
                        onClick={() => handleViewDetail(schedule)}
                        className={`p-2 rounded-lg transition ${isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-[rgba(124,166,191,0.15)] text-[#1D395E] hover:bg-[rgba(124,166,191,0.25)]'}`}
                        title="View Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() => handleEditClick(schedule)}
                        className={`p-2 rounded-lg transition ${isDark ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                        title="Edit Schedule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(schedule)}
                        className={`p-2 rounded-lg transition ${isDark ? 'bg-rose-900/30 text-rose-400 hover:bg-rose-900/50' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                        title="Delete Schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        <div className={`mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {/* Left: Show entries dropdown */}
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                isDark ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white'
              }`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Center: Info text */}
          <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Showing {totalRecords > 0 ? startIndex + 1 : 0} to{" "}
            {endIndex} of{" "}
            {totalRecords} records
          </div>

          {/* Right: Pagination buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    currentPage === pageNumber
                      ? "bg-[#1D395E] text-white"
                      : isDark 
                        ? "border border-gray-600 hover:bg-gray-700" 
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
              className={`p-2 rounded-lg border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== DETAIL MODAL ===== */}
      {showDetailModal && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>
                Detail Jadwal Kerja
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Employee Info */}
              <div className={`flex items-center gap-4 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                {selectedSchedule.avatar ? (
                  <img
                    src={`${API_URL}${selectedSchedule.avatar}`}
                    alt={selectedSchedule.employeeName}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-16 h-16 rounded-full items-center justify-center ${isDark ? 'bg-gray-600' : 'bg-gray-200'} ${selectedSchedule.avatar ? 'hidden' : 'flex'}`}
                >
                  <span className={`text-xl font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedSchedule.employeeName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {selectedSchedule.employeeName}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedSchedule.position} • {selectedSchedule.branch}
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-semibold ${shiftTypeClass(
                      selectedSchedule.shiftType, isDark
                    )}`}
                  >
                    {selectedSchedule.shiftType}
                  </span>
                </div>
              </div>

              {/* Schedule Grid */}
              <div className="space-y-3">
                <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Jadwal Mingguan
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(dayLabelsFull).map(([key, label]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                        selectedSchedule.schedules?.[key]?.isOff
                          ? isDark ? "bg-gray-700" : "bg-gray-50"
                          : isDark ? "bg-emerald-900/30" : "bg-emerald-50"
                      }`}
                    >
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
                      <span
                        className={`text-sm font-semibold ${
                          selectedSchedule.schedules?.[key]?.isOff
                            ? isDark ? "text-gray-400" : "text-gray-500"
                            : isDark ? "text-emerald-400" : "text-emerald-700"
                        }`}
                      >
                        {formatTime(selectedSchedule.schedules?.[key] || { isOff: true })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex justify-end ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`px-6 py-2.5 rounded-lg border text-sm font-medium ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {showDeleteModal && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`rounded-xl shadow-2xl max-w-md w-full p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDark ? 'bg-rose-900/30' : 'bg-rose-50'}`}>
                <Trash2 className={`w-7 h-7 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
              </div>
            </div>
            <h3 className={`text-lg font-semibold text-center mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Hapus Jadwal Kerja?
            </h3>
            <p className={`text-sm text-center mb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Apakah kamu yakin ingin menghapus jadwal kerja{" "}
              <span className="font-semibold">
                {selectedSchedule.employeeName}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className={`rounded-lg p-4 mb-5 text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
              <div className="flex justify-between">
                <span>Jabatan:</span>
                <span className="font-medium">{selectedSchedule.position}</span>
              </div>
              <div className="flex justify-between">
                <span>Cabang:</span>
                <span className="font-medium">{selectedSchedule.branch}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipe Shift:</span>
                <span className="font-medium">{selectedSchedule.shiftType}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSchedule(null);
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium disabled:opacity-50 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tidak, Batalkan
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {saving ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>
                Edit Jadwal Kerja
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Employee Info (readonly) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nama Karyawan
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSchedule.employeeName}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm ${
                      isDark 
                        ? 'border-gray-600 bg-gray-700 text-gray-300' 
                        : 'border-gray-300 bg-gray-100 text-gray-700'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tipe Shift
                  </label>
                  <CustomDropdown
                    name="shiftType"
                    value={selectedSchedule.shiftType}
                    onChange={(e) =>
                      setSelectedSchedule({
                        ...selectedSchedule,
                        shiftType: e.target.value,
                      })
                    }
                    placeholder="Pilih Shift"
                    options={[
                      { value: "Regular", label: "Regular", icon: "⏰" },
                      { value: "Shift Pagi", label: "Shift Pagi", icon: "🌅" },
                      { value: "Shift Siang", label: "Shift Siang", icon: "☀️" },
                      { value: "Shift Malam", label: "Shift Malam", icon: "🌙" },
                      { value: "Flexible", label: "Flexible", icon: "📅" },
                    ]}
                  />
                </div>
              </div>

              {/* Schedule Editor */}
              <div className="space-y-3">
                <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Atur Jadwal Mingguan
                </h4>
                <div className="space-y-3">
                  {Object.entries(dayLabelsFull).map(([key, label]) => (
                    <div
                      key={key}
                      className={`grid grid-cols-12 gap-3 items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div className="col-span-2">
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
                      </div>
                      <div className="col-span-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSchedule.schedules[key].isOff}
                            onChange={(e) => {
                              const newSchedules = { ...selectedSchedule.schedules };
                              newSchedules[key] = {
                                ...newSchedules[key],
                                isOff: e.target.checked,
                              };
                              setSelectedSchedule({
                                ...selectedSchedule,
                                schedules: newSchedules,
                              });
                            }}
                            className="w-4 h-4 text-[#1D395E] rounded focus:ring-[#1D395E]"
                          />
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Libur</span>
                        </label>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="time"
                          value={selectedSchedule.schedules[key].start || ""}
                          disabled={selectedSchedule.schedules[key].isOff}
                          onChange={(e) => {
                            const newSchedules = { ...selectedSchedule.schedules };
                            newSchedules[key] = {
                              ...newSchedules[key],
                              start: e.target.value,
                            };
                            setSelectedSchedule({
                              ...selectedSchedule,
                              schedules: newSchedules,
                            });
                          }}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] disabled:opacity-50 ${
                            isDark 
                              ? 'border-gray-600 bg-gray-600 text-gray-200 disabled:bg-gray-700 disabled:text-gray-500' 
                              : 'border-gray-300 disabled:bg-gray-200 disabled:text-gray-400'
                          }`}
                        />
                      </div>
                      <div className={`col-span-1 text-center ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>-</div>
                      <div className="col-span-3">
                        <input
                          type="time"
                          value={selectedSchedule.schedules[key].end || ""}
                          disabled={selectedSchedule.schedules[key].isOff}
                          onChange={(e) => {
                            const newSchedules = { ...selectedSchedule.schedules };
                            newSchedules[key] = {
                              ...newSchedules[key],
                              end: e.target.value,
                            };
                            setSelectedSchedule({
                              ...selectedSchedule,
                              schedules: newSchedules,
                            });
                          }}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] disabled:opacity-50 ${
                            isDark 
                              ? 'border-gray-600 bg-gray-600 text-gray-200 disabled:bg-gray-700 disabled:text-gray-500' 
                              : 'border-gray-300 disabled:bg-gray-200 disabled:text-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                disabled={saving}
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSchedule(null);
                }}
                className={`px-6 py-2.5 rounded-lg border text-sm font-medium disabled:opacity-50 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Batal
              </button>
              <button
                disabled={saving}
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1D395E] text-sm font-medium text-white hover:bg-[#152a47] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>
                Tambah Jadwal Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Employee Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Pilih Karyawan <span className="text-red-500">*</span>
                  </label>
                  {loadingEmployees ? (
                    <div className="flex items-center gap-2 py-2.5">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1D395E]"></div>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Memuat karyawan...</span>
                    </div>
                  ) : (
                    <select
                      value={newSchedule.employeeId}
                      onChange={(e) => setNewSchedule({ ...newSchedule, employeeId: e.target.value })}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-gray-200' 
                          : 'border-gray-300 bg-white text-black'
                      }`}
                    >
                      <option value="">-- Pilih Karyawan --</option>
                      {employeeOptions.map((emp) => (
                        <option key={emp.id} value={emp.employeeId}>
                          {emp.employeeName} ({emp.employeeId})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tipe Shift
                  </label>
                  <CustomDropdown
                    name="shiftType"
                    value={newSchedule.shiftType}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        shiftType: e.target.value,
                      })
                    }
                    placeholder="Pilih Shift"
                    options={[
                      { value: "Regular", label: "Regular", icon: "⏰" },
                      { value: "Shift Pagi", label: "Shift Pagi", icon: "🌅" },
                      { value: "Shift Siang", label: "Shift Siang", icon: "☀️" },
                      { value: "Shift Malam", label: "Shift Malam", icon: "🌙" },
                      { value: "Flexible", label: "Flexible", icon: "📅" },
                    ]}
                  />
                </div>
              </div>

              {/* Schedule Editor */}
              <div className="space-y-3">
                <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Atur Jadwal Mingguan
                </h4>
                <div className="space-y-3">
                  {Object.entries(dayLabelsFull).map(([key, label]) => (
                    <div
                      key={key}
                      className={`grid grid-cols-12 gap-3 items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div className="col-span-2">
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
                      </div>
                      <div className="col-span-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newSchedule.schedules?.[key]?.isOff || false}
                            onChange={(e) =>
                              setNewSchedule({
                                ...newSchedule,
                                schedules: {
                                  ...newSchedule.schedules,
                                  [key]: {
                                    ...newSchedule.schedules?.[key],
                                    isOff: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-[#1D395E] focus:ring-[#1D395E]"
                          />
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Libur</span>
                        </label>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="time"
                          value={newSchedule.schedules?.[key]?.start || "08:00"}
                          disabled={newSchedule.schedules?.[key]?.isOff}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              schedules: {
                                ...newSchedule.schedules,
                                [key]: {
                                  ...newSchedule.schedules?.[key],
                                  start: e.target.value,
                                },
                              },
                            })
                          }
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] disabled:opacity-50 ${
                            isDark 
                              ? 'border-gray-600 bg-gray-600 text-gray-200 disabled:bg-gray-700 disabled:text-gray-500' 
                              : 'border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                          }`}
                        />
                      </div>
                      <div className={`col-span-1 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>—</div>
                      <div className="col-span-3">
                        <input
                          type="time"
                          value={newSchedule.schedules?.[key]?.end || "17:00"}
                          disabled={newSchedule.schedules?.[key]?.isOff}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              schedules: {
                                ...newSchedule.schedules,
                                [key]: {
                                  ...newSchedule.schedules?.[key],
                                  end: e.target.value,
                                },
                              },
                            })
                          }
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] disabled:opacity-50 ${
                            isDark 
                              ? 'border-gray-600 bg-gray-600 text-gray-200 disabled:bg-gray-700 disabled:text-gray-500' 
                              : 'border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                disabled={saving}
                onClick={() => {
                  setShowAddModal(false);
                  setNewSchedule({
                    employeeId: '',
                    shiftType: 'Regular',
                    schedules: { ...defaultSchedules }
                  });
                }}
                className={`px-6 py-2.5 rounded-lg border text-sm font-medium disabled:opacity-50 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Batal
              </button>
              <button
                disabled={saving || !newSchedule.employeeId}
                onClick={handleAddSchedule}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1D395E] text-sm font-medium text-white hover:bg-[#152a47] disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Tambah Jadwal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
