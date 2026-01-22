import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";

/**
 * AuthCallback Page
 * Handles OAuth callback from Google authentication
 * Extracts token and user from URL params and stores them
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuth((s) => s.setAuth);
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const errorParam = searchParams.get("error");

        console.log("=== AUTH CALLBACK DEBUG ===");
        console.log("Token:", token ? "exists" : "missing");
        console.log("User Param:", userParam);

        if (errorParam) {
          setStatus("error");
          setError(getErrorMessage(errorParam));
          setTimeout(() => navigate("/auth/sign-in"), 3000);
          return;
        }

        if (!token || !userParam) {
          setStatus("error");
          setError("Invalid callback parameters");
          setTimeout(() => navigate("/auth/sign-in"), 3000);
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userParam));
        
        console.log("Parsed User:", user);
        console.log("needsCompanySetup:", user.needsCompanySetup);
        console.log("companyId:", user.companyId);
        console.log("role:", user.role);

        // Store token and user data using the auth store
        setAuth(token, user);

        setStatus("success");

        // Check if user needs to setup company (new Google OAuth user OR existing user without company)
        if (user.needsCompanySetup || !user.companyId) {
          console.log("➡️ Redirecting to company-name page...");
          setTimeout(() => {
            navigate("/auth/company-name", { 
              state: { 
                fromGoogleAuth: true,
                userData: user 
              } 
            });
          }, 1500);
          return;
        }

        // Redirect based on role (existing user with company)
        console.log("➡️ Redirecting to dashboard...");
        setTimeout(() => {
          if (user.role === "admin" || user.role === "super_admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }, 1500);
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setError("Failed to process authentication");
        setTimeout(() => navigate("/auth/sign-in"), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, setAuth]);

  const getErrorMessage = (errorCode) => {
    const messages = {
      google_auth_failed: "Google authentication failed. Please try again.",
      no_user: "User account not found.",
      callback_error: "An error occurred during authentication.",
    };
    return messages[errorCode] || "An unknown error occurred.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Completing Sign In...
            </h2>
            <p className="text-gray-500 mt-2">
              Please wait while we verify your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Sign In Successful!
            </h2>
            <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Authentication Failed
            </h2>
            <p className="text-red-500 mt-2">{error}</p>
            <p className="text-gray-400 text-sm mt-4">
              Redirecting to sign in...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
