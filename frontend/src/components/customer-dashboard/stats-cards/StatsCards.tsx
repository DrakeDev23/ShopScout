import { Heart, Share2, Tag, TrendingUp } from "lucide-react";
import type { CustomerStat } from "../types/types";

interface StatsCardsProps {
  likedCount: number;
  sharedCount: number;
  savedDealsCount: number;
  stats: CustomerStat[];
}

export function StatsCards({
  likedCount,
  sharedCount,
  savedDealsCount,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Liked Stores",
      value: likedCount,
      trend: "+2 new this month",
      icon: <Heart size={20} className="text-[#E2542D]" />,
      bg: "bg-[#FDEEEA]",
    },
    {
      title: "Shared Stores & Links",
      value: sharedCount,
      trend: "109 clicks received",
      icon: <Share2 size={20} className="text-[#3B82F6]" />,
      bg: "bg-[#EFF6FF]",
    },
    {
      title: "Saved Deals & Promos",
      value: savedDealsCount,
      trend: "3 active discounts",
      icon: <Tag size={20} className="text-[#10B981]" />,
      bg: "bg-[#ECFDF5]",
    },
    {
      title: "Total Link Engagement",
      value: "109 Clicks",
      trend: "+24% interaction rate",
      icon: <TrendingUp size={20} className="text-[#8B5CF6]" />,
      bg: "bg-[#F5F3FF]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5B6472]">{card.title}</span>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
              {card.icon}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#161A23]">{card.value}</div>
            <p className="mt-1 text-[11px] font-medium text-[#10B981]">{card.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
