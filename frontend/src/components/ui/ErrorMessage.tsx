import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className = "" }: ErrorMessageProps) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] p-3 text-xs text-[#DC2626] ${className}`}>
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded bg-white px-2 py-1 font-semibold shadow-xs hover:bg-[#FEE2E2]"
        >
          Retry
        </button>
      )}
    </div>
  );
}
