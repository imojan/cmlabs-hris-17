import { useState } from "react";
import { ChevronDown, Phone, MessageCircle } from "lucide-react";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useTheme } from "@/app/hooks/useTheme";

// Assets
import waWhite from "@/assets/images/wa-white.png";
import emailWhite from "@/assets/images/email-white.png";

/* ===================== FAQ & HELP PAGE ===================== */
// userRole prop: "admin" | "user" | "employee"
// - Jika admin: tampilkan tab switcher untuk melihat FAQ admin & employee
// - Jika user/employee: hanya tampilkan FAQ employee (tanpa tab switcher)
export default function FaqHelpAdmin({ userRole = "admin" }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isAdmin = userRole === "admin";
  const [activeTab, setActiveTab] = useState(isAdmin ? "admin" : "user");
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ untuk Admin - using translations
  const adminFaqs = [
    {
      category: t("faq.dashboardNav"),
      questions: [
        { question: t("faq.adminQ1"), answer: t("faq.adminA1") },
        { question: t("faq.adminQ2"), answer: t("faq.adminA2") },
        { question: t("faq.adminQ3"), answer: t("faq.adminA3") },
      ]
    },
    {
      category: t("faq.employeeManagement"),
      questions: [
        { question: t("faq.adminQ4"), answer: t("faq.adminA4") },
        { question: t("faq.adminQ5"), answer: t("faq.adminA5") },
        { question: t("faq.adminQ6"), answer: t("faq.adminA6") },
        { question: t("faq.adminQ7"), answer: t("faq.adminA7") },
      ]
    },
    {
      category: t("faq.checkclockAttendance"),
      questions: [
        { question: t("faq.adminQ8"), answer: t("faq.adminA8") },
        { question: t("faq.adminQ9"), answer: t("faq.adminA9") },
        { question: t("faq.adminQ10"), answer: t("faq.adminA10") },
        { question: t("faq.adminQ11"), answer: t("faq.adminA11") },
      ]
    },
    {
      category: t("faq.workSchedule"),
      questions: [
        { question: t("faq.adminQ12"), answer: t("faq.adminA12") },
        { question: t("faq.adminQ13"), answer: t("faq.adminA13") },
      ]
    },
    {
      category: t("faq.troubleshooting"),
      questions: [
        { question: t("faq.adminQ14"), answer: t("faq.adminA14") },
        { question: t("faq.adminQ15"), answer: t("faq.adminA15") },
        { question: t("faq.adminQ16"), answer: t("faq.adminA16") },
      ]
    },
  ];

  // FAQ untuk User/Employee - using translations
  const userFaqs = [
    {
      category: t("faq.dashboardProfile"),
      questions: [
        { question: t("faq.userQ1"), answer: t("faq.userA1") },
        { question: t("faq.userQ2"), answer: t("faq.userA2") },
        { question: t("faq.userQ3"), answer: t("faq.userA3") },
      ]
    },
    {
      category: t("faq.attendanceCheckclock"),
      questions: [
        { question: t("faq.userQ4"), answer: t("faq.userA4") },
        { question: t("faq.userQ5"), answer: t("faq.userA5") },
        { question: t("faq.userQ6"), answer: t("faq.userA6") },
        { question: t("faq.userQ7"), answer: t("faq.userA7") },
        { question: t("faq.userQ8"), answer: t("faq.userA8") },
      ]
    },
    {
      category: t("faq.scheduleLeave"),
      questions: [
        { question: t("faq.userQ9"), answer: t("faq.userA9") },
        { question: t("faq.userQ10"), answer: t("faq.userA10") },
        { question: t("faq.userQ11"), answer: t("faq.userA11") },
      ]
    },
    {
      category: t("faq.troubleshooting"),
      questions: [
        { question: t("faq.userQ12"), answer: t("faq.userA12") },
        { question: t("faq.userQ13"), answer: t("faq.userA13") },
        { question: t("faq.userQ14"), answer: t("faq.userA14") },
      ]
    },
  ];

  const currentFaqs = activeTab === "admin" ? adminFaqs : userFaqs;

  const handleWhatsApp = (number) => {
    window.open(`https://wa.me/${number}?text=Halo, saya butuh bantuan terkait HRIS`, "_blank");
  };

  const handleEmail = () => {
    window.open("mailto:business@cmlabs.co?subject=HRIS Support Request", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-[#1D395E]'}`}>{t("faq.pageTitle")}</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t("faq.subtitle")}</p>
          </div>
          
          {/* Tab Switcher - Only show for Admin */}
          {isAdmin && (
            <div className={`rounded-full p-1.5 flex ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <button 
                onClick={() => { setActiveTab("admin"); setOpenFaq(null); }}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "admin" 
                    ? "bg-[#1d395e] text-white shadow-md" 
                    : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-[#1d395e]"
                }`}
              >
                {t("faq.adminTab")}
              </button>
              <button 
                onClick={() => { setActiveTab("user"); setOpenFaq(null); }}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "user" 
                    ? "bg-[#2D5F3F] text-white shadow-md" 
                    : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-[#2D5F3F]"
                }`}
              >
                {t("faq.employeeTab")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          {currentFaqs.map((category, catIndex) => (
            <div key={catIndex} className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              {/* Category Header */}
              <div className={`px-6 py-4 border-b ${
                isDark 
                  ? `border-gray-700 ${activeTab === "admin" ? "bg-[#1d395e]/20" : "bg-[#2D5F3F]/20"}`
                  : `border-gray-100 ${activeTab === "admin" ? "bg-[#1d395e]/5" : "bg-[#2D5F3F]/5"}`
              }`}>
                <h2 className={`text-lg font-semibold ${
                  activeTab === "admin" 
                    ? isDark ? "text-blue-400" : "text-[#1d395e]"
                    : isDark ? "text-emerald-400" : "text-[#2D5F3F]"
                }`}>
                  {category.category}
                </h2>
              </div>
              
              {/* Questions */}
              <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {category.questions.map((faq, faqIndex) => {
                  const uniqueKey = `${catIndex}-${faqIndex}`;
                  const isOpen = openFaq === uniqueKey;
                  
                  return (
                    <div key={faqIndex} className="transition-all duration-300">
                      <button 
                        onClick={() => setOpenFaq(isOpen ? null : uniqueKey)}
                        className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-all duration-300 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/80'}`}
                      >
                        <span className={`text-[15px] font-medium pr-4 transition-colors duration-300 ${
                          isOpen 
                            ? (activeTab === "admin" 
                                ? isDark ? "text-blue-400" : "text-[#1d395e]"
                                : isDark ? "text-emerald-400" : "text-[#2D5F3F]") 
                            : isDark ? "text-gray-200" : "text-gray-800"
                        }`}>
                          {faq.question}
                        </span>
                        <ChevronDown 
                          size={20} 
                          className={`flex-shrink-0 transition-all duration-300 ${
                            isOpen 
                              ? `rotate-180 ${activeTab === "admin" 
                                  ? isDark ? "text-blue-400" : "text-[#1d395e]"
                                  : isDark ? "text-emerald-400" : "text-[#2D5F3F]"}` 
                              : isDark ? "text-gray-500" : "text-gray-400"
                          }`} 
                        />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}>
                        <div className="px-4 md:px-5 pb-4 md:pb-5">
                          <p className={`text-sm leading-relaxed rounded-lg p-4 ${isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-50'}`}>
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Center - Takes 1 column */}
        <div className="space-y-4">
          {/* Contact Card */}
          <div className={`rounded-2xl shadow-sm border p-6 sticky top-24 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-blue-900/30' : 'bg-[#1d395e]/10'}`}>
                <Phone className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-[#1d395e]'}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>{t("faq.needMoreHelp")}</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t("faq.supportTeamReady")}</p>
            </div>
            
            <div className="space-y-3">
              {/* WhatsApp 1 */}
              <button 
                onClick={() => handleWhatsApp("6281213968518")}
                className="w-full flex items-center gap-3 bg-[#237047] hover:bg-[#20bd5a] text-white rounded-xl px-4 py-3 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src={waWhite} alt="WhatsApp" className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{t("faq.whatsappSupport")} 1</p>
                  <p className="text-xs opacity-90">+62 812-1396-8518</p>
                </div>
              </button>

              {/* WhatsApp 2 */}
              <button 
                onClick={() => handleWhatsApp("6285712813983")}
                className="w-full flex items-center gap-3 bg-[#237047] hover:bg-[#20bd5a] text-white rounded-xl px-4 py-3 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src={waWhite} alt="WhatsApp" className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{t("faq.whatsappSupport")} 2</p>
                  <p className="text-xs opacity-90">+62 857-1281-3983</p>
                </div>
              </button>

              {/* Email */}
              <button 
                onClick={handleEmail}
                className="w-full flex items-center gap-3 bg-[#1d395e] hover:bg-[#2a4a6e] text-white rounded-xl px-4 py-3 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src={emailWhite} alt="Email" className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{t("faq.emailSupport")}</p>
                  <p className="text-xs opacity-90">business@cmlabs.co</p>
                </div>
              </button>
            </div>

            {/* Working Hours */}
            <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{t("faq.operationalHours")}</h4>
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-[#1d395e]'}`}>{t("faq.support247")}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t("faq.teamAlwaysReady")}</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex gap-3">
                <MessageCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{t("faq.quickTips")}</p>
                  <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    {t("faq.quickTipsText")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
