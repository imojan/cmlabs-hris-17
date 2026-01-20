// src/components/ui/CustomDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * CustomDropdown - Komponen dropdown minimalis dan modern
 * 
 * @param {string} value - Nilai yang dipilih
 * @param {function} onChange - Handler saat nilai berubah
 * @param {array} options - Array opsi [{value: string, label: string, icon?: string}]
 * @param {string} placeholder - Placeholder saat belum ada yang dipilih
 * @param {string} name - Nama field untuk form
 * @param {string} className - Custom className tambahan
 * @param {boolean} disabled - Disabled state
 * @param {string} variant - "default" | "dark" - Style variant
 */
export function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi",
  name = "",
  className = "",
  disabled = false,
  variant = "default",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange({
      target: {
        name,
        value: optionValue,
      },
    });
    setIsOpen(false);
  };

  // Style variants
  const variants = {
    default: {
      trigger: `
        bg-white border border-gray-300 rounded-lg
        ${disabled 
          ? "bg-gray-100 cursor-not-allowed text-gray-400" 
          : "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D395E]/20 focus:border-[#1D395E] cursor-pointer"
        }
        ${isOpen ? "border-[#1D395E] ring-2 ring-[#1D395E]/20" : ""}
      `,
      triggerText: selectedOption ? "text-gray-900" : "text-gray-500",
      chevron: "text-gray-400",
      menu: "bg-white border border-gray-200 shadow-lg shadow-gray-200/50",
      option: (isSelected) => isSelected 
        ? "bg-[#1D395E]/5 text-[#1D395E] font-medium" 
        : "text-gray-700 hover:bg-gray-50",
      check: "text-[#1D395E]",
    },
    dark: {
      trigger: `
        bg-[#1D395E] border border-[#1D395E] rounded-xl
        ${disabled 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:bg-[#142848] focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        }
        ${isOpen ? "ring-2 ring-blue-400" : ""}
      `,
      triggerText: "text-white",
      chevron: "text-white",
      menu: "bg-[#1D395E] border border-[#2a4a73] shadow-xl",
      option: (isSelected) => isSelected 
        ? "bg-white/10 text-white font-medium" 
        : "text-white/90 hover:bg-white/10",
      check: "text-white",
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2
          px-4 py-2.5 
          text-sm text-left
          transition-all duration-200
          ${currentVariant.trigger}
        `}
      >
        <span className={currentVariant.triggerText}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <span>{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown 
          className={`w-4 h-4 ${currentVariant.chevron} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`
            absolute z-[9999] w-full mt-1
            rounded-lg
            max-h-60 overflow-auto
            ${currentVariant.menu}
          `}
          style={{
            animation: "dropdownEnter 0.15s ease-out",
          }}
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Tidak ada opsi
            </div>
          ) : (
            <ul className="py-1">
              {options.map((option, index) => (
                <li key={option.value || index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between gap-2
                      px-4 py-2.5 text-sm text-left
                      transition-colors duration-150
                      ${currentVariant.option(option.value === value)}
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {option.icon && <span>{option.icon}</span>}
                      {option.label}
                    </span>
                    {option.value === value && (
                      <Check className={`w-4 h-4 ${currentVariant.check}`} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add CSS animation */}
      <style>{`
        @keyframes dropdownEnter {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default CustomDropdown;
