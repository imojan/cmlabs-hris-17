// src/features/employees/pages/ViewEmployeeAdmin.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, ChevronDown, ArrowLeft, Loader2 } from "lucide-react";
import { employeeService } from "@/app/services/employee.api";
import { Notification } from "@/components/ui/Notification";

export function ViewEmployeeAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Mapping backend -> frontend
  const CONTRACT_TYPE_MAP = {
    "permanent": "Tetap",
    "contract": "Kontrak",
    "intern": "Magang",
    "resign": "Resign",
  };

  const EDUCATION_MAP = {
    "sma": "SMA/SMK",
    "smk": "SMA/SMK",
    "d3": "D3",
    "s1": "S1",
    "s2": "S2",
    "s3": "S3",
  };

  // Fetch employee data
  useEffect(() => {
    async function fetchEmployee() {
      // If we have employee data from navigation state, use it
      if (state?.employee) {
        setEmployee(state.employee);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      try {
        setLoading(true);
        const response = await employeeService.getById(id);
        
        if (response.success && response.data) {
          setEmployee(response.data);
        } else {
          setNotification({
            type: "error",
            message: "Data karyawan tidak ditemukan",
          });
          setTimeout(() => navigate("/admin/employees-database"), 2000);
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        setNotification({
          type: "error",
          message: error.message || "Gagal memuat data karyawan",
        });
        setTimeout(() => navigate("/admin/employees-database"), 2000);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id, state, navigate]);

  // Build display data from employee
  const getDisplayData = () => {
    if (!employee) return {};
    
    // Get avatar URL
    let avatarUrl = null;
    if (employee.avatar) {
      avatarUrl = employee.avatar.startsWith("http")
        ? employee.avatar
        : `${import.meta.env.VITE_API_URL}${employee.avatar}`;
    }

    return {
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      fullName: `${employee.firstName || ""} ${employee.lastName || ""}`.trim() || "Unknown Employee",
      mobileNumber: employee.phone || "",
      nik: employee.nik || "-",
      gender: employee.gender || "-",
      birthPlace: employee.birthPlace || "-",
      birthDate: employee.birthDate ? employee.birthDate.split("T")[0] : "",
      education: EDUCATION_MAP[employee.education] || employee.education || "-",
      branch: employee.branch || "-",
      position: employee.jobdesk || "-",
      contractType: CONTRACT_TYPE_MAP[employee.contractType] || employee.contractType || "-",
      grade: employee.grade || "-",
      bank: employee.bank || "-",
      accountNumber: employee.accountNumber || "-",
      accountName: employee.accountName || "-",
      spType: employee.spType || "-",
      email: employee.User?.email || "-",
      avatarUrl,
      isActive: employee.contractType !== "resign",
    };
  };

  const display = getDisplayData();

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

      {/* Loading state */}
      {loading ? (
        <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-[#1D395E] animate-spin mb-4" />
            <p className="text-gray-600">Memuat data karyawan...</p>
          </div>
        </section>
      ) : (
      <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 lg:p-8">
        <h2 className="text-lg md:text-xl font-semibold text-[#1D395E] mb-5">
          View Employee Information
        </h2>

        <div className="rounded-2xl border border-[#BFD0E0] bg-[#F7FAFC] px-5 py-6 md:px-8 md:py-8">
          {/* Avatar + basic info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                {display.avatarUrl ? (
                  <img 
                    src={display.avatarUrl} 
                    alt={display.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-gray-600">
                    {display.firstName?.charAt(0) || "E"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {display.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {display.position} • {display.branch}
                </p>
                {display.email !== "-" && (
                  <p className="text-sm text-gray-500 mt-1">{display.email}</p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Status:{" "}
                <span
                  className={`font-semibold ${
                    display.isActive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {display.isActive ? "Active" : "Inactive"}
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
      )}
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
