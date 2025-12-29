"use client";

import { MessageSquare, Twitter, BadgeCheck } from "lucide-react";

const POSTS = [
    {
        id: 1,
        user: "StockWizard",
        handle: "@stockwiz",
        platform: "twitter",
        isInfluencer: true,
        text: "$NVDA breaking out above 155! The volume here is massive. Expecting a run to 160 by EOD. #AI #Bullish",
        time: "2m ago",
        sentiment: "bullish"
    },
    {
        id: 2,
        user: "MarketBear",
        handle: "@bearish_bets",
        platform: "twitter",
        isInfluencer: false,
        text: "Too extended here. RSI is overbought on the 1hr. Looking for a pullback. 📉",
        time: "15m ago",
        sentiment: "bearish"
    },
    {
        id: 3,
        user: "TechCrunch",
        handle: "@TechCrunch",
        platform: "news",
        isInfluencer: true,
        text: "NVIDIA announces new partnership with top cloud providers to accelerate generative AI deployment.",
        time: "1h ago",
        sentiment: "neutral"
    }
];

export default function SocialPulseSidebar() {
    return (
        <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-accent" /> Social Pulse
                </h3>
                <div className="flex gap-1 text-[10px] bg-white/5 p-1 rounded-lg">
                    <button className="px-2 py-1 rounded bg-accent text-white font-medium">Top</button>
                    <button className="px-2 py-1 rounded hover:text-white text-muted-foreground">Latest</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {POSTS.map((post) => (
                    <div
                        key={post.id}
                        className={`p-4 rounded-2xl border ${post.sentiment === 'bullish' ? 'border-green-500/20 bg-green-500/5' : post.sentiment === 'bearish' ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 bg-white/5'} transition-all hover:bg-white/10`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
                                    {post.user[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-bold text-foreground">{post.user}</span>
                                        {post.isInfluencer && <BadgeCheck className="w-3 h-3 text-blue-400" />}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{post.handle} • {post.time}</span>
                                </div>
                            </div>
                            <Twitter className="w-4 h-4 text-blue-400 opacity-50" />
                        </div>

                        <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                            {post.text}
                        </p>

                        <div className="flex gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${post.sentiment === 'bullish' ? 'text-green-400 bg-green-500/10' : post.sentiment === 'bearish' ? 'text-red-400 bg-red-500/10' : 'text-gray-400 bg-gray-500/10'}`}>
                                {post.sentiment}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
