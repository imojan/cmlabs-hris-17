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
  Moon
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
  const { t, language } = useTranslation();

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
    { name: "BASIC", subtitle: "Untuk bisnis kecil & tim awal", popular: false, features: ["Attendance & List Hadir", "GPS based attendance validation", "Employee data management", "Leave & time off request", "Overtime management", "Fixed work schedule management"] },
    { name: "PREMIUM", subtitle: "Flexible & professional", popular: true, features: ["All Standard Features", "Clock in/out attendance settings", "Payroll integration", "Employee document management", "Sick leave & time off setting", "Shift management", "Overtime management (custom)"] },
    { name: "STANDARD", subtitle: "Untuk tim berkembang & Operasional stabil", popular: false, features: ["Attendance & List Hadir", "GPS-based attendance validation", "Employee data management", "Leave & time off request", "Overtime management", "Fixed work schedule management", "Automatic tax calculation"] },
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

  return (
    <section id="pricing" className={`py-16 lg:py-24 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-[#1d395e]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10" data-animate="fade-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">{t("landing.pricingTitle")}</h2>
          <p className="max-w-2xl mx-auto text-white/80">{t("landing.pricingSubtitle")}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10" data-animate="fade-up" data-animate-delay="100">
          <div className={`rounded-full p-1.5 flex shadow-lg ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
            <button 
              onClick={() => setActiveTab("package")} 
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "package" ? "bg-[#1d395e] text-white shadow-md" : isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-[#1d395e]"}`}
            >
              {t("landing.package")}
            </button>
            <button 
              onClick={() => setActiveTab("seat")} 
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "seat" ? "bg-[#e85a5a] text-white shadow-md" : isDark ? "text-gray-300 hover:text-[#e85a5a]" : "text-gray-600 hover:text-[#e85a5a]"}`}
            >
              {t("landing.seat")}
            </button>
          </div>
        </div>

        {/* Package Plans */}
        <div 
          className={`grid md:grid-cols-3 gap-6 items-start transition-all duration-500 ${
            activeTab === "package" 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 translate-y-4 absolute pointer-events-none h-0 overflow-hidden"
          }`}
        >
          {packagePlans.map((plan, index) => (
            <div 
              key={`package-${index}`} 
              className={`card-hover rounded-2xl p-6 ${plan.popular ? "ring-2 ring-[#25d366] md:scale-105 shadow-xl" : "shadow-lg"} ${isDark ? 'bg-gray-700' : 'bg-white'}`}
              style={{ 
                animation: activeTab === "package" ? `fadeInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
              }}
            >
              {plan.popular && <div className="text-center mb-2"><span className="inline-block text-xs text-[#25d366] font-semibold uppercase tracking-wider animate-pulse bg-[#25d366]/10 px-3 py-1 rounded-full">{t("landing.mostPopular")}</span></div>}
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>{plan.name}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{plan.subtitle}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-start gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}><Check size={16} className="text-[#25d366] mt-0.5 flex-shrink-0" /><span>{feature}</span></li>
                ))}
              </ul>
              <button 
                onClick={() => handleSelectPackage(plan.name, "package")}
                className={`btn-hover w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  plan.popular 
                    ? "bg-[#1d395e] text-white hover:bg-[#2a4a6e]" 
                    : isDark 
                      ? "text-blue-400 border-2 border-blue-400 hover:bg-blue-400 hover:text-gray-900"
                      : "text-[#1d395e] border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white"
                }`}
              >
                {t("landing.selectPackage")}
              </button>
            </div>
          ))}
        </div>

        {/* Seat Plans */}
        <div 
          className={`grid md:grid-cols-3 gap-6 items-start transition-all duration-500 ${
            activeTab === "seat" 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 translate-y-4 absolute pointer-events-none h-0 overflow-hidden"
          }`}
        >
          {seatPlans.map((plan, index) => (
            <div 
              key={`seat-${index}`} 
              className={`card-hover rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${plan.popular ? "ring-2 ring-[#e85a5a]" : ""} ${isDark ? 'bg-gray-700' : 'bg-white'}`}
              style={{ 
                animation: activeTab === "seat" ? `fadeInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
              }}
            >
              {/* Header */}
              <div className={`py-4 px-6 ${plan.popular ? "bg-gradient-to-r from-[#1d395e] to-[#2a4a6e]" : "bg-[#1d395e]"}`}>
                <h3 className="text-lg font-bold text-white text-center">{plan.name}</h3>
              </div>
              
              {/* Body */}
              <div className="p-6 text-center">
                <div className="mb-4">
                  <span className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>{plan.price}</span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{plan.unit}</span>
                </div>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                
                {/* Select Button */}
                <button 
                  onClick={() => handleSelectPackage(plan.name, "seat")}
                  className={`btn-hover inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    plan.popular 
                      ? "bg-[#1d395e] text-white hover:bg-[#2a4a6e]" 
                      : isDark
                        ? "text-blue-400 border-2 border-blue-400 hover:bg-blue-400 hover:text-gray-900"
                        : "text-[#1d395e] border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white"
                  }`}
                >
                  {t("landing.selectPackage")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== ABOUT / FAQ SECTION ===================== */
function AboutSection({ isDark }) {
  const [openFaq, setOpenFaq] = useState(null);
  const { t, language } = useTranslation();
  
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

  // Initialize scroll animations
  useScrollAnimations();

  // Page transition: fade-in saat load
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const page = document.getElementById('page-transition');
        if (page) page.classList.add('page-transition-active');
      });
    });
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  return (
    <>
      <Navbar activeSection={activeSection} isDark={isDark} />
      <div id="page-transition" className={`page-transition min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div id="landing-content">
          <HeroSection isDark={isDark} />
          <FeaturesSection isDark={isDark} />
          <PricingSection isDark={isDark} />
          <AboutSection isDark={isDark} />
          <CtaSection isDark={isDark} />
          <Footer isDark={isDark} />
        </div>
      </div>
    </>
  );
}
