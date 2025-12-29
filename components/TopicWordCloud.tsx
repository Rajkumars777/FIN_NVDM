"use client";

import DashboardCard from "./DashboardCard";
import { Cloud, Info } from "lucide-react";

// Mock Data: Word, Volume (size), Sentiment (color)
const TOPICS = [
    { text: "Inflation", val: 80, sentiment: -0.6 }, // Big, Negative
    { text: "AI Boom", val: 95, sentiment: 0.8 },    // Big, Positive
    { text: "Fed Rate", val: 60, sentiment: -0.2 },
    { text: "Recession", val: 50, sentiment: -0.8 },
    { text: "Soft Landing", val: 40, sentiment: 0.3 },
    { text: "Earnings", val: 70, sentiment: 0.5 },
    { text: "Crypto", val: 85, sentiment: 0.9 },     // Big, Positive
    { text: "Oil Supply", val: 30, sentiment: -0.1 },
    { text: "Tech Layoffs", val: 35, sentiment: -0.5 },
    { text: "GDP Growth", val: 25, sentiment: 0.4 },
    { text: "Housing Market", val: 45, sentiment: -0.3 },
    { text: "EV Demand", val: 55, sentiment: 0.2 },
];

export default function TopicWordCloud() {
    return (
        <DashboardCard
            title="Narrative Word Cloud"
            action={<Cloud className="w-5 h-5 text-accent" />}
        >
            <div className="h-[300px] flex flex-wrap items-center justify-center gap-x-8 gap-y-4 p-4 overflow-hidden relative">
                {/* Background grid effect */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                {TOPICS.map((topic, i) => {
                    // Logic for visual properties
                    const size = Math.max(0.8, topic.val / 20) + "rem"; // Scale font size

                    // Color logic
                    let color = "text-gray-400";
                    if (topic.sentiment > 0.3) color = "text-green-400";
                    else if (topic.sentiment < -0.3) color = "text-red-400";
                    else color = "text-blue-200"; // Neutral-ish

                    // Opacity/Glow based on intensity
                    const opacity = Math.min(1, Math.max(0.4, topic.val / 100));
                    const shadow = Math.abs(topic.sentiment) > 0.7 ? `0 0 15px ${topic.sentiment > 0 ? "rgba(74, 222, 128, 0.4)" : "rgba(248, 113, 113, 0.4)"}` : "none";

                    return (
                        <span
                            key={i}
                            className={`font-bold transition-all duration-300 hover:scale-110 cursor-pointer ${color}`}
                            style={{
                                fontSize: size,
                                opacity: opacity,
                                textShadow: shadow
                            }}
                            title={`Volume: ${topic.val} | Sentiment: ${topic.sentiment}`}
                        >
                            {topic.text}
                        </span>
                    );
                })}
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground border-t border-white/5 pt-3">
                <span>Green = Bullish</span>
                <span>Red = Bearish</span>
                <span>Size = Social Volume</span>
            </div>
        </DashboardCard>
    );
}
