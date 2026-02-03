// src/features/employees/pages/ViewEmployeeAdmin.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, ChevronDown, ArrowLeft, Loader2 } from "lucide-react";
import { employeeService } from "@/app/services/employee.api";
import { Notification } from "@/components/ui/Notification";
import { useTheme } from "@/app/hooks/useTheme";

export function ViewEmployeeAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

    // Determine status based on terminationType and isActive
    let status = "Active";
    if (!employee.isActive) {
      status = "Inactive";
    } else if (employee.terminationType) {
      // Map terminationType to display status
      if (employee.terminationType.toLowerCase() === "resign") {
        status = "Resigned";
      } else if (employee.terminationType.toLowerCase() === "terminated") {
        status = "Terminated (PHK)";
      } else {
        status = "Inactive";
      }
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
      status,
      isActive: !employee.terminationType && employee.isActive,
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
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${
            isDark 
              ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className={`text-xl md:text-2xl font-semibold ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`}>
          Employee Detail
        </h1>
      </div>

      {/* Loading state */}
      {loading ? (
        <section className={`rounded-2xl border shadow-sm p-6 lg:p-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className={`w-10 h-10 animate-spin mb-4 ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`} />
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Memuat data karyawan...</p>
          </div>
        </section>
      ) : (
      <section className={`rounded-2xl border shadow-sm p-6 lg:p-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-5 ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`}>
          View Employee Information
        </h2>

        <div className={`rounded-2xl border px-5 py-6 md:px-8 md:py-8 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-[#BFD0E0] bg-[#F7FAFC]'}`}>
          {/* Avatar + basic info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-28 h-28 rounded-lg flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                {display.avatarUrl ? (
                  <img 
                    src={display.avatarUrl} 
                    alt={display.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={`text-xl font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {display.firstName?.charAt(0) || "E"}
                  </span>
                )}
              </div>
              <div>
                <p className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {display.fullName}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {display.position} • {display.branch}
                </p>
                {display.email !== "-" && (
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{display.email}</p>
                )}
              </div>
            </div>

            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>
                Status:{" "}
                <span
                  className={`font-semibold ${
                    display.isActive 
                      ? (isDark ? "text-emerald-400" : "text-emerald-600")
                      : display.status === "Resigned" || display.status === "Terminated (PHK)"
                      ? (isDark ? "text-orange-400" : "text-orange-600")
                      : (isDark ? "text-rose-400" : "text-rose-600")
                  }`}
                >
                  {display.status}
                </span>
              </p>
            </div>
          </div>

          {/* FORM READ ONLY */}
          <div className="space-y-6">
            {/* Baris 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="First Name" value={display.firstName} isDark={isDark} />
              <ReadOnlyInput label="Last Name" value={display.lastName} isDark={isDark} />
            </div>

            {/* Baris 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput
                label="Mobile Number"
                value={display.mobileNumber}
                isDark={isDark}
              />
              <ReadOnlyInput label="NIK" value={display.nik} isDark={isDark} />
            </div>

            {/* Baris 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Gender" value={display.gender} isDark={isDark} />
              <ReadOnlyInput
                label="Pendidikan Terakhir"
                value={display.education}
                isDark={isDark}
              />
            </div>

            {/* Baris 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Tempat Lahir" value={display.birthPlace} isDark={isDark} />
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tanggal Lahir
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={display.birthDate}
                    readOnly
                    disabled
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm ${
                      isDark 
                        ? 'border-gray-600 bg-gray-600 text-gray-300' 
                        : 'border-gray-300 bg-gray-100 text-gray-700'
                    }`}
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Baris 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Jabatan" value={display.position} isDark={isDark} />
              <ReadOnlyInput label="Cabang" value={display.branch} isDark={isDark} />
            </div>

            {/* Baris 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Tipe Kontrak" value={display.contractType} isDark={isDark} />
              <ReadOnlyInput label="Grade" value={display.grade} isDark={isDark} />
            </div>

            {/* Baris 7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput label="Bank" value={display.bank} isDark={isDark} />
              <ReadOnlyInput
                label="Nomor Rekening"
                value={display.accountNumber}
                isDark={isDark}
              />
            </div>

            {/* Baris 8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadOnlyInput
                label="Atas Nama Rekening"
                value={display.accountName}
                isDark={isDark}
              />
              <ReadOnlyInput label="Tipe SP" value={display.spType || "-"} isDark={isDark} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/employees-database")}
              className={`px-6 py-2.5 rounded-lg border text-sm font-medium ${
                isDark 
                  ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
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
function ReadOnlyInput({ label, value, isDark }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        type="text"
        readOnly
        disabled
        value={value || ""}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm ${
          isDark 
            ? 'border-gray-600 bg-gray-600 text-gray-300' 
            : 'border-gray-300 bg-gray-100 text-gray-700'
        }`}
      />
    </div>
  );
}
