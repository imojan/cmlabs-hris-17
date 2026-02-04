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
  Loader2,
} from "lucide-react";
import { Notification } from "../../../components/ui/Notification";
import { MapComponent } from "../components/MapComponent";
import { CustomDropdown } from "../../../components/ui/CustomDropdown";
import { employeeService } from "@/app/services/employee.api";
import { attendanceService } from "@/app/services/attendance.api";
import { locationService } from "@/app/services/location.api";
import { useTheme } from "@/app/hooks/useTheme";
import { useTranslation } from "@/app/hooks/useTranslation";


export default function AddCheckclockAdmin() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";
  
  const [formData, setFormData] = useState({
    employeeId: "",
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
  
  // API integration states
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Dynamic locations from API
  const [companyLocations, setCompanyLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Build locationPresets dynamically from API + fixed options
  const locationPresets = {
    // Dynamic locations from company settings will be added here
    ...companyLocations.reduce((acc, loc) => {
      acc[loc.name] = {
        lat: loc.latitude,
        lng: loc.longitude,
        address: loc.address || "",
      };
      return acc;
    }, {}),
    // Fixed options that are always available
    "Remote": null,
    "Lainnya": null,
  };

  // ====== FETCH EMPLOYEES ======
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await employeeService.getAll();
        const data = response?.data || response || [];
        setEmployees(data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setNotification({
          type: "error",
          message: t("attendance.loadEmployeesFailed"),
        });
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

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
        // Silent fail - will use default options only
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
        message: `${t("attendance.mapRedirected")} ${value}`,
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
          message: t("attendance.selectLocationOnMap"),
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
      // Reset date fields if not leave type
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
    // Reset file input
    const fileInput = document.getElementById("proof-file");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi field wajib dengan pesan lengkap
    const requiredFields = [];
    
    if (!formData.employeeId) {
      requiredFields.push(t("attendance.requiredEmployee"));
    }
    
    if (!formData.attendanceType) {
      requiredFields.push(t("attendance.requiredAttendanceType"));
    }
    
    // Validasi khusus untuk Annual Leave / Sick Leave
    if (["Annual Leave", "Sick Leave"].includes(formData.attendanceType)) {
      if (!formData.startDate) {
        requiredFields.push(t("attendance.startDate"));
      }
      if (!formData.endDate) {
        requiredFields.push(t("attendance.endDate"));
      }
    }
    
    if (!formData.location) {
      requiredFields.push(t("attendance.requiredLocation"));
    }
    
    if (!formData.latitude || !formData.longitude) {
      requiredFields.push(t("attendance.requiredCoordinates"));
    }
    
    if (!formData.address) {
      requiredFields.push(t("attendance.requiredAddress"));
    }
    
    // Jika ada field yang belum diisi, tampilkan notifikasi
    if (requiredFields.length > 0) {
      const fieldList = requiredFields.map(field => `• ${field}`).join("\n");
      setNotification({
        type: "warning",
        message: `${t("attendance.fillAllRequired")}\n${fieldList}`,
      });
      return;
    }
    
    // Jika semua validasi lolos, tampilkan modal konfirmasi
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    try {
      setSubmitting(true);

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
      payload.append("employeeId", formData.employeeId);
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
      await attendanceService.create(payload);

      // Success
      setNotification({
        type: "success",
        message: t("attendance.attendanceSaveSuccess"),
      });

      setShowConfirmModal(false);

      // Redirect after delay
      setTimeout(() => {
        navigate("/admin/checkclock");
      }, 1500);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      setNotification({
        type: "error",
        message: err?.data?.message || err?.message || t("attendance.attendanceSaveFailed"),
      });
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
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
        message: t("attendance.browserNoGeolocation"),
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
          message: t("attendance.locationUpdated"),
        });
      },
      (err) => {
        console.error(err);
        setNotification({
          type: "error",
          message: t("attendance.locationFailed"),
        });
      }
    );
  };

  return (
    <div className={`min-h-screen p-4 lg:p-6 relative ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ overflow: showConfirmModal ? 'hidden' : 'auto' }}>
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
        <div className={`rounded-2xl border shadow-lg p-4 lg:p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          {/* Header */}
          <div className="mb-6">
            <h2 className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {t("attendance.addCheckclock")}
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
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t("attendance.employee")}
                  </label>
                  {loadingEmployees ? (
                    <div className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm ${isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("attendance.loadingEmployees")}
                    </div>
                  ) : (
                    <CustomDropdown
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedEmployee = employees.find(
                          (emp) => String(emp.id) === String(selectedId)
                        );
                        setFormData((prev) => ({
                          ...prev,
                          employeeId: selectedId,
                          employeeName: selectedEmployee
                            ? `${selectedEmployee.firstName || ""} ${selectedEmployee.lastName || ""}`.trim()
                            : "",
                        }));
                      }}
                      placeholder={t("attendance.selectEmployee")}
                      options={employees.map((emp) => ({
                        value: emp.id,
                        label: `${emp.firstName || ""} ${emp.lastName || ""} - ${emp.jobdesk || "Staff"}`.trim(),
                      }))}
                    />
                  )}
                </div>

                {/* Tipe Absensi + Waktu Realtime */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t("attendance.attendanceType")}
                  </label>
                  <CustomDropdown
                    name="attendanceType"
                    value={formData.attendanceType}
                    onChange={(e) => handleAttendanceTypeChange(e.target.value)}
                    placeholder={t("attendance.selectAttendanceType")}
                    options={attendanceOptions.map((opt) => ({
                      value: opt,
                      label: opt,
                      icon: opt === "Clock In" ? "🟢" : opt === "Clock Out" ? "🔴" : opt === "Absent" ? "⚫" : opt === "Annual Leave" ? "🏖️" : "🏥",
                    }))}
                  />

                  {/* Waktu Realtime */}
                  <div className="mt-4 space-y-1.5">
                    <label className={`block text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t("attendance.realtimeAttendance")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentTime}
                        readOnly
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none ${
                          isDark 
                            ? 'border-gray-600 bg-gray-700 text-gray-200' 
                            : 'border-gray-300 bg-gray-50 text-gray-800'
                        }`}
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t("attendance.realtimeNote")}{" "}
                      <span className="font-semibold">
                        {formData.capturedTime || "--:--:--"}
                      </span>{" "}
                      {t("attendance.realtimeNote2")}
                    </p>
                  </div>
                </div>

                {/* Start/End Date (Annual Leave & Sick Leave) */}
                {["Annual Leave", "Sick Leave"].includes(formData.attendanceType) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t("attendance.startDate")}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDark 
                              ? 'border-gray-600 bg-gray-700 text-gray-200' 
                              : 'border-gray-300 bg-white text-gray-700'
                          }`}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t("attendance.endDate")}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDark 
                              ? 'border-gray-600 bg-gray-700 text-gray-200' 
                              : 'border-gray-300 bg-white text-gray-700'
                          }`}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Bukti Pendukung */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t("attendance.uploadProof")}
                  </label>

                  {/* Show preview if file is uploaded */}
                  {proofFile ? (
                    <div className={`border-2 rounded-lg p-4 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                      {/* Image Preview */}
                      {proofPreview && (
                        <div className={`mb-4 rounded-lg overflow-hidden border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                          <img 
                            src={proofPreview} 
                            alt="Preview" 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}

                      {/* File Info */}
                      <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                            {proofFile.type.startsWith("image/") ? (
                              <Upload className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            ) : (
                              <AlertCircle className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-medium truncate max-w-[200px] ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                              {proofFile.name}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {(proofFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className={`p-2 rounded-lg transition ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
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
                          id="proof-file-change"
                          accept="image/*,.pdf"
                        />
                        <label
                          htmlFor="proof-file-change"
                          className={`inline-block px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition ${
                            isDark 
                              ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {t("attendance.changeFile")}
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <Upload className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                        </div>
                        <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {t("attendance.dragDropHere")}
                        </p>
                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t("attendance.or")}</p>

                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="proof-file"
                          accept="image/*,.pdf"
                        />
                        <label
                          htmlFor="proof-file"
                          className={`inline-block px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition ${
                            isDark 
                              ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {t("attendance.browse")}
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
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t("attendance.location")}
                  </label>
                  <CustomDropdown
                    name="location"
                    value={formData.location}
                    onChange={handleLocationChange}
                    placeholder={loadingLocations ? t("attendance.loadingLocations") : t("attendance.selectLocation")}
                    options={[
                      // Dynamic locations from company settings
                      ...companyLocations.map(loc => ({
                        value: loc.name,
                        label: loc.name,
                        icon: "📍"
                      })),
                      // Fixed options
                      { value: "Remote", label: t("attendance.remote"), icon: "🏠" },
                      { value: "Lainnya", label: t("attendance.other"), icon: "📌" },
                    ]}
                  />
                  {companyLocations.length === 0 && !loadingLocations && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      {t("attendance.noLocationsRegistered")}
                    </p>
                  )}
                </div>

                {/* Map Section dengan Tombol My Location yang Terpisah */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t("attendance.locationMap")}
                    </label>
                    {/* Tombol My Location di luar map - selalu terlihat */}
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition shadow-sm"
                      title="Gunakan lokasimu"
                    >
                      <LocateFixed className="w-3.5 h-3.5" />
                      <span>{t("attendance.myLocation")}</span>
                    </button>
                  </div>
                  
                  {/* Map Container */}
                  <MapComponent 
                    mapPosition={mapPosition} 
                    onLocationChange={handleMapLocationChange}
                  />
                  
                  <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t("attendance.mapClickNote")}
                  </p>
                </div>

                {/* Detail Alamat */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t("attendance.addressDetail")}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t("attendance.addressPlaceholder")}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  />
                </div>

                {/* Lat/Long */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t("attendance.latitude")}
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder={t("attendance.latPlaceholder")}
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-gray-200' 
                          : 'border-gray-300 bg-gray-50 text-gray-900'
                      }`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t("attendance.longitude")}
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder={t("attendance.lngPlaceholder")}
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-gray-200' 
                          : 'border-gray-300 bg-gray-50 text-gray-900'
                      }`}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes (full width) */}
            <div className="mt-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t("attendance.additionalNotes")}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t("attendance.notesPlaceholder")}
                rows={4}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              />
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center justify-end gap-3 mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={() => navigate("/admin/checkclock")}
                className={`px-6 py-2.5 rounded-lg border text-sm font-medium transition ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#1D395E] text-sm font-medium text-white hover:bg-[#142848]"
              >
                {t("common.save")}
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
              {t("attendance.confirmSaveData")}
            </h3>

            {/* Message */}
            <p className={`text-sm text-center mb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t("attendance.confirmSaveMessage")}<br />
              {t("attendance.confirmSaveSubMessage")}
            </p>

            {/* Summary Info */}
            <div className={`rounded-lg p-4 mb-5 space-y-2.5 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t("attendance.employee")}:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.employeeName || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t("attendance.attendanceType")}:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.attendanceType || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t("common.time")}:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.capturedTime || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t("attendance.location")}:</span>
                <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {formData.location || "-"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("employee.saving")}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {t("attendance.yesSend")}
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