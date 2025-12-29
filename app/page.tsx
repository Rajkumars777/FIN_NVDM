"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import StockExchangeChart from "@/components/StockExchangeChart";

import MetricsRow from "@/components/MetricsRow";

// New Command Center Components
import NarrativeStream from "@/components/NarrativeStream";
import SentimentHeatmap from "@/components/SentimentHeatmap";
import FearGreedGauge from "@/components/FearGreedGauge";
import TradeStream from "@/components/TradeStream";

import { useState } from "react";

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-transparent text-foreground font-sans transition-colors duration-300">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main
        className={`flex-1 overflow-x-hidden bg-background/95 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"
          }`}
      >
        <Header />

        <div className="p-6 space-y-6 max-w-[1920px] mx-auto">


          {/* Ticker Row */}
          <div>
            <Ticker />
          </div>

          {/* 2. Sentiment Intelligence Hub */}
          <div className="grid grid-cols-12 gap-8">
            {/* Main Chart - Takes 7 Cols */}
            <div className="col-span-12 xl:col-span-7 h-[450px]">
              <StockExchangeChart />
            </div>

            {/* Interactive Heatmap & Gauge - Takes 5 Cols */}
            <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
              <div className="flex-1 min-h-[300px]">
                <SentimentHeatmap />
              </div>


            </div>
          </div>
          {/* 3. Realtime Market Stream */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 h-[500px]">
              <TradeStream />
            </div>
          </div>
          <MetricsRow />

          {/* Metrics Row (Quick Stats) */}

          {/* 1. Market Command Center: Narrative Stream */}
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <NarrativeStream />
          </section>

          {/* Bottom Row: Top Value List & Today's Value */}




        </div>
      </main>
    </div>
  );
}
