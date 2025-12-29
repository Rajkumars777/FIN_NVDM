
"use client"

import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus, ExternalLink, Calendar, MessageCircle, AlertCircle } from 'lucide-react';

interface Post {
    _id: string;
    title: string;
    content: string;
    url: string;
    source: string;
    author: string;
    timestamp: string;
    analysis?: {
        sentiment_class: 'Positive' | 'Negative' | 'Neutral';
        confidence: number;
        summary: string;
    };
    platform?: string;
}

export default function RealtimeFeed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/realtime-posts');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        // Poll every 30 seconds
        const interval = setInterval(fetchPosts, 30000);
        return () => clearInterval(interval);
    }, []);

    const getSentimentColor = (sentiment?: string) => {
        switch (sentiment) {
            case 'Positive': return 'text-green-400 border-green-500/30 bg-green-500/10';
            case 'Negative': return 'text-red-400 border-red-500/30 bg-red-500/10';
            default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
        }
    };

    const getSentimentIcon = (sentiment?: string) => {
        switch (sentiment) {
            case 'Positive': return <TrendingUp className="w-4 h-4" />;
            case 'Negative': return <TrendingDown className="w-4 h-4" />;
            default: return <Minus className="w-4 h-4" />;
        }
    };

    return (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Realtime Social Signals</h2>
                    <p className="text-xs text-slate-400">Live feed from Reddit, News, & Web</p>
                </div>
                <button
                    onClick={fetchPosts}
                    className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg transition-all"
                    disabled={loading}
                    title="Refresh Feed"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[600px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {posts.length === 0 && !loading ? (
                    <div className="text-center py-10 text-slate-500">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No signals detected.</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all hover:bg-slate-900/60"
                        >
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getSentimentColor(post.analysis?.sentiment_class)}`}>
                                            {getSentimentIcon(post.analysis?.sentiment_class)}
                                            {post.analysis?.sentiment_class || 'Neu'}
                                        </span>
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                            {post.platform || post.source || 'Web'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 ml-auto">
                                            {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-semibold text-slate-200 leading-snug mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
                                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            {post.title}
                                        </a>
                                    </h3>

                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-2">
                                        <span className="truncate max-w-[100px]">{post.author}</span>
                                        {post.analysis?.confidence && (
                                            <span className="opacity-70">Conf: {(post.analysis.confidence * 100).toFixed(0)}%</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
