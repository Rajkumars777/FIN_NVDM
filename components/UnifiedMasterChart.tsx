"use client";

import { useState } from "react";
import DashboardCard from "./DashboardCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Bar } from "recharts";
import { Maximize, Filter, Calendar } from "lucide-react";

// Mock Data: Price vs Sentiment Divergence Scenario
const DATA = [
    { time: "09:30", price: 150.2, sentiment: 60, volume: 2000 },
    { time: "10:00", price: 152.5, sentiment: 75, volume: 3500 }, // Sentiment spikes
    { time: "10:30", price: 153.8, sentiment: 82, volume: 4000 },
    { time: "11:00", price: 154.2, sentiment: 80, volume: 3200 },
    { time: "11:30", price: 155.5, sentiment: 65, volume: 3000 }, // Price up, Sentiment dropping (Divergence)
    { time: "12:00", price: 156.0, sentiment: 50, volume: 2800 },
    { time: "12:30", price: 156.4, sentiment: 40, volume: 2500 }, // Bearish Divergence clearer
    { time: "13:00", price: 155.8, sentiment: 35, volume: 4500 }, // Price starts following sentiment
    { time: "13:30", price: 154.0, sentiment: 30, volume: 5000 },
    { time: "14:00", price: 152.0, sentiment: 25, volume: 6000 }, // Dump
];

export default function UnifiedMasterChart({ ticker }: { ticker: string }) {
    const [showSentiment, setShowSentiment] = useState(true);

    return (
        <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                        {ticker} Master Chart
                        <span className="text-xs font-normal px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground">USD</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Comparing <span className="text-accent">Price Action</span> vs <span className="text-orange-400">Social Sentiment</span></p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSentiment(!showSentiment)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${showSentiment ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-white/5 text-muted-foreground border-white/10"}`}
                    >
                        <Filter className="w-3 h-3" /> {showSentiment ? "Hide Sentiment" : "Show Sentiment"}
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all">
                        <Calendar className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all">
                        <Maximize className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={DATA}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                            dy={10}
                        />

                        {/* Left Axis: Price */}
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            domain={['auto', 'auto']}
                            hide
                        />

                        {/* Right Axis: Sentiment */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 100]}
                            hide
                        />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#1c1c21', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                            itemStyle={{ color: '#fff' }}
                        />

                        {/* Price Area */}
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="price"
                            stroke="#6C5DD3"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            name="Price ($)"
                        />

                        {/* Sentiment Line Overlay */}
                        {showSentiment && (
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="sentiment"
                                stroke="#f97316"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fill="url(#colorSentiment)"
                                name="Sentiment (0-100)"
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
