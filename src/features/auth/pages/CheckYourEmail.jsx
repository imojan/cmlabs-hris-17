import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import checkEmailIllustration from "@/assets/images/auth/check-ur-email.png";

/* ---------- Page ---------- */
export default function CheckYourEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get email from URL query param
  const email = searchParams.get("email") || "your email";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleOpenGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* LEFT SIDE - Illustration */}
      <div className={`hidden lg:flex lg:w-1/2 bg-white items-center justify-center px-16 py-20 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        <div className="w-full max-w-[600px]">
          <img
            src={checkEmailIllustration}
            alt="Check Your Email"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Content */}
      <div className={`w-full lg:w-1/2 bg-white flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        <div className="w-full max-w-[600px]">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-[48px] font-bold text-[#2a2a2a] tracking-[1.8px] leading-tight mb-4">
              Check Your Email
            </h1>
            <p className="text-[18px] text-black tracking-[0.72px] leading-[28px]">
              We have sent password recovery instructions to your email{" "}
              <span className="font-semibold text-[#1d395e]">{email}</span>. Please check your inbox.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Open Gmail Button */}
            <button
              type="button"
              onClick={handleOpenGmail}
              className="w-full h-[59.516px] bg-[#1d395e] text-white text-[18px] font-bold uppercase leading-[16.427px] rounded-[17.601px] hover:bg-[#2a4a6e] transition-colors"
            >
              OPEN GMAIL
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

            {/* Resend Email */}
            <div className="pt-6 text-center">
              <p className="text-[14px] text-gray-500">
                Didn't receive the email?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/auth/forgot-password")}
                  className="text-[#1d395e] font-semibold hover:underline"
                >
                  Click here to resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
