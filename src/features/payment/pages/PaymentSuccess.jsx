import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Download, ArrowRight, Home } from "lucide-react";
import { jsPDF } from "jspdf";

// Assets
import logoHris from "@/assets/images/logo-hris-2.png";
import logoHrisPutih from "@/assets/images/hris-putih.png";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { 
    orderNumber = "N/A", 
    total = 0, 
    planName = "PREMIUM",
    paymentMethod = "QRIS",
    employeeCount = 1,
    billingPeriod = "single"
  } = location.state || {};

  // Payment date
  const paymentDate = new Date();
  const formattedDate = paymentDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = paymentDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate PDF Receipt
  const generatePdfReceipt = async () => {
    setIsGeneratingPdf(true);
    
    try {
      // Load logo image first and get its dimensions
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve({
              data: canvas.toDataURL("image/png"),
              width: img.width,
              height: img.height,
              aspectRatio: img.width / img.height,
            });
          };
          img.onerror = reject;
          img.src = src;
        });
      };

      // Load the logo
      let logoData = null;
      try {
        logoData = await loadImage(logoHrisPutih);
      } catch (e) {
        console.warn("Could not load logo image:", e);
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      // Colors
      const primaryBlue = [29, 57, 94]; // #1d395e
      const successGreen = [34, 197, 94]; // green-500
      const grayText = [107, 114, 128]; // gray-500
      const darkText = [31, 41, 55]; // gray-800

      // Header background
      doc.setFillColor(...primaryBlue);
      doc.rect(0, 0, pageWidth, 55, "F");

      // Add logo image or fallback to text
      if (logoData) {
        // Calculate logo size maintaining aspect ratio
        // Set max height for the logo area
        const maxLogoHeight = 25;
        const maxLogoWidth = 80;
        
        let logoWidth, logoHeight;
        
        // Calculate based on aspect ratio
        if (logoData.aspectRatio > (maxLogoWidth / maxLogoHeight)) {
          // Image is wider - constrain by width
          logoWidth = maxLogoWidth;
          logoHeight = logoWidth / logoData.aspectRatio;
        } else {
          // Image is taller - constrain by height
          logoHeight = maxLogoHeight;
          logoWidth = logoHeight * logoData.aspectRatio;
        }
        
        const logoX = (pageWidth - logoWidth) / 2;
        const logoY = 8;
        doc.addImage(logoData.data, "PNG", logoX, logoY, logoWidth, logoHeight);
        
        // Subtitle under logo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Human Resource Information System", pageWidth / 2, 40, { align: "center" });
        doc.setFontSize(8);
        doc.text("by CMLABS", pageWidth / 2, 47, { align: "center" });
      } else {
        // Fallback to text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("HRIS", pageWidth / 2, 28, { align: "center" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Human Resource Information System", pageWidth / 2, 38, { align: "center" });
        doc.setFontSize(8);
        doc.text("by CMLABS", pageWidth / 2, 45, { align: "center" });
      }

      yPos = 72;

      // Success Icon Circle
      const circleX = pageWidth / 2;
      const circleY = yPos;
      const circleRadius = 12;
      
      doc.setFillColor(...successGreen);
      doc.circle(circleX, circleY, circleRadius, "F");
      
      // Draw a proper checkmark using lines
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(2);
      // Checkmark path: starts from left, goes down to bottom, then up to right
      const checkStartX = circleX - 5;
      const checkStartY = circleY;
      const checkMidX = circleX - 1;
      const checkMidY = circleY + 4;
      const checkEndX = circleX + 6;
      const checkEndY = circleY - 4;
      
      doc.line(checkStartX, checkStartY, checkMidX, checkMidY); // Left part going down
      doc.line(checkMidX, checkMidY, checkEndX, checkEndY); // Right part going up

      yPos += 22;

      // Payment Successful Title
      doc.setTextColor(...primaryBlue);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Successful!", pageWidth / 2, yPos, { align: "center" });

      yPos += 10;

      doc.setTextColor(...grayText);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for your purchase. Your subscription is now active.", pageWidth / 2, yPos, { align: "center" });

      yPos += 18;

      // Receipt Box
      const boxX = margin;
      const boxWidth = pageWidth - (margin * 2);
      const boxStartY = yPos;
      const boxHeight = 90;

      // Box border
      doc.setDrawColor(229, 231, 235); // gray-200
      doc.setLineWidth(0.5);
      doc.roundedRect(boxX, boxStartY, boxWidth, boxHeight, 3, 3, "S");

      // Receipt Title background
      doc.setFillColor(249, 250, 251); // gray-50
      doc.roundedRect(boxX + 0.5, boxStartY + 0.5, boxWidth - 1, 18, 2, 2, "F");
      
      doc.setTextColor(...primaryBlue);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PAYMENT RECEIPT", pageWidth / 2, boxStartY + 12, { align: "center" });

      yPos = boxStartY + 28;

      // Receipt Details
      const labelX = boxX + 10;
      const valueX = boxX + boxWidth - 10;
      const lineHeight = 9;

      const receiptItems = [
        { label: "Order Number", value: orderNumber },
        { label: "Payment Date", value: formattedDate },
        { label: "Payment Time", value: formattedTime },
        { label: "Package", value: `${planName} Package` },
        { label: "Number of Employees", value: `${employeeCount} Employee${employeeCount > 1 ? 's' : ''}` },
        { label: "Billing Period", value: billingPeriod === "monthly" ? "Monthly Subscription" : "One-time Payment" },
        { label: "Payment Method", value: paymentMethod },
      ];

      doc.setFontSize(9);
      receiptItems.forEach((item, index) => {
        doc.setTextColor(...grayText);
        doc.setFont("helvetica", "normal");
        doc.text(item.label, labelX, yPos);
        
        doc.setTextColor(...darkText);
        doc.setFont("helvetica", "bold");
        doc.text(item.value, valueX, yPos, { align: "right" });
        
        yPos += lineHeight;

        // Add subtle line separator except for last item
        if (index < receiptItems.length - 1) {
          doc.setDrawColor(243, 244, 246); // gray-100
          doc.setLineWidth(0.2);
          doc.line(labelX, yPos - 3, valueX, yPos - 3);
        }
      });

      // Total Amount Box
      yPos = boxStartY + boxHeight + 8;
      const totalBoxY = yPos;
      
      doc.setFillColor(239, 246, 255); // blue-50
      doc.roundedRect(boxX, totalBoxY, boxWidth, 28, 3, 3, "F");
      doc.setDrawColor(...primaryBlue);
      doc.setLineWidth(0.5);
      doc.roundedRect(boxX, totalBoxY, boxWidth, 28, 3, 3, "S");

      doc.setTextColor(...grayText);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("TOTAL PAID", labelX, totalBoxY + 11);

      doc.setTextColor(...successGreen);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Rp ${formatCurrency(total)}`, valueX, totalBoxY + 19, { align: "right" });

      // Footer Line - position at the bottom
      const footerLineY = pageHeight - 30;
      doc.setDrawColor(...primaryBlue);
      doc.setLineWidth(0.8);
      doc.line(margin, footerLineY, pageWidth - margin, footerLineY);

      // Status Badge - position it centered between total box and footer line
      const badgeWidth = 40;
      const badgeHeight = 12;
      const badgeX = (pageWidth - badgeWidth) / 2;
      // Calculate center position between total box bottom and footer line
      const badgeY = totalBoxY + 28 + ((footerLineY - (totalBoxY + 28)) / 2) - (badgeHeight / 2);
      
      doc.setFillColor(...successGreen);
      doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 4, 4, "F");
      
      // Center text vertically in badge
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("PAID", pageWidth / 2, badgeY + (badgeHeight / 2) + 3, { align: "center" });

      // Footer text - first row: HRIS CMLABS and website
      doc.setTextColor(...primaryBlue);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("HRIS CMLABS", margin, footerLineY + 8);
      doc.setFont("helvetica", "normal");
      doc.text("www.hris-cmlabs.com", pageWidth - margin, footerLineY + 8, { align: "right" });

      // Second row: Disclaimer note
      doc.setTextColor(...grayText);
      doc.setFontSize(7);
      doc.text("This is a computer-generated receipt and does not require a signature.", pageWidth / 2, footerLineY + 16, { align: "center" });

      // Third row: Contact and timestamp
      doc.text(`For any inquiries: support@hris-cmlabs.com  |  Generated: ${new Date().toLocaleString("id-ID")}`, pageWidth / 2, footerLineY + 22, { align: "center" });

      // Save PDF
      doc.save(`Receipt-${orderNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#e8f4fc] to-[#f0f7ff] flex flex-col ${isLoaded ? "page-enter" : "opacity-0"}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={logoHris} 
              alt="HRIS" 
              className="h-8 sm:h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate("/")}
              title="Kembali ke Beranda"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg text-center card-lift">
            {/* Success Icon */}
            <div className="mb-6 slide-up-enter">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1d395e] mb-2 slide-up-enter" style={{ animationDelay: '0.1s' }}>
              Payment Successful!
            </h1>
            <p className="text-gray-500 mb-8 slide-up-enter" style={{ animationDelay: '0.15s' }}>
              Thank you for your purchase. Your subscription is now active.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4 slide-up-enter" style={{ animationDelay: '0.2s' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Order Number</span>
                <span className="font-mono font-semibold text-[#1d395e]">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Payment Date</span>
                <span className="font-semibold text-[#1d395e] text-right text-sm">{formattedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Payment Time</span>
                <span className="font-semibold text-[#1d395e]">{formattedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Package</span>
                <span className="font-semibold text-[#1d395e]">{planName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Payment Method</span>
                <span className="font-semibold text-[#1d395e]">{paymentMethod}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Paid</span>
                  <span className="text-xl font-bold text-green-600">Rp {formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Receipt Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 slide-up-enter" style={{ animationDelay: '0.25s' }}>
              <p className="text-sm text-blue-700">
                A confirmation email with your receipt has been sent to your registered email address.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 slide-up-enter" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={generatePdfReceipt}
                disabled={isGeneratingPdf}
                className="w-full py-3 bg-white border-2 border-[#1d395e] text-[#1d395e] font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPdf ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Receipt (PDF)
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-full py-3 bg-[#1d395e] text-white font-semibold rounded-xl hover:bg-[#2a4a6e] transition-colors flex items-center justify-center gap-2 btn-press"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full py-3 text-gray-500 font-medium hover:text-[#1d395e] transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
