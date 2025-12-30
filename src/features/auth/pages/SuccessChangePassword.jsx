import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import successIllustration from "@/assets/images/auth/success-change-password.png";

/* ---------- Page ---------- */
export default function SuccessChangePassword() {
  const navigate = useNavigate();

  const handleLoginNow = () => {
    navigate("/auth/sign-in");
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* LEFT SIDE - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center px-16 py-20">
        <div className="w-full max-w-[600px]">
          <img
            src={successIllustration}
            alt="Password Reset Success"
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
              Your password has been successfully reset
            </h1>
            <p className="text-[18px] text-black tracking-[0.72px] leading-[28px]">
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
