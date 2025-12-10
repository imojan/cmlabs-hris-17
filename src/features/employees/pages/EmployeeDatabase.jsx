// src/features/employees/pages/EmployeeDatabase.jsx
import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  FileText,
  Edit,
  Trash2,
  Calendar,
  Users,
  UserPlus,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const employeeList = [
  {
    no: 1,
    name: "Issa",
    gender: "Perempuan",
    phone: "08123456789",
    branch: "Jakarta",
    position: "CEO",
    grade: "Management",
    status: true,
  },
  {
    no: 2,
    name: "Salma",
    gender: "Perempuan",
    phone: "08123456789",
    branch: "Malang",
    position: "Head Of HR",
    grade: "Management",
    status: true,
  },
  {
    no: 3,
    name: "Fauzan",
    gender: "Laki-Laki",
    phone: "08123456789",
    branch: "Solo",
    position: "Supervisor",
    grade: "Management",
    status: true,
  },
  {
    no: 4,
    name: "Haykal",
    gender: "Laki-Laki",
    phone: "08123456789",
    branch: "Jogja",
    position: "HRD",
    grade: "Management",
    status: true,
  },
  {
    no: 5,
    name: "Diva",
    gender: "Perempuan",
    phone: "08123456789",
    branch: "Bekasi",
    position: "CPO",
    grade: "Management",
    status: false,
  },
  {
    no: 6,
    name: "Bintang",
    gender: "Laki-Laki",
    phone: "08123456789",
    branch: "Semarang",
    position: "CEO",
    grade: "Management",
    status: true,
  },
  {
    no: 7,
    name: "Khayru",
    gender: "Laki-Laki",
    phone: "08123456789",
    branch: "Bandung",
    position: "HRD",
    grade: "Management",
    status: true,
  },
  {
    no: 8,
    name: "Riska",
    gender: "Perempuan",
    phone: "08123456789",
    branch: "Jakarta",
    position: "OB",
    grade: "Management",
    status: false,
  },
  {
    no: 9,
    name: "Ahmad",
    gender: "Laki-Laki",
    phone: "08123456790",
    branch: "Surabaya",
    position: "Staff",
    grade: "Staff",
    status: true,
  },
  {
    no: 10,
    name: "Siti",
    gender: "Perempuan",
    phone: "08123456791",
    branch: "Bandung",
    position: "Manager",
    grade: "Management",
    status: true,
  },
  {
    no: 11,
    name: "Budi",
    gender: "Laki-Laki",
    phone: "08123456792",
    branch: "Jakarta",
    position: "Staff",
    grade: "Staff",
    status: false,
  },
  {
    no: 12,
    name: "Lina",
    gender: "Perempuan",
    phone: "08123456793",
    branch: "Malang",
    position: "Supervisor",
    grade: "Management",
    status: true,
  },
];

export function EmployeeDatabase() {
  const [employees, setEmployees] = useState(employeeList);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Toggle status employee
  const toggleEmployeeStatus = (employeeNo) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.no === employeeNo ? { ...emp, status: !emp.status } : emp
      )
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(employees.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

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
            <p className="text-3xl font-semibold text-[#1D395E]">Bulan Tahun</p>
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
            <p className="text-3xl font-semibold text-[#1D395E]">208</p>
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
            <p className="text-3xl font-semibold text-[#1D395E]">20</p>
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
            <p className="text-3xl font-semibold text-[#1D395E]">20</p>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#7CA6BF] bg-[rgba(124,166,191,0.08)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D395E]" />
              </div>

              {/* Buttons: Filter, Export, Import, Tambah Data */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>

                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>

                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </button>

                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#B93C54] bg-[#B93C54] text-white text-sm hover:bg-[#9b3246] hover:border-[#9b3246] transition-all shadow-sm">
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
                <th className="px-4 py-3 text-left font-medium">No.</th>
                <th className="px-4 py-3 text-left font-medium">Avatar</th>
                <th className="px-4 py-3 text-left font-medium">
                  Nama <span className="text-xs">↕</span>
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Jenis Kelamin <span className="text-xs">↕</span>
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Nomor Telepon
                </th>
                <th className="px-4 py-3 text-left font-medium">Cabang</th>
                <th className="px-4 py-3 text-left font-medium">Jabatan</th>
                <th className="px-4 py-3 text-left font-medium">Grade</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr
                  key={employee.no}
                  className={`border-t border-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100/60 transition-colors`}
                >
                  <td className="px-4 py-3 text-gray-700">{employee.no}</td>

                  {/* Avatar bulat + huruf depan */}
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-800">{employee.name}</td>
                  <td className="px-4 py-3 text-gray-800">{employee.gender}</td>
                  <td className="px-4 py-3 text-gray-800">{employee.phone}</td>
                  <td className="px-4 py-3 text-gray-800">{employee.branch}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {employee.position}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{employee.grade}</td>

                  {/* Status Toggle Button */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleEmployeeStatus(employee.no)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        employee.status
                          ? "bg-[#1D395E] focus:ring-[#1D395E]"
                          : "bg-gray-300 focus:ring-gray-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          employee.status ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Action icons */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-[rgba(124,166,191,0.15)] text-[#1D395E] hover:bg-[rgba(124,166,191,0.25)] transition">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition">
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
            {Math.min(endIndex, employees.length)} of {employees.length} records
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
    </div>
  );
}