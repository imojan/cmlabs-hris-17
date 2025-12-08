import { ChevronDown } from "lucide-react";
import { useAuth } from "@/app/store/authStore";
import { useMemo } from "react";

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "?";

  const parts = String(nameOrEmail)
    .split(" ")
    .filter(Boolean);

  if (parts.length === 1) {
    // kalau cuma 1 kata (misal email), ambil 2 huruf pertama
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function UserProfileMini() {
  const user = useAuth((s) => s.user);

  const displayName = user?.name || user?.fullName || user?.email || "Guest";

  const initials = useMemo(
    () => getInitials(displayName),
    [displayName]
  );

  const roleLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "employee"
      ? "Employee"
      : user?.role
      ? user.role
      : "User";

  return (
    <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-medium text-sm sm:text-base">
          {initials}
        </span>
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-gray-800">
          {displayName}
        </p>
        <p className="text-xs text-gray-500">{roleLabel}</p>
      </div>
      <ChevronDown className="w-5 h-5 text-gray-600 hidden sm:block flex-shrink-0" />
    </div>
  );
}
