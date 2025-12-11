import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function Notification({ type = "success", message, onClose, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Styling berdasarkan type
  const styles = {
    success: {
      bgColor: "bg-emerald-600",
      iconColor: "text-white",
      borderColor: "border-emerald-600",
      icon: CheckCircle,
    },
    warning: {
      bgColor: "bg-[#F59E0B]",
      iconColor: "text-white",
      borderColor: "border-[#F59E0B]",
      icon: AlertCircle,
    },
    error: {
      bgColor: "bg-[#8B3A3A]",
      iconColor: "text-white",
      borderColor: "border-[#8B3A3A]",
      icon: XCircle,
    },
  };

  const config = styles[type] || styles.success;
  const IconComponent = config.icon;

  return (
    <div className="fixed top-4 right-4 z-40 animate-slideIn">
      <div
        className={`${config.bgColor} border ${config.borderColor} rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-sm`}
      >
        <IconComponent className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
        <p className="text-white text-sm font-medium" style={{ color: "#FFFFFF" }}>{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-auto text-white hover:opacity-70 transition"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function NotificationContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-40 space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${notif.bgColor} border ${notif.borderColor} rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-sm animate-slideIn`}
        >
          <notif.Icon className={`w-5 h-5 ${notif.iconColor} flex-shrink-0`} />
          <p className="text-white text-sm font-medium" style={{ color: "#FFFFFF" }}>{notif.message}</p>
          <button
            onClick={() => onRemove(notif.id)}
            className="ml-auto text-white hover:opacity-70 transition"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
