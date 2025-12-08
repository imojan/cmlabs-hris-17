import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Ontime', value: 142, color: '#6366f1' },
  { name: 'Late', value: 4, color: '#f87171' },
  { name: 'Absent', value: 9, color: '#3cc3df' },
];

export function AttendanceChart() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Statistics</p>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Attendance</h3>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-0">
          <p>Today</p>
          <p className="font-medium">01/12/2024</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => `${value}: ${entry.payload.value}`}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#6366f1]" />
            <span className="text-sm sm:text-base font-medium">{data[0].value}</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Ontime</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#f87171]" />
            <span className="text-sm sm:text-base font-medium">{data[1].value}</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Late</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#3cc3df]" />
            <span className="text-sm sm:text-base font-medium">{data[2].value}</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Absent</p>
        </div>
      </div>
    </div>
  );
}
