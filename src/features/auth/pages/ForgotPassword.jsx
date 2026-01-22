import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { authService } from "@/app/services/auth.api";
import { Notification } from "@/components/ui/Notification";
import { useTheme } from "@/app/hooks/useTheme";
import forgotPasswordIllustration from "@/assets/images/auth/forgot-password.png";

/* ---------- Page ---------- */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // form state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = email.trim() && emailRe.test(email);

  const onBlur = () => {
    if (!email.trim()) {
      setNotification({
        type: "warning",
        message: "Please enter your email address.",
      });
    } else if (!emailRe.test(email)) {
      setNotification({
        type: "warning",
        message: "Please enter a valid email address.",
      });
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!isValidEmail) {
      setNotification({
        type: "warning",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      setLoading(true);
      // Call backend to send reset password email
      await authService.forgotPassword({ email });

      // Navigate to check email page with email as query param
      navigate(`/auth/check-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Failed to send reset link. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex auth-page-enter ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
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
      <div className={`hidden lg:flex lg:w-1/2 items-center justify-center px-16 py-20 auth-illustration-enter ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-[600px]">
          <img
            src={forgotPasswordIllustration}
            alt="Forgot Password"
            className="w-full h-auto object-contain illustration-bounce"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 auth-content-enter ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="w-full max-w-[600px]">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className={`text-[48px] font-bold tracking-[1.8px] leading-tight mb-4 ${isDark ? 'text-gray-100' : 'text-[#2a2a2a]'}`}>
              Forgot Password
            </h1>
            <p className={`text-[18px] tracking-[0.72px] leading-[28px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
              No worries! Enter your email address below, and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={onBlur}
                placeholder="Enter your email address"
                className={`w-full h-[73px] px-5 py-6 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                    : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                }`}
              />
            </div>

            {/* Reset Password Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValidEmail || loading}
                className="w-full h-[59.516px] bg-[#1d395e] text-white text-[18px] font-bold uppercase leading-[16.427px] rounded-[17.601px] hover:bg-[#2a4a6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "RESET PASSWORD"}
              </button>
            </div>

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
          </form>
        </div>
      </div>
    </div>
  );
}
