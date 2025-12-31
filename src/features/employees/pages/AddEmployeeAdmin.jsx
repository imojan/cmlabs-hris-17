// src/features/employees/pages/AddEmployeeAdmin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Calendar, ChevronDown, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Notification } from "../../../components/ui/Notification";

export function AddEmployeeAdmin() {
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi field wajib
    if (!formData.firstName || !formData.lastName || !formData.mobileNumber || !formData.nik) {
      setNotification({
        type: "warning",
        message: "Mohon isi semua field wajib (Nama, NIK, No. HP)!",
      });
      return;
    }
    // Tampilkan modal konfirmasi
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    // Proses penyimpanan data
    console.log("Form add employee:", formData);
    console.log("Avatar:", avatarFile);
    
    // Tampilkan success notification
    setNotification({
      type: "success",
      message: "Data karyawan berhasil ditambahkan!",
    });
    
    // Tutup modal
    setShowConfirmModal(false);
    
    // Redirect ke halaman EmployeeDatabase setelah 1.5 detik
    setTimeout(() => {
      navigate("/admin/employees-database");
    }, 1500);
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
                {/* bisa nanti diisi preview img */}
                <span className="text-xs text-gray-500">
                  {avatarFile ? "Preview" : "Avatar"}
                </span>
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
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                  >
                    <option value="">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pendidikan Terakhir
                </label>
                <div className="relative">
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                  >
                    <option value="">Pilih Pendidikan Terakhir</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
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
                <div className="relative">
                  <select
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                  >
                    <option value="">Pilih Bank</option>
                    <option value="BCA">BCA</option>
                    <option value="BNI">BNI</option>
                    <option value="BRI">BRI</option>
                    <option value="Mandiri">Mandiri</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
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
                <div className="relative">
                  <select
                    name="spType"
                    value={formData.spType}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D395E]"
                  >
                    <option value="">Pilih SP</option>
                    <option value="SP1">SP1</option>
                    <option value="SP2">SP2</option>
                    <option value="SP3">SP3</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Ya, Tambahkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
