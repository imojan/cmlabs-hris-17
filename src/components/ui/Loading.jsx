import logoHris from "@/assets/images/logo-hris-2.png";
import logoHrisWhite from "@/assets/images/hris-putih.png";
import { useTheme } from "@/app/hooks/useTheme";

/**
 * Full Page Loading Spinner
 */
export function PageLoader() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="text-center">
        <div className="relative mb-6">
          <img 
            src={isDark ? logoHrisWhite : logoHris} 
            alt="HRIS" 
            className="h-12 mx-auto animate-pulse"
          />
        </div>
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className={`text-sm animate-pulse ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</p>
      </div>
    </div>
  );
}

/**
 * Inline Loading Spinner
 */
export function Spinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-[#1d395e]/20 border-t-[#1d395e] rounded-full animate-spin ${className}`}
    ></div>
  );
}

/**
 * Button Loading State
 */
export function ButtonLoader({ text = "Loading..." }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <Spinner size="sm" />
      <span>{text}</span>
    </span>
  );
}

/**
 * Skeleton Loader for Cards
 */
export function CardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white rounded-xl p-6 ${className}`}>
      <div className="skeleton h-4 w-3/4 mb-4"></div>
      <div className="skeleton h-3 w-full mb-2"></div>
      <div className="skeleton h-3 w-5/6 mb-4"></div>
      <div className="skeleton h-10 w-full mt-4"></div>
    </div>
  );
}

/**
 * Skeleton Loader for Text
 */
export function TextSkeleton({ lines = 3, className = "" }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-3 mb-2"
          style={{ width: `${Math.random() * 30 + 70}%` }}
        ></div>
      ))}
    </div>
  );
}

/**
 * Skeleton Loader for Image
 */
export function ImageSkeleton({ className = "" }) {
  return (
    <div className={`skeleton aspect-video rounded-lg ${className}`}></div>
  );
}

/**
 * Dots Loading Animation
 */
export function DotsLoader() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-[#1d395e] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-[#1d395e] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-[#1d395e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
}

export default PageLoader;
