// src/features/work-schedule/pages/WorkScheduleAdmin.jsx
import { useState } from "react";
import {
  Search,
  Filter,
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
} from "lucide-react";

// Dummy data untuk jadwal kerja
const initialSchedules = [
  {
    id: 1,
    employeeName: "Issa",
    position: "CEO",
    branch: "Jakarta",
    shiftType: "Regular",
    schedules: {
      monday: { start: "08:00", end: "17:00", isOff: false },
      tuesday: { start: "08:00", end: "17:00", isOff: false },
      wednesday: { start: "08:00", end: "17:00", isOff: false },
      thursday: { start: "08:00", end: "17:00", isOff: false },
      friday: { start: "08:00", end: "17:00", isOff: false },
      saturday: { start: null, end: null, isOff: true },
      sunday: { start: null, end: null, isOff: true },
    },
  },
  {
    id: 2,
    employeeName: "Salma",
    position: "Head Of HR",
    branch: "Malang",
    shiftType: "Regular",
    schedules: {
      monday: { start: "08:00", end: "17:00", isOff: false },
      tuesday: { start: "08:00", end: "17:00", isOff: false },
      wednesday: { start: "08:00", end: "17:00", isOff: false },
      thursday: { start: "08:00", end: "17:00", isOff: false },
      friday: { start: "08:00", end: "17:00", isOff: false },
      saturday: { start: null, end: null, isOff: true },
      sunday: { start: null, end: null, isOff: true },
    },
  },
  {
    id: 3,
    employeeName: "Fauzan",
    position: "Supervisor",
    branch: "Solo",
    shiftType: "Shift Pagi",
    schedules: {
      monday: { start: "06:00", end: "14:00", isOff: false },
      tuesday: { start: "06:00", end: "14:00", isOff: false },
      wednesday: { start: "06:00", end: "14:00", isOff: false },
      thursday: { start: "06:00", end: "14:00", isOff: false },
      friday: { start: "06:00", end: "14:00", isOff: false },
      saturday: { start: "06:00", end: "12:00", isOff: false },
      sunday: { start: null, end: null, isOff: true },
    },
  },
  {
    id: 4,
    employeeName: "Haykal",
    position: "HRD",
    branch: "Jogja",
    shiftType: "Shift Siang",
    schedules: {
      monday: { start: "14:00", end: "22:00", isOff: false },
      tuesday: { start: "14:00", end: "22:00", isOff: false },
      wednesday: { start: "14:00", end: "22:00", isOff: false },
      thursday: { start: "14:00", end: "22:00", isOff: false },
      friday: { start: "14:00", end: "22:00", isOff: false },
      saturday: { start: null, end: null, isOff: true },
      sunday: { start: null, end: null, isOff: true },
    },
  },
  {
    id: 5,
    employeeName: "Diva",
    position: "CPO",
    branch: "Bekasi",
    shiftType: "Flexible",
    schedules: {
      monday: { start: "09:00", end: "18:00", isOff: false },
      tuesday: { start: "09:00", end: "18:00", isOff: false },
      wednesday: { start: "09:00", end: "18:00", isOff: false },
      thursday: { start: "09:00", end: "18:00", isOff: false },
      friday: { start: "09:00", end: "15:00", isOff: false },
      saturday: { start: null, end: null, isOff: true },
      sunday: { start: null, end: null, isOff: true },
    },
  },
  {
    id: 6,
    employeeName: "Bintang",
    position: "Staff",
    branch: "Semarang",
    shiftType: "Shift Malam",
    schedules: {
      monday: { start: "22:00", end: "06:00", isOff: false },
      tuesday: { start: "22:00", end: "06:00", isOff: false },
      wednesday: { start: "22:00", end: "06:00", isOff: false },
      thursday: { start: "22:00", end: "06:00", isOff: false },
      friday: { start: null, end: null, isOff: true },
      saturday: { start: null, end: null, isOff: true },
      sunday: { start: "22:00", end: "06:00", isOff: false },
    },
  },
  {
    id: 7,
    employeeName: "Khayru",
    position: "HRD",
    branch: "Bandung",
    shiftType: "Regular",
    schedules: {
      monday: { start: "08:00", end: "17:00", isOff: false },
      tuesday: { start: "08:00", end: "17:00", isOff: false },
      wednesday: { start: "08:00", end: "17:00", isOff: false },
      thursday: { start: "08:00", end: "17:00", isOff: false },
      friday: { start: "08:00", end: "17:00", isOff: false },
      saturday: { start: null, end: null, isOff: true },
      sunday: { start: null, end: null, isOff: true },
    },
  },
  {
    id: 8,
    employeeName: "Riska",
    position: "OB",
    branch: "Jakarta",
    shiftType: "Shift Pagi",
    schedules: {
      monday: { start: "05:00", end: "13:00", isOff: false },
      tuesday: { start: "05:00", end: "13:00", isOff: false },
      wednesday: { start: "05:00", end: "13:00", isOff: false },
      thursday: { start: "05:00", end: "13:00", isOff: false },
      friday: { start: "05:00", end: "13:00", isOff: false },
      saturday: { start: "05:00", end: "10:00", isOff: false },
      sunday: { start: null, end: null, isOff: true },
    },
  },
];

