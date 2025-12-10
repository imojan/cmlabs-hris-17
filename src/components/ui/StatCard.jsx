// src/components/ui/StatCard.jsx

export function StatCard({ title, value, icon: Icon, iconColor, updateDate }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      {/* Content Area */}
      <div className="p-5 lg:p-6 flex-1 flex flex-col">
        {/* Icon and Title - Side by side */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 rounded-xl ${iconColor} flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xs lg:text-sm font-semibold text-[#1D395E] leading-tight">
            {title}
          </h3>
        </div>

        {/* Value - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-3xl lg:text-4xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>

      {/* Footer with Blue Background */}
      <div className="bg-[#1D395E] text-white text-xs px-5 lg:px-6 py-2.5 text-center">
        Update : {updateDate}
      </div>
    </div>
  );
}