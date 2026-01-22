import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useTheme } from "@/app/hooks/useTheme";
import successIllustration from "@/assets/images/auth/success-change-password.png";

/* ---------- Page ---------- */
export default function SuccessChangePassword() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLoginNow = () => {
    navigate("/auth/sign-in");
  };

  return (
    <div className={`min-h-screen flex auth-page-enter ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* LEFT SIDE - Illustration */}
      <div className={`hidden lg:flex lg:w-1/2 items-center justify-center px-16 py-20 auth-illustration-enter ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-[600px]">
          <img
            src={successIllustration}
            alt="Password Reset Success"
            className="w-full h-auto object-contain illustration-bounce"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Content */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 auth-content-enter ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="w-full max-w-[600px]">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className={`text-[48px] font-bold tracking-[1.8px] leading-tight mb-4 ${isDark ? 'text-gray-100' : 'text-[#2a2a2a]'}`}>
              Your password has been successfully reset
            </h1>
            <p className={`text-[18px] tracking-[0.72px] leading-[28px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
              You can log in with your new password. If you encounter any issues, please contact support !
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Login Now Button */}
            <button
              type="button"
              onClick={handleLoginNow}
              className="w-full h-[59.516px] bg-[#1d395e] text-white text-[18px] font-bold uppercase leading-[16.427px] rounded-[17.601px] hover:bg-[#2a4a6e] transition-colors"
            >
              LOGIN NOW
            </button>

            {/* Back to Login */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate("/auth/sign-in")}
                className={`w-full flex items-center justify-center gap-2 text-[16px] transition-colors ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-black hover:text-[#1d395e]'}`}
              >
                <ArrowLeft size={20} />
                <span>Back to log in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
