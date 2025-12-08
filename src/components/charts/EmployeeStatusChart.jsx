import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Permanen', value: 43.62, color: '#c74c62' },
  { name: 'Percobaan', value: 43.2, color: '#c7586e' },
  { name: 'PKWT (Kontrak)', value: 43.2, color: '#c76479' },
  { name: 'Magang', value: 93.74, color: '#c77085' },
];

export function EmployeeStatusChart() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <div className="mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-gray-500">Employee Statistics</p>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Employee Status</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 11 }}
            width={70}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
