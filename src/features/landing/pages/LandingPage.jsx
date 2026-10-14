import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  Globe, 
  Monitor, 
  MessageSquare, 
  Users,
  ChevronDown,
  MapPin,
  Check,
  Key,
  Phone,
  UserPlus,
  Sun,
  Moon,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useTheme } from "@/app/hooks/useTheme";

// Assets
import logoHris from "@/assets/images/logo-hris-2.png";
import logoHrisWhite from "@/assets/images/hris-putih.png";
import dashboardExample from "@/assets/images/dashboard-example.png";
import waWhite from "@/assets/images/wa-white.png";
import instagramWhite from "@/assets/images/instagram-white.png";
import tiktokWhite from "@/assets/images/tiktok-white.png";
import emailWhite from "@/assets/images/email-white.png";
import linkedinWhite from "@/assets/images/linkedin-white.png";
import youtubeWhite from "@/assets/images/youtube-white.png";
import xWhite from "@/assets/images/x-white.png";
import facebookWhite from "@/assets/images/facebook-white.png";

/* ===================== HOOK: useScrollAnimations ===================== */
// Mirip pattern isuzu-karabha - observe [data-animate] elements
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -100px 0px' 
      }
    );

    // Observe semua elemen dengan data-animate
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach((node) => {
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);
}

/* ===================== HOOK: useActiveSection ===================== */
function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0 
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}

