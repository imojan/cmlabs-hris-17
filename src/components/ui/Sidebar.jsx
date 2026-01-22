import { LayoutDashboard, Users, Clock, Calendar, Settings, Headphones } from 'lucide-react';
import logoExpanded from "@/assets/images/logo-hris-2.png";
import logoExpandedWhite from "@/assets/images/hris-putih.png";
import logoCollapsed from "@/assets/images/logo-hris-4.png";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useTheme } from "@/app/hooks/useTheme";

export function Sidebar({ isOpen, onToggle, currentPage, onNavigate, role = "admin" }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Menu items based on role
  const adminMenuItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), page: 'dashboard' },
    { icon: Users, label: t("nav.employeeDatabase"), page: 'employee-database' },
    { icon: Clock, label: t("nav.checkclock"), page: 'checkclock' },
    { icon: Calendar, label: t("nav.workSchedule"), page: 'work-schedule' },
  ];

  const userMenuItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), page: 'dashboard' },
    { icon: Clock, label: t("nav.checkclock"), page: 'checkclock' },
  ];

  // Use menu items based on role
  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  const bottomMenuItems = [
    { icon: Headphones, label: t("nav.faqHelp"), page: 'faq-help' },
    { icon: Settings, label: t("nav.settings"), page: 'settings' },
  ];

  const handleMenuClick = (e, page) => {
    e.stopPropagation();
    onNavigate(page);
  };

  // Dynamic styles based on theme
  const sidebarBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/80';
  const menuActive = isDark ? 'text-blue-400 bg-blue-900/20' : 'text-[#1D395E] bg-[#1D395E]/5';
  const menuInactive = isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50';

  return (
    <>
      {/* Sidebar - Floating with smooth animations */}
      <aside 
        onClick={onToggle}
        className={`
          fixed top-4 left-4 bottom-4 ${sidebarBg} rounded-2xl shadow-lg border
          transition-all duration-500 ease-out z-40 cursor-pointer hover:shadow-xl
          ${isOpen ? 'w-64' : 'w-20'}
        `}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="flex flex-col h-full py-6 px-4">
          {/* Logo Area */}
          <div className={`mb-8 flex justify-center transition-all duration-500 ease-out`}>
            <div className="flex flex-col items-center gap-3 overflow-hidden">
              <img 
                src={isOpen ? (isDark ? logoExpandedWhite : logoExpanded) : logoCollapsed}
                alt="HRIS Logo" 
                className={`
                  object-contain transition-all duration-500 ease-out
                  ${isOpen ? 'w-32 h-auto opacity-100' : 'w-10 h-auto opacity-100'}
                `}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={(e) => handleMenuClick(e, item.page)}
                className={`
                  w-full flex items-center transition-all duration-300 ease-out cursor-pointer pointer-events-auto
                  rounded-xl px-3 py-2.5
                  ${currentPage === item.page ? menuActive : menuInactive}
                  ${isOpen ? 'gap-4 justify-start' : 'justify-center'}
                `}
                title={!isOpen ? item.label : undefined}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <item.icon
                  className={`
                    flex-shrink-0 transition-all duration-300 ease-out
                    ${isOpen ? 'w-5 h-5' : 'w-6 h-6'}
                  `}
                  strokeWidth={currentPage === item.page ? 2.5 : 2}
                />
                <span 
                  className={`
                    text-sm whitespace-nowrap transition-all duration-300 ease-out
                    ${currentPage === item.page ? 'font-semibold' : 'font-medium'}
                    ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0'}
                  `}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="pt-2 mt-auto space-y-3">
            {bottomMenuItems.map((item, index) => (
              <div 
                key={index}
                onClick={(e) => handleMenuClick(e, item.page)}
                className={`
                  w-full flex items-center transition-all duration-300 ease-out cursor-pointer pointer-events-auto
                  rounded-xl px-3 py-2.5
                  ${currentPage === item.page ? menuActive : menuInactive}
                  ${isOpen ? 'gap-4 justify-start' : 'justify-center'}
                `}
                title={!isOpen ? item.label : undefined}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <item.icon 
                  className={`
                    flex-shrink-0 transition-all duration-300 ease-out
                    ${isOpen ? 'w-5 h-5' : 'w-6 h-6'}
                  `} 
                  strokeWidth={currentPage === item.page ? 2.5 : 2} 
                />
                <span 
                  className={`
                    text-sm whitespace-nowrap transition-all duration-300 ease-out
                    ${currentPage === item.page ? 'font-semibold' : 'font-medium'}
                    ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0'}
                  `}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}