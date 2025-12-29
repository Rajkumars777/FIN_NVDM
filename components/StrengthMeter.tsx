"use client";

import DashboardCard from "./DashboardCard";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";

const data = [
    { name: "A", value: 30 },
    { name: "B", value: 45 },
    { name: "C", value: 25 },
];
const COLORS = ["#A095E8", "#6C5DD3", "#D1FA9F"]; // Light purple, Accent, Light Green (approximating image)

export default function StrengthMeter() {
    return (
        <DashboardCard
            title="Strength meter"
            action={<Info className="w-5 h-5 text-muted-foreground" />}
        >
            <div className="h-[200px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="70%"
                            // Shifted down to make it a gauge
                            startAngle={180}
                            endAngle={0}
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-lg font-bold text-foreground">DSEX</div>
                    <div className="text-sm text-foreground">Strength</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <MetricBox val="26" trend="up" />
                <MetricBox val="281" trend="down" />
                <MetricBox val="78" trend="flat" />
                <MetricBox val="6.8%" trend="up" />
                <MetricBox val="75.5%" trend="down" />
                <MetricBox val="18.52%" trend="flat" />
            </div>
        </DashboardCard>
    );
}

function MetricBox({ val, trend }: { val: string, trend: "up" | "down" | "flat" }) {
    const color = trend === "up" ? "text-green-500" : trend === "down" ? "text-accent" : "text-yellow-500";
    const rotate = trend === "up" ? "-45deg" : trend === "down" ? "45deg" : "0deg";

    return (
        <div className="bg-muted/30 p-2 rounded-xl flex items-center justify-center gap-1">
            <span className="font-bold text-foreground text-sm">{val}</span>
            <svg style={{ transform: `rotate(${rotate})` }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </div>
    )
}
