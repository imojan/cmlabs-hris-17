// src/features/employees/pages/AddEmployeeAdmin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Calendar, ChevronDown, AlertCircle, CheckCircle, XCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Notification } from "../../../components/ui/Notification";
import { CustomDropdown } from "../../../components/ui/CustomDropdown";
import { employeeService } from "@/app/services/employee.api";
import { useTheme } from "@/app/hooks/useTheme";

export function AddEmployeeAdmin() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    email: "",
    password: "",
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
    contractType: "Permanen",
    grade: "",
    bank: "",
    accountNumber: "",
    accountName: "",
    spType: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mapping contractType frontend -> backend
  const CONTRACT_TYPE_MAP = {
    "Permanen": "permanent",
    "Trial": "trial",
    "PKWT": "contract",
    "Magang": "intern",
    "Freelance": "freelance",
  };

  // Mapping education frontend -> backend
  const EDUCATION_MAP = {
    "SMA/SMK": "sma",
    "D3": "d3",
    "S1": "s1",
    "S2": "s2",
    "S3": "s3",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Generate preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi field wajib
    if (!formData.employeeId || !formData.email || !formData.password) {
      setNotification({
        type: "warning",
        message: "Mohon isi ID Employee, Email, dan Password!",
      });
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.mobileNumber || !formData.nik) {
      setNotification({
        type: "warning",
        message: "Mohon isi semua field wajib (Nama, NIK, No. HP)!",
      });
      return;
    }
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setNotification({
        type: "warning",
        message: "Format email tidak valid!",
      });
      return;
    }
    // Validasi password minimal 6 karakter
    if (formData.password.length < 6) {
      setNotification({
        type: "warning",
        message: "Password minimal 6 karakter!",
      });
      return;
    }
    // Tampilkan modal konfirmasi
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);
    
    try {
      // Buat FormData untuk handle file upload
      const submitData = new FormData();
      
      // Account Login fields
      submitData.append("employeeId", formData.employeeId);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      
      // Personal Information fields
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
      
      // Avatar file
      if (avatarFile) {
        submitData.append("avatar", avatarFile);
      }
      
      // Call API
      const response = await employeeService.create(submitData);
      
      console.log("Employee created:", response);
      
      // Tampilkan success notification
      setNotification({
        type: "success",
        message: response.message || "Data karyawan berhasil ditambahkan!",
      });
      
      // Tutup modal
      setShowConfirmModal(false);
      
      // Redirect ke halaman EmployeeDatabase setelah 1.5 detik
      setTimeout(() => {
        navigate("/admin/employees-database");
      }, 1500);
      
    } catch (error) {
      console.error("Error creating employee:", error);
      
      // Handle specific error messages from backend
      let errorMessage = "Gagal menambahkan data karyawan";
      
      if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error codes
      if (error.status === 409) {
        // Conflict - duplicate employeeId or email
        errorMessage = error.data?.message || "Employee ID atau Email sudah terdaftar";
      } else if (error.status === 400) {
        // Validation error
        errorMessage = error.data?.message || "Data yang dikirim tidak valid";
      } else if (error.status === 403) {
        errorMessage = "Anda tidak memiliki akses untuk menambahkan karyawan";
      }
      
      setNotification({
        type: "error",
        message: errorMessage,
      });
      
      // Tutup modal agar user bisa edit data
      setShowConfirmModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    navigate("/admin/employees-database");
  };

  return (
    <div className="space-y-6 relative" style={{ overflow: showConfirmModal ? 'hidden' : 'auto' }}>
      {/* Notification Toast */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}
      {/* wrapper card besar */}
      {!showConfirmModal && (
      <section className={`rounded-2xl border shadow-sm p-6 lg:p-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/70'}`}>
        {/* header title kecil di dalam card */}
        <h2 className={`text-lg md:text-xl font-semibold mb-5 ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>
          Add New Employee
        </h2>

        {/* inner card (abu biru) seperti frame-mu */}
        <div className={`rounded-2xl border px-5 py-6 md:px-8 md:py-8 ${isDark ? 'border-gray-600 bg-gray-700/50' : 'border-[#BFD0E0] bg-[#F7FAFC]'}`}>
          {/* header avatar */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            {/* box avatar */}
            <div className="flex items-center gap-4">
              <div className={`w-28 h-28 rounded-lg flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar Preview" 
                  />
                ) : (
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avatar</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="avatar-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload Avatar
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                {avatarFile && (
                  <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Account Login Employee */}
            <div className={`rounded-xl border p-4 md:p-5 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-[#1D395E]/20'}`}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>
                <span className="w-6 h-6 rounded-full bg-[#1D395E] text-white text-xs flex items-center justify-center">1</span>
                Account Login Employee
              </h3>
              
              {/* Employee ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="e.g. EMP001"
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent ${
                      isDark 
                        ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ID ini akan digunakan untuk login karyawan</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@company.com"
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent ${
                      isDark 
                        ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Untuk recovery password</p>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                      className={`w-full rounded-lg border px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent ${
                        isDark 
                          ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-700'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Password default untuk login pertama kali</p>
                </div>
              </div>
            </div>

            {/* Section: Personal Information */}
            <div className={`rounded-xl border p-4 md:p-5 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>
                <span className="w-6 h-6 rounded-full bg-[#1D395E] text-white text-xs flex items-center justify-center">2</span>
                Personal Information
              </h3>

            {/* Baris 1: First / Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter the first name"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter the last name"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
            </div>

            {/* Baris 2: Mobile / NIK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter the Mobile Number"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  NIK
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="Enter the NIK"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
            </div>

            {/* Baris 3: Gender / Pendidikan Terakhir */}
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

            {/* Baris 4: Tempat Lahir / Tanggal Lahir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  placeholder="Masukan Tempat Lahir"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
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
                        : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  />
                  <Calendar className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>

            {/* Baris 5: Jabatan / Cabang */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Jabatan
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Enter the jabatan"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cabang
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Enter the cabang"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
            </div>

            {/* Baris 6: Tipe Kontrak (radio) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
              <div>
                <p className={`text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tipe Kontrak
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {["Permanen", "Trial", "PKWT", "Magang", "Freelance"].map((type) => (
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

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="Masukan Grade Anda"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
            </div>

            {/* Baris 7: Bank / Nomor Rekening */}
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
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Masukan Nomor Rekening"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
            </div>

            {/* Baris 8: Atas Nama / Tipe SP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Atas Nama Rekening
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Masukkan A/N Rekening"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] ${
                    isDark 
                      ? 'border-gray-600 bg-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                />
              </div>
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
            </div>

            {/* Action buttons di kanan bawah */}
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
                Save
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
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <AlertCircle className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-lg font-semibold text-center mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Konfirmasi Penambahan Data
            </h3>

            {/* Message */}
            <p className={`text-sm text-center mb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Apakah Anda yakin ingin menambahkan data karyawan baru ini?<br />
              Pastikan semua informasi yang dimasukkan sudah benar.
            </p>

            {/* Summary Info */}
            <div className={`rounded-lg p-4 mb-5 space-y-2.5 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Employee ID:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.employeeId || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Email:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.email || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Nama:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.firstName && formData.lastName 
                    ? `${formData.firstName} ${formData.lastName}` 
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>NIK:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.nik || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Posisi:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.position || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cabang:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.branch || "-"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelModal}
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Ya, Tambahkan
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
