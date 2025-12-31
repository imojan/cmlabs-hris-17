// src/features/attendance/pages/AddCheckclockAdmin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Upload,
  LocateFixed,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Notification } from "../../../components/ui/Notification";
import { MapComponent } from "../components/MapComponent";


export default function AddCheckclockAdmin() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    employeeName: "",
    attendanceType: "",
    capturedTime: "",
    startDate: "",
    endDate: "",
    location: "",
    address: "",
    latitude: "",
    longitude: "",
    notes: "",
  });

  const [proofFile, setProofFile] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [mapPosition, setMapPosition] = useState({
    lat: -7.9666,
    lng: 112.6315,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // ====== REALTIME CLOCK ======
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hh}:${mm}:${ss}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Saat tipe absensi dipilih → capture jam realtime ke capturedTime
  const handleAttendanceTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      attendanceType: value,
      capturedTime: currentTime,
      ...(value !== "Annual Leave" ? { startDate: "", endDate: "" } : {}),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProofFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi field wajib dengan pesan lengkap
    const requiredFields = [];
    
    if (!formData.employeeName) {
      requiredFields.push("Nama Karyawan");
    }
    
    if (!formData.attendanceType) {
      requiredFields.push("Tipe Absensi");
    }
    
    // Validasi khusus untuk Annual Leave
    if (formData.attendanceType === "Annual Leave") {
      if (!formData.startDate) {
        requiredFields.push("Start Date (untuk Annual Leave)");
      }
      if (!formData.endDate) {
        requiredFields.push("End Date (untuk Annual Leave)");
      }
    }
    
    if (!formData.location) {
      requiredFields.push("Lokasi");
    }
    
    if (!formData.latitude || !formData.longitude) {
      requiredFields.push("Koordinat Lokasi (Pilih di peta atau gunakan My Location)");
    }
    
    if (!formData.address) {
      requiredFields.push("Detail Alamat");
    }
    
    // Jika ada field yang belum diisi, tampilkan notifikasi
    if (requiredFields.length > 0) {
      const fieldList = requiredFields.map(field => `• ${field}`).join("\n");
      setNotification({
        type: "warning",
        message: `Mohon isi semua field wajib:\n${fieldList}`,
      });
      return;
    }
    
    // Jika semua validasi lolos, tampilkan modal konfirmasi
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    // Proses penyimpanan data
    console.log("Form Data:", formData);
    console.log("Proof File:", proofFile);
    
    // Tampilkan success notification
    setNotification({
      type: "success",
      message: "Data absensi berhasil disimpan!",
    });
    
    // Tutup modal
    setShowConfirmModal(false);
    
    // Redirect ke halaman AttendanceAdmin setelah 1.5 detik
    setTimeout(() => {
      navigate("/admin/checkclock");
    }, 1500);
  };

  const handleCancelSave = () => {
    setShowConfirmModal(false);
  };

  const attendanceOptions = [
    "Clock In",
    "Clock Out",
    "Absent",
    "Annual Leave",
    "Sick Leave",
  ];

  // ==== ketika posisi di map berubah (klik map / my location) ====
  const handleMapLocationChange = (latlng) => {
    setMapPosition(latlng);
    setFormData((prev) => ({
      ...prev,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6),
    }));
  };

  // ==== tombol "Show My Location" ====
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setNotification({
        type: "error",
        message: "Browser kamu tidak mendukung geolocation.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        handleMapLocationChange({ lat, lng });

        setNotification({
          type: "success",
          message: "Lokasi berhasil diperbarui!",
        });
      },
      (err) => {
        console.error(err);
        setNotification({
          type: "error",
          message: "Gagal mengambil lokasi. Pastikan izin lokasi sudah diizinkan.",
        });
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 relative" style={{ overflow: showConfirmModal ? 'hidden' : 'auto' }}>
      {/* Notification Toast */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
              Add Checkclock
            </h2>
          </div>

          {/* Main Form - Hidden when modal is open */}
          {!showConfirmModal && (
            <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* ================== LEFT COLUMN ================== */}
              <div className="space-y-5">
                {/* Karyawan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Karyawan
                  </label>
                  <div className="relative">
                    <select
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="">Pilih Karyawan</option>
                      <option value="Juanita">Juanita - CEO</option>
                      <option value="Shane">Shane - OB</option>
                      <option value="Miles">Miles - Head of HR</option>
                      <option value="Flores">Flores - Manager</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tipe Absensi + Waktu Realtime */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Absensi
                  </label>
                  <div className="relative">
                    <select
                      name="attendanceType"
                      value={formData.attendanceType}
                      onChange={(e) =>
                        handleAttendanceTypeChange(e.target.value)
                      }
                      className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="">Pilih Tipe Absensi</option>
                      {attendanceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Waktu Realtime */}
                  <div className="mt-4 space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500">
                      Waktu Absensi (Realtime)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentTime}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-800 focus:outline-none"
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Saat kamu memilih tipe absensi, jam ini disimpan sebagai{" "}
                      <span className="font-semibold">
                        {formData.capturedTime || "--:--:--"}
                      </span>{" "}
                      dan bisa dikirim ke database.
                    </p>
                  </div>
                </div>

                {/* Start/End Date (Annual Leave only) */}
                {formData.attendanceType === "Annual Leave" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Bukti Pendukung */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Bukti Pendukung
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Drag n Drop here
                      </p>
                      <p className="text-sm text-gray-500 mb-3">Or</p>

                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="proof-file"
                        accept="image/*,.pdf"
                      />
                      <label
                        htmlFor="proof-file"
                        className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition"
                      >
                        Browse
                      </label>

                      {proofFile && (
                        <p className="text-xs text-green-600 mt-3">
                          ✓ {proofFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Upload Now Button */}
                  <button
                    type="button"
                    onClick={() => proofFile && alert("File uploaded!")}
                    className="w-full mt-3 px-4 py-2.5 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                    disabled={!proofFile}
                  >
                    Upload Now
                  </button>
                </div>
              </div>

              {/* ================== RIGHT COLUMN ================== */}
              <div className="space-y-5">
                {/* Lokasi dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <div className="relative">
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="">Pilih Lokasi</option>
                      <option value="Kantor Pusat">Kantor Pusat</option>
                      <option value="Cabang A">Cabang A</option>
                      <option value="Cabang B">Cabang B</option>
                      <option value="Remote">Remote</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Map Section dengan Tombol My Location yang Terpisah */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Peta Lokasi
                    </label>
                    {/* Tombol My Location di luar map - selalu terlihat */}
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition shadow-sm"
                      title="Gunakan lokasimu"
                    >
                      <LocateFixed className="w-3.5 h-3.5" />
                      <span>My Location</span>
                    </button>
                  </div>
                  
                  {/* Map Container */}
                  <MapComponent 
                    mapPosition={mapPosition} 
                    onLocationChange={handleMapLocationChange}
                  />
                  
                  <p className="text-xs text-gray-500 mt-1.5">
                    Klik pada peta untuk memilih lokasi atau gunakan tombol "My Location"
                  </p>
                </div>

                {/* Detail Alamat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detail Alamat
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nama Jalan, No. Rumah/Apartemen dan lainnya"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Lat/Long */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="Lat Lokasi"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="Long Lokasi"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes (full width) */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Tambahkan keterangan tambahan jika diperlukan..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/checkclock")}
                className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
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
          )}
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={handleCancelSave}
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
              Konfirmasi Penyimpanan Data
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 text-center mb-5">
              Apakah Anda yakin ingin mengirim data absensi ini?<br />
              Pastikan semua informasi yang dimasukkan sudah benar.
            </p>

            {/* Summary Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Karyawan:</span>
                <span className="font-medium text-gray-900">
                  {formData.employeeName || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipe Absensi:</span>
                <span className="font-medium text-gray-900">
                  {formData.attendanceType || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Waktu:</span>
                <span className="font-medium text-gray-900">
                  {formData.capturedTime || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lokasi:</span>
                <span className="font-medium text-gray-900">
                  {formData.location || "-"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/checkclock")}
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
                Ya, Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}