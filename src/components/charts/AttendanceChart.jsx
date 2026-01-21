import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const defaultData = [
  { name: 'Ontime', value: 0, color: '#6366f1' },
  { name: 'Late', value: 0, color: '#f87171' },
  { name: 'Absent', value: 0, color: '#3cc3df' },
];

export function AttendanceChart({ attendanceData = null, date = null, loading = false }) {
  const data = attendanceData || defaultData;
  
  // Format date for display
  const displayDate = date 
    ? new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
    : new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Statistics</p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Attendance</h3>
        </div>
        <div className="text-xs text-gray-600 mt-2 sm:mt-0">
          <p className="text-gray-500">Today</p>
          <p className="font-semibold text-gray-900">{displayDate}</p>
        </div>
      </div>
      
      {/* Chart Container */}
      {loading ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* Legend Section */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700 font-medium">
              {item.name}: <span className="font-semibold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}