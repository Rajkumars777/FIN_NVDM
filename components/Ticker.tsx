"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

const TICKER_ITEMS = [
    { symbol: "NVDA", price: "124.50", change: "+2.5%", isUp: true },
    { symbol: "BTC", price: "68,450", change: "+1.2%", isUp: true },
    { symbol: "TSLA", price: "245.80", change: "-0.8%", isUp: false },
    { symbol: "ETH", price: "3,890", change: "+0.5%", isUp: true },
    { symbol: "AAPL", price: "185.20", change: "+0.1%", isUp: true },
    { symbol: "SOL", price: "145.60", change: "-1.5%", isUp: false },
];

export default function Ticker() {
    return (
        <div className="w-full overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-3">
            <div className="flex animate-ticker gap-12 whitespace-nowrap">
                {/* Double the list for seamless loop */}
                {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                    <Link href={`/market/${item.symbol}`} key={idx} className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="font-black text-foreground group-hover:text-accent transition-colors">{item.symbol}</span>
                        <span className="text-sm font-medium text-muted-foreground">{item.price}</span>
                        <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${item.isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {item.isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {item.change}
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 30s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
