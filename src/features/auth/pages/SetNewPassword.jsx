import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { authService } from "@/app/services/auth.api";
import { Notification } from "@/components/ui/Notification";
import setNewPasswordIllustration from "@/assets/images/auth/set-new-password.png";

/* ---------- Page ---------- */
export default function SetNewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get token from URL query param (sent from email link)
  const token = searchParams.get("token") || "";

  // form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // validation
  const isPasswordValid = newPassword.length >= 8;
  const isPasswordMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && isPasswordMatch;

  const onBlurNewPassword = () => {
    if (newPassword && newPassword.length < 8) {
      setNotification({
        type: "warning",
        message: "Password must be at least 8 characters.",
      });
    }
  };

  const onBlurConfirmPassword = () => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setNotification({
        type: "warning",
        message: "Passwords do not match.",
      });
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!isPasswordValid) {
      setNotification({
        type: "warning",
        message: "Password must be at least 8 characters.",
      });
      return;
    }

    if (!isPasswordMatch) {
      setNotification({
        type: "warning",
        message: "Passwords do not match.",
      });
      return;
    }

    if (!token) {
      setNotification({
        type: "error",
        message: "Invalid or missing reset token.",
      });
      return;
    }

    try {
      setLoading(true);
      // Call backend to reset password
      await authService.resetPassword({ token, password: newPassword });

      // Navigate to success page
      navigate("/auth/success-change-password");
    } catch (err) {
      // Check if token is expired or invalid
      const errorMessage = err.message?.toLowerCase() || "";
      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid token") ||
        errorMessage.includes("token not found") ||
        err.status === 401 ||
        err.status === 410
      ) {
        // Redirect to link expired page
        navigate("/auth/link-expired");
      } else {
        setNotification({
          type: "error",
          message: err.message || "Failed to reset password. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex auth-page-enter">
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
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center px-16 py-20 auth-illustration-enter">
        <div className="w-full max-w-[600px]">
          <img
            src={setNewPasswordIllustration}
            alt="Set New Password"
            className="w-full h-auto object-contain illustration-bounce"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 auth-content-enter">
        <div className="w-full max-w-[600px]">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-[48px] font-bold text-[#2a2a2a] tracking-[1.8px] leading-tight mb-4">
              Set new password
            </h1>
            <p className="text-[18px] text-black tracking-[0.72px] leading-[28px]">
              Enter your new password below to complete the reset process. Ensure it's strong and secure
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-[16px] text-black tracking-[0.48px]"
              >
                New Password
              </label>
              <div className="relative h-[73px]">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={onBlurNewPassword}
                  placeholder="Enter Your Password"
                  className="w-full h-full px-5 py-6 pr-14 bg-white border border-[#7ca6bf] rounded-xl text-[16px] tracking-[0.48px] placeholder:text-[rgba(0,0,0,0.5)] focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
              <p className="text-[14px] text-gray-500 tracking-[0.42px]">
                Must be at least 8 character
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-[16px] text-black tracking-[0.48px]"
              >
                Confirm Password
              </label>
              <div className="relative h-[73px]">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={onBlurConfirmPassword}
                  placeholder="Enter Your Password"
                  className="w-full h-full px-5 py-6 pr-14 bg-white border border-[#7ca6bf] rounded-xl text-[16px] tracking-[0.48px] placeholder:text-[rgba(0,0,0,0.5)] focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* Reset Password Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full h-[59.516px] bg-[#1d395e] text-white text-[18px] font-bold uppercase leading-[16.427px] rounded-[17.601px] hover:bg-[#2a4a6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "RESET PASSWORD"}
              </button>
            </div>

            {/* Back to Login */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate("/auth/sign-in")}
                className="w-full flex items-center justify-center gap-2 text-[16px] text-black hover:text-[#1d395e] transition-colors"
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
