import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { CustomDropdown } from './CustomDropdown';

const attendanceData = [
  { no: 1, nama: 'Johan', status: 'Ontime', checkIn: '08.00', statusColor: 'bg-indigo-500' },
  { no: 2, nama: 'Timothy', status: 'Izin', checkIn: '09.00', statusColor: 'bg-blue-500' },
  { no: 3, nama: 'Bob Doe', status: 'Late', checkIn: '08.15', statusColor: 'bg-red-400' },
  { no: 4, nama: 'Timothy', status: 'Late', checkIn: '08.15', statusColor: 'bg-red-400' },
];

export function AttendanceTable() {
  const [selectedMonth, setSelectedMonth] = useState('Select Month');

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Attendance</h3>
        <div className="flex items-center gap-2">
          <CustomDropdown
            name="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            variant="dark"
            className="w-36"
            placeholder="Select Month"
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
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ExternalLink className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-gray-700 font-medium">142 Ontime</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-gray-700 font-medium">4 Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3cc3df]" />
          <span className="text-gray-700 font-medium">9 Absent</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1D395E] text-white">
              <th className="text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-tl-xl">No</th>
              <th className="text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold">Nama</th>
              <th className="text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold">Status Kehadiran</th>
              <th className="text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-tr-xl">Check In</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((row, index) => (
              <tr 
                key={index} 
                className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 font-medium">{row.no}</td>
                <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 font-medium">{row.nama}</td>
                <td className="px-3 sm:px-4 py-3">
                  <span className={`${row.statusColor} text-white text-xs px-3 py-1.5 rounded-full font-medium inline-block`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 font-medium">{row.checkIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}