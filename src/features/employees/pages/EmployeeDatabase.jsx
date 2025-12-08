// src/features/employees/pages/EmployeeDatabase.jsx
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";

const employeeData = [
  {
    no: 1,
    name: "Issa",
    gender: "Perempuan",
    phone: "08123456789",
    branch: "Jakarta",
    position: "CEO",
    grade: "Management",
    status: "active",
  },
  {
    no: 2,
    name: "Salma",
    gender: "Perempuan",
    phone: "08123456789",
    branch: "Malang",
    position: "Head Of HR",
    grade: "Management",
    status: "active",
  },
  {
    no: 3,
    name: "Fauzan",
    gender: "Laki-Laki",
    phone: "08123456789",
    branch: "Solo",
    position: "Supervisor",
    grade: "Management",
    status: "active",
  },
  {
    no: 4,
    name: "Haykal",
    gender: "Laki-Laki",
    phone: "08123456789",
    branch: "Jogja",
    position: "HRD",
    grade: "Management",
    status: "active",
  },
  {
    no: 5,
    name: "Diva",
    gender: "Perempuan",
    phone: "08123456789",
    branch: "Bekasi",
    position: "CPO",
    grade: "Management",
    status: "active",
  },
  {
    no: 6,
    name: "Bintang",
    gender: "Laki-Laki",
    phone: "08123456789",
    branch: "Semarang",
    position: "CEO",
    grade: "Management",
    status: "active",
  },
  {
    no: 7,
    name: "Khayru",
    gender: "Laki-Laki",
    phone: "08123456789",
    branch: "Bandung",
    position: "HRD",
    grade: "Management",
    status: "active",
  },
  {
    no: 8,
    name: "Riska",
    gender: "Perempuan",
    phone: "08123456789",
    branch: "Jakarta",
    position: "OB",
    grade: "Management",
    status: "active",
  },
];

export function EmployeeDatabase() {
  return (
    <div className="space-y-6">
      {/* ===== STAT CARDS (bagian atas persis seperti Figma) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5">
          <p className="text-sm text-gray-600 mb-1">Periode</p>
          <p className="text-2xl font-semibold text-[#1D395E]">Bulan Tahun</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5">
          <p className="text-sm text-gray-600 mb-1">Total Employee</p>
          <p className="text-2xl font-semibold text-[#1D395E]">208</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5">
          <p className="text-sm text-gray-600 mb-1">Total New Hire</p>
          <p className="text-2xl font-semibold text-[#1D395E]">20</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5">
          <p className="text-sm text-gray-600 mb-1">Full Time Employee</p>
          <p className="text-2xl font-semibold text-[#1D395E]">20</p>
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
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#7CA6BF] bg-white text-sm text-gray-700 hover:bg-gray-50 transition">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#7CA6BF] bg-white text-sm text-gray-700 hover:bg-gray-50 transition">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#7CA6BF] bg-white text-sm text-gray-700 hover:bg-gray-50 transition">
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#B93C54] bg-[#B93C54] text-white text-sm hover:bg-[#9b3246] transition">
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
                <th className="px-4 py-3 text-left font-medium">Nomor Telepon</th>
                <th className="px-4 py-3 text-left font-medium">Cabang</th>
                <th className="px-4 py-3 text-left font-medium">Jabatan</th>
                <th className="px-4 py-3 text-left font-medium">Grade</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {employeeData.map((employee, index) => (
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
                  <td className="px-4 py-3 text-gray-800">{employee.position}</td>
                  <td className="px-4 py-3 text-gray-800">{employee.grade}</td>

                  {/* Status bulat biru (mirip Figma) */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-[#1D395E]"></span>
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
      </section>
    </div>
  );
}
