import { LayoutDashboard, Users, Clock, Calendar, Settings, HelpCircle } from 'lucide-react';
import logoExpanded from "@/assets/images/logo-hris-2.png";
import logoCollapsed from "@/assets/images/logo-hris-4.png";

export function Sidebar({ isOpen, onToggle, currentPage, onNavigate }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
    { icon: Users, label: 'Employee Database', page: 'employee-database' },
    { icon: Clock, label: 'Checkclock', page: 'checkclock' },
    { icon: Calendar, label: 'Work Schedule', page: 'work-schedule' },
  ];

  const handleMenuClick = (e, page) => {
    e.stopPropagation();
    onNavigate(page);
  };

  return (
    <>
      {/* Sidebar - Floating with two states */}
      <aside 
        onClick={onToggle}
        className={`
          fixed top-4 left-4 bottom-4 bg-white rounded-2xl shadow-lg border border-gray-200/80
          transition-all duration-300 ease-in-out z-40 cursor-pointer hover:shadow-xl
          ${isOpen ? 'w-64' : 'w-15'}
        `}
      >
        <div className="flex flex-col h-full py-6 px-4">
          {/* Logo Area */}
          <div className={`mb-8 transition-all duration-300 ${isOpen ? '' : 'flex justify-center'}`}>
            <div className="flex flex-col items-center gap-3">
              <img 
                src={isOpen ? logoExpanded : logoCollapsed}
                alt="HRIS Logo" 
                className={`object-contain transition-all duration-200 ${isOpen ? 'w-30 h-auto' : 'w-8 h-auto'}`}
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
                  w-full flex items-center transition-all duration-300 cursor-pointer pointer-events-auto
                  ${currentPage === item.page
                    ? 'text-[#1D395E]' 
                    : 'text-gray-400 hover:text-gray-600'
                  }
                  ${isOpen ? 'gap-4 justify-start' : 'justify-center'}
                `}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon
                  className={`flex-shrink-0 transition-all ${isOpen ? 'w-6 h-6' : 'w-6 h-6'}`}
                  strokeWidth={currentPage === item.page ? 2.5 : 2}
                />
                {isOpen && (
                  <span className={`text-sm whitespace-nowrap transition-opacity duration-300 ${currentPage === item.page ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="pt-2 mt-auto space-y-3">
            <div 
              className={`
                w-full flex items-center text-gray-400 transition-all duration-300
                ${isOpen ? 'gap-4 justify-start' : 'justify-center'}
              `}
              title={!isOpen ? 'Bantuan' : undefined}
            >
              <HelpCircle className={`flex-shrink-0 ${isOpen ? 'w-6 h-6' : 'w-7 h-7'}`} strokeWidth={2} />
              {isOpen && <span className="text-sm font-medium">Bantuan(?)</span>}
            </div>
            <div 
              className={`
                w-full flex items-center text-gray-400 transition-all duration-300
                ${isOpen ? 'gap-4 justify-start' : 'justify-center'}
              `}
              title={!isOpen ? 'Setting' : undefined}
            >
              <Settings className={`flex-shrink-0 ${isOpen ? 'w-6 h-6' : 'w-7 h-7'}`} strokeWidth={2} />
              {isOpen && <span className="text-sm font-medium">Setting</span>}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
