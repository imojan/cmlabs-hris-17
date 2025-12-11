// src/features/attendance/pages/AttendanceAdmin.jsx
import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    case "Annual Leave":
      return "bg-sky-50 text-sky-700 border border-sky-200";
    case "Sick":
      return "bg-violet-50 text-violet-700 border border-violet-200";
    case "Absent":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Waiting Approval":
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

export function AttendanceAdmin() {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // modal approve / reject
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [decisionType, setDecisionType] = useState(""); // "approve" | "reject"

  // panel detail
  const [detailEmployee, setDetailEmployee] = useState(null);

  // pagination
  const totalPages = Math.ceil(attendanceData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = attendanceData.slice(startIndex, endIndex);

  const handleApprovalClick = (employee, type) => {
    setSelectedEmployee(employee);
    setDecisionType(type); // "approve" atau "reject"
    setShowModal(true);
  };

  const handleConfirmDecision = () => {
    if (!selectedEmployee || !decisionType) return;

    setAttendanceData((prev) =>
      prev.map((emp) => {
        if (emp.id !== selectedEmployee.id) return emp;

        const updated = { ...emp };

        if (decisionType === "approve") {
          updated.approvalStatus = "approved";
          updated.status = updated.actualStatus;
        } else if (decisionType === "reject") {
          updated.approvalStatus = "rejected";
          updated.status = "Rejected";
        }

        return updated;
      })
    );

    setShowModal(false);
    setSelectedEmployee(null);
    setDecisionType("");
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
      {/* ===== WRAPPER TABEL ATTENDANCE ===== */}
      <section className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-6">
        {/* Header tabel + action bar */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-[#1D395E]">
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

        {/* ===== TABLE ===== */}
        <div className="overflow-x-auto rounded-xl border border-gray-200/70">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F7FA] text-gray-700">
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
              {currentData.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`border-t border-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100/60 transition-colors`}
                >
                  {/* Employee Name with Avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {employee.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-800">{employee.role}</td>
                  <td className="px-4 py-3 text-center text-gray-800">
                    {employee.clockIn}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-800">
                    {employee.clockOut}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-800">
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100 hover:bg-rose-100 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>

                        {/* Approve chip */}
                        <button
                          onClick={() =>
                            handleApprovalClick(employee, "approve")
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100 hover:bg-emerald-100 transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                      </div>
                    )}

                    {employee.approvalStatus === "approved" && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 justify-center">
                        <CheckCircle className="w-4 h-4" />
                        <span>Approved</span>
                      </div>
                    )}

                    {employee.approvalStatus === "rejected" && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100 justify-center">
                        <XCircle className="w-4 h-4" />
                        <span>Rejected</span>
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                        employee.status
                      )}`}
                    >
                      {employee.status}
                    </span>
                  </td>

                  {/* Details Button */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewDetails(employee)}
                      className="px-3 py-1.5 rounded-lg border-2 border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                      View
                    </button>
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
            {Math.min(endIndex, attendanceData.length)} of{" "}
            {attendanceData.length} records
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
                className="px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium text-white transition-all shadow-sm ${
                  decisionType === "approve"
                    ? "bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700"
                    : "bg-rose-600 border-rose-600 hover:bg-rose-700 hover:border-rose-700"
                }`}
              >
                {decisionType === "approve" ? "Approve" : "Reject"}
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
                  <span className="text-gray-600 font-semibold text-xl">
                    {detailEmployee.name.charAt(0)}
                  </span>
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

                <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs text-gray-800 transition">
                  <span className="truncate text-left">
                    {detailEmployee.proofFile}
                  </span>

                  <span className="flex items-center gap-2 flex-shrink-0">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <Download className="w-4 h-4 text-gray-600" />
                  </span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
