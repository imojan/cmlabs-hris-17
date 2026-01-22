import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { authService } from "@/app/services/auth.api";
import { Notification } from "@/components/ui/Notification";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useTheme } from "@/app/hooks/useTheme";
import logo from "@/assets/branding/logo-hris-1.png";
import logoWhite from "@/assets/images/hris-putih.png";
import signUpIllustration from "@/assets/images/auth/sign-up.png";
import googleLogo from "@/assets/branding/google.webp";

/* ---------- page component ---------- */
export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [_isLoaded, setIsLoaded] = useState(false);
  
  // Check if redirected from payment page
  const fromPayment = location.state?.from === "/payment";

  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // form state
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const [_touched, setTouched] = useState({});
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const onChange = (e) =>
    setValues((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    const { name, value } = e.target;
    if (!value.trim()) {
      const fieldNames = {
        firstName: t("auth.firstName"),
        lastName: t("auth.lastName"),
        email: t("auth.email"),
        password: t("auth.password"),
        confirmPassword: t("auth.confirmPassword"),
        companyName: t("auth.companyName"),
      };
      setNotification({
        type: "warning",
        message: t("auth.pleaseField", { field: fieldNames[name] || name }),
      });
    }
  };

  // validation rules
  const errors = useMemo(() => {
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.firstName.trim()) errs.firstName = t("auth.firstNameRequired");
    if (!values.lastName.trim()) errs.lastName = t("auth.lastNameRequired");

    if (!values.email.trim()) errs.email = t("auth.emailRequired");
    else if (!emailRe.test(values.email))
      errs.email = t("auth.invalidEmail");

    if (!values.password) errs.password = t("auth.passwordRequired");
    else if (values.password.length < 8)
      errs.password = t("auth.minCharacters", { min: "8" });

    if (!values.confirmPassword)
      errs.confirmPassword = t("auth.confirmPasswordRequired");
    else if (values.confirmPassword !== values.password)
      errs.confirmPassword = t("auth.passwordMismatch");

    if (!agree) errs.agree = t("auth.agreeRequired");
    return errs;
  }, [values, agree, t]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      companyName: true,
      submit: true,
    });

    if (!isValid) {
      setNotification({
        type: "warning",
        message: t("auth.fillAllFields"),
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        companyName: values.companyName,
      };
      await authService.signUp(payload);

      setNotification({
        type: "success",
        message: fromPayment 
          ? t("auth.accountCreatedPayment")
          : t("auth.accountCreated"),
      });

      setTimeout(() => {
        // Pass the fromPayment state to sign-in page
        navigate("/auth/sign-in", { state: fromPayment ? { from: "/payment" } : {} });
      }, 1500);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || t("auth.signUpFailed"),
      });
    } finally {
      setLoading(false);
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
      <div className={`hidden lg:flex lg:w-1/2 items-center justify-center px-16 py-12 auth-illustration-enter ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-[827px]">
          <img
            src={signUpIllustration}
            alt="Sign Up"
            className="w-full h-auto object-contain illustration-bounce"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-8 auth-content-enter ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="w-full max-w-[842px]">
          {/* Header with Logo and Try for free */}
          <div className="flex items-center justify-between mb-6">
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
              style={{ textDecoration: "underline" }}
              className="text-[#b93c54] text-[20px] font-bold tracking-[0.6px] hover:opacity-80 transition-opacity"
            >
              {t("auth.tryForFree")}
            </a>
          </div>

          {/* Title Section */}
          <div className="mb-4">
            <h1 className={`text-[48px] font-bold tracking-[1.8px] leading-tight mb-1 ${isDark ? 'text-gray-100' : 'text-[#2a2a2a]'}`}>
              {t("auth.signUp")}
            </h1>
            <p className={`text-[18px] tracking-[0.72px] leading-[28px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
              {t("auth.signUpSubtitle")}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3" noValidate onSubmit={handleSubmit}>
            {/* First Name & Last Name - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* First Name */}
              <div className="space-y-1">
                <label htmlFor="firstName" className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                  {t("auth.firstName")}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={t("auth.enterFirstName")}
                  className={`w-full h-[60px] px-5 py-4 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                      : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                  }`}
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label htmlFor="lastName" className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                  {t("auth.lastName")}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={t("auth.enterLastName")}
                  className={`w-full h-[60px] px-5 py-4 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                      : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                  }`}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                {t("auth.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={t("auth.enterEmail")}
                className={`w-full h-[60px] px-5 py-4 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                    : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                }`}
              />
            </div>

            {/* Password & Confirm Password - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                  {t("auth.password")}
                </label>
                <div className="relative h-[60px]">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={t("auth.enterPassword")}
                    className={`w-full h-full px-5 py-4 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all pr-14 ${
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
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                  {t("auth.confirmPassword")}
                </label>
                <div className="relative h-[60px]">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={t("auth.confirmYourPassword")}
                    className={`w-full h-full px-5 py-4 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all pr-14 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                        : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className={`absolute right-4 top-0 bottom-0 flex items-center transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-[#C4C4C4] hover:text-[#1d395e]'}`}
                    aria-label="toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label htmlFor="companyName" className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                {t("auth.companyName")}
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={values.companyName}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={t("auth.enterCompanyName")}
                className={`w-full h-[60px] px-5 py-4 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                    : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                }`}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center pt-2">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <div className="relative flex-shrink-0 w-6 h-6">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
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
                <span className={`text-[16px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
                  {t("auth.agreeTerms")} <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-[#1d395e]'}`}>HRIS</span>
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full h-[59.516px] bg-[#1d395e] text-white text-[18px] font-bold uppercase leading-[16.427px] rounded-[17.601px] hover:bg-[#2a4a6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("auth.signingUp") : t("auth.signUp").toUpperCase()}
              </button>
            </div>

            {/* Continue with Google */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGoogleClick}
                className={`w-full h-[59.516px] rounded-[17.601px] flex items-center justify-center gap-3 text-[18px] font-bold transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-600 text-gray-100 hover:bg-[#1d395e] hover:text-white hover:border-transparent' 
                    : 'bg-white border border-black/50 text-black hover:bg-[#1d395e] hover:text-white hover:border-transparent'
                } active:bg-[#152a47]`}
              >
                <img src={googleLogo} alt="Google" className="w-[37.44px] h-[37.44px]" />
                <span>{t("auth.continueWithGoogle")}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="py-2">
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-black'}`}></div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-[16px] font-bold leading-[16.427px]">
                <span className={isDark ? 'text-gray-400' : 'text-[rgba(0,0,0,0.5)]'}>{t("auth.alreadyHaveAccount")} </span>
                <a
                  href="/auth/sign-in"
                  style={{ textDecoration: "underline" }}
                  className="text-[#b93c54] hover:opacity-80 transition-opacity"
                >
                  {t("auth.signInHere")}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
