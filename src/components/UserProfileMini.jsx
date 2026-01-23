// src/components/UserProfileMini.jsx
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/app/store/authStore";
import { useMemo, useState, useEffect } from "react";
import { ENV } from "@/app/config/env";

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
  const [imgError, setImgError] = useState(false);

  // Debug logging
  console.log("🖼️ UserProfileMini - user:", user);
  console.log("🖼️ UserProfileMini - user.avatarUrl:", user?.avatarUrl);
  console.log("🖼️ UserProfileMini - user.position:", user?.position);
  console.log("🖼️ UserProfileMini - user.jobdesk:", user?.jobdesk);
  console.log("🖼️ UserProfileMini - user.role:", user?.role);

  // Display name: firstName + lastName > username > email prefix
  const displayUsername = useMemo(() => {
    return (
      (user?.firstName || user?.lastName
        ? [user.firstName, user.lastName].filter(Boolean).join(" ")
        : null) ||
      user?.username ||
      user?.name ||
      (user?.email ? user.email.split("@")[0] : "User")
    );
  }, [user?.firstName, user?.lastName, user?.username, user?.name, user?.email]);

  const initials = useMemo(
    () => getInitials(displayUsername),
    [displayUsername]
  );

  // Role/Position label - prioritas: position > jobdesk > role
  const roleLabel = useMemo(() => {
    if (user?.position) return user.position;
    if (user?.jobdesk) return user.jobdesk;
    if (user?.role === "admin") return "Admin";
    if (user?.role === "employee") return "Employee";
    return "User";
  }, [user?.position, user?.jobdesk, user?.role]);

  // Avatar URL - dengan cache buster untuk force refresh
  const avatarUrl = useMemo(() => {
    if (!user?.avatarUrl) return null;
    const baseUrl = user.avatarUrl.startsWith("http") 
      ? user.avatarUrl 
      : `${ENV.API_URL}${user.avatarUrl}`;
    return baseUrl;
  }, [user?.avatarUrl]);

  // Reset error state when avatar changes
  useEffect(() => {
    setImgError(false);
  }, [user?.avatarUrl]);

  const showAvatar = avatarUrl && !imgError;

  return (
    <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {showAvatar ? (
          <img 
            src={avatarUrl} 
            alt={displayUsername}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-white font-medium text-sm sm:text-base">
            {initials}
          </span>
        )}
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
