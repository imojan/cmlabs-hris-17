// src/features/attendance/pages/AttendanceAdmin.jsx
import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  XSquare,
  X,
} from "lucide-react";

const initialData = [
  {
    id: 1,
    name: "Juanita",
    role: "CEO",
    clockIn: "08.00",
    clockOut: "16.30",
    workHours: "10h 5m",
    approveIt: false,
    approveHr: false,
    status: "Waiting Approval",
    actualStatus: "On Time", // Status sebenarnya setelah diapprove
  },
  {
    id: 2,
    name: "Shane",
    role: "OB",
    clockIn: "08.00",
    clockOut: "17.15",
    workHours: "9h 50m",
    approveIt: true,
    approveHr: false,
    status: "Waiting Approval",
    actualStatus: "On Time",
  },
  {
    id: 3,
    name: "Miles",
    role: "Head of HR",
    clockIn: "09.00",
    clockOut: "16.45",
    workHours: "10h 30m",
    approveIt: true,
    approveHr: true,
    status: "On Time",
    actualStatus: "On Time",
  },
  {
    id: 4,
    name: "Flores",
    role: "Manager",
    clockIn: "09.15",
    clockOut: "15.30",
    workHours: "6h 15m",
    approveIt: false,
    approveHr: false,
    status: "Waiting Approval",
    actualStatus: "Late",
  },
  {
    id: 5,
    name: "Henry",
    role: "CPO",
    clockIn: "0",
    clockOut: "0",
    workHours: "0",
    approveIt: false,
    approveHr: false,
    status: "Waiting Approval",
    actualStatus: "Annual Leave",
  },
  {
    id: 6,
    name: "Sarah",
    role: "Manager",
    clockIn: "08.30",
    clockOut: "17.00",
    workHours: "8h 30m",
    approveIt: true,
    approveHr: true,
    status: "On Time",
    actualStatus: "On Time",
  },
  {
    id: 7,
    name: "Michael",
    role: "Staff",
    clockIn: "09.30",
    clockOut: "17.30",
    workHours: "8h 0m",
    approveIt: false,
    approveHr: false,
    status: "Waiting Approval",
    actualStatus: "Late",
  },
  {
    id: 8,
    name: "Lisa",
    role: "Supervisor",
    clockIn: "0",
    clockOut: "0",
    workHours: "0",
    approveIt: false,
    approveHr: false,
    status: "Waiting Approval",
    actualStatus: "Sick",
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
    case "Waiting Approval":
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

export function AttendanceAdmin() {
  const [attendanceData, setAttendanceData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [approvalType, setApprovalType] = useState(""); // "hr" or "it"

  // Pagination logic
  const totalPages = Math.ceil(attendanceData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = attendanceData.slice(startIndex, endIndex);

  // Handle approval click
  const handleApprovalClick = (employee, type) => {
    setSelectedEmployee(employee);
    setApprovalType(type);
    setShowModal(true);
  };

  // Handle approve action
  const handleApprove = () => {
    setAttendanceData((prev) =>
      prev.map((emp) => {
        if (emp.id === selectedEmployee.id) {
          const updatedEmp = { ...emp };
          
          if (approvalType === "hr") {
            updatedEmp.approveHr = true;
          } else if (approvalType === "it") {
            updatedEmp.approveIt = true;
          }

          // Jika kedua approval sudah true, ubah status
          if (updatedEmp.approveHr && updatedEmp.approveIt) {
            updatedEmp.status = updatedEmp.actualStatus;
          }

          return updatedEmp;
        }
        return emp;
      })
    );
    setShowModal(false);
    setSelectedEmployee(null);
  };

  // Handle reject action
  const handleReject = () => {
    setShowModal(false);
    setSelectedEmployee(null);
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

                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-600 bg-emerald-600 text-white text-sm hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:border-emerald-800 transition-all shadow-sm">
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
                <th className="px-4 py-3 text-left font-medium">Employee Name</th>
                <th className="px-4 py-3 text-left font-medium">Jabatan</th>
                <th className="px-4 py-3 text-center font-medium">Clock In</th>
                <th className="px-4 py-3 text-center font-medium">Clock Out</th>
                <th className="px-4 py-3 text-center font-medium">Work Hours</th>
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

                  {/* Approve Icons */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* HR Approval */}
                      <button
                        onClick={() => handleApprovalClick(employee, "hr")}
                        disabled={employee.approveHr}
                        className="disabled:cursor-not-allowed"
                      >
                        {employee.approveHr ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XSquare className="w-5 h-5 text-gray-400 hover:text-gray-600 transition" />
                        )}
                      </button>

                      {/* IT Approval */}
                      <button
                        onClick={() => handleApprovalClick(employee, "it")}
                        disabled={employee.approveIt}
                        className="disabled:cursor-not-allowed"
                      >
                        {employee.approveIt ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XSquare className="w-5 h-5 text-gray-400 hover:text-gray-600 transition" />
                        )}
                      </button>
                    </div>
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
                    <button className="px-3 py-1.5 rounded-lg border-2 border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all">
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

      {/* ===== APPROVAL MODAL ===== */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Approve Attendance
              </h3>
              <button
                onClick={() => setShowModal(false)}
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
                    Are you sure you want to approve{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedEmployee.name}'s
                    </span>{" "}
                    attendance?
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
                onClick={handleReject}
                className="px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 rounded-xl border-2 border-[#1D395E] bg-[#1D395E] text-sm font-medium text-white hover:bg-[#152945] hover:border-[#152945] transition-all shadow-sm"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}