import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check, User, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/store/authStore";
import ConfirmModal from "@/components/ui/ConfirmModal";

// Assets
import logoHris from "@/assets/images/logo-hris-2.png";
import logoBni from "@/assets/images/payment/logo-bni.png";

// Payment method logos (using placeholder/external URLs for demo)
const paymentMethods = [
  { id: "qris", name: "QRIS", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" },
  { id: "dana", name: "DANA", logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" },
  { id: "bca", name: "BCA", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" },
  { id: "mandiri", name: "Mandiri", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" },
  { id: "bni", name: "BNI", logo: logoBni },
  { id: "paypal", name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
];

// Pricing data - Package plans (fitur-based, flexible employee count)
const packagePlans = {
  BASIC: {
    name: "BASIC",
    subtitle: "Untuk bisnis kecil & tim awal",
    pricePerUser: {
      single: 12000,  // Single payment (one-time)
      monthly: 10000, // Monthly subscription
    },
    minEmployees: 1,
    maxEmployees: 50,
    teamSizeLabel: "1 - 50",
    features: [
      "Attendance & List Hadir",
      "GPS based attendance validation",
      "Employee data management",
      "Leave & time off request",
      "Overtime management",
      "Fixed work schedule management",
    ],
  },
  STANDARD: {
    name: "STANDARD",
    subtitle: "Untuk tim berkembang & Operasional stabil",
    pricePerUser: {
      single: 15000,
      monthly: 13000,
    },
    minEmployees: 1,
    maxEmployees: 100,
    teamSizeLabel: "1 - 100",
    features: [
      "Attendance & List Hadir",
      "GPS-based attendance validation",
      "Employee data management",
      "Leave & time off request",
      "Overtime management",
      "Fixed work schedule management",
      "Automatic tax calculation",
    ],
  },
  PREMIUM: {
    name: "PREMIUM",
    subtitle: "Flexible & professional",
    pricePerUser: {
      single: 17000,
      monthly: 15000,
    },
    minEmployees: 1,
    maxEmployees: 200,
    teamSizeLabel: "1 - 200",
    features: [
      "All Standard Features",
      "Clock in/out attendance settings",
      "Payroll integration",
      "Employee document management",
      "Sick leave & time off setting",
      "Shift management",
      "Overtime management (custom)",
    ],
  },
};

// Pricing data - Seat plans (employee count determines tier)
const seatPlans = {
  STARTER: {
    name: "STARTER",
    pricePerUser: { single: 10800, monthly: 9000 },
    minEmployees: 1,
    maxEmployees: 20,
    teamSizeLabel: "1 - 20",
    description: "For 1-20 employees, suitable for a small team.",
  },
  STANDARD: {
    name: "STANDARD",
    pricePerUser: { single: 34800, monthly: 29000 },
    minEmployees: 1,
    maxEmployees: 50,
    teamSizeLabel: "1 - 50",
    description: "For 21-50 employees, suitable for growing team.",
  },
  PREMIUM: {
    name: "PREMIUM",
    pricePerUser: { single: 58800, monthly: 49000 },
    minEmployees: 1,
    maxEmployees: 100,
    teamSizeLabel: "1 - 100",
    description: "For 51-100 employees, suitable for complex operations.",
  },
  BUSINESS: {
    name: "BUSINESS",
    pricePerUser: { single: 94800, monthly: 79000 },
    minEmployees: 1,
    maxEmployees: 200,
    teamSizeLabel: "1 - 200",
    description: "For 101-200 employees, suitable for company scale up.",
  },
  ENTERPRISE: {
    name: "ENTERPRISE",
    pricePerUser: { single: 154800, monthly: 129000 },
    minEmployees: 1,
    maxEmployees: 500,
    teamSizeLabel: "1 - 500",
    description: "For 201-500 employees, advanced HR solutions.",
  },
  "ENTERPRISE PLUS": {
    name: "ENTERPRISE PLUS",
    pricePerUser: { single: 199000, monthly: 179000 },
    minEmployees: 1,
    maxEmployees: 9999,
    teamSizeLabel: "Unlimited",
    description: "For 500+ employees, custom enterprise solution.",
  },
};

export default function PaymentInformation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  
  // Check if user is authenticated
  const isAuthenticated = !!token;

  // Get state from navigation (from landing page) or restore from sessionStorage
  const getInitialState = () => {
    // First check if there's navigation state
    if (location.state?.selectedPlan) {
      return location.state;
    }
    
    // Then check sessionStorage for pending payment (after login redirect)
    const pendingPayment = sessionStorage.getItem("pendingPayment");
    if (pendingPayment) {
      try {
        const parsed = JSON.parse(pendingPayment);
        // Clear the pending payment after retrieving
        sessionStorage.removeItem("pendingPayment");
        return parsed;
      } catch {
        sessionStorage.removeItem("pendingPayment");
      }
    }
    
    return {};
  };
  
  const initialState = getInitialState();

  // State
  const [planType, _setPlanType] = useState(initialState.planType || "package"); // "package" or "seat"
  const [selectedPlan, _setSelectedPlan] = useState(initialState.selectedPlan || "PREMIUM");
  const [billingPeriod, setBillingPeriod] = useState(initialState.billingPeriod || "single"); // "single" or "monthly"
  const [employeeCount, setEmployeeCount] = useState(initialState.employeeCount || 3);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Get current plan data based on type
  const currentPlan = useMemo(() => {
    if (planType === "package") {
      return packagePlans[selectedPlan] || packagePlans.PREMIUM;
    } else {
      return seatPlans[selectedPlan] || seatPlans.PREMIUM;
    }
  }, [planType, selectedPlan]);

  // Validate and adjust employee count based on plan limits
  useEffect(() => {
    if (employeeCount < currentPlan.minEmployees) {
      setEmployeeCount(currentPlan.minEmployees);
    } else if (employeeCount > currentPlan.maxEmployees) {
      setEmployeeCount(currentPlan.maxEmployees);
    }
  }, [currentPlan, employeeCount]);

  // Calculate pricing
  const pricing = useMemo(() => {
    const pricePerUser = currentPlan.pricePerUser[billingPeriod];
    const subtotal = pricePerUser * employeeCount;
    const taxRate = 0; // 0% tax for now (can be adjusted)
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      pricePerUser,
      subtotal,
      tax,
      total,
    };
  }, [currentPlan, billingPeriod, employeeCount]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle employee count change
  const handleEmployeeChange = (delta) => {
    const newCount = employeeCount + delta;
    if (newCount >= currentPlan.minEmployees && newCount <= currentPlan.maxEmployees) {
      setEmployeeCount(newCount);
    }
  };

  // Handle change plan - navigate to pricing section
  const handleChangePlan = () => {
    navigate("/", { state: { scrollTo: "pricing" } });
    // Scroll to pricing after navigation
    setTimeout(() => {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Handle confirm and payment
  const handleConfirmPayment = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedPaymentMethod) {
      setShowPaymentMethodModal(true);
      return;
    }

    // Navigate to payment confirmation page with payment data
    navigate("/payment/confirmation", {
      state: {
        paymentMethod: selectedPaymentMethod.id,
        paymentMethodName: selectedPaymentMethod.name,
        total: pricing.total,
        planName: selectedPlan,
        employeeCount,
        billingPeriod,
        planType,
        pricePerUser: pricing.pricePerUser,
      },
    });
  };

  // Handle login confirmation
  const handleLoginConfirm = () => {
    // Save payment state to sessionStorage for after login redirect
    sessionStorage.setItem("pendingPayment", JSON.stringify({
      planType,
      selectedPlan,
      billingPeriod,
      employeeCount,
    }));
    navigate("/auth/sign-in", { state: { from: "/payment" } });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#e8f4fc] to-[#f0f7ff] ${isLoaded ? "page-enter" : "opacity-0"}`}>
      {/* Login Confirmation Modal */}
      <ConfirmModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
        type="login"
        title="Masuk ke Akun"
        message="Untuk melanjutkan pembayaran, Anda harus masuk ke akun terlebih dahulu.

Klik 'Sign In' untuk masuk atau membuat akun baru."
        confirmText="Sign In"
        cancelText="Batal"
      />

      {/* Payment Method Required Modal */}
      <ConfirmModal
        isOpen={showPaymentMethodModal}
        onClose={() => setShowPaymentMethodModal(false)}
        onConfirm={() => setShowPaymentMethodModal(false)}
        type="warning"
        title="Pilih Metode Pembayaran"
        message="Silakan pilih metode pembayaran terlebih dahulu sebelum melanjutkan."
        confirmText="OK, Mengerti"
        cancelText="Tutup"
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10 slide-up-enter" style={{ animationDelay: '0.1s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <img 
                src={logoHris} 
                alt="HRIS" 
                className="h-8 sm:h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => navigate("/")}
                title="Kembali ke Beranda"
              />
            </div>
            
            {/* Right side - Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1d395e]/5 rounded-lg">
                  <User className="w-4 h-4 text-[#1d395e]" />
                  <span className="text-sm font-medium text-[#1d395e]">
                    {user?.firstName || user?.email || "User"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate("/auth/sign-in", { state: { from: "/payment" } })}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium text-[#1d395e] border-2 border-[#1d395e] hover:bg-[#1d395e] hover:text-white rounded-lg transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => navigate("/auth/sign-up", { state: { from: "/payment" } })}
                    className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-[#1d395e] hover:bg-[#2a4a6e] rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Notice Banner */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-amber-800">
                <span className="font-medium">⚠️ Belum masuk akun.</span> Silakan{" "}
                <button
                  onClick={() => navigate("/auth/sign-in", { state: { from: "/payment" } })}
                  className="font-semibold underline hover:text-amber-900"
                >
                  Sign In
                </button>{" "}
                atau{" "}
                <button
                  onClick={() => navigate("/auth/sign-up", { state: { from: "/payment" } })}
                  className="font-semibold underline hover:text-amber-900"
                >
                  Sign Up
                </button>{" "}
                untuk melanjutkan pembayaran.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Plan Configuration */}
          <div className="lg:col-span-3 space-y-6 stagger-children">
            {/* Plan Header */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm card-lift">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1d395e] mb-2">
                {currentPlan.name} Packet
              </h1>
              <p className="text-gray-500 mb-1">
                Upgrade to {currentPlan.name}
              </p>
              <button
                onClick={handleChangePlan}
                className="text-[#e85a5a] text-sm font-medium hover:underline"
              >
                Change plan
              </button>
            </div>

            {/* Billing Period */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm card-lift">
              <h2 className="text-lg font-semibold text-[#1d395e] mb-4">Billing Period</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setBillingPeriod("single")}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    billingPeriod === "single"
                      ? "border-[#1d395e] bg-[#1d395e] text-white"
                      : "border-gray-200 hover:border-[#1d395e]/50 text-gray-700"
                  }`}
                >
                  <div className="font-medium">Single Payment</div>
                  <div className={`text-sm ${billingPeriod === "single" ? "text-white/80" : "text-gray-500"}`}>
                    Rp {formatCurrency(currentPlan.pricePerUser.single)} / User
                  </div>
                </button>
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    billingPeriod === "monthly"
                      ? "border-[#1d395e] bg-[#1d395e] text-white"
                      : "border-gray-200 hover:border-[#1d395e]/50 text-gray-700"
                  }`}
                >
                  <div className="font-medium">Monthly</div>
                  <div className={`text-sm ${billingPeriod === "monthly" ? "text-white/80" : "text-gray-500"}`}>
                    Rp {formatCurrency(currentPlan.pricePerUser.monthly)} / User / Month
                  </div>
                </button>
              </div>
            </div>

            {/* Team Size & Employee Count */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm card-lift">
              <h2 className="text-lg font-semibold text-[#1d395e] mb-1">Number Of Employees</h2>
              <p className="text-gray-500 text-sm mb-4">
                Paket <span className="font-medium text-[#1d395e]">{currentPlan.name}</span> mendukung hingga <span className="font-medium text-[#e85a5a]">{currentPlan.maxEmployees === 9999 ? "unlimited" : currentPlan.maxEmployees}</span> karyawan
              </p>

              {/* Employee Counter */}
              <div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleEmployeeChange(-1)}
                    disabled={employeeCount <= currentPlan.minEmployees}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      employeeCount <= currentPlan.minEmployees
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#1d395e] text-white hover:bg-[#2a4a6e]"
                    }`}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={employeeCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || currentPlan.minEmployees;
                      if (val >= currentPlan.minEmployees && val <= currentPlan.maxEmployees) {
                        setEmployeeCount(val);
                      }
                    }}
                    min={currentPlan.minEmployees}
                    max={currentPlan.maxEmployees}
                    className="w-24 h-12 text-center bg-gray-50 rounded-xl text-xl font-semibold text-[#1d395e] border-0 focus:ring-2 focus:ring-[#1d395e]/20"
                  />
                  <button
                    onClick={() => handleEmployeeChange(1)}
                    disabled={employeeCount >= currentPlan.maxEmployees}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      employeeCount >= currentPlan.maxEmployees
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#1d395e] text-white hover:bg-[#2a4a6e]"
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Min: {currentPlan.minEmployees} • Max: {currentPlan.maxEmployees === 9999 ? "Unlimited" : currentPlan.maxEmployees} employees
                </p>
              </div>
            </div>

            {/* Continue Button (Mobile) */}
            <div className="lg:hidden">
              <button
                onClick={handleConfirmPayment}
                className="w-full py-4 rounded-xl bg-[#1d395e] text-white font-semibold hover:bg-[#2a4a6e] transition-colors btn-press"
              >
                Continue
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2 slide-up-enter" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm sticky top-24 card-lift">
              <h2 className="text-xl font-bold text-[#1d395e] mb-6">Order Summary</h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package</span>
                  <span className="font-medium text-[#1d395e]">: {currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing Period</span>
                  <span className="font-medium text-[#1d395e]">
                    : {billingPeriod === "single" ? "Single Payment" : "Monthly"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Capacity</span>
                  <span className="font-medium text-[#1d395e]">: {currentPlan.teamSizeLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number Of Employee</span>
                  <span className="font-medium text-[#1d395e]">: {employeeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Per User</span>
                  <span className="font-medium text-[#1d395e]">
                    : Rp {formatCurrency(pricing.pricePerUser)}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6" />

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-[#1d395e]">
                    : Rp {formatCurrency(pricing.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-[#1d395e]">
                    : Rp {formatCurrency(pricing.tax)}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6" />

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span className="font-semibold text-[#1d395e]">Total At Renewal</span>
                <span className="text-xl font-bold text-[#1d395e]">
                  : Rp {formatCurrency(pricing.total)}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Select Payment Method</p>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center h-14 ${
                        selectedPaymentMethod?.id === method.id
                          ? "border-[#1d395e] bg-[#1d395e]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="h-6 w-auto object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <span 
                        className="text-xs font-medium text-gray-600 hidden"
                        style={{ display: "none" }}
                      >
                        {method.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmPayment}
                className={`w-full py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 btn-press ${
                  isAuthenticated
                    ? "bg-[#1d395e] text-white hover:bg-[#2a4a6e] shadow-[#1d395e]/20"
                    : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                }`}
              >
                {isAuthenticated ? (
                  "Confirm And Payment"
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In to Continue
                  </>
                )}
              </button>

              {/* Security Note */}
              <p className="text-xs text-gray-400 text-center mt-4">
                🔒 Pembayaran Anda aman dan terenkripsi
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
