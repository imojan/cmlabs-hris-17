import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { CustomDropdown } from './CustomDropdown';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/app/hooks/useTheme';

const defaultAttendanceData = [];

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'ON_TIME':
    case 'ONTIME':
      return 'bg-indigo-500';
    case 'LATE':
      return 'bg-red-400';
    case 'IZIN':
    case 'LEAVE':
      return 'bg-blue-500';
    case 'ABSENT':
      return 'bg-cyan-500';
    default:
      return 'bg-gray-400';
  }
};

const formatStatus = (status) => {
  switch (status?.toUpperCase()) {
    case 'ON_TIME':
      return 'Ontime';
    case 'LATE':
      return 'Late';
    case 'ABSENT':
      return 'Absent';
    default:
      return status || '-';
  }
};

export function AttendanceTable({ 
  attendanceData = null, 
  summary = null,
  loading = false 
}) {
  const [selectedMonth, setSelectedMonth] = useState('Select Month');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const data = attendanceData || defaultAttendanceData;
  
  // Calculate summary from data if not provided
  const onTimeCount = summary?.onTime ?? data.filter(d => 
    d.status?.toUpperCase() === 'ON_TIME' || d.status?.toUpperCase() === 'ONTIME'
  ).length;
  const lateCount = summary?.late ?? data.filter(d => d.status?.toUpperCase() === 'LATE').length;
  const absentCount = summary?.absent ?? data.filter(d => d.status?.toUpperCase() === 'ABSENT').length;

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 sm:p-5 shadow-sm border transition-colors duration-300`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h3 className={`text-lg sm:text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Attendance</h3>
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
          <button 
            className={`p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            onClick={() => navigate('/admin/checkclock')}
            title="View All Attendance"
          >
            <ExternalLink className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{onTimeCount} Ontime</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{lateCount} Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3cc3df]" />
          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{absentCount} Absent</span>
        </div>
      </div>

      {/* Table Section */}
      <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <table className="w-full">
          <thead>
            <tr className={`${isDark ? 'bg-blue-900' : 'bg-[#1D395E]'} text-white`}>
              <th className="text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-tl-xl">No</th>
              <th className="text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold">Nama</th>
              <th className="text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold">Status Kehadiran</th>
              <th className="text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-tr-xl">Check In</th>
            </tr>
          </thead>
          <tbody className={isDark ? 'bg-gray-800' : 'bg-white'}>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Tidak ada data kehadiran hari ini
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr 
                  key={index} 
                  className={`border-b last:border-b-0 ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                >
                  <td className={`px-3 sm:px-4 py-3 text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{row.no || index + 1}</td>
                  <td className={`px-3 sm:px-4 py-3 text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{row.name || row.nama}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className={`${getStatusColor(row.status)} text-white text-xs px-3 py-1.5 rounded-full font-medium inline-block`}>
                      {formatStatus(row.status)}
                    </span>
                  </td>
                  <td className={`px-3 sm:px-4 py-3 text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{row.checkIn || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}