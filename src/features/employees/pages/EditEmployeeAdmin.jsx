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

export function EditEmployeeAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [originalData, setOriginalData] = useState(null);

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
          setOriginalData(response.data);
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
  }, [id, state, navigate]);

  // Helper to populate form from employee data
  function populateFormFromData(emp) {
    setOriginalData(emp);
    
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
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-[#1D395E]">
          Edit Employee
        </h1>
      </div>

      {/* Loading state saat fetch data */}
      {isFetching ? (
        <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-[#1D395E] animate-spin mb-4" />
            <p className="text-gray-600">Memuat data karyawan...</p>
          </div>
        </section>
      ) : (
      <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 lg:p-8">
        <h2 className="text-lg md:text-xl font-semibold text-[#1D395E] mb-5">
          Update Employee Data
        </h2>

        <div className="rounded-2xl border border-[#BFD0E0] bg-[#F7FAFC] px-5 py-6 md:px-8 md:py-8">
          {/* === AVATAR DI TENGAH === */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg text-gray-500">
                    {formData.firstName?.charAt(0) || "E"}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center">
                <label
                  htmlFor="avatar-upload-edit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
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
                  <p className="mt-1 text-xs text-gray-600 text-center">
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* FORM EDIT */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Baris 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-black">
              <Field
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter the first name"
              />
              <Field
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter the last name"
              />
            </div>

            {/* Baris 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-black">
              <Field
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter the Mobile Number"
              />
              <Field
                label="NIK"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="Enter the NIK"
              />
            </div>

            {/* Baris 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-black">
              <Field
                label="Tempat Lahir"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                placeholder="Masukan Tempat Lahir"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tanggal Lahir
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Baris 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-black">
              <Field
                label="Jabatan"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter the jabatan"
              />
              <Field
                label="Cabang"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="Enter the cabang"
              />
            </div>

            {/* Baris 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center text-black">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1.5">
                  Tipe Kontrak
                </p>
                <div className="flex items-center gap-6">
                  {["Tetap", "Kontrak", "Lepas"].map((type) => (
                    <label
                      key={type}
                      className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
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
              />
            </div>

            {/* Baris 7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-black">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
              />
            </div>

            {/* Baris 8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-black">
              <Field
                label="Atas Nama Rekening"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="Masukkan A/N Rekening"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tipe SP
                </label>
                <CustomDropdown
                  name="spType"
                  value={formData.spType}
                  onChange={handleChange}
                  placeholder="Pilih SP"
                  options={[
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
                className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
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
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Konfirmasi Perubahan Data
            </h3>
            <p className="text-sm text-gray-600 text-center mb-5">
              Apakah kamu yakin ingin menyimpan perubahan data karyawan ini?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama:</span>
                <span className="font-medium text-gray-900">
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posisi:</span>
                <span className="font-medium text-gray-900">
                  {formData.position || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cabang:</span>
                <span className="font-medium text-gray-900">
                  {formData.branch || "-"}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelModal}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
      />
    </div>
  );
}
