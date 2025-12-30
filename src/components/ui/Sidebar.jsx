import { LayoutDashboard, Users, Clock, Calendar, Settings, Headphones } from 'lucide-react';
import logoExpanded from "@/assets/images/logo-hris-2.png";
import logoCollapsed from "@/assets/images/logo-hris-4.png";

export function Sidebar({ isOpen, onToggle, currentPage, onNavigate }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
    { icon: Users, label: 'Employee Database', page: 'employee-database' },
    { icon: Clock, label: 'Checkclock', page: 'checkclock' },
    { icon: Calendar, label: 'Work Schedule', page: 'work-schedule' },
  ];

  const bottomMenuItems = [
    { icon: Headphones, label: 'FAQ & Help', page: 'faq-help' },
    { icon: Settings, label: 'Setting', page: 'settings' },
  ];

  const handleMenuClick = (e, page) => {
    e.stopPropagation();
    onNavigate(page);
  };

  return (
    <>
      {/* Sidebar - Floating with smooth animations */}
      <aside 
        onClick={onToggle}
        className={`
          fixed top-4 left-4 bottom-4 bg-white rounded-2xl shadow-lg border border-gray-200/80
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
                src={isOpen ? logoExpanded : logoCollapsed}
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
                  ${currentPage === item.page
                    ? 'text-[#1D395E] bg-[#1D395E]/5' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }
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
                  ${currentPage === item.page
                    ? 'text-[#1D395E] bg-[#1D395E]/5' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }
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