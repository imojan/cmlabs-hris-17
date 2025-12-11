// src/features/employees/pages/ViewEmployeeAdmin.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Calendar, ChevronDown, ArrowLeft } from "lucide-react";

export function ViewEmployeeAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const employee = state?.employee || null;

  // fallback text kalau belum terhubung ke backend
  const display = {
    firstName: employee?.name?.split(" ")[0] || "",
    lastName: employee?.name?.split(" ").slice(1).join(" ") || "",
    mobileNumber: employee?.phone || "",
    nik: "1234567890123456",
    gender:
      employee?.gender === "Perempuan"
        ? "Female"
        : employee?.gender === "Laki-Laki"
        ? "Male"
        : "",
    birthPlace: "Malang",
    birthDate: "2000-01-01",
    education: "S1",
    branch: employee?.branch || "",
    position: employee?.position || "",
    contractType: employee?.status ? "Tetap" : "Kontrak",
    grade: employee?.grade || "",
    bank: "BCA",
    accountNumber: "1234567890",
    accountName: employee?.name || "",
    spType: "",
  };

  return (
    <div className="space-y-6">
      {/* Header top: back + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/employees-database")}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-[#1D395E]">
          Employee Detail
        </h1>
      </div>

      <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 lg:p-8">
        <h2 className="text-lg md:text-xl font-semibold text-[#1D395E] mb-5">
          View Employee Information
        </h2>

        <div className="rounded-2xl border border-[#BFD0E0] bg-[#F7FAFC] px-5 py-6 md:px-8 md:py-8">
          {/* Avatar + basic info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-600">
                  {employee?.name?.charAt(0) ?? "E"}
                </span>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {employee?.name ?? "Unknown Employee"}
                </p>
                <p className="text-sm text-gray-600">
                  {employee?.position} • {employee?.branch}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Status:{" "}
                <span
                  className={`font-semibold ${
                    employee?.status ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {employee?.status ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>

          {/* FORM READ ONLY */}
          <div className="space-y-6">
            {/* Baris 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="First Name" value={display.firstName} />
              <ReadOnlyInput label="Last Name" value={display.lastName} />
            </div>

            {/* Baris 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput
                label="Mobile Number"
                value={display.mobileNumber}
              />
              <ReadOnlyInput label="NIK" value={display.nik} />
            </div>

            {/* Baris 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Gender" value={display.gender} />
              <ReadOnlyInput
                label="Pendidikan Terakhir"
                value={display.education}
              />
            </div>

            {/* Baris 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Tempat Lahir" value={display.birthPlace} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tanggal Lahir
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={display.birthDate}
                    readOnly
                    disabled
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-gray-100 text-gray-700"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Baris 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Jabatan" value={display.position} />
              <ReadOnlyInput label="Cabang" value={display.branch} />
            </div>

            {/* Baris 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Tipe Kontrak" value={display.contractType} />
              <ReadOnlyInput label="Grade" value={display.grade} />
            </div>

            {/* Baris 7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Bank" value={display.bank} />
              <ReadOnlyInput
                label="Nomor Rekening"
                value={display.accountNumber}
              />
            </div>

            {/* Baris 8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput
                label="Atas Nama Rekening"
                value={display.accountName}
              />
              <ReadOnlyInput label="Tipe SP" value={display.spType || "-"} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/employees-database")}
              className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Small helper component for read-only input
function ReadOnlyInput({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        readOnly
        disabled
        value={value || ""}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-gray-100 text-gray-700"
      />
    </div>
  );
}
