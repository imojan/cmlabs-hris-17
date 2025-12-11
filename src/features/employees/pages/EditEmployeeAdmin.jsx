// src/features/employees/pages/EditEmployeeAdmin.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Upload,
  Calendar,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Notification } from "../../../components/ui/Notification";

export function EditEmployeeAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const baseEmp = state?.employee;

  const [avatarFile, setAvatarFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    firstName: baseEmp?.name?.split(" ")[0] || "",
    lastName: baseEmp?.name?.split(" ").slice(1).join(" ") || "",
    mobileNumber: baseEmp?.phone || "",
    nik: "1234567890123456",
    gender:
      baseEmp?.gender === "Perempuan"
        ? "Female"
        : baseEmp?.gender === "Laki-Laki"
        ? "Male"
        : "",
    birthPlace: "Malang",
    birthDate: "2000-01-01",
    education: "S1",
    branch: baseEmp?.branch || "",
    position: baseEmp?.position || "",
    contractType: baseEmp?.status ? "Tetap" : "Kontrak",
    grade: baseEmp?.grade || "",
    bank: "BCA",
    accountNumber: "1234567890",
    accountName: baseEmp?.name || "",
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
    if (!formData.firstName || !formData.lastName || !formData.mobileNumber) {
      setNotification({
        type: "warning",
        message: "Mohon isi field wajib (Nama & No. HP)!",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    console.log("Edit employee ID:", id);
    console.log("Form edit:", formData);
    console.log("Avatar:", avatarFile);

    setNotification({
      type: "success",
      message: "Data karyawan berhasil diperbarui!",
    });
    setShowConfirmModal(false);

    setTimeout(() => {
      navigate("/admin/employees-database");
    }, 1500);
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

      <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 lg:p-8">
        <h2 className="text-lg md:text-xl font-semibold text-[#1D395E] mb-5">
          Update Employee Data
        </h2>

        <div className="rounded-2xl border border-[#BFD0E0] bg-[#F7FAFC] px-5 py-6 md:px-8 md:py-8">
          {/* === AVATAR DI TENGAH === */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <span className="text-lg text-gray-500">
                  {baseEmp?.name?.charAt(0) ?? "E"}
                </span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

            {/* Baris 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D395E] bg-white"
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

              <Field
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Masukan Grade Anda"
              />
            </div>

            {/* Baris 7 */}
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
              <Field
                label="Nomor Rekening"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Masukan Nomor Rekening"
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
              />
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
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Simpan
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
