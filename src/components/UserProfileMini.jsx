// src/components/UserProfileMini.jsx
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/app/store/authStore";
import { useMemo } from "react";

function getInitials(str) {
  if (!str) return "?";
  const parts = String(str).split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function UserProfileMini() {
  const user = useAuth((s) => s.user);

  // 1. username
  // 2. firstName + lastName
  // 3. bagian depan email
  const displayUsername =
    user?.username ||
    (user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(" ")
      : null) ||
    (user?.email ? user.email.split("@")[0] : "User");

  const initials = useMemo(
    () => getInitials(displayUsername),
    [displayUsername]
  );

  const roleLabel = user?.isAdmin ? "Admin" : "User";

  return (
    <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-medium text-sm sm:text-base">
          {initials}
        </span>
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-gray-800">
          {displayUsername}
        </p>
        <p className="text-xs text-gray-500">{roleLabel}</p>
      </div>
      <ChevronDown className="w-5 h-5 text-gray-600 hidden sm:block flex-shrink-0" />
    </div>
  );
}
