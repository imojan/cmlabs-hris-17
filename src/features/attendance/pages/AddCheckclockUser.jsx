// src/features/attendance/pages/AddCheckclockUser.jsx
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
  Loader2,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Notification } from "../../../components/ui/Notification";
import { MapComponent } from "../components/MapComponent";
import { CustomDropdown } from "../../../components/ui/CustomDropdown";
import { attendanceService } from "@/app/services/attendance.api";
import { locationService } from "@/app/services/location.api";

export default function AddCheckclockUser() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
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
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic locations from API
  const [companyLocations, setCompanyLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Build locationPresets dynamically from API + fixed options
  const locationPresets = {
    ...companyLocations.reduce((acc, loc) => {
      acc[loc.name] = {
        lat: loc.latitude,
        lng: loc.longitude,
        address: loc.address || "",
      };
      return acc;
    }, {}),
    "Remote": null,
    "Lainnya": null,
  };

  // ====== FETCH COMPANY LOCATIONS ======
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await locationService.getLocations();
        const data = response?.data || [];
        setCompanyLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

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

  // Handler khusus untuk perubahan lokasi dropdown
  const handleLocationChange = (e) => {
    const { value } = e.target;
    const preset = locationPresets[value];

    if (preset) {
      // Jika lokasi punya preset koordinat, update map dan form
      setMapPosition({ lat: preset.lat, lng: preset.lng });
      setFormData((prev) => ({
        ...prev,
        location: value,
        latitude: preset.lat.toFixed(6),
        longitude: preset.lng.toFixed(6),
        address: preset.address || prev.address,
      }));
      setNotification({
        type: "info",
        message: `Peta diarahkan ke ${value}`,
      });
    } else {
      // Untuk Remote/Lainnya, hanya update location tanpa mengubah peta
      setFormData((prev) => ({
        ...prev,
        location: value,
      }));
      if (value === "Remote" || value === "Lainnya") {
        setNotification({
          type: "info",
          message: "Silakan pilih lokasi di peta atau gunakan tombol My Location",
        });
      }
    }
  };

  // Saat tipe absensi dipilih → capture jam realtime ke capturedTime
  const handleAttendanceTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      attendanceType: value,
      capturedTime: currentTime,
      ...(!["Annual Leave", "Sick Leave"].includes(value) ? { startDate: "", endDate: "" } : {}),
    }));
  };

  // State for file preview
  const [proofPreview, setProofPreview] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      
      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setProofPreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setProofFile(null);
    setProofPreview(null);
    const fileInput = document.getElementById("proof-file-user");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi field wajib
    const requiredFields = [];
    
    if (!formData.attendanceType) {
      requiredFields.push("Tipe Absensi");
    }
    
    // Validasi khusus untuk Annual Leave / Sick Leave
    if (["Annual Leave", "Sick Leave"].includes(formData.attendanceType)) {
      if (!formData.startDate) {
        requiredFields.push("Start Date");
      }
      if (!formData.endDate) {
        requiredFields.push("End Date");
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

  const handleConfirmSave = async () => {
    setIsLoading(true);
    
    try {
      // Mapping attendance type: Frontend → Backend
      const typeMapping = {
        "Clock In": "CLOCK_IN",
        "Clock Out": "CLOCK_OUT",
        "Absent": "ABSENT",
        "Annual Leave": "ANNUAL_LEAVE",
        "Sick Leave": "SICK_LEAVE",
      };

      // Build FormData for multipart/form-data (file upload support)
      const payload = new FormData();
      payload.append("type", typeMapping[formData.attendanceType] || formData.attendanceType);
      payload.append("locationName", formData.location);
      payload.append("address", formData.address);
      payload.append("latitude", formData.latitude);
      payload.append("longitude", formData.longitude);
      
      if (formData.notes) {
        payload.append("notes", formData.notes);
      }

      // For Annual Leave / Sick Leave, send date range
      if (["Annual Leave", "Sick Leave"].includes(formData.attendanceType)) {
        if (formData.startDate) payload.append("startDate", formData.startDate);
        if (formData.endDate) payload.append("endDate", formData.endDate);
      }

      // Attach proof file if exists
      if (proofFile) {
        payload.append("proof", proofFile);
      }

      // Call API
      await attendanceService.createUserCheckclock(payload);

      // Success
      setNotification({
        type: "success",
        message: "Data absensi berhasil disimpan!",
      });

      setShowConfirmModal(false);

      // Redirect after delay
      setTimeout(() => {
        navigate("/user/checkclock");
      }, 1500);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      setNotification({
        type: "error",
        message: err?.message || err?.data?.message || "Gagal menyimpan data absensi",
      });
      setShowConfirmModal(false);
    } finally {
      setIsLoading(false);
    }
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

  const handleBack = () => {
    navigate("/user/checkclock");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative" style={{ overflow: showConfirmModal ? 'hidden' : 'auto' }}>
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
                  {/* Tipe Absensi + Waktu Realtime */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe Absensi
                    </label>
                    <CustomDropdown
                      name="attendanceType"
                      value={formData.attendanceType}
                      onChange={(e) => handleAttendanceTypeChange(e.target.value)}
                      placeholder="Pilih Tipe Absensi"
                      options={attendanceOptions.map((opt) => ({
                        value: opt,
                        label: opt,
                        icon: opt === "Clock In" ? "🟢" : opt === "Clock Out" ? "🔴" : opt === "Absent" ? "⚫" : opt === "Annual Leave" ? "🏖️" : "🏥",
                      }))}
                    />

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

                  {/* Start/End Date (Annual Leave & Sick Leave) */}
                  {["Annual Leave", "Sick Leave"].includes(formData.attendanceType) && (
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

                    {/* Show preview if file is uploaded */}
                    {proofFile ? (
                      <div className="border-2 border-gray-200 rounded-lg p-4">
                        {/* Image Preview */}
                        {proofPreview && (
                          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={proofPreview} 
                              alt="Preview" 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}

                        {/* File Info */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              {proofFile.type.startsWith("image/") ? (
                                <Upload className="w-5 h-5 text-blue-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                {proofFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(proofFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Remove file"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Change file button */}
                        <div className="mt-3 text-center">
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="proof-file-user-change"
                            accept="image/*,.pdf"
                          />
                          <label
                            htmlFor="proof-file-user-change"
                            className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition"
                          >
                            Change File
                          </label>
                        </div>
                      </div>
                    ) : (
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
                            id="proof-file-user"
                            accept="image/*,.pdf"
                          />
                          <label
                            htmlFor="proof-file-user"
                            className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition"
                          >
                            Browse
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ================== RIGHT COLUMN ================== */}
                <div className="space-y-5">
                  {/* Lokasi dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi
                    </label>
                    <CustomDropdown
                      name="location"
                      value={formData.location}
                      onChange={handleLocationChange}
                      placeholder={loadingLocations ? "Memuat lokasi..." : "Pilih Lokasi"}
                      options={[
                        // Dynamic locations from company settings
                        ...companyLocations.map(loc => ({
                          value: loc.name,
                          label: loc.name,
                          icon: "📍"
                        })),
                        // Fixed options
                        { value: "Remote", label: "Remote / WFH", icon: "🏠" },
                        { value: "Lainnya", label: "Lainnya", icon: "📌" },
                      ]}
                    />
                    {companyLocations.length === 0 && !loadingLocations && (
                      <p className="text-xs text-amber-600 mt-1">
                        Belum ada lokasi kantor terdaftar. Hubungi admin untuk menambahkan.
                      </p>
                    )}
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
                      placeholder="Masukkan detail alamat..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Catatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Tambahkan catatan jika diperlukan..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Map Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Pilih Lokasi di Peta
                      </label>
                      <button
                        type="button"
                        onClick={handleUseMyLocation}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition shadow-sm"
                      >
                        <LocateFixed className="w-3.5 h-3.5" />
                        My Location
                      </button>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <MapComponent
                        mapPosition={mapPosition}
                        onLocationChange={handleMapLocationChange}
                      />
                    </div>

                    {/* Coordinates Display */}
                    {formData.latitude && formData.longitude && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500">Latitude:</span>
                            <span className="ml-2 font-medium text-gray-800">{formData.latitude}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Longitude:</span>
                            <span className="ml-2 font-medium text-gray-800">{formData.longitude}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Perhatian</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Pastikan Anda berada di lokasi yang benar sebelum melakukan absensi. Data lokasi akan dicatat secara otomatis.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1D395E] text-white rounded-lg text-sm font-medium hover:bg-[#2a4a6e] transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => !isLoading && setShowConfirmModal(false)}
              />
              <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#1D395E]/10">
                    <Clock className="w-8 h-8 text-[#1D395E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Konfirmasi Absensi
                  </h3>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>Tipe: <span className="font-semibold">{formData.attendanceType}</span></p>
                    <p>Waktu: <span className="font-semibold">{formData.capturedTime}</span></p>
                    <p>Lokasi: <span className="font-semibold">{formData.location}</span></p>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    Apakah Anda yakin ingin menyimpan data absensi ini?
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancelSave}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmSave}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-[#1D395E] text-white rounded-xl font-medium hover:bg-[#2a4a6e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Memproses...
                        </>
                      ) : (
                        "Ya, Simpan"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
