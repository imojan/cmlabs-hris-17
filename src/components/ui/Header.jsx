import { Search, Bell, ChevronDown } from 'lucide-react';
import UserProfileMini from "@/components/UserProfileMini";


export function Header({ title = 'Dashboard' }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
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

          {/* User Profile */}
            <UserProfileMini />
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
    </header>
  );
}
