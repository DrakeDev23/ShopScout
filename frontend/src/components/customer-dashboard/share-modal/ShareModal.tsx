import { useState } from "react";
import { X, Share2, Copy, Check, Send, MessageSquare } from "lucide-react";
import type { LikedStore } from "../types/types";

interface ShareModalProps {
  store: LikedStore;
  onClose: () => void;
  onConfirmShare: (store: LikedStore, platform: "Copy Link" | "WhatsApp" | "Facebook" | "Twitter", notes: string) => void;
}

export function ShareModal({ store, onClose, onConfirmShare }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState("");
  const shareUrl = `https://shopscout.app/store/${store.id}?ref=customer_share`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onConfirmShare(store, "Copy Link", notes || "Shared store link");
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  const handleSocialShare = (platform: "WhatsApp" | "Facebook" | "Twitter") => {
    onConfirmShare(store, platform, notes || `Shared via ${platform}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#F1F2F4] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6]">
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#161A23]">Share Store</h3>
              <p className="text-xs text-[#5B6472]">{store.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F7F8FA] hover:text-[#161A23]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] p-3">
          <img
            src={store.imageUrl}
            alt={store.name}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div>
            <p className="text-xs font-bold text-[#161A23]">{store.name}</p>
            <p className="text-[11px] text-[#5B6472]">{store.address}</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-[#161A23]">Personal Note (Optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a message for your friends..."
            className="mt-1.5 h-10 w-full rounded-xl border border-[#E4E7EC] bg-white px-3 text-xs text-[#161A23] focus:border-[#161A23] focus:outline-none"
          />
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold text-[#161A23]">Share via Platform</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSocialShare("WhatsApp")}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#E4E7EC] p-3 text-xs font-semibold text-[#10B981] hover:bg-[#ECFDF5]"
            >
              <MessageSquare size={20} />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleSocialShare("Facebook")}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#E4E7EC] p-3 text-xs font-semibold text-[#3B82F6] hover:bg-[#EFF6FF]"
            >
              <Send size={20} />
              <span>Facebook</span>
            </button>

            <button
              onClick={() => handleSocialShare("Twitter")}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#E4E7EC] p-3 text-xs font-semibold text-[#0B0F19] hover:bg-[#F7F8FA]"
            >
              <Share2 size={20} />
              <span>Twitter</span>
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold text-[#161A23]">Direct Share Link</label>
          <div className="mt-1.5 flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="h-10 flex-1 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] px-3 text-xs text-[#5B6472]"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-all ${
                copied
                  ? "bg-[#10B981] text-white"
                  : "bg-[#161A23] text-white hover:bg-black"
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
