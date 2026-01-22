import { useEffect, useMemo, useState } from "react";
import { Notification } from "@/components/ui/Notification";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/app/store/authStore";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useTheme } from "@/app/hooks/useTheme";
import logo from "@/assets/branding/logo-hris-1.png";
import logoWhite from "@/assets/images/hris-putih.png";
import signInIllustration from "@/assets/images/auth/sign-in.png";
import googleLogo from "@/assets/branding/google.webp";

/* ---------- Page ---------- */
export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Check if redirected from payment page
  const fromPayment = location.state?.from === "/payment";

  // store
  const login            = useAuth((s) => s.login);
  const loading          = useAuth((s) => s.loading);

  // form state
  const [values, setValues] = useState({ identifier: "", password: "" });
  const [_touched, setTouched] = useState({});
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load saved credentials on mount (Remember Me feature)
  useEffect(() => {
    const savedCredentials = localStorage.getItem("hris_remember_signin");
    if (savedCredentials) {
      try {
        const { identifier, remember: wasRemembered } = JSON.parse(savedCredentials);
        if (wasRemembered && identifier) {
          setValues(prev => ({ ...prev, identifier }));
          setRemember(true);
        }
      } catch {
        localStorage.removeItem("hris_remember_signin");
      }
    }
  }, []);

  const onChange = (e) => setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    // Jika field kosong saat blur, munculkan notifikasi warning
    const { name, value } = e.target;
    if (!value.trim()) {
      setNotification({
        type: "warning",
        message: name === "identifier"
          ? "Mohon isi Email atau Username terlebih dahulu."
          : "Mohon isi Password terlebih dahulu."
      });
    }
  };

  // validation
  const errors = useMemo(() => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRe = /^[a-zA-Z0-9_]{3,}$/; // username: min 3 chars, alphanumeric + underscore
    
    if (!values.identifier.trim()) {
      e.identifier = "Email or Username is required.";
    } else {
      // Accept email OR username (not phone anymore since UI says "Email or Username")
      const isEmail = emailRe.test(values.identifier);
      const isUsername = usernameRe.test(values.identifier);
      if (!isEmail && !isUsername) {
        e.identifier = "Enter a valid email or username.";
      }
    }
    
    if (!values.password) e.password = "Password is required.";
    return e;
  }, [values]);
  const isValid = Object.keys(errors).length === 0;

  // handlers
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched({ identifier: true, password: true, submit: true });

    if (!isValid) {
      setNotification({
        type: "warning",
        message: "Mohon isi semua kolom dengan benar untuk login."
      });
      return;
    }

    const { ok, error, user } = await login({
      identifier: values.identifier,
      password: values.password,
    });

    if (ok) {
      // Handle Remember Me - save or remove credentials
      if (remember) {
        localStorage.setItem("hris_remember_signin", JSON.stringify({
          identifier: values.identifier,
          remember: true
        }));
      } else {
        localStorage.removeItem("hris_remember_signin");
      }
      
      // Redirect based on priority and role
      if (fromPayment) {
        // Jika dari payment page, kembali ke payment
        navigate("/payment");
      } else {
        // Auto-redirect berdasarkan role
        const userRole = user?.role || "admin";
        if (userRole === "employee" || userRole === "user") {
          navigate("/user/dashboard");
        } else {
          // admin atau role lain → admin dashboard
          navigate("/admin/dashboard");
        }
      }
    } else {
      setNotification({
        type: "error",
        message:
          error && error !== "kredensial salah"
            ? error
            : "Email or Password is incorrect."
      });
    }
  };

  const handleGoogleClick = () => {
    // Redirect to backend Google OAuth endpoint
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    window.location.href = `${apiUrl}/api/auth/google`;
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
        <div className="w-full max-w-[827px]">
          <img 
            src={signInIllustration} 
            alt="Sign In" 
            className="w-full h-auto object-contain illustration-bounce" 
          />
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 auth-content-enter ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="w-full max-w-[842px]">
          {/* Header with Logo and Try for free */}
          <div className="flex items-center justify-between mb-11">
            <div className="w-[148px]">
              <img 
                src={isDark ? logoWhite : logo} 
                alt="HRIS" 
                className="w-auto h-auto max-h-16 object-contain cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => navigate("/")}
                title="Kembali ke Beranda"
              />
            </div>
            <a 
              href="#try" 
              style={{ textDecoration: 'underline' }}
              className="text-[#b93c54] text-[20px] font-bold tracking-[0.6px] hover:opacity-80 transition-opacity"
            >
              Try for free!
            </a>
          </div>

          {/* Title Section */}
          <div className="mb-8">
            <h1 className={`text-[60px] font-bold tracking-[1.8px] leading-tight mb-2 ${isDark ? 'text-gray-100' : 'text-[#2a2a2a]'}`}>
              {t("auth.signIn")}
            </h1>
            <p className={`text-[20px] tracking-[0.72px] leading-[28px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
              {t("auth.signInSubtitle")}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3" noValidate onSubmit={handleSubmit}>
            {/* Email or Phone Number */}
            <div className="space-y-1">
              <label htmlFor="identifier" className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                {t("auth.emailOrUsername")}
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={values.identifier}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={t("auth.emailOrUsername")}
                  className={`w-full h-[73px] px-5 py-6 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                      : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                  }`}
                />
                {/* warning kecil di bawah input dihilangkan, hanya pakai notifikasi pop-up */}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                {t("auth.password")}
              </label>
              <div className="relative h-[73px]">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Enter Your Password"
                  className={`w-full h-full px-5 py-6 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all pr-16 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                      : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-0 bottom-0 flex items-center transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-[#C4C4C4] hover:text-[#1d395e]'}`}
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <EyeOff size={26} /> : <Eye size={26} />}
                </button>
              </div>
              {/* warning kecil di bawah input dihilangkan, hanya pakai notifikasi pop-up */}
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between pt-3 pb-2">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <div className="relative flex-shrink-0 w-6 h-6">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className={`peer w-6 h-6 appearance-none rounded-full border cursor-pointer transition-all ${
                      isDark 
                        ? 'border-gray-500 bg-gray-700 checked:bg-blue-500 checked:border-blue-500' 
                        : 'border-[#1D395E] bg-white checked:bg-[#1D395E] checked:border-[#1D395E]'
                    }`}
                  />
                  <svg 
                    className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-[18px] ${isDark ? 'text-gray-300' : 'text-black'}`}>{t("auth.rememberMe")}</span>
              </label>
              
              <a 
                href="/auth/forgot-password" 
                className="text-[18px] text-[#b93c54] hover:underline"
              >
                {t("auth.forgotPassword")}
              </a>
            </div>

            {/* Sign In Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full h-[59.516px] bg-[#1d395e] text-white text-[18px] font-bold uppercase leading-[16.427px] rounded-[17.601px] hover:bg-[#2a4a6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("common.loading") : t("auth.signIn").toUpperCase()}
              </button>
            </div>

            {/* Error dari store dihilangkan, hanya pakai notifikasi pop-up */}

            {/* Sign In with Google */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className={`w-full h-[59.516px] rounded-[17.601px] flex items-center justify-center gap-3 text-[18px] font-bold transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-600 text-gray-100 hover:bg-[#1d395e] hover:text-white hover:border-transparent' 
                    : 'bg-white border border-black/50 text-black hover:bg-[#1d395e] hover:text-white hover:border-transparent'
                } active:bg-[#152a47]`}
              >
                <img src={googleLogo} alt="Google" className="w-[37.44px] h-[37.44px]" />
                <span>{t("auth.signInWithGoogle")}</span>
              </button>
            </div>

            {/* Sign In with ID Employee */}
            <div>
              <button
                type="button"
                onClick={() => navigate("/auth/sign-in-id")}
                className={`w-full h-[59.516px] rounded-[17.601px] text-[18px] font-bold transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-600 text-gray-100 hover:bg-[#1d395e] hover:text-white hover:border-transparent' 
                    : 'bg-white border border-black/50 text-black hover:bg-[#1d395e] hover:text-white hover:border-transparent'
                } active:bg-[#152a47]`}
              >
                {t("auth.employeeSignIn")}
              </button>
            </div>

            {/* Divider */}
            <div className="py-2">
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-black'}`}></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center p">
              <p className="text-[16px] font-bold leading-[16.427px]">
                <span className={isDark ? 'text-gray-400' : 'text-[rgba(0,0,0,0.5)]'}>{t("auth.dontHaveAccount")} </span>
                <a href="/auth/sign-up" className="text-[#b93c54] hover:underline">
                  {t("auth.signUpNow")}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
