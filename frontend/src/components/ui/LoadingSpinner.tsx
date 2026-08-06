import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 20, className = "", label }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 size={size} className="animate-spin text-[#E2542D]" />
      {label && <span className="text-sm text-[#5B6472]">{label}</span>}
    </div>
  );
}
