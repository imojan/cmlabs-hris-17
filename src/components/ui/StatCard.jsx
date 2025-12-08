// src/components/ui/StatCard.jsx

export function StatCard({ title, value, icon: Icon, iconColor, updateDate }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg ${iconColor}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs sm:text-sm text-gray-600">{title}</p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900">{value}</p>
        <div className="bg-[#1D395E] text-white text-xs px-3 py-1.5 rounded-md inline-block whitespace-nowrap">
          Update : {updateDate}
        </div>
      </div>
    </div>
  );
}