/* ===================== NAVBAR ===================== */
function Navbar({ activeSection, isDark }) {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const { setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const navLinks = [
    { label: language === "id" ? "Beranda" : "Home", href: "#beranda", id: "beranda" },
    { label: language === "id" ? "Solusi" : "Solutions", href: "#solusi", id: "solusi" },
    { label: language === "id" ? "Tentang" : "About", href: "#tentang", id: "tentang" },
    { label: language === "id" ? "Kontak" : "Contact", href: "#kontak", id: "kontak" },
  ];

  const languages = [
    { code: "id", label: "Indonesia" },
    { code: "en", label: "English" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/6281213968518?text=Halo, saya tertarik dengan HRIS Online", "_blank");
  };

  const handleNavigate = (path) => {
    const pageWrapper = document.getElementById('page-transition');
    if (pageWrapper) {
      pageWrapper.classList.remove('page-transition-active');
      pageWrapper.classList.add('page-transition-leave');
      setTimeout(() => navigate(path), 250);
    } else {
      navigate(path);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? isDark ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-lg'
        : isDark ? 'bg-gray-900 shadow-sm shadow-gray-800' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <img 
              src={isDark ? logoHrisWhite : logoHris} 
              alt="HRIS Online" 
              className="h-8 w-auto cursor-pointer hover:scale-105 transition-transform duration-300" 
              onClick={() => scrollToSection('#beranda')}
            />
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className={`link-underline text-[15px] font-medium py-2 transition-colors duration-300 ${
                  activeSection === link.id 
                    ? isDark ? 'text-blue-400 active' : 'text-[#1d395e] active'
                    : isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-[#1d395e]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 ${
                  isDark ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-600 hover:text-[#1d395e] hover:bg-gray-100'
                }`}
              >
                <Globe size={18} />
                <span className="text-sm">{language === "id" ? "ID" : "EN"}</span>
                <ChevronDown size={14} className={`transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showLangDropdown && (
                <div className={`absolute top-full right-0 mt-2 rounded-lg shadow-lg border py-1 z-50 min-w-[120px] ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        language === lang.code 
                          ? isDark ? 'text-blue-400 font-medium' : 'text-[#1d395e] font-medium'
                          : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => handleNavigate("/auth/sign-in")}
              className={`text-[15px] font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                isDark ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-[#1d395e] hover:bg-gray-100'
              }`}
            >
              {t("auth.signIn")}
            </button>
            <button
              onClick={handleWhatsApp}
              className="btn-hover flex items-center gap-2 bg-[#1d395e] text-white text-[14px] font-semibold px-4 py-2 rounded-lg"
            >
              {t("landing.contactSales")}
            </button>
            <button
              onClick={() => handleNavigate("/auth/sign-up")}
              className={`btn-hover text-[14px] font-semibold px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                isDark 
                  ? 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900'
                  : 'text-[#1d395e] border-[#1d395e] hover:bg-[#1d395e] hover:text-white'
              }`}
            >
              {t("landing.tryFree")}
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              isDark ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden border-t shadow-lg overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'
      } ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className={`block w-full text-left text-[16px] font-medium py-2 px-3 rounded-lg transition-all duration-300 ${
                activeSection === link.id 
                  ? isDark ? 'text-blue-400 bg-blue-400/10' : 'text-[#1d395e] bg-[#1d395e]/10'
                  : isDark ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-[#1d395e] hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <hr className={`my-3 ${isDark ? 'border-gray-700' : ''}`} />
          {/* Language Selector Mobile */}
          <div className={`flex items-center gap-2 px-3 py-2 ${isDark ? 'text-gray-300' : ''}`}>
            <Globe size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t("settings.language")}:</span>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  language === lang.code 
                    ? 'bg-[#1d395e] text-white' 
                    : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          
          {/* Theme Toggle Mobile */}
          <div className={`flex items-center gap-2 px-3 py-2 ${isDark ? 'text-gray-300' : ''}`}>
            {isDark ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-600" />
            )}
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{language === "id" ? "Tema" : "Theme"}:</span>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded-lg text-sm ${
                !isDark 
                  ? 'bg-[#1d395e] text-white' 
                  : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Light
            </button>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded-lg text-sm ${
                isDark 
                  ? 'bg-[#1d395e] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dark
            </button>
          </div>

          <button onClick={() => { handleNavigate("/auth/sign-in"); setMobileMenuOpen(false); }} className={`block w-full text-left text-[16px] font-medium py-2 px-3 rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}>{t("auth.signIn")}</button>
          <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-2 bg-[#1d395e] text-white text-[14px] font-semibold px-4 py-3 rounded-lg">{t("landing.contactSales")}</button>
          <button onClick={() => { handleNavigate("/auth/sign-up"); setMobileMenuOpen(false); }} className={`w-full text-[14px] font-semibold px-4 py-3 rounded-lg border-2 transition-all duration-300 ${isDark ? 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900' : 'text-[#1d395e] border-[#1d395e] hover:bg-[#1d395e] hover:text-white'}`}>{t("landing.tryFree")}</button>
        </div>
      </div>
    </nav>
  );
}

/* ===================== HERO SECTION ===================== */
function HeroSection({ isDark }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleWhatsApp = () => {
    window.open("https://wa.me/6281213968518?text=Halo, saya tertarik dengan HRIS Online", "_blank");
  };

  const handleNavigate = (path) => {
    const pageWrapper = document.getElementById('page-transition');
    if (pageWrapper) {
      pageWrapper.classList.remove('page-transition-active');
      pageWrapper.classList.add('page-transition-leave');
      setTimeout(() => navigate(path), 250);
    } else {
      navigate(path);
    }
  };

  return (
    <section id="beranda" className={`pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left" data-animate="fade-right">
            <p className={`font-semibold text-sm uppercase tracking-wider mb-3 ${isDark ? 'text-blue-400' : 'text-[#1d395e]'}`}>
              {t("landing.hrisApp")}
            </p>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 whitespace-pre-line ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>
              {t("landing.heroTitle")}
            </h1>
            <p className={`text-lg mb-8 max-w-lg mx-auto lg:mx-0 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t("landing.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleWhatsApp}
                className="btn-hover ripple flex items-center justify-center gap-2 bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg"
              >
                <img src={waWhite} alt="WhatsApp" className="w-5 h-5" />
                {t("landing.whatsappSales")}
              </button>
              <button
                onClick={() => handleNavigate("/auth/sign-up")}
                className={`btn-hover font-semibold px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                  isDark 
                    ? 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900'
                    : 'text-[#1d395e] border-[#1d395e] hover:bg-[#1d395e] hover:text-white'
                }`}
              >
                {t("landing.tryFree")}
              </button>
            </div>
          </div>

          {/* Right Content - Dashboard Image */}
          <div className="relative" data-animate="fade-left" data-animate-delay="200">
            <div className={`rounded-2xl p-4 shadow-xl card-hover hover-float ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <img src={dashboardExample} alt="HRIS Dashboard" className="w-full h-auto rounded-lg" />
            </div>
            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl ${isDark ? 'bg-blue-500/20' : 'bg-[#1d395e]/10'}`}></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== FEATURES SECTION ===================== */
function FeaturesSection({ isDark }) {
  const { t } = useTranslation();
  
  const features = [
    { 
      icon: <Key className="w-8 h-8 text-white" />, 
      bgColor: "bg-[#8B2942]",
      title: t("landing.feature1Title"), 
      description: t("landing.feature1Desc")
    },
    { 
      icon: <Phone className="w-8 h-8 text-white" />, 
      bgColor: "bg-[#B8860B]",
      title: t("landing.feature2Title"), 
      description: t("landing.feature2Desc")
    },
    { 
      icon: <UserPlus className="w-8 h-8 text-white" />, 
      bgColor: "bg-[#2E7D4F]",
      title: t("landing.feature3Title"), 
      description: t("landing.feature3Desc")
    },
  ];

  return (
    <section id="solusi" className={`py-16 lg:py-24 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-animate="fade-up">
          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-blue-400' : 'text-[#1d395e]'}`}>
            {t("landing.featuresSubtitle")}
          </p>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold whitespace-pre-line ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>
            {t("landing.featuresTitle")}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`card-hover rounded-xl p-6 shadow-sm cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-white'}`} data-animate="fade-up" data-animate-delay={String((index + 1) * 150)}>
              <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>{feature.icon}</div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>{feature.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== PRICING SECTION ===================== */
function PricingSection({ isDark }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("package");

  // Package plans (fitur lengkap)
  const packagePlans = [
    { name: "BASIC", price: "Rp 10.000", subtitle: "Untuk bisnis kecil & tim awal", popular: false, features: ["Attendance & List Hadir", "GPS based attendance validation", "Employee data management", "Leave & time off request", "Overtime management", "Fixed work schedule management"] },
    { name: "PREMIUM", price: "Rp 15.000", subtitle: "Flexible & professional", popular: true, features: ["All Standard Features", "Clock in/out attendance settings", "Payroll integration", "Employee document management", "Sick leave & time off setting", "Shift management", "Overtime management (custom)"] },
    { name: "STANDARD", price: "Rp 13.000", subtitle: "Untuk tim berkembang & Operasional stabil", popular: false, features: ["Attendance & List Hadir", "GPS-based attendance validation", "Employee data management", "Leave & time off request", "Overtime management", "Fixed work schedule management", "Automatic tax calculation"] },
  ];

  // Seat plans (per user pricing)
  const seatPlans = [
    { name: "STARTER", price: "Rp 9.000", unit: "/user/month", description: "This package for 1 until 20 employee, suitable for a small team.", popular: false },
    { name: "STANDARD", price: "Rp 29.000", unit: "/user/month", description: "This package for 21 until 50 employee, suitable for growing team.", popular: false },
    { name: "PREMIUM", price: "Rp 49.000", unit: "/user/month", description: "This package for 51 until 100 employee, suitable for complex operations business ready.", popular: true },
    { name: "BUSINESS", price: "Rp 79.000", unit: "/user/month", description: "This package for 101 until 200 employee, suitable for company scale up ", popular: false },
    { name: "ENTERPRISE", price: "Rp 129.000", unit: "/user/month", description: "This package for 201 until 500 employee, suitable for advanced HR solutions.", popular: false },
    { name: "ENTERPRISE PLUS",  description: "This package for 500+ employee, suitable for custom solution.", popular: false },
  ];

  // Handle package selection - navigate to payment page with smooth transition
  const handleSelectPackage = (planName, planType = "package") => {
    // Add page leave animation
    const pageContent = document.getElementById('landing-content');
    if (pageContent) {
      pageContent.classList.add('page-leave');
    }
    
    // Navigate after animation
    setTimeout(() => {
      navigate("/payment", {
        state: {
          selectedPlan: planName,
          planType: planType,
          employeeCount: 3,
        },
      });
    }, 250);
  };

  const plans = activeTab === "package" ? packagePlans : seatPlans;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={`relative overflow-hidden py-16 sm:py-20 lg:py-24 ${isDark ? "bg-[#101e32]" : "bg-[#edf3f9]"}`}
    >
      <div aria-hidden="true" className={`pointer-events-none absolute -right-40 -top-48 h-[480px] w-[480px] rounded-full border-[60px] ${isDark ? "border-blue-300/[0.03]" : "border-white/50"}`} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <p className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${isDark ? "text-blue-300" : "text-[#42658b]"}`}>
              {t("landing.pricingEyebrow")}
            </p>
            <h2 id="pricing-heading" className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px] lg:leading-tight ${isDark ? "text-white" : "text-[#1d395e]"}`}>
              {t("landing.pricingTitle")}
            </h2>
          </div>
          <p className={`max-w-xl text-sm leading-7 sm:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            {t("landing.pricingSubtitle")}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label={t("landing.pricingType")} className={`inline-flex w-full rounded-full border p-1.5 sm:w-auto ${isDark ? "border-slate-600 bg-slate-800" : "border-[#d5e1ee] bg-white/80"}`}>
            {["package", "seat"].map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={activeTab === type}
                onClick={() => setActiveTab(type)}
                className={`min-h-11 flex-1 rounded-full px-8 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 sm:flex-none ${activeTab === type ? "bg-[#1d395e] text-white shadow-sm" : isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 hover:bg-blue-50"}`}
              >
                {t(`landing.${type}`)}
              </button>
            ))}
          </div>
          <p className={`flex items-center gap-2 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Users aria-hidden="true" size={16} className="shrink-0" />
            {t(activeTab === "package" ? "landing.pricingPackageHint" : "landing.pricingSeatHint")}
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <article
              key={`${activeTab}-${plan.name}`}
              className={`relative flex min-w-0 flex-col rounded-[24px] border p-6 motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 sm:p-8 ${plan.popular
                ? isDark ? "border-blue-400 bg-[#1b3352] shadow-xl shadow-black/15" : "border-[#658fbe] bg-white shadow-[0_16px_48px_-16px_rgba(29,57,94,0.3)]"
                : isDark ? "border-slate-700 bg-[#17273d]" : "border-white bg-white shadow-[0_8px_30px_-16px_rgba(29,57,94,0.15)]"}`}
            >
              <div className="mb-6 flex min-h-7 flex-wrap items-center justify-between gap-2">
                <h3 className={`text-sm font-bold tracking-[0.08em] ${isDark ? "text-slate-100" : "text-[#1d395e]"}`}>{plan.name}</h3>
                {plan.popular && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide ${isDark ? "bg-blue-300/15 text-blue-200" : "bg-[#eaf2fc] text-[#315d90]"}`}>
                    <Sparkles aria-hidden="true" size={12} />
                    {t("landing.mostPopular")}
                  </span>
                )}
              </div>

              <div className="mb-5">
                <p className={`text-4xl font-bold leading-tight tracking-tight sm:text-[42px] ${isDark ? "text-white" : "text-[#1d395e]"}`}>
                  {plan.price || t("landing.pricingCustom")}
                </p>
                <p className={`mt-2 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {t(plan.price ? "landing.pricingPerUser" : "landing.pricingCustomHint")}
                </p>
              </div>

              <p className={`mb-6 text-sm leading-6 md:min-h-12 ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                {activeTab === "package" ? plan.subtitle : plan.description}
              </p>

              {plan.features && (
                <div className={`mb-8 border-t pt-6 ${isDark ? "border-slate-600/60" : "border-slate-100"}`}>
                  <p className={`mb-4 text-xs font-semibold ${isDark ? "text-slate-200" : "text-[#1d395e]"}`}>{t("landing.pricingIncluded")}</p>
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className={`flex items-start gap-3 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${isDark ? "bg-blue-300/10 text-blue-300" : "bg-[#edf3fa] text-[#416f9f]"}`}>
                          <Check aria-hidden="true" size={13} strokeWidth={2.5} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSelectPackage(plan.name, activeTab)}
                className={`mt-auto flex min-h-12 w-full items-center justify-between gap-3 rounded-full border px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 ${plan.popular
                  ? "border-[#1d395e] bg-[#1d395e] text-white hover:border-[#2c527d] hover:bg-[#2c527d]"
                  : isDark ? "border-slate-500 text-slate-100 hover:bg-slate-700" : "border-[#b9cadd] text-[#1d395e] hover:border-[#1d395e] hover:bg-[#edf3f9]"}`}
              >
                {t("landing.selectPackage")}
                <ArrowUpRight aria-hidden="true" size={18} className="shrink-0" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== ABOUT / FAQ SECTION ===================== */
function AboutSection({ isDark }) {
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useTranslation();
  
  const faqs = [
    { question: t("landing.aboutFaq1Q"), answer: t("landing.aboutFaq1A") },
    { question: t("landing.aboutFaq2Q"), answer: t("landing.aboutFaq2A") },
    { question: t("landing.aboutFaq3Q"), answer: t("landing.aboutFaq3A") },
    { question: t("landing.aboutFaq4Q"), answer: t("landing.aboutFaq4A") },
    { question: t("landing.aboutFaq5Q"), answer: t("landing.aboutFaq5A") },
    { question: t("landing.aboutFaq6Q"), answer: t("landing.aboutFaq6A") },
  ];

  return (
    <section id="tentang" className={`py-16 lg:py-24 overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div data-animate="fade-right">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>{t("landing.aboutTitle")}</h2>
            <div className={`space-y-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>{t("landing.aboutP1")}</p>
              <p>{t("landing.aboutP2")}</p>
              <p>{t("landing.aboutP3")}</p>
            </div>
          </div>
          <div data-animate="fade-left" data-animate-delay="200">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                  isDark 
                    ? `border-gray-700 hover:border-blue-400/30 hover:shadow-md ${openFaq === index ? 'bg-gray-800 border-blue-400/20' : ''}`
                    : `border-gray-200 hover:border-[#1d395e]/30 hover:shadow-md ${openFaq === index ? 'bg-[#f8fafc] border-[#1d395e]/20' : ''}`
                }`}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className={`w-full flex items-center justify-between p-4 text-left transition-all duration-300 ${isDark ? 'hover:bg-gray-700/80' : 'hover:bg-gray-50/80'}`}>
                    <span className={`text-[15px] font-medium transition-colors duration-300 ${openFaq === index ? isDark ? 'text-blue-400' : 'text-[#1d395e]' : isDark ? 'text-gray-200' : 'text-gray-800'}`}>{faq.question}</span>
                    <ChevronDown size={20} className={`flex-shrink-0 transition-all duration-300 ${openFaq === index ? isDark ? 'rotate-180 text-blue-400' : 'rotate-180 text-[#1d395e]' : isDark ? 'text-gray-500' : 'text-gray-500'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4"><p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{faq.answer}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== CTA SECTION ===================== */
function CtaSection({ isDark }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleWhatsApp = () => window.open("https://wa.me/6281213968518?text=Halo, saya tertarik dengan HRIS Online", "_blank");
  const handleNavigate = (path) => {
    const pageWrapper = document.getElementById('page-transition');
    if (pageWrapper) { pageWrapper.classList.remove('page-transition-active'); pageWrapper.classList.add('page-transition-leave'); setTimeout(() => navigate(path), 250); }
    else navigate(path);
  };

  return (
    <section className={`py-16 lg:py-20 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-animate="fade-up">
        <img src={isDark ? logoHrisWhite : logoHris} alt="HRIS" className="h-10 mx-auto mb-6 hover:scale-110 transition-transform duration-300 cursor-pointer" />
        <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>{t("landing.ctaTitle")}</h2>
        <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t("landing.ctaSubtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleWhatsApp} className="btn-hover ripple flex items-center justify-center gap-2 bg-[#1d395e] text-white font-semibold px-6 py-3 rounded-lg"><img src={waWhite} alt="WhatsApp" className="w-5 h-5" />{t("landing.whatsappSales")}</button>
          <button onClick={() => handleNavigate("/auth/sign-up")} className={`btn-hover font-semibold px-6 py-3 rounded-lg border-2 transition-all duration-300 ${isDark ? 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900' : 'text-[#1d395e] border-[#1d395e] hover:bg-[#1d395e] hover:text-white'}`}>{t("landing.tryFreeShort")}</button>
        </div>
      </div>
    </section>
  );
}

/* ===================== FOOTER ===================== */
function Footer({ isDark }) {
  const handleWhatsApp = () => window.open("https://wa.me/6281213968518?text=Halo, saya tertarik dengan HRIS Online", "_blank");
  const footerLinks = {
    fitur: ["Software Payroll", "Employee Self Service (ESS)", "HR Dashboard Analytics"],
    solusiBisnis: ["Hospitality", "Teknologi Informasi", "Distribusi", "Bisnis Menengah", "Enterprise"],
    insight: ["Artikel HR & Payroll", "Ebook & Whitepaper"],
    perusahaan: ["Help Center", "Hubungi Support", "Keamanan", "Pemberitahuan Privasi", "Syarat & Ketentuan"],
  };
  const offices = [
    { city: "Jakarta", address: "Jl. Pluit Kencana Raya No.63, RT.4/RW.6, Pluit, Kecamatan Penjaringan, Jkt Utara, Daerah Khusus Ibukota Jakarta 14450" },
    { city: "Malang", address: "Jl. Raya Blimbing Indah No.10 Blok A4, Polowijen, Kec. Blimbing, Kota Malang, Jawa Timur 65126" },
    { city: "Solo", address: "Jl. Kutai Utara No.1, Sumber, Kec. Banjarsari, Kota Surakarta, Jawa Tengah 57138" },
    { city: "Surabaya", address: "Jl. Pakuwon Trade Center No.2, Lontar, Kec. Wiyung, Surabaya, Jawa Timur 60227" },
  ];

  return (
    <footer id="kontak" className={isDark ? 'bg-gray-800' : 'bg-[#F2F2F3]'}>
      <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#1d395e]'}`}><span className={`cursor-pointer ${isDark ? 'hover:text-blue-400' : 'hover:text-[#2a4a6e]'}`}>Home</span> / <span className="font-medium">Aplikasi & Software HRIS Online</span></p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8" data-animate="fade-up">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <img src={isDark ? logoHrisWhite : logoHris} alt="HRIS" className="h-8 mb-4" />
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com/cmlabsco" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"><img src={instagramWhite} alt="Instagram" className="w-5 h-5" /></a>
              <a href="https://www.tiktok.com/@cmlabs" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"><img src={tiktokWhite} alt="TikTok" className="w-5 h-5" /></a>
              <button onClick={handleWhatsApp} className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"><img src={waWhite} alt="WhatsApp" className="w-5 h-5" /></button>
              <a href="mailto:business@cmlabs.co" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"><img src={emailWhite} alt="Gmail" className="w-5 h-5" /></a>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="https://x.com/cmlabsco" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"><img src={xWhite} alt="X" className="w-5 h-5" /></a>
              <a href="https://www.youtube.com/@cmlabsco" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"><img src={youtubeWhite} alt="YouTube" className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/company/cmlabs-co" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"><img src={linkedinWhite} alt="LinkedIn" className="w-5 h-5" /></a>              
              <a href="https://www.facebook.com/cmlabsco" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"><img src={facebookWhite} alt="Facebook" className="w-5 h-5" /></a>
            </div>
          </div>
          <div><h4 className={`font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>Fitur</h4><ul className="space-y-2">{footerLinks.fitur.map((link, idx) => <li key={idx}><a href="#" className={`text-sm hover:translate-x-1 inline-block transition-all duration-300 ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-[#1d395e]/80 hover:text-[#1d395e]'}`}>{link}</a></li>)}</ul></div>
          <div><h4 className={`font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>Solusi Bisnis</h4><ul className="space-y-2">{footerLinks.solusiBisnis.map((link, idx) => <li key={idx}><a href="#" className={`text-sm hover:translate-x-1 inline-block transition-all duration-300 ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-[#1d395e]/80 hover:text-[#1d395e]'}`}>{link}</a></li>)}</ul></div>
          <div><h4 className={`font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>Insight</h4><ul className="space-y-2">{footerLinks.insight.map((link, idx) => <li key={idx}><a href="#" className={`text-sm hover:translate-x-1 inline-block transition-all duration-300 ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-[#1d395e]/80 hover:text-[#1d395e]'}`}>{link}</a></li>)}</ul></div>
          <div><h4 className={`font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>Perusahaan</h4><ul className="space-y-2">{footerLinks.perusahaan.map((link, idx) => <li key={idx}><a href="#" className={`text-sm hover:translate-x-1 inline-block transition-all duration-300 ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-[#1d395e]/80 hover:text-[#1d395e]'}`}>{link}</a></li>)}</ul></div>
        </div>
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`} data-animate="fade-up" data-animate-delay="200">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, idx) => <div key={idx}><h5 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}><MapPin size={14} />{office.city}</h5><p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#1d395e]/70'}`}>{office.address}</p></div>)}
          </div>
        </div>
      </div>
      <div className="bg-[#1d395e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2"><img src={logoHris} alt="HRIS" className="h-8 brightness-0 invert" /></div>
            <p className="text-sm text-white font-medium">© Copyright 2025 HRIS | CMLABS Group 17 Project</p>
            <a href="#" className="text-sm text-white font-medium hover:text-white/80 transition-all duration-300">View All HRIS Online</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===================== MAIN LANDING PAGE ===================== */
export default function LandingPage() {
  const sectionIds = ['beranda', 'solusi', 'tentang', 'kontak'];
  const activeSection = useActiveSection(sectionIds);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isReady, setIsReady] = useState(false);

  // Initialize scroll animations - re-run when theme changes
  useScrollAnimations();

  // Page transition: fade-in saat load
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { 
      clearTimeout(timer);
      document.documentElement.style.scrollBehavior = 'auto'; 
    };
  }, []);

  // Re-trigger animations when theme changes
  useEffect(() => {
    if (isReady) {
      // Re-add in-view class to all animated elements that are visible
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in-view');
        }
      });
    }
  }, [theme, isReady]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar activeSection={activeSection} isDark={isDark} />
      <div 
        className={`transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      >
        <div id="landing-content">
          <HeroSection isDark={isDark} />
          <FeaturesSection isDark={isDark} />
          <PricingSection isDark={isDark} />
          <AboutSection isDark={isDark} />
          <CtaSection isDark={isDark} />
          <Footer isDark={isDark} />
        </div>
      </div>
    </div>
  );
}
