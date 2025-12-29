"use client";

import DashboardCard from "./DashboardCard";
import { Gauge } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function FearGreedGauge() {
    const value = 75; // 0-100 (Greed)

    // Gauge data: segments for the arc (180 degrees)
    const data = [
        { name: "Extreme Fear", value: 20, color: "#ef4444" },  // Red
        { name: "Fear", value: 20, color: "#f97316" },          // Orange
        { name: "Neutral", value: 20, color: "#eab308" },        // Yellow
        { name: "Greed", value: 20, color: "#84cc16" },          // Lime
        { name: "Extreme Greed", value: 20, color: "#22c55e" },  // Green
    ];

    // Calculate needle rotation
    // 0 = 180deg (left), 100 = 0deg (right)
    // Formula: 180 - (value * 1.8)
    const rotation = 180 - (value * 1.8);

    return (
        <DashboardCard
            title="Fear & Greed Index"
            action={<div className="bg-green-500/10 text-green-500 px-2 py-1 rounded-lg text-xs font-bold animate-pulse">Updated Now</div>}
        >
            <div className="relative h-[200px] flex justify-center overflow-hidden">
                <ResponsiveContainer width="100%" height="200%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%" // Center vertically in the double-height container
                            startAngle={180}
                            endAngle={0}
                            innerRadius="60%"
                            outerRadius="80%"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Needle */}
                <div
                    className="absolute top-[50%] left-[50%] w-[45%] h-1.5 bg-foreground origin-left rounded-r-full transition-transform duration-1000 ease-out shadow-lg"
                    style={{ transform: `rotate(-${rotation}deg)` }} // Negative because rotation is CCW from right in CSS usually, wait.
                // Correcting logic: 
                // CSS Rotate 0deg points RIGHT (3 o'clock).
                // We want 0 value (left, 9 o'clock) to be 180deg.
                // We want 100 value (right, 3 o'clock) to be 0deg.
                // So value=75 -> 180 - (75*1.8) = 180 - 135 = 45deg.
                // rotate(-45deg) would point UP-RIGHT. 
                // Let's rely on standard: rotate(180deg) points ??? 
                // By default div is horizontal. Left anchor.
                // rotate(0) = 3 oclock.
                // rotate(180) = 9 oclok.
                // So we need rotate(180 - val*1.8).
                // If val=0 -> rotate(180). Correct.
                // If val=100 -> rotate(0). Correct.
                // But we used origin-left. So the left tip is center. The bar extends right.
                // So at 0 (3 oclock), it points 3 oclock.
                // At 180 (9 oclock), it points 9 oclock. 
                ></div>

                {/* Center Pivot */}
                <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-foreground rounded-full border-4 border-background shadow-xl z-10"></div>

                {/* Text Label */}
                <div className="absolute bottom-[20%] text-center">
                    <div className="text-4xl font-black text-foreground">{value}</div>
                    <div className="text-sm font-bold text-green-500 uppercase tracking-widest mt-1">Greed</div>
                </div>
            </div>

            <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-[80%] mx-auto">
                    Market sentiment is currently driven by <span className="text-foreground font-bold">Tech sector rallies</span> and <span className="text-foreground font-bold">positive earnings</span>.
                </p>
            </div>
        </DashboardCard>
    );
}
