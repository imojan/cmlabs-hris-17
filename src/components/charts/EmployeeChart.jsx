import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';
import { CustomDropdown } from '../ui/CustomDropdown';

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
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-US", { month: "long" });
  });

  // Default fallback data
  const defaultData = {
    'January': [{ name: 'New', value: 0 }, { name: 'Active', value: 0 }, { name: 'Resign', value: 0 }],
  };

  const dataSource = monthlyData || defaultData;
  const data = dataSource[selectedMonth] || [
    { name: 'New', value: 0 },
    { name: 'Active', value: 0 },
    { name: 'Resign', value: 0 },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Employee Statistics</p>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Current Number of Employees</h3>
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,26,0.1)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(0,0,0,0.7)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'rgba(0,0,0,0.7)', fontSize: 12 }} />
              <Tooltip />
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
