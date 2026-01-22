import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Download, Clock, Info, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { Notification } from "@/components/ui/Notification";
import { useTheme } from "@/app/hooks/useTheme";

// Assets
import logoHris from "@/assets/images/logo-hris-2.png";
import logoHrisWhite from "@/assets/images/hris-putih.png";

// Generate random order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${timestamp}${random}`;
};

// Generate random VA number for banks
const generateVANumber = (bankCode) => {
  const prefixes = {
    bca: "8277",
    bni: "8810",
    mandiri: "8912",
  };
  const prefix = prefixes[bankCode] || "8800";
  const random = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  return `${prefix}${random}`;
};

// Payment method configs
const paymentConfigs = {
  qris: {
    type: "qris",
    title: "QRIS",
    subtitle: "Scan dengan aplikasi e-wallet atau mobile banking",
    instructions: [
      "Pay with any payment application that supports QRIS.",
      "This is only valid for a single payment. Please return to the merchant for other transactions.",
      "Complete payment before the timer expires to ensure your order is processed immediately.",
    ],
  },
  dana: {
    type: "ewallet",
    title: "DANA",
    subtitle: "Bayar dengan DANA",
    instructions: [
      "Klik tombol 'Bayar dengan DANA' untuk membuka aplikasi DANA.",
      "Konfirmasi pembayaran di aplikasi DANA Anda.",
      "Setelah pembayaran berhasil, klik 'Saya Sudah Bayar'.",
    ],
  },
  bca: {
    type: "va",
    title: "BCA Virtual Account",
    subtitle: "Transfer via ATM/Mobile Banking BCA",
    instructions: [
      "Login ke BCA Mobile atau kunjungi ATM BCA terdekat.",
      "Pilih menu Transfer > ke BCA Virtual Account.",
      "Masukkan nomor Virtual Account dan jumlah transfer.",
      "Konfirmasi dan selesaikan pembayaran.",
    ],
  },
  mandiri: {
    type: "va",
    title: "Mandiri Virtual Account",
    subtitle: "Transfer via ATM/Livin' by Mandiri",
    instructions: [
      "Login ke Livin' by Mandiri atau kunjungi ATM Mandiri.",
      "Pilih menu Bayar > Multipayment.",
      "Masukkan nomor Virtual Account dan jumlah transfer.",
      "Konfirmasi dan selesaikan pembayaran.",
    ],
  },
  bni: {
    type: "va",
    title: "BNI Virtual Account",
    subtitle: "Transfer via ATM/BNI Mobile Banking",
    instructions: [
      "Login ke BNI Mobile Banking atau kunjungi ATM BNI.",
      "Pilih menu Transfer > Virtual Account Billing.",
      "Masukkan nomor Virtual Account dan jumlah transfer.",
      "Konfirmasi dan selesaikan pembayaran.",
    ],
  },
  paypal: {
    type: "redirect",
    title: "PayPal",
    subtitle: "Pay with your PayPal account",
    instructions: [
      "Click 'Pay with PayPal' to open PayPal checkout.",
      "Login to your PayPal account and confirm payment.",
      "You will be redirected back after payment completion.",
    ],
  },
};

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Get payment data from navigation state
  const paymentData = location.state || {};
  const { 
    paymentMethod = "qris", 
    total = 51000, 
    planName = "PREMIUM",
    employeeCount = 3,
    billingPeriod = "single"
  } = paymentData;

  // State
  const [orderNumber] = useState(() => generateOrderNumber());
  const [vaNumber] = useState(() => generateVANumber(paymentMethod));
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [notification, setNotification] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get payment config
  const config = paymentConfigs[paymentMethod] || paymentConfigs.qris;

  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const time = formatTime(timeLeft);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Copy to clipboard
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setNotification({
      type: "success",
      message: `${label} berhasil disalin!`,
    });
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    setNotification({
      type: "success",
      message: "Pembayaran sedang diverifikasi...",
    });
    
    // Simulate verification then redirect
    setTimeout(() => {
      navigate("/payment/success", {
        state: {
          orderNumber,
          total,
          planName,
          paymentMethod: config.title,
          employeeCount,
          billingPeriod,
        },
      });
    }, 2000);
  };

  // Handle cancel
  const handleCancel = () => {
    const confirm = window.confirm("Apakah Anda yakin ingin membatalkan transaksi ini?");
    if (confirm) {
      navigate("/payment");
    }
  };

  // Generate dummy QR code URL (in real app, this would come from payment gateway)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=HRIS-PAYMENT-${orderNumber}-${total}`;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#e8f4fc] to-[#f0f7ff] ${isLoaded ? "page-enter" : "opacity-0"}`}>
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={isDark ? logoHrisWhite : logoHris} 
              alt="HRIS" 
              className="h-8 sm:h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate("/")}
              title="Kembali ke Beranda"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Order Info */}
          <div className="space-y-6 stagger-children">
            {/* Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1d395e] mb-2">
                Payment Confirmation
              </h1>
              <p className="text-gray-500">
                Complete your transaction using {config.title}.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm card-lift">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-[#1d395e] font-mono">{orderNumber}</p>
                    <button 
                      onClick={() => handleCopy(orderNumber, "Order number")}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-[#e85a5a]">
                    Rp {formatCurrency(total)}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    {planName} Package • {employeeCount} Employees • {billingPeriod === "single" ? "Single Payment" : "Monthly"}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm card-lift">
              <h3 className="font-semibold text-[#1d395e] mb-4">Attention</h3>
              <ul className="space-y-3">
                {config.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                    <Info className="w-4 h-4 text-[#1d395e] mt-0.5 flex-shrink-0" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-[#e85a5a] hover:text-[#c94a4a] font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel Transaction
            </button>
          </div>

          {/* Right Column - Payment Method Specific */}
          <div className="slide-up-enter" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm card-lift">
              {/* Timer */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img src={isDark ? logoHrisWhite : logoHris} alt="HRIS" className="h-6 w-auto opacity-50" />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${timeLeft < 60 ? "bg-red-50 text-red-600" : "bg-[#e85a5a]/10 text-[#e85a5a]"}`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-bold">
                    {time.minutes} : {time.seconds}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Bank system maintenance or similar issues may delay transactions between 30-60 minutes.
                  </p>
                </div>
              </div>

              {/* Payment Content based on type */}
              {config.type === "qris" && (
                <div className="text-center">
                  {/* QR Code */}
                  <div className="inline-block p-4 bg-white border-2 border-gray-100 rounded-2xl mb-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-xs font-bold text-[#1d395e]">QRIS</span>
                      <div className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                        QR Code Standar<br/>Pembayaran Nasional
                      </div>
                    </div>
                    <img 
                      src={qrCodeUrl} 
                      alt="QRIS Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Scan This Code With Your Banking App
                  </p>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = qrCodeUrl;
                      link.download = `QRIS-${orderNumber}.png`;
                      link.click();
                    }}
                    className="inline-flex items-center gap-2 text-[#1d395e] hover:text-[#2a4a6e] font-medium text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download QR Code
                  </button>
                </div>
              )}

              {config.type === "va" && (
                <div className="text-center">
                  {/* Virtual Account */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">{config.title}</p>
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-2xl font-bold font-mono text-[#1d395e] tracking-wider">
                        {vaNumber}
                      </p>
                      <button 
                        onClick={() => handleCopy(vaNumber, "Nomor VA")}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Copy className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-1">Transfer Amount</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-xl font-bold text-[#1d395e]">
                        Rp {formatCurrency(total)}
                      </p>
                      <button 
                        onClick={() => handleCopy(total.toString(), "Jumlah transfer")}
                        className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Transfer sesuai nominal untuk verifikasi otomatis
                    </p>
                  </div>
                </div>
              )}

              {config.type === "ewallet" && (
                <div className="text-center">
                  {/* E-Wallet */}
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">D</span>
                    </div>
                    <p className="text-lg font-semibold text-[#1d395e] mb-2">
                      Bayar dengan {config.title}
                    </p>
                    <p className="text-3xl font-bold text-[#e85a5a] mb-4">
                      Rp {formatCurrency(total)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNotification({
                        type: "info",
                        message: "Membuka aplikasi DANA...",
                      });
                    }}
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors mb-4"
                  >
                    Bayar dengan DANA
                  </button>
                </div>
              )}

              {config.type === "redirect" && (
                <div className="text-center">
                  {/* PayPal */}
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-[#003087] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-lg font-bold">PayPal</span>
                    </div>
                    <p className="text-lg font-semibold text-[#1d395e] mb-2">
                      Pay with {config.title}
                    </p>
                    <p className="text-3xl font-bold text-[#e85a5a] mb-2">
                      Rp {formatCurrency(total)}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      ≈ ${(total / 15500).toFixed(2)} USD
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNotification({
                        type: "info",
                        message: "Redirecting to PayPal...",
                      });
                    }}
                    className="w-full py-3 bg-[#003087] text-white font-semibold rounded-xl hover:bg-[#001f5c] transition-colors flex items-center justify-center gap-2 mb-4"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Pay with PayPal
                  </button>
                </div>
              )}

              {/* Expiration */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <span className="text-sm text-gray-400">Expiration Date</span>
                <span className="text-sm font-medium text-[#1d395e]">
                  {new Date(Date.now() + timeLeft * 1000).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>

              {/* Complete Payment Button */}
              <button
                onClick={handlePaymentComplete}
                className="w-full mt-6 py-4 bg-[#1d395e] text-white font-semibold rounded-xl hover:bg-[#2a4a6e] transition-colors flex items-center justify-center gap-2 btn-press"
              >
                <CheckCircle className="w-5 h-5" />
                I Have Completed Payment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
