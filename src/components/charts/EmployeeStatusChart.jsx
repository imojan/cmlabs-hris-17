import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const monthlyData = {
  'January': [
    { name: 'Permanen', value: 43 },
    { name: 'Percobaan', value: 38 },
    { name: 'PKWT (Kontrak)', value: 52 },
    { name: 'Magang', value: 67 },
  ],
  'February': [
    { name: 'Permanen', value: 45 },
    { name: 'Percobaan', value: 42 },
    { name: 'PKWT (Kontrak)', value: 48 },
    { name: 'Magang', value: 70 },
  ],
  'March': [
    { name: 'Permanen', value: 47 },
    { name: 'Percobaan', value: 40 },
    { name: 'PKWT (Kontrak)', value: 55 },
    { name: 'Magang', value: 73 },
  ],
  'April': [
    { name: 'Permanen', value: 50 },
    { name: 'Percobaan', value: 35 },
    { name: 'PKWT (Kontrak)', value: 50 },
    { name: 'Magang', value: 68 },
  ],
  'May': [
    { name: 'Permanen', value: 48 },
    { name: 'Percobaan', value: 43 },
    { name: 'PKWT (Kontrak)', value: 58 },
    { name: 'Magang', value: 75 },
  ],
  'June': [
    { name: 'Permanen', value: 52 },
    { name: 'Percobaan', value: 37 },
    { name: 'PKWT (Kontrak)', value: 53 },
    { name: 'Magang', value: 72 },
  ],
  'July': [
    { name: 'Permanen', value: 46 },
    { name: 'Percobaan', value: 41 },
    { name: 'PKWT (Kontrak)', value: 56 },
    { name: 'Magang', value: 69 },
  ],
  'August': [
    { name: 'Permanen', value: 49 },
    { name: 'Percobaan', value: 39 },
    { name: 'PKWT (Kontrak)', value: 51 },
    { name: 'Magang', value: 74 },
  ],
  'September': [
    { name: 'Permanen', value: 44 },
    { name: 'Percobaan', value: 44 },
    { name: 'PKWT (Kontrak)', value: 54 },
    { name: 'Magang', value: 71 },
  ],
  'October': [
    { name: 'Permanen', value: 51 },
    { name: 'Percobaan', value: 36 },
    { name: 'PKWT (Kontrak)', value: 57 },
    { name: 'Magang', value: 76 },
  ],
  'November': [
    { name: 'Permanen', value: 47 },
    { name: 'Percobaan', value: 40 },
    { name: 'PKWT (Kontrak)', value: 52 },
    { name: 'Magang', value: 70 },
  ],
  'December': [
    { name: 'Permanen', value: 45 },
    { name: 'Percobaan', value: 38 },
    { name: 'PKWT (Kontrak)', value: 50 },
    { name: 'Magang', value: 68 },
  ],
};

const COLORS = ['#3d5a80', '#4a8b6f', '#d4a942', '#98b4d4'];

export function EmployeeStatusChart() {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const data = monthlyData[selectedMonth];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Employee Statistics</p>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Employee Status</h3>
        </div>
        <div className="relative">
          <select 
            className="appearance-none bg-[#1D395E] text-white text-sm font-medium px-4 py-2 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          barSize={50}
        >
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 11 }}
            width={100}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}