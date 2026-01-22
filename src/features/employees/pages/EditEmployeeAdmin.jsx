// src/features/employees/pages/EditEmployeeAdmin.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Upload,
  Calendar,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Notification } from "../../../components/ui/Notification";
import { CustomDropdown } from "../../../components/ui/CustomDropdown";
import { employeeService } from "@/app/services/employee.api";
import { useTheme } from "@/app/hooks/useTheme";

export function EditEmployeeAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Mapping backend -> frontend
  const CONTRACT_TYPE_MAP_REVERSE = {
    "permanent": "Tetap",
    "contract": "Kontrak",
    "intern": "Lepas",
  };

  const EDUCATION_MAP_REVERSE = {
    "sma": "SMA/SMK",
    "smk": "SMA/SMK",
    "d3": "D3",
    "s1": "S1",
    "s2": "S2",
    "s3": "S3",
  };

  // Mapping frontend -> backend
  const CONTRACT_TYPE_MAP = {
    "Tetap": "permanent",
    "Kontrak": "contract",
    "Lepas": "intern",
  };

  const EDUCATION_MAP = {
    "SMA/SMK": "sma",
    "D3": "d3",
    "S1": "s1",
    "S2": "s2",
    "S3": "s3",
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    nik: "",
    gender: "",
    birthPlace: "",
    birthDate: "",
    education: "",
    branch: "",
    position: "",
    contractType: "Tetap",
    grade: "",
    bank: "",
    accountNumber: "",
    accountName: "",
    spType: "",
    email: "",
  });

  // Fetch employee data on mount
  useEffect(() => {
    async function fetchEmployee() {
      // If we have employee data from navigation state, use it first
      if (state?.employee) {
        populateFormFromData(state.employee);
        setIsFetching(false);
        return;
      }

      // Otherwise fetch from API
      try {
        setIsFetching(true);
        const response = await employeeService.getById(id);
        
        if (response.success && response.data) {
          populateFormFromData(response.data);
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
        setIsFetching(false);
      }
    }

    fetchEmployee();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, state, navigate]);

  // Helper to populate form from employee data
  function populateFormFromData(emp) {
    // Set avatar preview if exists
    if (emp.avatar) {
      const avatarUrl = emp.avatar.startsWith("http") 
        ? emp.avatar 
        : `${import.meta.env.VITE_API_URL}${emp.avatar}`;
      setAvatarPreview(avatarUrl);
    }

    setFormData({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      mobileNumber: emp.phone || "",
      nik: emp.nik || "",
      gender: emp.gender || "",
      birthPlace: emp.birthPlace || "",
      birthDate: emp.birthDate ? emp.birthDate.split("T")[0] : "",
      education: EDUCATION_MAP_REVERSE[emp.education] || emp.education || "",
      branch: emp.branch || "",
      position: emp.jobdesk || "",
      contractType: CONTRACT_TYPE_MAP_REVERSE[emp.contractType] || "Tetap",
      grade: emp.grade || "",
      bank: emp.bank || "",
      accountNumber: emp.accountNumber || "",
      accountName: emp.accountName || "",
      spType: emp.spType || "",
      email: emp.User?.email || "",
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.mobileNumber) {
      setNotification({
        type: "warning",
        message: "Mohon isi field wajib (Nama & No. HP)!",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);

    try {
      // Buat FormData untuk handle file upload
      const submitData = new FormData();

      // Personal Information
      submitData.append("firstName", formData.firstName);
      if (formData.lastName) submitData.append("lastName", formData.lastName);
      if (formData.mobileNumber) submitData.append("mobileNumber", formData.mobileNumber);
      if (formData.nik) submitData.append("nik", formData.nik);
      if (formData.gender) submitData.append("gender", formData.gender);
      if (formData.birthPlace) submitData.append("birthPlace", formData.birthPlace);
      if (formData.birthDate) submitData.append("birthDate", formData.birthDate);

      // Education - map to backend format
      if (formData.education) {
        submitData.append("education", EDUCATION_MAP[formData.education] || formData.education.toLowerCase());
      }

      // Employment fields - map position to jobdesk
      if (formData.position) submitData.append("jobdesk", formData.position);
      if (formData.branch) submitData.append("branch", formData.branch);

      // ContractType - map to backend format
      if (formData.contractType) {
        submitData.append("contractType", CONTRACT_TYPE_MAP[formData.contractType] || formData.contractType.toLowerCase());
      }

      if (formData.grade) submitData.append("grade", formData.grade);

      // Bank Information
      if (formData.bank) submitData.append("bank", formData.bank);
      if (formData.accountNumber) submitData.append("accountNumber", formData.accountNumber);
      if (formData.accountName) submitData.append("accountName", formData.accountName);
      if (formData.spType) submitData.append("spType", formData.spType);

      // Email (if changed)
      if (formData.email) submitData.append("email", formData.email);

      // Avatar file (if new one selected)
      if (avatarFile) {
        submitData.append("avatar", avatarFile);
      }

      // Call API
      const response = await employeeService.update(id, submitData);

      console.log("Employee updated:", response);

      setNotification({
        type: "success",
        message: response.message || "Data karyawan berhasil diperbarui!",
      });
      setShowConfirmModal(false);

      setTimeout(() => {
        navigate("/admin/employees-database");
      }, 1500);

    } catch (error) {
      console.error("Error updating employee:", error);

      let errorMessage = "Gagal memperbarui data karyawan";

      if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (error.status === 404) {
        errorMessage = "Data karyawan tidak ditemukan";
      } else if (error.status === 400) {
        errorMessage = error.data?.message || "Data yang dikirim tidak valid";
      } else if (error.status === 403) {
        errorMessage = "Anda tidak memiliki akses untuk mengubah data karyawan";
      }

      setNotification({
        type: "error",
        message: errorMessage,
      });
      setShowConfirmModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelModal = () => setShowConfirmModal(false);

  const handleCancel = () => {
    navigate("/admin/employees-database");
  };

  return (
    <div className="space-y-6 relative">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}

      {/* Header atas */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCancel}
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
          Edit Employee
        </h1>
      </div>

      {/* Loading state saat fetch data */}
      {isFetching ? (
        <section className={`rounded-2xl border shadow-sm p-6 lg:p-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className={`w-10 h-10 animate-spin mb-4 ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`} />
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Memuat data karyawan...</p>
          </div>
        </section>
      ) : (
      <section className={`rounded-2xl border shadow-sm p-6 lg:p-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-5 ${isDark ? 'text-blue-400' : 'text-[#1D395E]'}`}>
          Update Employee Data
        </h2>

        <div className={`rounded-2xl border px-5 py-6 md:px-8 md:py-8 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-[#BFD0E0] bg-[#F7FAFC]'}`}>
          {/* === AVATAR DI TENGAH === */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-3">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formData.firstName?.charAt(0) || "E"}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center">
                <label
                  htmlFor="avatar-upload-edit"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-200 hover:bg-gray-500' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Update Avatar
                </label>

                <input
                  id="avatar-upload-edit"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                {avatarFile && (
                  <p className={`mt-1 text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* FORM EDIT */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Baris 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Field
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter the first name"
                isDark={isDark}
              />
              <Field
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter the last name"
                isDark={isDark}
              />
            </div>

            {/* Baris 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Field
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter the Mobile Number"
                isDark={isDark}
              />
              <Field
                label="NIK"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="Enter the NIK"
                isDark={isDark}
              />
            </div>

            {/* Baris 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Gender
                </label>
                <CustomDropdown
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Choose Gender"
                  options={[
                    { value: "Male", label: "Male", icon: "👨" },
                    { value: "Female", label: "Female", icon: "👩" },
                  ]}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Pendidikan Terakhir
                </label>
                <CustomDropdown
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Pilih Pendidikan Terakhir"
                  options={[
                    { value: "SMA/SMK", label: "SMA/SMK", icon: "🎓" },
                    { value: "D3", label: "D3", icon: "🎓" },
                    { value: "S1", label: "S1", icon: "🎓" },
                    { value: "S2", label: "S2", icon: "🎓" },
                  ]}
                />
              </div>
            </div>

            {/* Baris 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Field
                label="Tempat Lahir"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                placeholder="Masukan Tempat Lahir"
                isDark={isDark}
              />
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tanggal Lahir
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                      isDark 
                        ? 'border-gray-600 bg-gray-600 text-gray-100' 
                        : 'border-gray-300 bg-white text-black'
                    }`}
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Baris 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Field
                label="Jabatan"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter the jabatan"
                isDark={isDark}
              />
              <Field
                label="Cabang"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="Enter the cabang"
                isDark={isDark}
              />
            </div>

            {/* Baris 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
              <div>
                <p className={`text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tipe Kontrak
                </p>
                <div className="flex items-center gap-6">
                  {["Tetap", "Kontrak", "Lepas"].map((type) => (
                    <label
                      key={type}
                      className={`inline-flex items-center gap-2 text-sm cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <input
                        type="radio"
                        name="contractType"
                        value={type}
                        checked={formData.contractType === type}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-[#1D395E] focus:ring-[#1D395E]"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Field
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Masukan Grade Anda"
                isDark={isDark}
              />
            </div>

            {/* Baris 7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Bank
                </label>
                <CustomDropdown
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  placeholder="Pilih Bank"
                  options={[
                    { value: "BCA", label: "BCA", icon: "🏦" },
                    { value: "BNI", label: "BNI", icon: "🏦" },
                    { value: "BRI", label: "BRI", icon: "🏦" },
                    { value: "Mandiri", label: "Mandiri", icon: "🏦" },
                  ]}
                />
              </div>
              <Field
                label="Nomor Rekening"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Masukan Nomor Rekening"
                isDark={isDark}
              />
            </div>

            {/* Baris 8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Field
                label="Atas Nama Rekening"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="Masukkan A/N Rekening"
                isDark={isDark}
              />
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tipe SP
                </label>
                <CustomDropdown
                  name="spType"
                  value={formData.spType}
                  onChange={handleChange}
                  placeholder="Pilih SP"
                  options={[
                    { value: "", label: "Tidak Ada", icon: "✓" },
                    { value: "SP1", label: "SP1", icon: "⚠️" },
                    { value: "SP2", label: "SP2", icon: "⚠️" },
                    { value: "SP3", label: "SP3", icon: "⚠️" },
                  ]}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className={`px-6 py-2.5 rounded-lg border text-sm font-medium ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#1D395E] text-sm font-medium text-white hover:bg-[#142848]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>
      )}

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={handleCancelModal}
        >
          <div
            className={`rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <AlertCircle className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <h3 className={`text-lg font-semibold text-center mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Konfirmasi Perubahan Data
            </h3>
            <p className={`text-sm text-center mb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Apakah kamu yakin ingin menyimpan perubahan data karyawan ini?
            </p>
            <div className={`rounded-lg p-4 mb-5 space-y-2.5 text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Nama:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Posisi:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.position || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cabang:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.branch || "-"}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelModal}
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// helper field component
function Field({ label, name, value, onChange, placeholder, isDark }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
          isDark 
            ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
            : 'border-gray-300 bg-white text-black'
        }`}
      />
    </div>
  );
}