// Shift type dengan warna
function shiftTypeClass(type) {
  switch (type) {
    case "Regular":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Shift Pagi":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Shift Siang":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Shift Malam":
      return "bg-violet-50 text-violet-700 border border-violet-200";
    case "Flexible":
      return "bg-sky-50 text-sky-700 border border-sky-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
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
  const [schedules, setSchedules] = useState(initialSchedules);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Filter
  const filteredSchedules = schedules.filter(
    (s) =>
      s.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSchedules.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentSchedules = filteredSchedules.slice(startIndex, endIndex);

  // Action handlers
  const handleViewDetail = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDetailModal(true);
  };

  const handleEditClick = (schedule) => {
    setSelectedSchedule({ ...schedule });
    setShowEditModal(true);
  };

  const handleDeleteClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedSchedule) return;
    setSchedules((prev) => prev.filter((s) => s.id !== selectedSchedule.id));
    setShowDeleteModal(false);
    setSelectedSchedule(null);
  };

  const handleSaveEdit = () => {
    if (!selectedSchedule) return;
    setSchedules((prev) =>
      prev.map((s) => (s.id === selectedSchedule.id ? selectedSchedule : s))
    );
    setShowEditModal(false);
    setSelectedSchedule(null);
  };

  // Stats
  const totalEmployees = schedules.length;
  const regularShift = schedules.filter((s) => s.shiftType === "Regular").length;
  const shiftWorkers = schedules.filter((s) => s.shiftType !== "Regular" && s.shiftType !== "Flexible").length;
  const _flexibleWorkers = schedules.filter((s) => s.shiftType === "Flexible").length; // underscore prefix for unused

  return (
    <div className="space-y-6">
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
            <p className="text-2xl font-semibold text-[#1D395E]">Desember 2025</p>
          </div>
        </div>

        {/* Card 2: Total Schedule */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Total Karyawan
            </p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">{totalEmployees}</p>
          </div>
        </div>

        {/* Card 3: Regular Shift */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Jam Reguler
            </p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">{regularShift}</p>
          </div>
        </div>

        {/* Card 4: Shift Workers */}
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="bg-[#1D395E] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#1D395E]" />
            </div>
            <p className="text-white font-medium" style={{ color: "#FFFFFF" }}>
              Pekerja Shift
            </p>
          </div>
          <div className="p-5">
            <p className="text-3xl font-semibold text-[#1D395E]">{shiftWorkers}</p>
          </div>
        </div>
      </div>

      {/* ===== WRAPPER TABEL SCHEDULE ===== */}
      <section className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-6">
        {/* Header tabel + action bar */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-[#1D395E]">
                Jadwal Kerja Karyawan
              </h2>
              <p className="text-sm text-gray-500 mt-1">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#7CA6BF] bg-[rgba(124,166,191,0.08)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D395E]" />
              </div>

              {/* Buttons: Filter, Tambah Data */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
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
        <div className="overflow-x-auto rounded-xl border border-gray-200/70">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F7FA] text-gray-700">
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
              {currentSchedules.map((schedule, index) => (
                <tr
                  key={schedule.id}
                  className={`border-t border-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100/60 transition-colors`}
                >
                  {/* Employee Name with Avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {schedule.employeeName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {schedule.employeeName}
                        </p>
                        <p className="text-xs text-gray-500">{schedule.position}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-800">{schedule.branch}</td>

                  {/* Shift Type Badge */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${shiftTypeClass(
                        schedule.shiftType
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
                          schedule.schedules[day].isOff
                            ? "bg-gray-100 text-gray-500"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {schedule.schedules[day].isOff
                          ? "OFF"
                          : schedule.schedules[day].start}
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
                        className="p-2 rounded-lg bg-[rgba(124,166,191,0.15)] text-[#1D395E] hover:bg-[rgba(124,166,191,0.25)] transition"
                        title="View Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() => handleEditClick(schedule)}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                        title="Edit Schedule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(schedule)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete Schedule"
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
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredSchedules.length)} of{" "}
            {filteredSchedules.length} records
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
      </section>

      {/* ===== DETAIL MODAL ===== */}
      {showDetailModal && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#1D395E]">
                Detail Jadwal Kerja
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Employee Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {selectedSchedule.employeeName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedSchedule.employeeName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedSchedule.position} • {selectedSchedule.branch}
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-semibold ${shiftTypeClass(
                      selectedSchedule.shiftType
                    )}`}
                  >
                    {selectedSchedule.shiftType}
                  </span>
                </div>
              </div>

              {/* Schedule Grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Jadwal Mingguan
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(dayLabelsFull).map(([key, label]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                        selectedSchedule.schedules[key].isOff
                          ? "bg-gray-50"
                          : "bg-emerald-50"
                      }`}
                    >
                      <span className="font-medium text-gray-700">{label}</span>
                      <span
                        className={`text-sm font-semibold ${
                          selectedSchedule.schedules[key].isOff
                            ? "text-gray-500"
                            : "text-emerald-700"
                        }`}
                      >
                        {formatTime(selectedSchedule.schedules[key])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-rose-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Hapus Jadwal Kerja?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-5">
              Apakah kamu yakin ingin menghapus jadwal kerja{" "}
              <span className="font-semibold">
                {selectedSchedule.employeeName}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-5 text-sm text-gray-700">
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
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSchedule(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Tidak, Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#1D395E]">
                Edit Jadwal Kerja
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Employee Info (readonly) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Karyawan
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSchedule.employeeName}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-gray-100 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tipe Shift
                  </label>
                  <select
                    value={selectedSchedule.shiftType}
                    onChange={(e) =>
                      setSelectedSchedule({
                        ...selectedSchedule,
                        shiftType: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Shift Pagi">Shift Pagi</option>
                    <option value="Shift Siang">Shift Siang</option>
                    <option value="Shift Malam">Shift Malam</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Schedule Editor */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Atur Jadwal Mingguan
                </h4>
                <div className="space-y-3">
                  {Object.entries(dayLabelsFull).map(([key, label]) => (
                    <div
                      key={key}
                      className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg bg-gray-50"
                    >
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">{label}</span>
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
                          <span className="text-sm text-gray-600">Libur</span>
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
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] disabled:bg-gray-200 disabled:text-gray-400"
                        />
                      </div>
                      <div className="col-span-1 text-center text-gray-400">-</div>
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
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] disabled:bg-gray-200 disabled:text-gray-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSchedule(null);
                }}
                className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1D395E] text-sm font-medium text-white hover:bg-[#152a47]"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD MODAL (Placeholder) ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1D395E]">
                Tambah Jadwal Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Fitur tambah jadwal baru akan segera tersedia. Saat ini kamu dapat
              mengedit jadwal yang sudah ada.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
