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
  Check
} from "lucide-react";

// Assets
import logoHris from "@/assets/images/logo-hris-2.png";
import dashboardExample from "@/assets/images/dashboard-example.png";
import waWhite from "@/assets/images/wa-white.png";
import instagramWhite from "@/assets/images/instagram-white.png";
import tiktokWhite from "@/assets/images/tiktok-white.png";
import gmailWhite from "@/assets/images/gmail-white.png";

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
function Navbar({ activeSection }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: "Beranda", href: "#beranda", id: "beranda" },
    { label: "Solusi", href: "#solusi", id: "solusi" },
    { label: "Tentang", href: "#tentang", id: "tentang" },
    { label: "Kontak", href: "#kontak", id: "kontak" },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <img 
              src={logoHris} 
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
                  activeSection === link.id ? 'text-[#1d395e] active' : 'text-gray-600 hover:text-[#1d395e]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button className="flex items-center gap-1 text-gray-600 hover:text-[#1d395e] px-2 py-1 rounded-lg hover:bg-gray-100 transition-all duration-300">
              <Globe size={18} />
              <span className="text-sm">ID</span>
            </button>
            <button
              onClick={() => handleNavigate("/auth/sign-in")}
              className="text-[15px] text-gray-700 hover:text-[#1d395e] font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Sign In
            </button>
            <button
              onClick={handleWhatsApp}
              className="btn-hover flex items-center gap-2 bg-[#1d395e] text-white text-[14px] font-semibold px-4 py-2 rounded-lg"
            >
              Hubungi Sales
            </button>
            <button
              onClick={() => handleNavigate("/auth/sign-up")}
              className="btn-hover text-[14px] text-[#1d395e] font-semibold px-4 py-2 rounded-lg border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white transition-all duration-300"
            >
              Coba Gratis
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden bg-white border-t shadow-lg overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className={`block w-full text-left text-[16px] font-medium py-2 px-3 rounded-lg transition-all duration-300 ${
                activeSection === link.id ? 'text-[#1d395e] bg-[#1d395e]/10' : 'text-gray-700 hover:text-[#1d395e] hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <hr className="my-3" />
          <button onClick={() => { handleNavigate("/auth/sign-in"); setMobileMenuOpen(false); }} className="block w-full text-left text-[16px] text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-50">Sign In</button>
          <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-2 bg-[#1d395e] text-white text-[14px] font-semibold px-4 py-3 rounded-lg">Hubungi Sales</button>
          <button onClick={() => { handleNavigate("/auth/sign-up"); setMobileMenuOpen(false); }} className="w-full text-[14px] text-[#1d395e] font-semibold px-4 py-3 rounded-lg border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white transition-all duration-300">Coba Gratis</button>
        </div>
      </div>
    </nav>
  );
}

/* ===================== HERO SECTION ===================== */
function HeroSection() {
  const navigate = useNavigate();

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
    <section id="beranda" className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left" data-animate="fade-right">
            <p className="text-[#1d395e] font-semibold text-sm uppercase tracking-wider mb-3">
              Aplikasi HRIS
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1d395e] leading-tight mb-6">
              Tinggalkan arsip fisik,<br />
              gunakan software HRIS online
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Kelola operasional HR, mulai dari sistem database karyawan hingga rekrutmen, dalam satu aplikasi HRIS komprehensif berbasis cloud yang aman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleWhatsApp}
                className="btn-hover ripple flex items-center justify-center gap-2 bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg"
              >
                <img src={waWhite} alt="WhatsApp" className="w-5 h-5" />
                WhatsApp Sales
              </button>
              <button
                onClick={() => handleNavigate("/auth/sign-up")}
                className="btn-hover text-[#1d395e] font-semibold px-6 py-3 rounded-lg border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white transition-all duration-300"
              >
                Coba Gratis
              </button>
            </div>
          </div>

          {/* Right Content - Dashboard Image */}
          <div className="relative" data-animate="fade-left" data-animate-delay="200">
            <div className="bg-gray-50 rounded-2xl p-4 shadow-xl card-hover hover-float">
              <img src={dashboardExample} alt="HRIS Dashboard" className="w-full h-auto rounded-lg" />
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#1d395e]/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== FEATURES SECTION ===================== */
function FeaturesSection() {
  const features = [
    { icon: <Monitor className="w-8 h-8 text-[#1d395e]" />, title: "Akses data secara online", description: "Data disimpan dalam server berstandar keamanan internasional dan bisa diakses kapan saja secara online." },
    { icon: <MessageSquare className="w-8 h-8 text-[#1d395e]" />, title: "Kurangi miskomunikasi", description: "Kelola alur informasi, persetujuan, dan pekerjaan dalam perusahaan secara menyeluruh." },
    { icon: <Users className="w-8 h-8 text-[#1d395e]" />, title: "Automasikan rekrutmen", description: "Pastikan tidak ada yang terlewat dalam proses rekrutmen sampai offboarding dengan mengurangi dokumen fisik." },
  ];

  return (
    <section id="solusi" className="py-16 lg:py-24 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-animate="fade-up">
          <p className="text-[#1d395e] text-sm font-medium mb-2">Serba cepat dengan pengelolaan HR online</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1d395e]">Manajemen data terintegrasi dengan<br />aplikasi HRIS online</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card-hover bg-white rounded-xl p-6 shadow-sm cursor-pointer" data-animate="fade-up" data-animate-delay={String((index + 1) * 150)}>
              <div className="w-16 h-16 bg-[#eef4f8] rounded-xl flex items-center justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-[#1d395e] mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== PRICING SECTION ===================== */
function PricingSection() {
  const [activeTab, setActiveTab] = useState("package");

  // Package plans (fitur lengkap)
  const packagePlans = [
    { name: "BASIC", subtitle: "Untuk bisnis kecil", popular: false, features: ["List Hadir", "GPS based attendance validation", "Employee data management", "Leave & time off request", "Overtime management", "Fixed work schedule management", "Automatic tax calculation"] },
    { name: "PREMIUM", subtitle: "Flexible & professional", popular: true, features: ["All Standard Features", "Clock in/out attendance settings", "Payroll integration", "Employee document management", "Sick leave & time off setting", "Shift management", "Overtime management (custom)"] },
    { name: "STANDART", subtitle: "Untuk tim berkembang", popular: false, features: ["List Hadir", "GPS-based attendance validation", "Employee data management", "Leave & time off request", "Overtime management", "Fixed work schedule management", "Automatic tax calculation"] },
  ];

  // Seat plans (per user pricing)
  const seatPlans = [
    { name: "STANDART", price: "Rp 12.000", unit: "/user/month", description: "This package for 1 until 51 employee", popular: false },
    { name: "PREMIUM", price: "Rp 17.000", unit: "/user/month", description: "This package for 51 until 100 employee", popular: true },
    { name: "STANDART", price: "Rp 12.000", unit: "/user/month", description: "This package for 1 until 51 employee", popular: false },
    { name: "STANDART", price: "Rp 12.000", unit: "/user/month", description: "This package for 1 until 51 employee", popular: false },
    { name: "PREMIUM", price: "Rp 17.000", unit: "/user/month", description: "This package for 51 until 100 employee", popular: true },
    { name: "STANDART", price: "Rp 12.000", unit: "/user/month", description: "This package for 1 until 51 employee", popular: false },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#1d395e] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10" data-animate="fade-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">HRIS Pricing Plans</h2>
          <p className="max-w-2xl mx-auto text-white/80">Choose the plan that best suits your business! This HRIS offers
both subscription and pay-as-you-go payment options,
available in the following packages:</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10" data-animate="fade-up" data-animate-delay="100">
          <div className="bg-white rounded-full p-1.5 flex shadow-lg">
            <button 
              onClick={() => setActiveTab("package")} 
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "package" ? "bg-[#1d395e] text-white shadow-md" : "text-gray-600 hover:text-[#1d395e]"}`}
            >
              Package
            </button>
            <button 
              onClick={() => setActiveTab("seat")} 
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "seat" ? "bg-[#e85a5a] text-white shadow-md" : "text-gray-600 hover:text-[#e85a5a]"}`}
            >
              Seat
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
              className={`card-hover bg-white rounded-2xl p-6 ${plan.popular ? "ring-2 ring-[#25d366] md:scale-105 shadow-xl" : "shadow-lg"}`}
              style={{ 
                animation: activeTab === "package" ? `fadeInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
              }}
            >
              {plan.popular && <div className="text-center mb-2"><span className="inline-block text-xs text-[#25d366] font-semibold uppercase tracking-wider animate-pulse bg-[#25d366]/10 px-3 py-1 rounded-full">Most Popular</span></div>}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#1d395e] mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm">{plan.subtitle}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600"><Check size={16} className="text-[#25d366] mt-0.5 flex-shrink-0" /><span>{feature}</span></li>
                ))}
              </ul>
              <button className={`btn-hover w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${plan.popular ? "bg-[#1d395e] text-white hover:bg-[#2a4a6e]" : "text-[#1d395e] border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white"}`}>Select Package</button>
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
              className={`card-hover bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${plan.popular ? "ring-2 ring-[#e85a5a]" : ""}`}
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
                  <span className="text-2xl font-bold text-[#1d395e]">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.unit}</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                
                {/* Select Button */}
                <button className={`btn-hover inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  plan.popular 
                    ? "bg-[#1d395e] text-white hover:bg-[#2a4a6e]" 
                    : "text-[#1d395e] border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white"
                }`}>
                  Select a Package
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
function AboutSection() {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { question: "Apakah aplikasi HRIS online?", answer: "Ya, Anda dapat mengelola segala macam operasional HR perusahaan secara online. Aplikasi menggunakan sistem berbasis cloud yang dapat diakses melalui desktop maupun mobile." },
    { question: "Apa saja fitur software HRIS online?", answer: "Fitur HRIS online mencakup manajemen data karyawan, absensi, penggajian, cuti, rekrutmen, dan pelaporan HR secara komprehensif." },
    { question: "Apakah software HRIS Online gratis?", answer: "Kami menyediakan paket Basic yang gratis untuk bisnis kecil. Untuk fitur lebih lengkap, tersedia paket berbayar dengan harga yang kompetitif." },
    { question: "Bagaimana jika saya ingin berlangganan?", answer: "Anda dapat menghubungi tim sales kami melalui WhatsApp atau mengisi form registrasi untuk memulai berlangganan." },
    { question: "Kenapa perusahaan dapat mempercayakan sistem HRIS?", answer: "Sistem kami menggunakan enkripsi tingkat enterprise dan server berstandar keamanan internasional untuk melindungi data perusahaan Anda." },
    { question: "Apa saja aplikasi HRIS terbaik bagi perusahaan?", answer: "HRIS Online adalah salah satu solusi terbaik dengan fitur lengkap, harga terjangkau, dan dukungan teknis yang responsif." },
  ];

  return (
    <section id="tentang" className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div data-animate="fade-right">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d395e] mb-6">Apa itu software HRIS?</h2>
            <div className="text-gray-600 space-y-4 leading-relaxed">
              <p>Aplikasi HRIS (Human Resource Information System) merupakan sebuah platform terintegrasi yang digunakan untuk mengelola seluruh informasi serta aktivitas terkait sumber daya manusia di dalam perusahaan.</p>
              <p>Pada dasarnya, HRIS berfungsi sebagai pusat data karyawan berbasis teknologi, umumnya berjalan di lingkungan komputasi cloud. Dengan pendekatan ini, sistem dapat diakses kapan saja dan melalui berbagai perangkat.</p>
              <p>Melalui CMLABS HRIS, konsep tersebut diimplementasikan untuk menghadirkan solusi pengelolaan SDM yang modern, responsif, dan sesuai kebutuhan operasional perusahaan.</p>
            </div>
          </div>
          <div data-animate="fade-left" data-animate-delay="200">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#1d395e]/30 hover:shadow-md ${openFaq === index ? 'bg-[#f8fafc] border-[#1d395e]/20' : ''}`}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/80 transition-all duration-300">
                    <span className={`text-[15px] font-medium transition-colors duration-300 ${openFaq === index ? 'text-[#1d395e]' : 'text-gray-800'}`}>{faq.question}</span>
                    <ChevronDown size={20} className={`flex-shrink-0 transition-all duration-300 ${openFaq === index ? 'rotate-180 text-[#1d395e]' : 'text-gray-500'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4"><p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p></div>
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
function CtaSection() {
  const navigate = useNavigate();
  const handleWhatsApp = () => window.open("https://wa.me/6281213968518?text=Halo, saya tertarik dengan HRIS Online", "_blank");
  const handleNavigate = (path) => {
    const pageWrapper = document.getElementById('page-transition');
    if (pageWrapper) { pageWrapper.classList.remove('page-transition-active'); pageWrapper.classList.add('page-transition-leave'); setTimeout(() => navigate(path), 250); }
    else navigate(path);
  };

  return (
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-animate="fade-up">
        <img src={logoHris} alt="HRIS" className="h-10 mx-auto mb-6 hover:scale-110 transition-transform duration-300 cursor-pointer" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1d395e] mb-4">Satu solusi untuk semua kebutuhan HR Anda</h2>
        <p className="text-gray-600 mb-8">Optimalkan pengelolaan operasi HR Anda dengan bantuan solusi terintegrasi.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleWhatsApp} className="btn-hover ripple flex items-center justify-center gap-2 bg-[#1d395e] text-white font-semibold px-6 py-3 rounded-lg"><img src={waWhite} alt="WhatsApp" className="w-5 h-5" />WhatsApp Sales</button>
          <button onClick={() => handleNavigate("/auth/sign-up")} className="btn-hover text-[#1d395e] font-semibold px-6 py-3 rounded-lg border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white transition-all duration-300">Coba Gratis</button>
        </div>
      </div>
    </section>
  );
}

/* ===================== FOOTER ===================== */
function Footer() {
  const handleWhatsApp = () => window.open("https://wa.me/6281213968518?text=Halo, saya tertarik dengan HRIS Online", "_blank");
  const footerLinks = {
    fitur: ["Software Payroll", "Employee Self Service (ESS)", "HR Dashboard Analytics"],
    solusiBisnis: ["Hospitality", "Teknologi Informasi", "Distribusi", "Bisnis Menengah", "Enterprise"],
    insight: ["Artikel HR & Payroll", "Ebook & Whitepaper"],
    perusahaan: ["Help Center", "Hubungi Support", "Keamanan", "Pemberitahuan Privasi", "Syarat & Ketentuan"],
  };
  const offices = [
    { city: "Jakarta", address: "Mid Plaza 2, Jl. Jenderal Sudirman No.4, Jakarta 10220" },
    { city: "Surabaya", address: "Jl. Ngagel Jaya Selatan No.158, Surabaya 60294" },
    { city: "Bandung", address: "Jl. K. Yani No.371A, Bandung 40114" },
    { city: "Medan", address: "Ayani Medan" },
  ];

  return (
    <footer id="kontak" className="bg-[#F2F2F3]">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-[#1d395e]"><span className="hover:text-[#2a4a6e] cursor-pointer">Home</span> / <span className="font-medium">Aplikasi & Software HRIS Online</span></p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8" data-animate="fade-up">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <img src={logoHris} alt="HRIS" className="h-8 mb-4" />
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-sm"><img src={instagramWhite} alt="Instagram" className="w-5 h-5" /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-sm"><img src={tiktokWhite} alt="TikTok" className="w-5 h-5" /></a>
              <button onClick={handleWhatsApp} className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-sm"><img src={waWhite} alt="WhatsApp" className="w-5 h-5" /></button>
              <a href="mailto:support@hris.com" className="icon-bounce w-9 h-9 bg-gradient-to-br from-[#1d395e] to-[#3a5a7c] rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-sm"><img src={gmailWhite} alt="Gmail" className="w-5 h-5" /></a>
            </div>
          </div>
          <div><h4 className="font-semibold mb-4 text-[#1d395e]">Fitur</h4><ul className="space-y-2">{footerLinks.fitur.map((link, idx) => <li key={idx}><a href="#" className="text-sm text-[#1d395e]/80 hover:text-[#1d395e] hover:translate-x-1 inline-block transition-all duration-300">{link}</a></li>)}</ul></div>
          <div><h4 className="font-semibold mb-4 text-[#1d395e]">Solusi Bisnis</h4><ul className="space-y-2">{footerLinks.solusiBisnis.map((link, idx) => <li key={idx}><a href="#" className="text-sm text-[#1d395e]/80 hover:text-[#1d395e] hover:translate-x-1 inline-block transition-all duration-300">{link}</a></li>)}</ul></div>
          <div><h4 className="font-semibold mb-4 text-[#1d395e]">Insight</h4><ul className="space-y-2">{footerLinks.insight.map((link, idx) => <li key={idx}><a href="#" className="text-sm text-[#1d395e]/80 hover:text-[#1d395e] hover:translate-x-1 inline-block transition-all duration-300">{link}</a></li>)}</ul></div>
          <div><h4 className="font-semibold mb-4 text-[#1d395e]">Perusahaan</h4><ul className="space-y-2">{footerLinks.perusahaan.map((link, idx) => <li key={idx}><a href="#" className="text-sm text-[#1d395e]/80 hover:text-[#1d395e] hover:translate-x-1 inline-block transition-all duration-300">{link}</a></li>)}</ul></div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-300" data-animate="fade-up" data-animate-delay="200">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, idx) => <div key={idx}><h5 className="font-semibold text-sm mb-2 flex items-center gap-2 text-[#1d395e]"><MapPin size={14} />{office.city}</h5><p className="text-xs text-[#1d395e]/70 leading-relaxed">{office.address}</p></div>)}
          </div>
        </div>
      </div>
      <div className="bg-[#1d395e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2"><img src={logoHris} alt="HRIS" className="h-8 brightness-0 invert" /></div>
            <p className="text-sm text-white font-medium">© Copyright 2025 HRIS Online</p>
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
      <Navbar activeSection={activeSection} />
      <div id="page-transition" className="page-transition min-h-screen bg-white">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <AboutSection />
        <CtaSection />
        <Footer />
      </div>
    </>
  );
}
