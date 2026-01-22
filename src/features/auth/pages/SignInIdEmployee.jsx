import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/app/store/authStore";
import { useTheme } from "@/app/hooks/useTheme";
import { Notification } from "@/components/ui/Notification";
import logo from "@/assets/branding/logo-hris-1.png";
import logoWhite from "@/assets/images/hris-putih.png";
import signInIdIllustration from "@/assets/images/auth/sign-in-id.png";

/* ---------- Page ---------- */
export default function SignInIdEmployee() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [_isLoaded, setIsLoaded] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // store
  const loginEmployee = useAuth((s) => s.loginEmployee);
  const loading = useAuth((s) => s.loading);

  // form state
  const [values, setValues] = useState({
    companyUsername: "",
    idEmployee: "",
    password: "",
  });
  const [_touched, setTouched] = useState({});
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load saved credentials on mount (Remember Me feature)
  useEffect(() => {
    const savedCredentials = localStorage.getItem("hris_remember_signin_id");
    if (savedCredentials) {
      try {
        const { companyUsername, idEmployee, remember: wasRemembered } = JSON.parse(savedCredentials);
        if (wasRemembered) {
          setValues(prev => ({ 
            ...prev, 
            companyUsername: companyUsername || "",
            idEmployee: idEmployee || ""
          }));
          setRemember(true);
        }
      } catch {
        localStorage.removeItem("hris_remember_signin_id");
      }
    }
  }, []);

  const onChange = (e) =>
    setValues((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    const { name, value } = e.target;
    if (!value.trim()) {
      const fieldNames = {
        companyUsername: "Company Username",
        idEmployee: "ID Employee",
        password: "Password",
      };
      setNotification({
        type: "warning",
        message: `Please fill in ${fieldNames[name] || name} field.`,
      });
    }
  };

  // validation
  const errors = useMemo(() => {
    const e = {};
    if (!values.companyUsername.trim())
      e.companyUsername = "Company Username is required.";
    if (!values.idEmployee.trim()) e.idEmployee = "ID Employee is required.";
    if (!values.password) e.password = "Password is required.";
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  // handlers
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched({
      companyUsername: true,
      idEmployee: true,
      password: true,
      submit: true,
    });

    if (!isValid) {
      setNotification({
        type: "warning",
        message: "Please fill in all fields to sign in.",
      });
      return;
    }

    // Call loginEmployee with Employee ID credentials
    // Map: companyUsername -> companyUser, idEmployee -> employeeId
    const { ok, error } = await loginEmployee({
      companyUser: values.companyUsername,
      employeeId: values.idEmployee,
      password: values.password,
    });

    if (ok) {
      // Handle Remember Me - save or remove credentials
      if (remember) {
        localStorage.setItem("hris_remember_signin_id", JSON.stringify({
          companyUsername: values.companyUsername,
          idEmployee: values.idEmployee,
          remember: true
        }));
      } else {
        localStorage.removeItem("hris_remember_signin_id");
      }
      // Redirect ke user dashboard (employee bukan admin)
      navigate("/user/dashboard");
    } else {
      setNotification({
        type: "error",
        message:
          error && error !== "kredensial salah"
            ? error
            : "Invalid credentials. Please check your Company Username, ID Employee, or Password.",
      });
    }
  };

  const handleUseDifferentMethod = () => {
    navigate("/auth/sign-in");
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
            src={signInIdIllustration}
            alt="Sign In with ID Employee"
            className="w-full h-auto object-contain illustration-bounce"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 auth-content-enter ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="w-full max-w-[842px]">
          {/* Header with Logo */}
          <div className="flex items-center justify-start mb-11">
            <div className="w-[148px]">
              <img
                src={isDark ? logoWhite : logo}
                alt="HRIS"
                className="w-auto h-auto max-h-16 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate("/")}
                title="Kembali ke Beranda"
              />
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-8">
            <h1 className={`text-[48px] font-bold tracking-[1.8px] leading-tight mb-2 ${isDark ? 'text-gray-100' : 'text-[#2a2a2a]'}`}>
              Sign in with ID Employee
            </h1>
            <p className={`text-[20px] tracking-[0.72px] leading-[28px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
              Welcome back to HRIS cmlabs! Manage everything with ease.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            {/* Company Username */}
            <div className="space-y-1">
              <label
                htmlFor="companyUsername"
                className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-200' : 'text-black'}`}
              >
                Company Username
              </label>
              <input
                id="companyUsername"
                name="companyUsername"
                type="text"
                value={values.companyUsername}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Enter your Company Username"
                className={`w-full h-[73px] px-5 py-6 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                    : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                }`}
              />
            </div>

            {/* ID Employee */}
            <div className="space-y-1">
              <label
                htmlFor="idEmployee"
                className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-200' : 'text-black'}`}
              >
                ID Employee
              </label>
              <input
                id="idEmployee"
                name="idEmployee"
                type="text"
                value={values.idEmployee}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Enter your ID Employee"
                className={`w-full h-[73px] px-5 py-6 border rounded-xl text-[16px] tracking-[0.48px] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                    : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                }`}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className={`block text-[16px] tracking-[0.48px] ${isDark ? 'text-gray-200' : 'text-black'}`}
              >
                Password
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
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400/20' 
                      : 'bg-white border-[#7ca6bf] text-black focus:border-[#1d395e] focus:ring-[#1d395e]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-0 bottom-0 flex items-center transition-colors ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-[#C4C4C4] hover:text-[#1d395e]'}`}
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <EyeOff size={26} /> : <Eye size={26} />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between pt-2 pb-2">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <div className="relative flex-shrink-0 w-6 h-6">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className={`peer w-6 h-6 appearance-none rounded-full border cursor-pointer transition-all checked:bg-[#1D395E] checked:border-[#1D395E] ${isDark ? 'border-gray-500 bg-gray-700' : 'border-[#1D395E] bg-white'}`}
                  />
                  <svg
                    className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className={`text-[18px] ${isDark ? 'text-gray-200' : 'text-black'}`}>Remember Me</span>
              </label>

              <a
                href="/auth/forgot-password"
                className="text-[18px] text-[#b93c54] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full h-[59.516px] bg-[#1d395e] text-white text-[18px] font-bold uppercase leading-[16.427px] rounded-[17.601px] hover:bg-[#2a4a6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "SIGN IN"}
              </button>
            </div>

            {/* Use Different Sign-in Method */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleUseDifferentMethod}
                className={`w-full h-[59.516px] rounded-[17.601px] text-[18px] font-bold transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-700 border border-gray-600 text-gray-200 hover:bg-[#1d395e] hover:text-white hover:border-transparent' 
                    : 'bg-white border border-black/50 text-black hover:bg-[#1d395e] hover:text-white hover:border-transparent'
                } active:bg-[#152a47]`}
              >
                Use a different sign-in method
              </button>
            </div>

            {/* Divider */}
            <div className="py-2">
              <div className={`border-t ${isDark ? 'border-gray-600' : 'border-black'}`}></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-[16px] font-bold leading-[16.427px]">
                <span className={isDark ? 'text-gray-400' : 'text-[rgba(0,0,0,0.5)]'}>
                  Don't have an account yet?{" "}
                </span>
                <a
                  href="/auth/sign-up"
                  className="text-[#b93c54] hover:underline"
                >
                  Sign up now and get started
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
