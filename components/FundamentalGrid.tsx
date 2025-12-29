"use client";

import { DollarSign, BarChart3, Users, Activity } from "lucide-react";

export default function FundamentalGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
            <Card
                label="Market Cap"
                value="$3.2T"
                sub="+2.4% Today"
                icon={<DollarSign className="w-5 h-5 text-green-400" />}
            />
            <Card
                label="P/E Ratio"
                value="74.5"
                sub="High Growth"
                icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
            />
            <Card
                label="Social Volume"
                value="125k"
                sub="Posts (24h)"
                icon={<Users className="w-5 h-5 text-orange-400" />}
            />
            <Card
                label="Whale Flows"
                value="+$45M"
                sub="Net Inflow"
                icon={<Activity className="w-5 h-5 text-purple-400" />}
            />
        </div>
    );
}

function Card({ label, value, sub, icon }: any) {
    return (
        <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/5 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-muted-foreground font-medium">{label}</span>
                <div className="p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{sub}</div>
            </div>
        </div>
    )
}
