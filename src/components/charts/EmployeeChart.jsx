import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';
import { CustomDropdown } from '../ui/CustomDropdown';

const monthlyData = {
  'January': [
    { name: 'New', value: 20 },
    { name: 'Active', value: 15 },
    { name: 'Resign', value: 8 },
  ],
  'February': [
    { name: 'New', value: 18 },
    { name: 'Active', value: 22 },
    { name: 'Resign', value: 5 },
  ],
  'March': [
    { name: 'New', value: 25 },
    { name: 'Active', value: 19 },
    { name: 'Resign', value: 12 },
  ],
  'April': [
    { name: 'New', value: 22 },
    { name: 'Active', value: 28 },
    { name: 'Resign', value: 7 },
  ],
  'May': [
    { name: 'New', value: 30 },
    { name: 'Active', value: 25 },
    { name: 'Resign', value: 10 },
  ],
  'June': [
    { name: 'New', value: 27 },
    { name: 'Active', value: 32 },
    { name: 'Resign', value: 6 },
  ],
  'July': [
    { name: 'New', value: 23 },
    { name: 'Active', value: 29 },
    { name: 'Resign', value: 9 },
  ],
  'August': [
    { name: 'New', value: 26 },
    { name: 'Active', value: 24 },
    { name: 'Resign', value: 11 },
  ],
  'September': [
    { name: 'New', value: 21 },
    { name: 'Active', value: 27 },
    { name: 'Resign', value: 8 },
  ],
  'October': [
    { name: 'New', value: 24 },
    { name: 'Active', value: 31 },
    { name: 'Resign', value: 7 },
  ],
  'November': [
    { name: 'New', value: 28 },
    { name: 'Active', value: 26 },
    { name: 'Resign', value: 10 },
  ],
  'December': [
    { name: 'New', value: 20 },
    { name: 'Active', value: 23 },
    { name: 'Resign', value: 9 },
  ],
};

const COLORS = ['#d4a942', '#4a8b6f', '#a94442'];

export function EmployeeChart() {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const data = monthlyData[selectedMonth];

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
          options={[
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
          ]}
        />
      </div>
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={100}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,26,0.1)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'rgba(0,0,0,0.7)', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: 'rgba(0,0,0,0.7)', fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}