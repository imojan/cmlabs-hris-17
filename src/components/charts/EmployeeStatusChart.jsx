import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useState } from 'react';
import { CustomDropdown } from '../ui/CustomDropdown';
import { useTheme } from '@/app/hooks/useTheme';

const COLORS = ['#3d5a80', '#4a8b6f', '#d4a942', '#98b4d4'];

const MONTH_OPTIONS = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

export function EmployeeStatusChart({ statusData = null, loading = false }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-US", { month: "long" });
  });

  // Default fallback data
  const defaultData = [
    { name: 'Permanen', value: 0 },
    { name: 'Percobaan', value: 0 },
    { name: 'PKWT (Kontrak)', value: 0 },
    { name: 'Magang', value: 0 },
  ];

  const data = statusData || defaultData;

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border transition-colors duration-300`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Employee Statistics</p>
          <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Employee Status</h3>
        </div>
        <CustomDropdown
          name="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          variant="dark"
          className="w-36"
          options={MONTH_OPTIONS}
        />
      </div>
      {loading ? (
        <div className="h-[280px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            barSize={50}
          >
            <XAxis type="number" tick={{ fill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontSize: 11 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontSize: 11 }}
              width={100}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1f2937' : '#fff', 
                border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                borderRadius: '8px',
                color: isDark ? '#f3f4f6' : '#111827'
              }} 
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
