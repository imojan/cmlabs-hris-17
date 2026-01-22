// src/components/ui/FilterDropdown.jsx
import { useState, useRef, useEffect } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Filter,
} from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";

/**
 * FilterDropdown - A reusable dropdown for sorting & filtering table columns
 * @param {Object} props
 * @param {Array} props.columns - Available columns to sort [{key: string, label: string}]
 * @param {Object} props.sortConfig - Current sort config {key: string, direction: 'asc' | 'desc'}
 * @param {Function} props.onSortChange - Callback when sort changes (sortConfig) => void
 * @param {string} props.className - Additional classes
 */
export function FilterDropdown({
  columns = [],
  sortConfig = { key: null, direction: null },
  onSortChange,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key, direction) => {
    if (sortConfig.key === key && sortConfig.direction === direction) {
      // Clear sort if clicking same option
      onSortChange({ key: null, direction: null });
    } else {
      onSortChange({ key, direction });
    }
    setIsOpen(false);
  };

  const clearSort = () => {
    onSortChange({ key: null, direction: null });
    setIsOpen(false);
  };

  const currentLabel = sortConfig.key
    ? columns.find((c) => c.key === sortConfig.key)?.label
    : null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm transition-all shadow-sm ${
          sortConfig.key
            ? isDark 
              ? "border-blue-500 bg-blue-900/30 text-blue-400"
              : "border-[#1D395E] bg-[#1D395E]/5 text-[#1D395E]"
            : isDark
              ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
        {sortConfig.key && (
          <span className={`flex items-center gap-1 pl-1 border-l ${isDark ? 'border-gray-500' : 'border-gray-300'} ml-1`}>
            {sortConfig.direction === "asc" ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-72 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border z-50 overflow-hidden`}>
          {/* Header */}
          <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} text-sm`}>
                Urutkan Berdasarkan
              </h4>
              {sortConfig.key && (
                <button
                  onClick={clearSort}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
            {currentLabel && (
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Diurutkan: {currentLabel} (
                {sortConfig.direction === "asc" ? "A-Z" : "Z-A"})
              </p>
            )}
          </div>

          {/* Column List */}
          <div className="max-h-64 overflow-y-auto">
            {columns.map((column) => (
              <div
                key={column.key}
                className={`border-b last:border-0 ${isDark ? 'border-gray-700' : 'border-gray-50'}`}
              >
                {/* Column Name */}
                <div className={`px-4 py-2 text-sm font-medium ${isDark ? 'text-gray-300 bg-gray-700/50' : 'text-gray-700 bg-gray-50/50'}`}>
                  {column.label}
                </div>

                {/* Sort Options */}
                <div className="flex">
                  {/* Ascending */}
                  <button
                    onClick={() => handleSort(column.key, "asc")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs transition-colors ${
                      sortConfig.key === column.key &&
                      sortConfig.direction === "asc"
                        ? "bg-[#1D395E] text-white"
                        : isDark
                          ? "text-gray-400 hover:bg-gray-700"
                          : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>A - Z</span>
                    {sortConfig.key === column.key &&
                      sortConfig.direction === "asc" && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                  </button>

                  {/* Descending */}
                  <button
                    onClick={() => handleSort(column.key, "desc")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs border-l transition-colors ${isDark ? 'border-gray-700' : 'border-gray-100'} ${
                      sortConfig.key === column.key &&
                      sortConfig.direction === "desc"
                        ? "bg-[#1D395E] text-white"
                        : isDark
                          ? "text-gray-400 hover:bg-gray-700"
                          : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Z - A</span>
                    {sortConfig.key === column.key &&
                      sortConfig.direction === "desc" && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
