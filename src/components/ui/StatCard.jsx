// src/components/ui/StatCard.jsx
import { useTheme } from "@/app/hooks/useTheme";

export function StatCard({ title, value, icon: Icon, iconColor, updateDate }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full`}>
      {/* Content Area */}
      <div className="p-5 lg:p-6 flex-1 flex flex-col">
        {/* Icon and Title - Side by side */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 rounded-xl ${iconColor} flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-xs lg:text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-[#1D395E]'} leading-tight`}>
            {title}
          </h3>
        </div>

        {/* Value - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <p className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
      </div>

      {/* Footer with Blue Background */}
      <div className={`${isDark ? 'bg-blue-900' : 'bg-[#1D395E]'} text-white text-xs px-5 lg:px-6 py-2.5 text-center`}>
        Update : {updateDate}
      </div>
    </div>
  );
}