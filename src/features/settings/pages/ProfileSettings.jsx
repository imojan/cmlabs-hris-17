// src/features/settings/pages/ProfileSettings.jsx
// Universal Profile Settings page for both Admin and User/Employee
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  ChevronDown,
  AlertCircle,
  CheckCircle,
  User,
  Trash2,
  Eye,
  EyeOff,
  Pencil,
  Upload,
  X,
  Lock
} from "lucide-react";
import { Notification } from "../../../components/ui/Notification";
import { authService } from "@/app/services/auth.api";
import { useAuth } from "@/app/store/authStore";
import { ENV } from "@/app/config/env";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { setUser, fetchMe } = useAuth();
  
  // Determine role based on current URL path
  const isAdmin = location.pathname.startsWith("/admin");
  const basePath = isAdmin ? "/admin" : "/user";

  // States
  const [existingAvatar, setExistingAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);
  const [showPhotoOverlay, setShowPhotoOverlay] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Initial form data - to track changes
  const [initialFormData, setInitialFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    nik: "",
    gender: "",
    education: "",
    birthPlace: "",
    birthDate: "",
    bank: "",
    accountNumber: "",
    accountName: "",
  });

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    nik: "",
    gender: "",
    education: "",
    birthPlace: "",
    birthDate: "",
    bank: "",
    accountNumber: "",
    accountName: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      const res = await authService.getProfile();
      const data = res?.data || res;
      
      // Format birthDate for input date
      let birthDateFormatted = "";
      if (data.birthDate) {
        const d = new Date(data.birthDate);
        birthDateFormatted = d.toISOString().split("T")[0];
      }

      const profileData = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        mobileNumber: data.mobileNumber || data.phone || "",
        nik: data.nik || "",
        gender: data.gender || "",
        education: data.education || "",
        birthPlace: data.birthPlace || "",
        birthDate: birthDateFormatted,
        bank: data.bank || "",
        accountNumber: data.accountNumber || "",
        accountName: data.accountName || "",
      };

      setFormData(profileData);
      setInitialFormData(profileData);

      // Set avatar
      if (data.avatar) {
        setExistingAvatar(`${ENV.API_URL}${data.avatar}`);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setNotification({
        type: "error",
        message: "Gagal mengambil data profile",
      });
    } finally {
      setIsFetching(false);
    }
  };

  // Dropdown states
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  // Options
  const genderOptions = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
  ];

  const educationOptions = [
    { value: "SMA", label: "SMA/SMK" },
    { value: "D3", label: "D3 - Diploma" },
    { value: "S1", label: "S1 - Sarjana" },
    { value: "S2", label: "S2 - Magister" },
    { value: "S3", label: "S3 - Doktor" },
  ];

  const bankOptions = [
    { value: "BCA", label: "Bank BCA" },
    { value: "BNI", label: "Bank BNI" },
    { value: "BRI", label: "Bank BRI" },
    { value: "Mandiri", label: "Bank Mandiri" },
    { value: "CIMB", label: "Bank CIMB Niaga" },
    { value: "Danamon", label: "Bank Danamon" },
    { value: "BSI", label: "Bank Syariah Indonesia" },
  ];

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowGenderDropdown(false);
    setShowEducationDropdown(false);
    setShowBankDropdown(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setNotification({
          type: "warning",
          message: "Ukuran file maksimal 1MB!",
        });
        return;
      }
      
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setNotification({
          type: "warning",
          message: "Format file harus JPEG atau PNG!",
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmDeletePhoto = async () => {
    try {
      await authService.deleteAvatar();
      setAvatarFile(null);
      setAvatarPreview(null);
      setExistingAvatar(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setShowDeletePhotoModal(false);
      setNotification({
        type: "success",
        message: "Foto profil berhasil dihapus!",
      });
    } catch (err) {
      console.error("Failed to delete avatar:", err);
      setNotification({
        type: "error",
        message: err.message || "Gagal menghapus foto profil",
      });
    }
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'mobileNumber', 'gender', 'birthPlace', 'birthDate'];
    const emptyFields = required.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      setNotification({
        type: "warning",
        message: "Mohon lengkapi semua field yang wajib diisi!",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);
    
    try {
      // 1. Update profile data
      const res = await authService.updateProfile(formData);
      
      // 2. Upload avatar jika ada file baru
      let newAvatarPath = null;
      if (avatarFile) {
        const avatarRes = await authService.updateAvatar(avatarFile);
        if (avatarRes?.data?.avatar) {
          newAvatarPath = avatarRes.data.avatar;
          setExistingAvatar(`${ENV.API_URL}${newAvatarPath}`);
        }
        setAvatarFile(null);
        setAvatarPreview(null);
      }
      
      // Update initial form data to match current (so hasChanges returns false)
      setInitialFormData({ ...formData });
      
      // Refresh user data dari server untuk update header
      await fetchMe();

      setNotification({
        type: "success",
        message: "Profil berhasil diperbarui!",
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
      setNotification({
        type: "error",
        message: err.message || "Gagal memperbarui profil",
      });
    }
    
    setShowConfirmModal(false);
    setIsLoading(false);
  };

  // Handle change password
  const handleChangePassword = async () => {
    // Validasi
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setNotification({
        type: "warning",
        message: "Semua field password wajib diisi!",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setNotification({
        type: "warning",
        message: "Password baru minimal 6 karakter!",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        type: "warning",
        message: "Konfirmasi password tidak cocok!",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setNotification({
        type: "success",
        message: "Password berhasil diubah!",
      });
      
      // Reset form dan tutup modal
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePasswordModal(false);
    } catch (err) {
      console.error("Failed to change password:", err);
      setNotification({
        type: "error",
        message: err.message || "Gagal mengubah password",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleBack = () => {
    navigate(`${basePath}/settings`);
  };

  const getSelectedLabel = (options, value) => {
    return options.find(opt => opt.value === value)?.label || "Pilih...";
  };

  // Get current display avatar
  const currentDisplayAvatar = avatarPreview || existingAvatar;

  // Check if there are any changes
  const hasChanges = () => {
    // Check if avatar changed
    if (avatarFile || avatarPreview) return true;
    
    // Check if any form field changed
    for (const key in formData) {
      if (formData[key] !== initialFormData[key]) return true;
    }
    
    return false;
  };

  const isFormChanged = hasChanges();

  // Input class
  const inputClass = "w-full h-[52px] px-4 bg-white border border-gray-300 rounded-xl text-[15px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="space-y-6 relative">
      {/* Notification Toast */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}

      {/* Back Button & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#1D395E]">Pengaturan Profil</h1>
          <p className="text-sm text-gray-500">Kelola informasi profil dan data pribadi Anda</p>
        </div>
      </div>

      {/* Main Form Card */}
      <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 lg:p-8">
          {/* Inner Card */}
          <div className="rounded-2xl border border-[#BFD0E0] bg-[#F7FAFC] px-5 py-6 md:px-8 md:py-8">
            
            {/* Content Layout - Form on left, Avatar on right */}
            <div className="flex flex-col-reverse lg:flex-row gap-8">
              {/* Left Side - Form Fields */}
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className={labelClass}>
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Masukkan nama depan"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Masukkan nama belakang"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Row 2: Mobile Number & NIK */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className={labelClass}>
                        No. Handphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        NIK
                      </label>
                      <input
                        type="text"
                        name="nik"
                        value={formData.nik}
                        onChange={handleChange}
                        placeholder="Masukkan NIK"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Row 3: Gender & Education */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Gender Dropdown */}
                    <div className="relative">
                      <label className={labelClass}>
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowGenderDropdown(!showGenderDropdown);
                          setShowEducationDropdown(false);
                          setShowBankDropdown(false);
                        }}
                        className={`${inputClass} flex items-center justify-between text-left`}
                      >
                        <span className={formData.gender ? "text-black" : "text-gray-400"}>
                          {getSelectedLabel(genderOptions, formData.gender)}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showGenderDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showGenderDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                          {genderOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleSelectChange('gender', opt.value)}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                                formData.gender === opt.value ? 'bg-[#1D395E]/5 text-[#1D395E] font-medium' : 'text-gray-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Education Dropdown */}
                    <div className="relative">
                      <label className={labelClass}>Pendidikan Terakhir</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEducationDropdown(!showEducationDropdown);
                          setShowGenderDropdown(false);
                          setShowBankDropdown(false);
                        }}
                        className={`${inputClass} flex items-center justify-between text-left`}
                      >
                        <span className={formData.education ? "text-black" : "text-gray-400"}>
                          {getSelectedLabel(educationOptions, formData.education)}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showEducationDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showEducationDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-48 overflow-y-auto">
                          {educationOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleSelectChange('education', opt.value)}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                                formData.education === opt.value ? 'bg-[#1D395E]/5 text-[#1D395E] font-medium' : 'text-gray-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Birth Place & Birth Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className={labelClass}>
                        Tempat Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleChange}
                        placeholder="Masukkan tempat lahir"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className={inputClass}
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Informasi Rekening</h3>
                  </div>

                  {/* Row 5: Bank & Account Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Bank Dropdown */}
                    <div className="relative">
                      <label className={labelClass}>Bank</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBankDropdown(!showBankDropdown);
                          setShowGenderDropdown(false);
                          setShowEducationDropdown(false);
                        }}
                        className={`${inputClass} flex items-center justify-between text-left`}
                      >
                        <span className={formData.bank ? "text-black" : "text-gray-400"}>
                          {getSelectedLabel(bankOptions, formData.bank)}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showBankDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showBankDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-48 overflow-y-auto">
                          {bankOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleSelectChange('bank', opt.value)}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                                formData.bank === opt.value ? 'bg-[#1D395E]/5 text-[#1D395E] font-medium' : 'text-gray-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>No. Rekening</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="Masukkan nomor rekening"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Row 6: Account Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className={labelClass}>Atas Nama Rekening</label>
                      <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleChange}
                        placeholder="Masukkan nama pemilik rekening"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Keamanan Akun</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className={labelClass}>Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          value="********"
                          readOnly
                          className={`${inputClass} bg-gray-100 cursor-not-allowed pr-12`}
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowChangePasswordModal(true)}
                        className="mt-2 text-sm text-[#1D395E] hover:underline font-medium"
                      >
                        Ubah Password
                      </button>
                    </div>
                  </div>

                  {/* Warning Info */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Perhatian</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Pastikan semua data yang Anda masukkan sudah benar. Field dengan tanda (*) wajib diisi.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormChanged}
                      className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-medium transition-colors ${
                        isFormChanged 
                          ? 'bg-[#1D395E] text-white hover:bg-[#2a4a6e] cursor-pointer' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side - Profile Photo */}
              <div className="lg:w-64 flex flex-col items-center lg:pt-6">
                {/* Avatar Preview - Square with rounded corners */}
                <div className="relative mb-4">
                  <div 
                    className="w-50 h-50 rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-100 shadow-md cursor-pointer"
                    onClick={() => setShowPhotoOverlay(true)}
                  >
                    {currentDisplayAvatar ? (
                      <img 
                        src={currentDisplayAvatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  {/* Pencil Edit Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPhotoOverlay(true)}
                    className="absolute -bottom-1 -right-1 w-12 h-12 bg-[#1D395E] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2a4a6e] transition-colors border-2 border-white"
                  >
                    <Pencil className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                {/* Upload Info */}
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  
                  {/* Change Picture Button */}
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="px-6 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-3"
                  >
                    Change Picture
                  </button>
                  
                  <p className="text-xs text-gray-500">
                    Picture Size: max 1mb
                  </p>
                  <p className="text-xs text-gray-500">
                    Format Picture: JPEG, PNG
                  </p>
                  
                  {avatarFile && (
                    <p className="mt-2 text-xs text-[#1D395E] font-medium truncate max-w-[180px]">
                      New: {avatarFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

      {/* Photo Preview Overlay Modal - LinkedIn Style */}
      {showPhotoOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowPhotoOverlay(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Foto Profil</h3>
              <button
                type="button"
                onClick={() => setShowPhotoOverlay(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Photo Display */}
            <div className="bg-gray-900 flex items-center justify-center p-8">
              <div className="w-64 h-64 rounded-2xl overflow-hidden bg-gray-200 shadow-xl">
                {currentDisplayAvatar ? (
                  <img 
                    src={currentDisplayAvatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <User className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-8 px-6 py-5 bg-gray-50 border-t border-gray-200">
              {/* Update Photo */}
              <button
                type="button"
                onClick={() => {
                  setShowPhotoOverlay(false);
                  handleAvatarClick();
                }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#1D395E]/10 flex items-center justify-center group-hover:bg-[#1D395E]/20 transition-colors">
                  <Upload className="w-5 h-5 text-[#1D395E]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ganti Foto</span>
              </button>
              
              {/* Delete Photo - only show if there's a photo */}
              {currentDisplayAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoOverlay(false);
                    setShowDeletePhotoModal(true);
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Hapus</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation Modal */}
      {showDeletePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeletePhotoModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Hapus Foto Profil?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Foto profil Anda akan dihapus. Anda dapat mengunggah foto baru kapan saja.
              </p>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeletePhotoModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDeletePhoto}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => !isLoading && setShowConfirmModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1D395E]/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#1D395E]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Konfirmasi Perubahan
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Apakah Anda yakin ingin menyimpan perubahan data profil ini?
              </p>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
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
                      Menyimpan...
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

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => !isChangingPassword && setShowChangePasswordModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1D395E]/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#1D395E]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Ubah Password
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Masukkan password lama dan password baru Anda
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password Lama <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Masukkan password lama"
                    className="w-full h-[48px] px-4 bg-white border border-gray-300 rounded-xl text-[15px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Masukkan password baru (min. 6 karakter)"
                    className="w-full h-[48px] px-4 bg-white border border-gray-300 rounded-xl text-[15px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Ketik ulang password baru"
                    className="w-full h-[48px] px-4 bg-white border border-gray-300 rounded-xl text-[15px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-2.5 bg-[#1D395E] text-white rounded-xl font-medium hover:bg-[#2a4a6e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Menyimpan...
                  </>
                ) : (
                  "Ubah Password"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isFetching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-3">
            <span className="w-10 h-10 border-4 border-[#1D395E]/30 border-t-[#1D395E] rounded-full animate-spin"></span>
            <p className="text-sm text-gray-600">Memuat data profile...</p>
          </div>
        </div>
      )}
    </div>
  );
}
