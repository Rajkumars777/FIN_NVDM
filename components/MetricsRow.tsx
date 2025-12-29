"use client";

import DashboardCard from "./DashboardCard";
import { Database, TrendingUp, Smile, Meh, Frown } from "lucide-react";

export default function MetricsRow() {
    // Mock data - replace with real data fetching later
    const metrics = {
        totalRecords: "12,450",
        positive: "45%",
        neutral: "30%",
        negative: "25%",
        trending: "NVDA Hits ATH"
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard
                title="Total Records"
                value={metrics.totalRecords}
                icon={<Database className="w-5 h-5 text-blue-500" />}
                trend="+12%"
                trendUp={true}
            />
            <MetricCard
                title="Positive"
                value={metrics.positive}
                icon={<Smile className="w-5 h-5 text-green-500" />}
                trend="+5%"
                trendUp={true}
            />
            <MetricCard
                title="Neutral"
                value={metrics.neutral}
                icon={<Meh className="w-5 h-5 text-gray-400" />}
                trend="-2%"
                trendUp={false}
            />
            <MetricCard
                title="Negative"
                value={metrics.negative}
                icon={<Frown className="w-5 h-5 text-red-500" />}
                trend="-3%"
                trendUp={true} // 'Good' that negative is down
                inverseTrend // Visual indicator should be green if it went down
            />
            <MetricCard
                title="Trending Topic"
                value={metrics.trending}
                icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
                subtext="High Activity"
            />
        </div>
    );
}

function MetricCard({ title, value, icon, trend, trendUp, inverseTrend, subtext }: any) {
    // Determine trend color: 
    // If not inverse: Up is Green, Down is Red.
    // If inverse: Down is Green (good), Up is Red (bad).
    let trendColor = "text-muted-foreground";
    if (trend) {
        if (inverseTrend) {
            trendColor = trendUp ? "text-green-500" : "text-red-500";
            // Wait, logic check: 
            // If Negative went DOWN (-3%), trendUp is FALSE? 
            // Let's simplify: Pass `isGood` boolean if needed, or just let color be manual.
            // Let's stick to simple: Green = Good, Red = Bad.
            // For Negative: Down is Good (Green).
            // My props above: trend="-3%" (string), trendUp={true} (meaning 'improved'?).
            // Let's refactor for simplicity in this display component.
        }
    }

    // specific color logic based on helper props
    const isPositiveChange = trend?.includes("+");
    const isGood = inverseTrend ? !isPositiveChange : isPositiveChange;
    const finalTrendColor = isGood ? "text-green-500" : "text-red-500";

    return (
        <div className="relative group">
            {/* Hover Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-purple-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg transition-all duration-300 hover:shadow-accent/5 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-white/5 rounded-xl text-foreground ring-1 ring-white/10">
                        {icon}
                    </div>
                    {trend && (
                        <div className={`text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md ${finalTrendColor} bg-white/5`}>
                            {trend}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1 tracking-wide">{title}</p>
                    <h4 className="text-2xl font-extrabold text-foreground truncate tracking-tight" title={value}>{value}</h4>
                    {subtext && <p className="text-xs text-muted-foreground/80 mt-1 font-medium">{subtext}</p>}
                </div>
            </div>
        </div>
    );
}
