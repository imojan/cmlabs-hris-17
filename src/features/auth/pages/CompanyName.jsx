import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useTheme } from "@/app/hooks/useTheme";
import { useAuth } from "@/app/store/authStore";
import { Notification } from "@/components/ui/Notification";
import { http } from "@/lib/http";
import companyNameIllustration from "@/assets/images/auth/company-name.png";

/* ---------- page component ---------- */
export default function CompanyName() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Auth store
  const setAuth = useAuth((s) => s.setAuth);
  const currentUser = useAuth((s) => s.user);
  const token = useAuth((s) => s.token);
  
  // Check if coming from Google OAuth
  const fromGoogleAuth = location.state?.fromGoogleAuth || false;
  const userData = location.state?.userData || currentUser || {};

  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Redirect if not from Google OAuth or already has company
  useEffect(() => {
    if (!fromGoogleAuth && !userData.needsCompanySetup) {
      // If user already has company, redirect to dashboard
      if (currentUser?.companyId) {
        if (currentUser.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    }
  }, [fromGoogleAuth, userData, currentUser, navigate]);

  // form state
  const [companyName, setCompanyName] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const onBlur = () => {
    setTouched(true);
    if (!companyName.trim()) {
      setNotification({
        type: "warning",
        message: "Please enter your company name.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!companyName.trim()) {
      setNotification({
        type: "warning",
        message: "Please enter your company name to continue.",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Call API to setup company
      const response = await http("/api/auth/setup-company", {
        method: "POST",
        body: { companyName: companyName.trim() },
      });

      if (response.success) {
        // Update auth store with new token and user data
        setAuth(response.data.token, response.data.user);

        setNotification({
          type: "success",
          message: "Company created successfully! Redirecting to dashboard...",
        });

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to create company");
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Failed to save company name. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${isLoaded ? "auth-page-enter" : "opacity-0"} ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Notification Toast */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}

      {/* LEFT SIDE - Illustration */}
      <div className={`hidden lg:flex lg:w-1/2 items-center justify-center px-16 py-12 auth-illustration-enter ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-[600px]">
          <img
            src={companyNameIllustration}
            alt="Company Setup"
            className="w-full h-auto object-contain illustration-bounce"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-8 auth-content-enter ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="w-full max-w-[550px]">
          {/* Title Section - Centered */}
          <div className="mb-8 text-center">
            <h1 className={`text-[42px] sm:text-[48px] font-bold tracking-[1.2px] leading-tight mb-3 ${isDark ? 'text-blue-400' : 'text-[#1d395e]'}`}>
              One More Step!
            </h1>
            <p className={`text-[16px] sm:text-[18px] tracking-[0.5px] leading-[28px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Enter your company name to{" "}
              <br className="hidden sm:block" />
              finish setting up your HRIS workspace.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            {/* Company Name */}
            <div className="space-y-2">
              <label 
                htmlFor="companyName" 
                className={`block text-[16px] font-medium tracking-[0.48px] align-left ${isDark ? 'text-blue-400' : 'text-[#1d395e]'}`}
              >
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Enter your company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={onBlur}
                className={`
                  w-full px-4 py-4 
                  border-2 rounded-xl 
                  text-[16px] align-left
                  transition-all duration-200
                  focus:outline-none focus:ring-2
                  ${isDark 
                    ? `bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:ring-blue-400/20 ${touched && !companyName.trim() ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"}`
                    : `bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-[#1d395e]/20 ${touched && !companyName.trim() ? "border-red-400 focus:border-red-400" : "focus:border-[#1d395e]"}`
                  }
                `}
              />
              {touched && !companyName.trim() && (
                <p className="text-sm text-red-500 mt-1 align-life">
                  Company name is required.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 
                bg-[#1d395e] text-white 
                text-[18px] font-bold tracking-[1px] uppercase
                rounded-xl
                transition-all duration-200
                hover:bg-[#2a4a6e] hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-[#1d395e]/50
                disabled:opacity-60 disabled:cursor-not-allowed
                ${loading ? "animate-pulse" : ""}
              `}
            >
              {loading ? "Creating..." : "FINISH"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
