// src/features/employees/pages/AddEmployeeAdmin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Calendar, ChevronDown, AlertCircle, CheckCircle, XCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Notification } from "../../../components/ui/Notification";
import { CustomDropdown } from "../../../components/ui/CustomDropdown";
import { employeeService } from "@/app/services/employee.api";

export function AddEmployeeAdmin() {
  const navigate = useNavigate();

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
    contractType: "Tetap",
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
    "Tetap": "permanent",
    "Kontrak": "contract",
    "Lepas": "intern",
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
      <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 lg:p-8">
        {/* header title kecil di dalam card */}
        <h2 className="text-lg md:text-xl font-semibold text-[#1D395E] mb-5">
          Add New Employee
        </h2>

        {/* inner card (abu biru) seperti frame-mu */}
        <div className="rounded-2xl border border-[#BFD0E0] bg-[#F7FAFC] px-5 py-6 md:px-8 md:py-8">
          {/* header avatar */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            {/* box avatar */}
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">Avatar</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
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
                  <p className="mt-2 text-xs text-gray-600">
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Account Login Employee */}
            <div className="bg-white rounded-xl border border-[#1D395E]/20 p-4 md:p-5">
              <h3 className="text-sm font-semibold text-[#1D395E] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1D395E] text-white text-xs flex items-center justify-center">1</span>
                Account Login Employee
              </h3>
              
              {/* Employee ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="e.g. EMP001"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">ID ini akan digunakan untuk login karyawan</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@company.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Untuk recovery password</p>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password default untuk login pertama kali</p>
                </div>
              </div>
            </div>

            {/* Section: Personal Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
              <h3 className="text-sm font-semibold text-[#1D395E] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1D395E] text-white text-xs flex items-center justify-center">2</span>
                Personal Information
              </h3>

            {/* Baris 1: First / Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter the first name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter the last name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* Baris 2: Mobile / NIK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter the Mobile Number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  NIK
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="Enter the NIK"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                />
              </div>
            </div>

            {/* Baris 3: Gender / Pendidikan Terakhir */}
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

            {/* Baris 4: Tempat Lahir / Tanggal Lahir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  placeholder="Masukan Tempat Lahir"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                />
              </div>
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Baris 5: Jabatan / Cabang */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jabatan
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Enter the jabatan"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cabang
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Enter the cabang"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                />
              </div>
            </div>

            {/* Baris 6: Tipe Kontrak (radio) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="Masukan Grade Anda"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                />
              </div>
            </div>

            {/* Baris 7: Bank / Nomor Rekening */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Masukan Nomor Rekening"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                />
              </div>
            </div>

            {/* Baris 8: Atas Nama / Tipe SP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Atas Nama Rekening
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Masukkan A/N Rekening"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
                />
              </div>
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
            </div>

            {/* Action buttons di kanan bawah */}
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
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-blue-600" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Konfirmasi Penambahan Data
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 text-center mb-5">
              Apakah Anda yakin ingin menambahkan data karyawan baru ini?<br />
              Pastikan semua informasi yang dimasukkan sudah benar.
            </p>

            {/* Summary Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Employee ID:</span>
                <span className="font-medium text-gray-900">
                  {formData.employeeId || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">
                  {formData.email || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nama:</span>
                <span className="font-medium text-gray-900">
                  {formData.firstName && formData.lastName 
                    ? `${formData.firstName} ${formData.lastName}` 
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">NIK:</span>
                <span className="font-medium text-gray-900">
                  {formData.nik || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Posisi:</span>
                <span className="font-medium text-gray-900">
                  {formData.position || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cabang:</span>
                <span className="font-medium text-gray-900">
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
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
