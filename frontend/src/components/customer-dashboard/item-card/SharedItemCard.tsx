import { useState } from "react";
import { Copy, Check, MousePointer, Trash2, ExternalLink, Store, Clock } from "lucide-react";
import type { SharedItem } from "../types/types";

interface SharedItemCardProps {
  item: SharedItem;
  onRemoveShare: (id: string) => void;
}

export function SharedItemCard({ item, onRemoveShare }: SharedItemCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(item.sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-[#E4E7EC]"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#3B82F6]">
              {item.category}
            </span>
            <span className="rounded-md bg-[#F1F2F4] px-2 py-0.5 text-[10px] font-semibold text-[#5B6472]">
              {item.platform}
            </span>
          </div>

          <h3 className="mt-1 text-sm font-bold text-[#161A23]">{item.title}</h3>

          <div className="mt-1 flex items-center gap-3 text-xs text-[#5B6472]">
            <div className="flex items-center gap-1">
              <Store size={13} className="text-[#9CA3AF]" />
              <span>{item.storeName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={13} className="text-[#9CA3AF]" />
              <span>{item.sharedAt}</span>
            </div>
          </div>

          {item.notes && (
            <p className="mt-1 text-[11px] text-[#9CA3AF]">{item.notes}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#F1F2F4] pt-3 sm:mt-0 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
        <div className="flex items-center gap-1.5 rounded-xl bg-[#F7F8FA] px-3 py-1.5 text-xs font-bold text-[#161A23]">
          <MousePointer size={14} className="text-[#3B82F6]" />
          <span>{item.clicksCount} clicks</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              copied
                ? "bg-[#10B981] text-white"
                : "border border-[#E4E7EC] bg-white text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
            }`}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>

          <a
            href={item.sharedUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E7EC] bg-white text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
          >
            <ExternalLink size={14} />
          </a>

          <button
            onClick={() => onRemoveShare(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E7EC] bg-white text-[#EF4444] hover:bg-[#FDEEEA]"
            title="Delete Share Record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
