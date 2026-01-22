// src/features/settings/pages/Settings.jsx
// Universal Settings page for both Admin and User/Employee
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Globe, 
  Palette, 
  ChevronDown, 
  ChevronRight,
  Sun,
  Moon,
  MapPin
} from "lucide-react";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useTheme } from "@/app/hooks/useTheme";

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  // Determine role based on current URL path
  const isAdmin = location.pathname.startsWith("/admin");
  const basePath = isAdmin ? "/admin" : "/user";
  
  // Dropdown states
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  
  // Refs for click outside detection
  const langDropdownRef = useRef(null);
  const themeDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setShowThemeDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "id", label: "Indonesia" },
    { code: "en", label: "English" },
  ];

  const themes = [
    { code: "light", label: language === "id" ? "Mode Terang" : "Light Mode", icon: Sun },
    { code: "dark", label: language === "id" ? "Mode Gelap" : "Dark Mode", icon: Moon },
  ];

  const currentLang = languages.find(l => l.code === language);
  const currentTheme = themes.find(th => th.code === theme);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setShowLangDropdown(false);
  };

  const handleThemeChange = (code) => {
    setTheme(code);
    setShowThemeDropdown(false);
  };

  const handleProfileSettings = () => {
    navigate(`${basePath}/settings/profile`);
  };

  const handleLocationSettings = () => {
    navigate(`${basePath}/settings/locations`);
  };

  // Dynamic classes based on theme
  const cardBg = theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200/70";
  const cardHover = theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-gray-50/80";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-100";
  const dropdownBg = theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200";
  const dropdownHover = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const buttonBg = theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200";
  const buttonText = theme === "dark" ? "text-gray-200" : "text-gray-700";
  const headerText = theme === "dark" ? "text-blue-300" : "text-[#1D395E]";

  return (
    <div className="space-y-4 sm:space-y-6 px-1">
      {/* Main Settings Card */}
      <section className={`${cardBg} rounded-xl sm:rounded-2xl border shadow-sm overflow-visible`}>
        {/* Header */}
        <div className={`px-4 sm:px-6 py-4 sm:py-5 border-b ${borderColor}`}>
          <h2 className={`text-lg sm:text-xl font-semibold ${headerText}`}>{t("settings.generalSettings")}</h2>
          <p className={`text-xs sm:text-sm ${textSecondary} mt-1`}>{t("settings.subtitle")}</p>
        </div>

        {/* Settings List */}
        <div className={`divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-100"}`}>
          
          {/* 1. Profile Settings - Navigates to new page */}
          <button
            onClick={handleProfileSettings}
            className={`w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 ${cardHover} transition-colors group`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${theme === "dark" ? "bg-blue-900/30" : "bg-[#1D395E]/10"} flex items-center justify-center flex-shrink-0`}>
                <User className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === "dark" ? "text-blue-400" : "text-[#1D395E]"}`} />
              </div>
              <div className="text-left">
                <h3 className={`text-sm sm:text-[15px] font-semibold ${textPrimary}`}>{t("settings.profileSettings")}</h3>
                <p className={`text-xs sm:text-sm ${textSecondary} line-clamp-1`}>{t("settings.profileSettingsDesc")}</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${textSecondary} group-hover:${headerText} transition-colors flex-shrink-0`} />
          </button>

          {/* 1.5. Location Settings - Admin Only */}
          {isAdmin && (
            <button
              onClick={handleLocationSettings}
              className={`w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 ${cardHover} transition-colors group`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${theme === "dark" ? "bg-red-900/30" : "bg-red-500/10"} flex items-center justify-center flex-shrink-0`}>
                  <MapPin className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === "dark" ? "text-red-400" : "text-red-500"}`} />
                </div>
                <div className="text-left">
                  <h3 className={`text-sm sm:text-[15px] font-semibold ${textPrimary}`}>{t("settings.locationSettings")}</h3>
                  <p className={`text-xs sm:text-sm ${textSecondary} line-clamp-1`}>{t("settings.locationSettingsDesc")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary} group-hover:text-red-500 transition-colors flex-shrink-0`} />
            </button>
          )}

          {/* 2. Language Settings - Dropdown */}
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${theme === "dark" ? "bg-green-900/30" : "bg-[#2D5F3F]/10"} flex items-center justify-center flex-shrink-0`}>
                  <Globe className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === "dark" ? "text-green-400" : "text-[#2D5F3F]"}`} />
                </div>
                <div>
                  <h3 className={`text-sm sm:text-[15px] font-semibold ${textPrimary}`}>{t("settings.language")}</h3>
                  <p className={`text-xs sm:text-sm ${textSecondary}`}>{t("settings.languageDesc")}</p>
                </div>
              </div>
              
              {/* Language Dropdown */}
              <div className="relative ml-13 sm:ml-0" ref={langDropdownRef}>
                <button
                  onClick={() => {
                    setShowLangDropdown(!showLangDropdown);
                    setShowThemeDropdown(false);
                  }}
                  className={`flex items-center justify-between w-full sm:w-auto px-4 py-2 sm:py-2.5 ${buttonBg} rounded-lg sm:rounded-xl transition-colors sm:min-w-[160px]`}
                >
                  <span className={`text-sm font-medium ${buttonText}`}>{currentLang?.label}</span>
                  <ChevronDown className={`w-4 h-4 ${textSecondary} transition-transform ml-2 ${showLangDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showLangDropdown && (
                  <div className={`absolute right-0 left-0 sm:left-auto top-full mt-2 sm:w-full ${dropdownBg} rounded-lg sm:rounded-xl shadow-lg border py-1 z-50`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left sm:text-center px-4 py-2 sm:py-2.5 ${dropdownHover} transition-colors ${
                          language === lang.code 
                            ? theme === "dark" ? 'bg-blue-900/30 text-blue-300' : 'bg-[#1D395E]/5 text-[#1D395E]' 
                            : buttonText
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
          <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-visible">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${theme === "dark" ? "bg-yellow-900/30" : "bg-[#D4AF37]/10"} flex items-center justify-center flex-shrink-0`}>
                  <Palette className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === "dark" ? "text-yellow-400" : "text-[#D4AF37]"}`} />
                </div>
                <div>
                  <h3 className={`text-sm sm:text-[15px] font-semibold ${textPrimary}`}>{t("settings.theme")}</h3>
                  <p className={`text-xs sm:text-sm ${textSecondary}`}>{t("settings.themeDesc")}</p>
                </div>
              </div>
              
              {/* Theme Dropdown */}
              <div className="relative ml-13 sm:ml-0" ref={themeDropdownRef}>
                <button
                  onClick={() => {
                    setShowThemeDropdown(!showThemeDropdown);
                    setShowLangDropdown(false);
                  }}
                  className={`flex items-center justify-between w-full sm:w-auto px-4 py-2 sm:py-2.5 ${buttonBg} rounded-lg sm:rounded-xl transition-colors sm:min-w-[160px]`}
                >
                  <div className="flex items-center gap-2">
                    {currentTheme && <currentTheme.icon className={`w-4 h-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} />}
                    <span className={`text-sm font-medium ${buttonText}`}>{currentTheme?.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${textSecondary} transition-transform ml-2 ${showThemeDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showThemeDropdown && (
                  <div className={`absolute right-0 left-0 sm:left-auto top-full mt-2 sm:w-full ${dropdownBg} rounded-lg sm:rounded-xl shadow-lg border py-1 z-50`}>
                    {themes.map((themeItem) => (
                      <button
                        key={themeItem.code}
                        onClick={() => handleThemeChange(themeItem.code)}
                        className={`w-full flex items-center gap-2 px-4 py-2 sm:py-2.5 ${dropdownHover} transition-colors ${
                          theme === themeItem.code 
                            ? theme === "dark" ? 'bg-blue-900/30 text-blue-300' : 'bg-[#1D395E]/5 text-[#1D395E]' 
                            : buttonText
                        }`}
                      >
                        <themeItem.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{themeItem.label}</span>
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
      <section className="bg-gradient-to-r from-[#1D395E] to-[#2a4a6e] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base mb-1">{t("settings.aboutSettings")}</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {t("settings.aboutSettingsDesc")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
