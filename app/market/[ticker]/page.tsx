"use client";

import { use } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UnifiedMasterChart from "@/components/UnifiedMasterChart";
import SocialPulseSidebar from "@/components/SocialPulseSidebar";
import FundamentalGrid from "@/components/FundamentalGrid";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssetPage({ params }: { params: Promise<{ ticker: string }> }) {
    const { ticker } = use(params);

    return (
        <div className="flex min-h-screen bg-transparent text-foreground font-sans transition-colors duration-300">
            <Sidebar />

            <main className="flex-1 ml-64 overflow-x-hidden bg-background/95 min-h-screen">
                <Header />

                <div className="p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
                    {/* Breadcrumb / Top Bar */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/" className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            {ticker} <span className="text-muted-foreground font-normal text-lg">/ USD</span>
                        </h1>
                        <div className="ml-auto flex gap-2">
                            <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm font-bold animate-pulse">
                                Live Market
                            </div>
                        </div>
                    </div>

                    {/* Terminal Layout (Grid) */}
                    <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">

                        {/* LEFT COLUMN: Chart & Fundamentals (8 Cols) */}
                        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6 min-h-0">
                            {/* Main Chart (Flex 1 to take available space) */}
                            <div className="flex-[3] min-h-0">
                                <UnifiedMasterChart ticker={ticker} />
                            </div>

                            {/* Fundamentals Grid (Fixed height/smaller flex) */}
                            <div className="flex-1 min-h-[160px]">
                                <FundamentalGrid />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Social Stream (4 Cols) */}
                        <div className="col-span-12 xl:col-span-4 h-full min-h-0">
                            <SocialPulseSidebar />
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
