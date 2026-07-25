import { Search, X, Bell, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  title: string;
  subtitle: string;
}

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  title,
  subtitle,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[#E4E7EC] bg-white px-8 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-[#161A23]">{title}</h1>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FDEEEA]">
            <Sparkles size={12} className="text-[#E2542D]" />
          </div>
        </div>
        <p className="mt-0.5 text-xs text-[#5B6472]">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search stores or shared links..."
            className="h-10 w-full rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] pl-10 pr-8 text-xs text-[#161A23] placeholder:text-[#9CA3AF] focus:border-[#161A23] focus:bg-white focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#161A23]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E7EC] bg-white text-[#5B6472] shadow-sm hover:bg-[#F7F8FA] hover:text-[#161A23]">
          <Bell size={17} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#E2542D]" />
        </button>
      </div>
    </header>
  );
}
