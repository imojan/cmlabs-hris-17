import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import linkExpiredIllustration from "@/assets/images/auth/link-expired.png";

/* ---------- Page ---------- */
export default function LinkExpired() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/auth/sign-in");
  };

  const handleRequestNewLink = () => {
    navigate("/auth/forgot-password");
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* LEFT SIDE - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center px-16 py-20">
        <div className="w-full max-w-[600px]">
          <img
            src={linkExpiredIllustration}
            alt="Link Expired"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Content */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-[600px]">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-[48px] font-bold text-[#2a2a2a] tracking-[1.8px] leading-tight mb-4">
              Link Expired
            </h1>
            <p className="text-[18px] text-black tracking-[0.72px] leading-[28px]">
              The password reset link has expired.{" "}
              <br />
              Please request a new link to reset your password.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Back to Login Button */}
            <button
              type="button"
              onClick={handleRequestNewLink}
              className="w-full h-[59.516px] bg-[#1d395e] text-white text-[18px] font-bold uppercase leading-[16.427px] rounded-[17.601px] hover:bg-[#2a4a6e] transition-colors"
            >
              BACK TO LOGIN
            </button>

            {/* Back to Login Link */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-[16px] text-black hover:text-[#1d395e] transition-colors"
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
