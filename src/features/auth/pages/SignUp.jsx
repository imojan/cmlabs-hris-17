import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { authService } from "@/app/services/auth.api";
import { Notification } from "@/components/ui/Notification";
import logo from "@/assets/branding/logo-hris-1.png";
import signUpIllustration from "@/assets/images/auth/sign-up.png";
import googleLogo from "@/assets/branding/google.webp";

/* ---------- page component ---------- */
export default function SignUp() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

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
  const [touched, setTouched] = useState({});
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
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        companyName: "Company Name",
      };
      setNotification({
        type: "warning",
        message: `Please fill in ${fieldNames[name] || name} field.`,
      });
    }
  };

  // validation rules
  const errors = useMemo(() => {
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.firstName.trim()) errs.firstName = "First name is required.";
    if (!values.lastName.trim()) errs.lastName = "Last name is required.";

    if (!values.email.trim()) errs.email = "Email is required.";
    else if (!emailRe.test(values.email))
      errs.email = "Please enter a valid email.";

    if (!values.password) errs.password = "Password is required.";
    else if (values.password.length < 8)
      errs.password = "Minimum 8 characters.";

    if (!values.confirmPassword)
      errs.confirmPassword = "Please confirm your password.";
    else if (values.confirmPassword !== values.password)
      errs.confirmPassword = "Passwords do not match.";

    if (!agree) errs.agree = "You must agree to the terms.";
    return errs;
  }, [values, agree]);

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
        message: "Please fill in all required fields correctly.",
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
        message: "Account created successfully! Redirecting to sign in...",
      });

      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 1500);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Failed to sign up. Please try again.",
      });
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
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center px-16 py-12 auth-illustration-enter">
        <div className="w-full max-w-[827px]">
          <img
            src={signUpIllustration}
            alt="Sign Up"
            className="w-full h-auto object-contain illustration-bounce"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 sm:px-12 lg:px-16 py-8 auth-content-enter">
        <div className="w-full max-w-[842px]">
          {/* Header with Logo and Try for free */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-[148px]">
              <img src={logo} alt="HRIS" className="w-auto h-auto max-h-16 object-contain" />
            </div>
            <a
              href="#try"
              style={{ textDecoration: "underline" }}
              className="text-[#b93c54] text-[20px] font-bold tracking-[0.6px] hover:opacity-80 transition-opacity"
            >
              Try for free!
            </a>
          </div>

          {/* Title Section */}
          <div className="mb-4">
            <h1 className="text-[48px] font-bold text-[#2a2a2a] tracking-[1.8px] leading-tight mb-1">
              Sign Up
            </h1>
            <p className="text-[18px] text-black tracking-[0.72px] leading-[28px]">
              Create your account and streamline your employee management.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3" noValidate onSubmit={handleSubmit}>
            {/* First Name & Last Name - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* First Name */}
              <div className="space-y-1">
                <label htmlFor="firstName" className="block text-[16px] text-black tracking-[0.48px]">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Enter Your First Name"
                  className="w-full h-[60px] px-5 py-4 bg-white border border-[#7ca6bf] rounded-xl text-[16px] tracking-[0.48px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label htmlFor="lastName" className="block text-[16px] text-black tracking-[0.48px]">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Enter Your Last Name"
                  className="w-full h-[60px] px-5 py-4 bg-white border border-[#7ca6bf] rounded-xl text-[16px] tracking-[0.48px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-[16px] text-black tracking-[0.48px]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Enter Your Email"
                className="w-full h-[60px] px-5 py-4 bg-white border border-[#7ca6bf] rounded-xl text-[16px] tracking-[0.48px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all"
              />
            </div>

            {/* Password & Confirm Password - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-[16px] text-black tracking-[0.48px]">
                  Password
                </label>
                <div className="relative h-[60px]">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="Enter Your Password"
                    className="w-full h-full px-5 py-4 bg-white border border-[#7ca6bf] rounded-xl text-[16px] tracking-[0.48px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-0 bottom-0 flex items-center text-[#C4C4C4] hover:text-[#1d395e] transition-colors"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-[16px] text-black tracking-[0.48px]">
                  Confirm Password
                </label>
                <div className="relative h-[60px]">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="Confirm Your Password"
                    className="w-full h-full px-5 py-4 bg-white border border-[#7ca6bf] rounded-xl text-[16px] tracking-[0.48px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-0 bottom-0 flex items-center text-[#C4C4C4] hover:text-[#1d395e] transition-colors"
                    aria-label="toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label htmlFor="companyName" className="block text-[16px] text-black tracking-[0.48px]">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={values.companyName}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Enter Your Company"
                className="w-full h-[60px] px-5 py-4 bg-white border border-[#7ca6bf] rounded-xl text-[16px] tracking-[0.48px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1d395e] focus:ring-2 focus:ring-[#1d395e]/20 transition-all"
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
                    className="peer w-6 h-6 appearance-none rounded-full border border-[#1D395E] bg-white cursor-pointer transition-all checked:bg-[#1D395E] checked:border-[#1D395E]"
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
                <span className="text-[16px] text-black">
                  I agree with the terms of use of <span className="font-semibold text-[#1d395e]">HRIS</span>
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
                {loading ? "Signing up..." : "SIGN UP"}
              </button>
            </div>

            {/* Continue with Google */}
            <div className="pt-2">
              <button
                type="button"
                style={{ border: "1px solid rgba(0,0,0,0.5)" }}
                className="w-full h-[59.516px] bg-white rounded-[17.601px] flex items-center justify-center gap-3 text-[18px] font-bold text-black hover:bg-[#1d395e] hover:text-white hover:border-transparent active:bg-[#152a47] transition-all duration-200"
              >
                <img src={googleLogo} alt="Google" className="w-[37.44px] h-[37.44px]" />
                <span>Continue With Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="py-2">
              <div className="border-t border-black"></div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-[16px] font-bold leading-[16.427px]">
                <span className="text-[rgba(0,0,0,0.5)]">Already have an account? </span>
                <a
                  href="/auth/sign-in"
                  style={{ textDecoration: "underline" }}
                  className="text-[#b93c54] hover:opacity-80 transition-opacity"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
