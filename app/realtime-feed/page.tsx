
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

export default function RealtimeFeedPage() {
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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Realtime Financial Intelligence
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Live stream of market sentiment, news, and social signals.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 font-mono">
                            Last Query: {lastUpdated.toLocaleTimeString()}
                        </span>
                        <button
                            onClick={fetchPosts}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Feed
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {posts.length === 0 && !loading ? (
                        <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No posts found. Run the scraper script to populate data.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all hover:bg-slate-900/60 hover:shadow-xl hover:shadow-black/20"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSentimentColor(post.analysis?.sentiment_class)}`}>
                                                    {getSentimentIcon(post.analysis?.sentiment_class)}
                                                    {post.analysis?.sentiment_class || 'Neutral'}
                                                </span>
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                                    {post.platform || post.source || 'Web'}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-500 ml-auto md:ml-0">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(post.timestamp).toLocaleString()}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-semibold text-slate-200 leading-snug mb-2 group-hover:text-blue-400 transition-colors">
                                                <a href={post.url} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                                                    <span className="absolute inset-0" aria-hidden="true" />
                                                    {post.title}
                                                </a>
                                            </h3>

                                            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                                {post.content.length > 300 ? post.content.substring(0, 300) + '...' : post.content}
                                            </p>

                                            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] uppercase font-bold text-slate-300">
                                                        {post.author.substring(0, 1)}
                                                    </div>
                                                    {post.author}
                                                </div>
                                                {post.analysis?.confidence && (
                                                    <span>AI Confidence: {(post.analysis.confidence * 100).toFixed(0)}%</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="hidden md:flex flex-col items-center justify-center pl-4 border-l border-slate-800/50">
                                            <a
                                                href={post.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-500 hover:text-white transition-colors relative z-10"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
