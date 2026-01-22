import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useTheme } from "@/app/hooks/useTheme";
import { Notification } from "@/components/ui/Notification";
import companyNameIllustration from "@/assets/images/auth/company-name.png";

/* ---------- page component ---------- */
export default function CompanyName() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get user data from Google sign up (if any) - prefixed with _ to indicate intentionally unused
  const _userData = location.state?.userData || {};

  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
      
      // In a real app, you would save the company name to the user's profile
      // For now, we'll just simulate a save and redirect
      // await authService.updateCompanyName({ companyName, ...userData });

      setNotification({
        type: "success",
        message: "Company name saved! Redirecting to sign in...",
      });

      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 1500);
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
              {loading ? "Saving..." : "FINISH"}
            </button>
          </form>

          {/* Skip option (optional) */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/auth/sign-in")}
              className={`text-sm transition-colors underline ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-[#1d395e]'}`}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
