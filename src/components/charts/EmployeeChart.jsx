import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'New', '2020': 92.42, '2021': 72.03 },
  { name: 'Active', '2020': 35.88, '2021': 76.58 },
  { name: 'Resign', '2020': 43.78, '2021': 15.74 },
];

export function EmployeeChart() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Employee Statistics</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,26,0.1)" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'rgba(0,0,0,0.7)', fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: 'rgba(0,0,0,0.7)', fontSize: 12 }}
          />
          <Tooltip />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <Bar dataKey="2020" fill="#b93c54" opacity={0.8} />
          <Bar dataKey="2021" fill="rgba(185,60,84,0.28)" opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
