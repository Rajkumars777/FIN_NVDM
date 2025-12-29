"use client";

import DashboardCard from "./DashboardCard";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ReferenceLine, Label } from "recharts";
import { Target } from "lucide-react";

const DATA = [
    { x: 85, y: -2.5, z: 500, name: "Crypto", type: "Opportunity" }, // High Sentiment, Price Down (Buy Dip?)
    { x: 20, y: 5.0, z: 300, name: "Energy", type: "Overhyped" },    // Low Sentiment, Price Up (Short?)
    { x: 90, y: 8.0, z: 600, name: "AI Tech", type: "Momentum" },    // High/High
    { x: 15, y: -4.0, z: 200, name: "Real Estate", type: "Panic" }, // Low/Low
    { x: 60, y: 1.2, z: 400, name: "Finance", type: "Neutral" },
    { x: 45, y: -1.0, z: 250, name: "Utilities", type: "Neutral" },
    { x: 75, y: 3.5, z: 350, name: "Cons. Disc", type: "Momentum" },
];

export default function SectorMatrix() {
    return (
        <DashboardCard
            title="Sector Sentiment Matrix"
            action={
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="w-4 h-4 text-accent" />
                    Spot Alpha
                </div>
            }
        >
            <div className="h-[350px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Sentiment"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fill: "#64748b", fontSize: 10 }}
                            label={{ value: 'Sentiment Score (0-100)', position: 'bottom', fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Change"
                            unit="%"
                            tick={{ fill: "#64748b", fontSize: 10 }}
                            label={{ value: 'Price Performance (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                        />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-[#1c1c21] border border-white/10 p-3 rounded-xl shadow-xl">
                                            <p className="font-bold text-white mb-1">{data.name}</p>
                                            <p className="text-xs text-gray-400">Sentiment: <span className="text-white">{data.x}%</span></p>
                                            <p className="text-xs text-gray-400">Price: <span className={data.y > 0 ? "text-green-400" : "text-red-400"}>{data.y}%</span></p>
                                            <p className="text-[10px] uppercase font-bold text-accent mt-2">{data.type}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        {/* Quadrant Lines */}
                        <ReferenceLine x={50} stroke="#334155" strokeDasharray="3 3" />
                        <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />

                        {/* Labels for Quadrants */}
                        <ReferenceLine x={85} y={-4} stroke="none" label={{ position: 'top', value: 'BUY DIP ??', fill: '#22c55e', fontSize: 10, opacity: 0.5 }} />
                        <ReferenceLine x={15} y={7} stroke="none" label={{ position: 'bottom', value: 'SHORT ??', fill: '#ef4444', fontSize: 10, opacity: 0.5 }} />

                        <Scatter name="Sectors" data={DATA} fill="#8884d8">
                            {DATA.map((entry, index) => {
                                // Dynamic Coloring based on Type
                                let fill = "#94a3b8";
                                if (entry.type === "Opportunity") fill = "#22c55e"; // Green
                                if (entry.type === "Overhyped") fill = "#ef4444";  // Red
                                if (entry.type === "Momentum") fill = "#6C5DD3";   // Purple
                                if (entry.type === "Panic") fill = "#f97316";      // Orange

                                return <Cell key={`cell-${index}`} fill={fill} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />;
                            })}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </DashboardCard>
    );
}
