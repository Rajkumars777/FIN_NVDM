"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

const NARRATIVES = [
    {
        id: 1,
        headline: "AI Bubble Concerns Subside",
        subtext: "15k mentions of 'Sustainable Growth' in last 4 hours",
        sentiment: "Bullish",
        impact: "+12%",
        type: "positive"
    },
    {
        id: 2,
        headline: "Fed Rate Cut Expectations",
        subtext: "Sentiment for Banking Sector drops significantly",
        sentiment: "Bearish",
        impact: "-8%",
        type: "negative"
    },
    {
        id: 3,
        headline: "Crypto Resurgence",
        subtext: "Bitcoin crosses critical resistance with high social volume",
        sentiment: "High Hype",
        impact: "+15%",
        type: "positive"
    }
];

export default function NarrativeStream() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate narratives
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % NARRATIVES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const current = NARRATIVES[currentIndex];

    return (
        <div className="relative group overflow-hidden rounded-3xl">
            {/* Animated Gradient Border/Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${current.type === 'positive' ? 'from-green-500/20 to-emerald-500/10' : 'from-red-500/20 to-orange-500/10'} blur-xl transition-colors duration-1000`} />

            <div className="relative bg-card/40 backdrop-blur-xl border border-white/10 p-6 h-full flex items-center justify-between transition-all">

                <div className="flex items-center gap-6">
                    {/* Icon Box */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${current.type === 'positive' ? 'bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.3)]'} transition-all duration-500`}>
                        {current.type === 'positive' ? <Sparkles className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>

                    {/* Text Content */}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Narrative Stream
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${current.type === 'positive' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                                {current.sentiment} ({current.impact})
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                            {current.headline}
                        </h3>
                        <p className="text-sm text-muted-foreground/80">
                            {current.subtext}
                        </p>
                    </div>
                </div>

                {/* Navigation/Indicators */}
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        {NARRATIVES.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-accent shadow-[0_0_10px_rgba(108,93,211,0.5)]' : 'w-1.5 bg-white/10'}`}
                            />
                        ))}
                    </div>
                    <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
