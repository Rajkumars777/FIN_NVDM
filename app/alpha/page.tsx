"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TopicWordCloud from "@/components/TopicWordCloud";
import SectorMatrix from "@/components/SectorMatrix";
import { FlaskConical, MoveRight } from "lucide-react";

export default function AlphaLab() {
    return (
        <div className="flex min-h-screen bg-transparent text-foreground font-sans transition-colors duration-300">
            <Sidebar />

            <main className="flex-1 ml-64 overflow-x-hidden bg-background/95 min-h-screen">
                <Header />

                <div className="p-8 space-y-8 max-w-[1920px] mx-auto">

                    {/* Page Title */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                                <span className="p-2 bg-accent/10 rounded-xl text-accent"><FlaskConical className="w-8 h-8" /></span>
                                Alpha Lab
                                <span className="text-sm font-normal text-muted-foreground ml-2 px-3 py-1 rounded-full border border-white/5 bg-white/5">Sentiment Intelligence Hub</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 max-w-2xl">
                                Decode the "Market of Emotions". Use these tools to spot narrative anomalies and sentiment divergence before they impact price action.
                            </p>
                        </div>
                    </div>

                    {/* Top Row: Word Cloud & Stats */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* Word Cloud (8 cols) */}
                        <div className="col-span-12 xl:col-span-7">
                            <TopicWordCloud />
                        </div>

                        {/* Quick Alpha Stats (4 cols) - Placeholder for now or simple cards */}
                        <div className="col-span-12 xl:col-span-5 grid grid-rows-2 gap-6">
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-3xl p-6 flex flex-col justify-center">
                                <h3 className="text-green-400 font-bold text-sm uppercase mb-2">Top Bullish Narrative</h3>
                                <div className="text-3xl font-black text-white mb-1">AI & GPU Demand</div>
                                <div className="text-sm text-muted-foreground">Driving 45% of total market social volume.</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-3xl p-6 flex flex-col justify-center">
                                <h3 className="text-red-400 font-bold text-sm uppercase mb-2">Top Bearish Narrative</h3>
                                <div className="text-3xl font-black text-white mb-1">Commercial Real Estate</div>
                                <div className="text-sm text-muted-foreground">Sentiment hitting multi-year lows (-2 standard deviations).</div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Sector Matrix */}
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 h-[500px]">
                            <SectorMatrix />
                        </div>
                    </div>

                    {/* Strategy Tip */}
                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">!</div>
                            <div>
                                <h4 className="font-bold text-white">Alpha Strategy: The Sentiment Divergence</h4>
                                <p className="text-sm text-muted-foreground">Look for assets in the bottom-right of the Matrix (High Sentiment, Low Price). Historically, these have a 78% win-rate for mean reversion.</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold text-accent hover:text-white transition-colors">
                            Run Screener <MoveRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
