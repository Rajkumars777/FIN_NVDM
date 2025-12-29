"use client";

import DashboardCard from "./DashboardCard";
import { Filter } from "lucide-react";

export default function TopValueList() {
    return (
        <DashboardCard
            title="Top value list"
            action={
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted text-muted-foreground transition-colors">
                    <Filter className="w-3 h-3" /> Filters
                </button>
            }
        >
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground bg-muted/30 uppercase tracking-wider rounded-lg">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Instrument</th>
                            <th className="px-4 py-3">LTP</th>
                            <th className="px-4 py-3 text-center">%</th>
                            <th className="px-4 py-3 text-right">Value</th>
                            <th className="px-4 py-3 text-right rounded-r-lg">Volume</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <Row name="BEXIMCO" ltp="120.7" pct="1.26%" vol="819.35" val="High" />
                        <Row name="FORTUNE" ltp="79.5" pct="0%" vol="551.28" val="Med" />
                        <Row name="LHBL" ltp="73.9" pct="4.97%" vol="546.65" val="High" />
                        <Row name="MALEKSPIN" ltp="35.9" pct="-3.23%" vol="317.75" val="Low" isNeg />
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
}

function Row({ name, ltp, pct, vol, isNeg }: any) {
    return (
        <tr className="group hover:bg-muted/50 transition-colors">
            <td className="px-4 py-4 font-medium text-foreground">{name}</td>
            <td className="px-4 py-4 text-muted-foreground">{ltp}</td>
            <td className={`px-4 py-4 text-center ${isNeg ? "text-red-500" : pct === "0%" ? "text-muted-foreground" : "text-green-500"}`}>{pct}</td>
            <td className="px-4 py-4 text-right text-foreground">{vol}</td>
            <td className="px-4 py-4 text-right">
                <div className="flex items-end justify-end gap-0.5 h-6">
                    <div className="w-1 bg-accent/30 h-[40%] rounded-sm"></div>
                    <div className="w-1 bg-accent/50 h-[70%] rounded-sm"></div>
                    <div className="w-1 bg-accent h-[100%] rounded-sm"></div>
                    <div className="w-1 bg-accent/60 h-[50%] rounded-sm"></div>
                </div>
            </td>
        </tr>
    )
}
