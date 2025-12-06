import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/app/store/authStore";
import AuthLayout from "@/app/layouts/AuthLayout.jsx";
import logo from "@/assets/branding/logo-hris-1.png";
import illustration from "@/assets/images/auth/logincontoh.png";
import googleLogo from "@/assets/branding/google.webp";

/* ---------- UI helpers ---------- */
function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 text-xs md:text-sm font-medium text-neutral-700">
      {children}
    </label>
  );
}

function TextInput({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  rightIcon,
  onRightIconClick,
}) {
  const base =
    "w-full rounded-2xl bg-white px-4 py-3 text-sm md:text-base outline-none transition-all duration-150 placeholder:text-neutral-400";
  const ok =
    "border-2 border-neutral-900/70 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const err =
    "border-2 border-red-500 hover:border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20";
  const withIcon = rightIcon ? " pr-12" : "";

  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={base + withIcon + " " + (error ? err : ok)}
      />

      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className={`absolute inset-y-0 right-2 flex items-center justify-center p-2 rounded-md transition-colors ${
            error ? "text-red-400 hover:text-red-600" : "text-neutral-400 hover:text-blue-800"
          }`}
          aria-label="toggle password visibility"
        >
          {rightIcon}
        </button>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Page ---------- */
export default function SignIn() {
  const navigate = useNavigate();

  // store
  const login            = useAuth((s) => s.login);
  const loginWithGoogle  = useAuth((s) => s.loginWithGoogle);
  const loading          = useAuth((s) => s.loading);
  const errorAuth        = useAuth((s) => s.error);

  // form state
  const [values, setValues] = useState({ identifier: "", password: "" });
  const [touched, setTouched] = useState({});
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  const onBlur   = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  // validation
  const errors = useMemo(() => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[0-9+\-\s()]{9,}$/;
    if (!values.identifier.trim()) e.identifier = "Email or phone is required.";
    else if (!emailRe.test(values.identifier) && !phoneRe.test(values.identifier))
      e.identifier = "Enter a valid email or phone number.";
    if (!values.password) e.password = "Password is required.";
    return e;
  }, [values]);
  const isValid = Object.keys(errors).length === 0;

  // === GOOGLE IDENTITY SERVICES init ===
  useEffect(() => {
    const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !cid) return;

    window.google.accounts.id.initialize({
      client_id: cid,
      callback: async (response) => {
        // response.credential = JWT Google
        const { ok } = await loginWithGoogle(response.credential);
        if (ok) navigate("/dashboard");
      },
    });
    // (opsional) bisa render button default GIS ke elemen tertentu jika mau
    // window.google.accounts.id.renderButton(document.getElementById('google-btn'), { theme: 'outline' });
  }, [loginWithGoogle, navigate]);

  // handlers
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched({ identifier: true, password: true, submit: true });
    if (!isValid) return;

    const { ok } = await login({
      identifier: values.identifier,
      password: values.password,
    });

    if (ok) {
      // implementasi "remember me" kalau diperlukan
      navigate("/dashboard");
    }
  };

  const handleGoogleClick = () => {
    if (!window.google) return;
    // munculkan One Tap / chooser popup; suksesnya diproses di callback initialize()
    window.google.accounts.id.prompt();
  };

  return (
    <AuthLayout>
      {/* MOBILE illustration */}
      <div className="md:hidden mb-8">
        <img src={illustration} alt="Sign in illustration" className="mx-auto h-auto w-72" loading="lazy" />
      </div>

      <div className="grid items-start gap-10 md:grid-cols-2">
        {/* DESKTOP illustration */}
        <div className="hidden md:block">
          <img src={illustration} alt="Sign in illustration" className="mx-auto h-auto w-[88%] max-w-xl" loading="lazy" />
        </div>

        {/* FORM */}
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-6 flex items-center justify-between">
            <img src={logo} alt="HRIS" className="h-10 w-auto" />
            <a href="#try" className="text-sm font-semibold text-brand-accent underline underline-offset-4">
              Try for free!
            </a>
          </div>

          <h1 className="text-[44px] leading-[1.1] font-semibold text-brand">Sign In</h1>
          <p className="mt-2 text-neutral-700 md:text-base text-sm">
            Welcome back to HRIS cmlabs! Manage everything with ease.
          </p>

          <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
            {/* Email / Phone */}
            <div className="flex flex-col">
              <Label htmlFor="identifier">Email or Phone Number</Label>
              <TextInput
                id="identifier"
                placeholder="Enter Your Email or Phone Number"
                value={values.identifier}
                onChange={onChange}
                onBlur={onBlur}
                error={touched.identifier && errors.identifier}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={values.password}
                onChange={onChange}
                onBlur={onBlur}
                error={touched.password && errors.password}
                rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                onRightIconClick={() => setShowPassword((v) => !v)}
              />
            </div>

            {/* Remember + Forgot */}
            <div className="mt-1 flex items-center justify-between">
              <label className="mt-1 flex items-center gap-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-blue-950 bg-white transition-all duration-200 hover:border-blue-800 checked:border-blue-900 checked:bg-blue-950 relative before:content-[''] before:absolute before:inset-0 before:m-auto before:rounded-full before:scale-0 before:bg-white before:transition-transform before:duration-200 checked:before:scale-[0.5]"
                />
                <span className="select-none">Remember me</span>
              </label>

              <a href="/auth/forgot-password" className="text-sm font-semibold text-brand-accent hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="group mt-2 w-full rounded-full border-2 border-transparent bg-blue-950 px-6 py-3.5 text-[13px] md:text-sm font-semibold tracking-wide text-white transition-all duration-200 ease-out enabled:hover:bg-white enabled:hover:text-blue-950 enabled:hover:border-blue-950 enabled:active:bg-white enabled:active:text-blue-950 enabled:focus:outline-none enabled:focus:ring-2 enabled:focus:ring-blue-950/30 enabled:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "SIGN IN"}
            </button>

            {/* Error dari store */}
            {errorAuth && <p className="text-xs text-red-600">{errorAuth}</p>}

            {/* Google CTA (custom) */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={loading}
              className="group w-full rounded-full border border-neutral-400 bg-white px-6 py-3 text-sm md:text-base font-medium text-neutral-900 shadow-soft transition-all duration-200 ease-out hover:bg-blue-950 hover:text-white hover:border-blue-950 active:bg-blue-950 active:text-white focus:outline-none focus:ring-2 focus:ring-blue-950/30"
            >
              <span className="inline-flex items-center justify-center gap-3">
                <img src={googleLogo} alt="Google" className="h-5 w-5" />
                Sign In With Google
              </span>
            </button>

            {/* Employee ID CTA (placeholder) */}
            <button
              type="button"
              className="group w-full rounded-full border border-neutral-400 bg-white px-6 py-3 text-sm md:text-base font-medium text-neutral-900 shadow-soft transition-all duration-200 ease-out hover:bg-blue-950 hover:text-white hover:border-blue-950 active:bg-blue-950 active:text-white focus:outline-none focus:ring-2 focus:ring-blue-950/30"
            >
              Sign In With ID Employee
            </button>

            {/* Divider + Link to Sign Up */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-neutral-500"></span>
              </div>
            </div>

            <div className="text-center text-xs md:text-sm text-neutral-600">
              Don't have an account yet?{" "}
              <a href="/auth/sign-up" className="font-semibold text-brand-accent hover:underline">
                Sign up now and get started
              </a>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
