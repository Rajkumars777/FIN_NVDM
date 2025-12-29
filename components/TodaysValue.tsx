"use client";

import DashboardCard from "./DashboardCard";
import { MoreHorizontal } from "lucide-react";

const items = [
    { name: "Textile", val: 15285, pct: "21.02%" },
    { name: "Miscellaneous", val: 10243, pct: "14.2%" },
    { name: "Engineering", val: 8945, pct: "11.1%" },
    { name: "Fuel and Power", val: 5678, pct: "7.8%" },
    { name: "Food and Allied", val: 4321, pct: "5.4%" },
    { name: "Paper & Printing", val: 3210, pct: "4.1%" },
    { name: "Travel & Leisure", val: 2100, pct: "2.8%" },
];

export default function TodaysValue() {
    return (
        <DashboardCard
            title="Today's Value"
            action={<MoreHorizontal className="w-5 h-5 text-muted-foreground" />}
        >
            <div className="space-y-4">
                {items.map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                            {/* Tooltip-ish value on hover could be cool, sticking to static for now as per image logic */}
                        </div>
                        <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full group-hover:brightness-110 transition-all"
                                style={{ width: item.pct }}
                            />
                            {/* Text overlay on bar in image? No, let's put it on top or tooltip. 
                             Image has a popover. We'll skip complex interactive popover for speed, 
                             just simple list. 
                          */}
                        </div>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
}
