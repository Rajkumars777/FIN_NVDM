"use client";

import { cn } from "@/lib/utils";

type Post = {
    post_id: string;
    original_title: string;
    url: string;
    timestamp: number;
    dominant_emotion: string;
    dominant_topic: number;
    forecast_signal: string;
};

export default function LiveFeed({ posts }: { posts: Post[] }) {
    return (
        <div className="bg-transparent">
            <h3 className="text-lg font-semibold text-white mb-4">Last Actions</h3>
            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No data found.</div>
                ) : (
                    <ul className="space-y-4">
                        {posts.map((post) => (
                            <li key={post.post_id} className="relative pl-6 border-l border-white/10 last:border-0 pb-6">
                                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#6C5DD3] ring-4 ring-[#111114]" />
                                <a href={post.url || '#'} target="_blank" rel="noopener noreferrer" className="block group">
                                    <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors mb-1">
                                        Scan for <span className="text-white font-semibold">{post.original_title}</span> has been completed
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            {new Date(post.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded font-medium",
                                            post.dominant_emotion === "positive" && "bg-green-500/10 text-green-400",
                                            post.dominant_emotion === "negative" && "bg-red-500/10 text-red-400",
                                            post.dominant_emotion === "neutral" && "bg-gray-500/10 text-gray-400",
                                        )}>
                                            {post.dominant_emotion}
                                        </span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button className="w-full py-3 mt-4 rounded-xl bg-[#1c1c21] text-gray-400 text-sm hover:bg-[#25252b] transition-colors">
                Show all actions
            </button>
        </div>
    );
}
