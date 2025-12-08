import { ExternalLink } from 'lucide-react';

const attendanceData = [
  { no: 1, nama: 'Johan', status: 'Ontime', checkIn: '08.00', statusColor: 'bg-indigo-500' },
  { no: 2, nama: 'Timothy', status: 'Izin', checkIn: '09.00', statusColor: 'bg-blue-500' },
  { no: 3, nama: 'Bob Doe', status: 'Late', checkIn: '08.15', statusColor: 'bg-red-400' },
  { no: 4, nama: 'Timothy', status: 'Late', checkIn: '08.15', statusColor: 'bg-red-400' },
];

export function AttendanceTable() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Attendance</h3>
        <div className="flex items-center gap-2">
          <select className="bg-[#1D395E] text-white text-xs sm:text-sm px-3 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
          </select>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-5 lg:-mx-6">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1D395E] text-white">
              <th className="text-left px-4 sm:px-5 lg:px-6 py-3 text-xs sm:text-sm rounded-tl-lg">No</th>
              <th className="text-left px-4 sm:px-5 lg:px-6 py-3 text-xs sm:text-sm">Nama</th>
              <th className="text-left px-4 sm:px-5 lg:px-6 py-3 text-xs sm:text-sm">Status Kehadiran</th>
              <th className="text-left px-4 sm:px-5 lg:px-6 py-3 text-xs sm:text-sm rounded-tr-lg">Check In</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 sm:px-5 lg:px-6 py-3 text-xs sm:text-sm text-gray-700">{row.no}</td>
                <td className="px-4 sm:px-5 lg:px-6 py-3 text-xs sm:text-sm text-gray-700">{row.nama}</td>
                <td className="px-4 sm:px-5 lg:px-6 py-3">
                  <span className={`${row.statusColor} text-white text-xs px-2.5 py-1 rounded-full inline-block`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 sm:px-5 lg:px-6 py-3 text-xs sm:text-sm text-gray-700">{row.checkIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
