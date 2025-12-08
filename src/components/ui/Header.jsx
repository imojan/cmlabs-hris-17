import { Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';

export function Header({ title = 'Dashboard' }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 w-full">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-light text-[#1D395E] truncate">{title}</h1>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#1D395E]" />
              </div>
            </button>

            {/* User Profile with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm sm:text-base">SA</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900">Salma</p>
                  <p className="text-xs text-gray-500">User</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info in Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Salma</p>
                      <p className="text-xs text-gray-500 mt-0.5">User</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                        onClick={() => {
                          console.log('Account Settings clicked');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        <span>Account Settings</span>
                      </button>
                      
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                        onClick={() => {
                          console.log('Logout clicked');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari"
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}

// Demo wrapper untuk menampilkan header
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Dashboard" />
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-4">Content Area</h2>
        <p className="text-gray-600">
          Header sekarang memiliki background putih yang memenuhi seluruh layar dengan dropdown yang menarik untuk profil user.
        </p>
      </div>
    </div>
  );
}