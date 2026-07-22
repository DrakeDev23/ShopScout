import { Eye, Search, TrendingUp } from "lucide-react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { SearchTrendPoint, TopTerm } from "./types";
import { StatCard } from "./StatCard";

interface StatsTabProps {
    totalViews: number;
    totalSearchAppearances: number;
    searchTrend: SearchTrendPoint[];
    topTerms: TopTerm[];
    maxTermCount: number;
}

export function StatsTab({
    totalViews,
    totalSearchAppearances,
    searchTrend,
    topTerms,
    maxTermCount,
}: StatsTabProps) {
    return (
        <div>
            <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                Search statistics
            </h1>
            <p className="mt-1.5 text-sm text-[#5B6472]">
                How shoppers are finding your store this week.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
                <StatCard
                    icon={<Search size={16} />}
                    label="Search appearances"
                    value={totalSearchAppearances.toLocaleString()}
                />
                <StatCard
                    icon={<Eye size={16} />}
                    label="Store profile views"
                    value={totalViews.toLocaleString()}
                />
                <StatCard
                    icon={<TrendingUp size={16} />}
                    label="Vs. last week"
                    value="+18%"
                    positive
                />
            </div>

            <div className="mt-6 rounded-xl border border-[#E4E7EC] bg-white p-5">
                <p className="text-sm font-medium text-[#161A23]">Daily search appearances</p>
                <div className="mt-4 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={searchTrend} margin={{ left: -20, right: 10 }}>
                            <CartesianGrid stroke="#F1F2F4" vertical={false} />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 8,
                                    borderColor: "#E4E7EC",
                                    fontSize: 12,
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="searches"
                                stroke="#E2542D"
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: "#E2542D" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#E4E7EC] bg-white p-5">
                <p className="text-sm font-medium text-[#161A23]">Top search terms</p>
                <div className="mt-4 space-y-3">
                    {topTerms.map((t) => (
                        <div key={t.term} className="flex items-center gap-3">
                            <span className="w-28 shrink-0 text-sm text-[#5B6472]">{t.term}</span>
                            <div className="h-2 flex-1 rounded-full bg-[#F1F2F4]">
                                <div
                                    className="h-2 rounded-full bg-[#E2542D]"
                                    style={{ width: `${(t.count / maxTermCount) * 100}%` }}
                                />
                            </div>
                            <span className="w-8 shrink-0 text-right text-xs text-[#9CA3AF]">
                                {t.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}