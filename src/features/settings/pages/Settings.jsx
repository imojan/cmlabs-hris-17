// src/features/settings/pages/Settings.jsx
// Universal Settings page for both Admin and User/Employee
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Globe, 
  Palette, 
  ChevronDown, 
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine role based on current URL path
  const isAdmin = location.pathname.startsWith("/admin");
  const basePath = isAdmin ? "/admin" : "/user";
  
  // Language & Theme states
  const [language, setLanguage] = useState("id");
  const [theme, setTheme] = useState("light");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const languages = [
    { code: "id", label: "Indonesia" },
    { code: "en", label: "English" },
  ];

  const themes = [
    { code: "light", label: "Light Mode", icon: Sun },
    { code: "dark", label: "Dark Mode", icon: Moon },
  ];

  const currentLang = languages.find(l => l.code === language);
  const currentTheme = themes.find(t => t.code === theme);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setShowLangDropdown(false);
    // TODO: Implement language change logic
  };

  const handleThemeChange = (code) => {
    setTheme(code);
    setShowThemeDropdown(false);
    // TODO: Implement theme change logic
  };

  const handleProfileSettings = () => {
    navigate(`${basePath}/settings/profile`);
  };

  return (
    <div className="space-y-6">
      {/* Main Settings Card */}
      <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#1D395E]">Pengaturan Umum</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola preferensi akun dan aplikasi Anda</p>
        </div>

        {/* Settings List */}
        <div className="divide-y divide-gray-100">
          
          {/* 1. Profile Settings - Navigates to new page */}
          <button
            onClick={handleProfileSettings}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50/80 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1D395E]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[#1D395E]" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-semibold text-gray-800">Pengaturan Profil</h3>
                <p className="text-sm text-gray-500">Ubah informasi profil, foto, dan data pribadi</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1D395E] transition-colors" />
          </button>

          {/* 2. Language Settings - Dropdown */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2D5F3F]/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#2D5F3F]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-800">Bahasa</h3>
                  <p className="text-sm text-gray-500">Pilih bahasa tampilan aplikasi</p>
                </div>
              </div>
              
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLangDropdown(!showLangDropdown);
                    setShowThemeDropdown(false);
                  }}
                  className="flex items-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors min-w-[180px]"
                >
                  <span className="flex-1 text-center text-sm font-medium text-gray-700">{currentLang?.label}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ml-2 ${showLangDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showLangDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-center px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                          language === lang.code ? 'bg-[#1D395E]/5 text-[#1D395E]' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-sm font-medium">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Theme Settings - Dropdown */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-800">Tema Tampilan</h3>
                  <p className="text-sm text-gray-500">Pilih tema terang atau gelap</p>
                </div>
              </div>
              
              {/* Theme Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowThemeDropdown(!showThemeDropdown);
                    setShowLangDropdown(false);
                  }}
                  className="flex items-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors min-w-[180px]"
                >
                  {currentTheme && <currentTheme.icon className="w-4 h-4 text-gray-600 mr-2" />}
                  <span className="flex-1 text-center text-sm font-medium text-gray-700">{currentTheme?.label}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ml-2 ${showThemeDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showThemeDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                    {themes.map((t) => (
                      <button
                        key={t.code}
                        onClick={() => handleThemeChange(t.code)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                          theme === t.code ? 'bg-[#1D395E]/5 text-[#1D395E]' : 'text-gray-700'
                        }`}
                      >
                        <t.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Card */}
      <section className="bg-gradient-to-r from-[#1D395E] to-[#2a4a6e] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Tentang Pengaturan</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Perubahan bahasa dan tema akan diterapkan secara langsung. 
              Untuk mengubah informasi profil seperti nama, foto, dan data pribadi lainnya, 
              klik pada menu "Pengaturan Profil" di atas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
