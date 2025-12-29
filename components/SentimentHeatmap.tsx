"use client";

import DashboardCard from "./DashboardCard";
import { useState } from "react";
import { Maximize2 } from "lucide-react";

const SECTORS = [
    { name: "Technology", value: 45, sentiment: 85, trend: "+2.4%" }, // High Sentiment, High Value
    { name: "Finance", value: 25, sentiment: 30, trend: "-1.2%" },    // Low Sentiment
    { name: "Energy", value: 20, sentiment: 60, trend: "+0.8%" },     // Neutral
    { name: "Healthcare", value: 15, sentiment: 45, trend: "-0.5%" },
    { name: "Consumer", value: 10, sentiment: 92, trend: "+4.1%" },   // Creating Buzz
];

export default function SentimentHeatmap() {
    const [mode, setMode] = useState<"sentiment" | "price">("sentiment");

    return (
        <DashboardCard
            title="Macro-Sentiment Heatmap"
            action={
                <div className="flex bg-muted/20 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setMode("sentiment")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === "sentiment" ? "bg-accent text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
                    >
                        Sentiment
                    </button>
                    <button
                        onClick={() => setMode("price")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === "price" ? "bg-accent text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
                    >
                        Price
                    </button>
                </div>
            }
        >
            <div className="h-[300px] w-full grid grid-cols-12 grid-rows-6 gap-2 mt-2">
                {/* Custom Grid Layout stimulating a Treemap for top sectors */}

                {/* Tech - The Big Block */}
                <div className="col-span-6 row-span-6 relative group overflow-hidden rounded-2xl cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                    <Block item={SECTORS[0]} mode={mode} />
                </div>

                {/* Finance */}
                <div className="col-span-3 row-span-4 relative group overflow-hidden rounded-2xl cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                    <Block item={SECTORS[1]} mode={mode} />
                </div>

                {/* Energy */}
                <div className="col-span-3 row-span-3 relative group overflow-hidden rounded-2xl cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                    <Block item={SECTORS[2]} mode={mode} />
                </div>

                {/* Healthcare - Below Energy */}
                <div className="col-span-3 row-span-3 relative group overflow-hidden rounded-2xl cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                    <Block item={SECTORS[3]} mode={mode} />
                </div>

                {/* Consumer - Below Finance */}
                <div className="col-span-3 row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                    <Block item={SECTORS[4]} mode={mode} />
                </div>

            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500/80"></div> Fear
                    <div className="w-3 h-3 rounded bg-gray-500/50"></div> Neutral
                    <div className="w-3 h-3 rounded bg-green-500/80"></div> Greed
                </div>
                <span>Size = Market Cap</span>
            </div>
        </DashboardCard>
    );
}

function Block({ item, mode }: { item: any, mode: "sentiment" | "price" }) {
    // Color Logic
    let bg = "bg-gray-500/20";
    if (mode === "sentiment") {
        if (item.sentiment >= 80) bg = "bg-green-500/80 shadow-[inset_0_0_20px_rgba(34,197,94,0.3)]";
        else if (item.sentiment >= 60) bg = "bg-green-500/40";
        else if (item.sentiment >= 40) bg = "bg-gray-500/40";
        else if (item.sentiment >= 20) bg = "bg-red-500/40";
        else bg = "bg-red-500/80 shadow-[inset_0_0_20px_rgba(239,68,68,0.3)]";
    } else {
        // Simple positive/negative trend check
        const isPos = item.trend.includes("+");
        bg = isPos ? "bg-green-600/80" : "bg-red-600/80";
    }

    return (
        <div className={`w-full h-full ${bg} p-4 flex flex-col justify-between transition-all duration-500`}>
            <div className="flex justify-between items-start">
                <span className="font-bold text-white tracking-wide">{item.name}</span>
                {mode === "sentiment" && <Maximize2 className="w-3 h-3 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>

            <div className="text-right">
                <div className="text-2xl font-black text-white/90">
                    {mode === "sentiment" ? item.sentiment : item.trend}
                </div>
                <div className="text-[10px] uppercase font-bold text-white/60">
                    {mode === "sentiment" ? "Score" : "Change"}
                </div>
            </div>
        </div>
    )
}
