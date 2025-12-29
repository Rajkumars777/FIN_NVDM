"use client";

import { cn } from "@/lib/utils";

export default function TopicCards({ topics }: { topics: any[] }) {
    // Max count for progress bar calculation
    const maxCount = Math.max(...topics.map((t) => t.count), 1);

    return (
        <div className="space-y-4">
            {topics.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white",
                        idx === 0 ? "bg-[#6C5DD3]" : "bg-[#1c1c21] border border-white/10"
                    )}>
                        {idx + 1}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-white">Topic {topic.id}</span>
                            <span className="text-xs text-gray-400">{topic.count} Posts</span>
                        </div>
                        <div className="w-full bg-[#1c1c21] rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-[#6C5DD3] to-[#A0D7E7] h-2 rounded-full"
                                style={{ width: `${(topic.count / maxCount) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
