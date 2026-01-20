import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Notification } from "@/components/ui/Notification";
import companyNameIllustration from "@/assets/images/auth/company-name.png";

/* ---------- page component ---------- */
export default function CompanyName() {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className={`bg-white min-h-screen flex ${isLoaded ? "auth-page-enter" : "opacity-0"}`}>
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
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center px-16 py-12 auth-illustration-enter">
        <div className="w-full max-w-[600px]">
          <img
            src={companyNameIllustration}
            alt="Company Setup"
            className="w-full h-auto object-contain illustration-bounce"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 sm:px-12 lg:px-16 py-8 auth-content-enter">
        <div className="w-full max-w-[550px]">
          {/* Title Section - Centered */}
          <div className="mb-8 text-center">
            <h1 className="text-[42px] sm:text-[48px] font-bold text-[#1d395e] tracking-[1.2px] leading-tight mb-3">
              One More Step!
            </h1>
            <p className="text-[16px] sm:text-[18px] text-gray-600 tracking-[0.5px] leading-[28px]">
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
                className="block text-[16px] text-[#1d395e] font-medium tracking-[0.48px] align-left"
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
                  text-[16px] text-gray-800 align-left
                  placeholder:text-gray-400
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#1d395e]/20
                  ${touched && !companyName.trim() 
                    ? "border-red-400 focus:border-red-400" 
                    : "border-gray-200 focus:border-[#1d395e]"
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
              className="text-gray-500 text-sm hover:text-[#1d395e] transition-colors underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
