import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState, useMemo } from 'react';
import { CustomDropdown } from '../ui/CustomDropdown';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useTheme } from '@/app/hooks/useTheme';

const COLORS = ['#d4a942', '#4a8b6f', '#a94442'];

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

export function EmployeeChart({ monthlyData = null, loading = false }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-US", { month: "long" });
  });

  // Transform raw API data to chart format with translations
  const transformedData = useMemo(() => {
    if (!monthlyData || !Array.isArray(monthlyData)) return null;
    
    const result = {};
    monthlyData.forEach((item) => {
      result[item.month] = [
        { name: t("dashboard.new"), value: item.new },
        { name: t("dashboard.active"), value: item.active },
        { name: t("dashboard.resign"), value: item.resign },
      ];
    });
    return result;
  }, [monthlyData, t]);

  // Default fallback data
  const defaultData = {
    'January': [
      { name: t("dashboard.new"), value: 0 }, 
      { name: t("dashboard.active"), value: 0 }, 
      { name: t("dashboard.resign"), value: 0 }
    ],
  };

  const dataSource = transformedData || defaultData;
  const data = dataSource[selectedMonth] || [
    { name: t("dashboard.new"), value: 0 },
    { name: t("dashboard.active"), value: 0 },
    { name: t("dashboard.resign"), value: 0 },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border transition-colors duration-300`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Employee Statistics</p>
          <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Current Number of Employees</h3>
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
      <div className="flex justify-center">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barSize={100}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,26,0.1)'} />
              <XAxis dataKey="name" tick={{ fill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontSize: 12 }} />
              <YAxis tick={{ fill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : '#fff', 
                  border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: isDark ? '#f3f4f6' : '#111827'
                }} 
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
