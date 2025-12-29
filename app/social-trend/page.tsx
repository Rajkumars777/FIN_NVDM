"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { TrendingUp, TrendingDown, Minus, Hash, Database, ExternalLink, Activity, Newspaper, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
    totalPosts: number;
    sentimentCounts: {
        Positive: number;
        Negative: number;
        Neutral: number;
    };
    topTrend: string;
    trendData: { time: string; Positive: number; Negative: number; Neutral: number }[];
    recentFeed: { title: string; analysis: { sentiment_class: string }; source: string; timestamp: string; url: string }[];
}

interface FeedPost {
    _id: string;
    title: string;
    analysis: { sentiment_class: string };
    source: string;
    timestamp: string;
    url: string;
    metrics?: {
        likes: number;
        comments: number;
        shares: number;
    };
    platform?: string;
}

export default function SocialTrendPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Feed State
    const [feed, setFeed] = useState<FeedPost[]>([]);
    const [feedLoading, setFeedLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ sentiment: 'All', source: 'All' });

    useEffect(() => {
        // Fetch specific high-level stats
        fetch('/api/social-stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchFeed();
    }, [pagination.page, filters]);

    const fetchFeed = () => {
        setFeedLoading(true);
        const params = new URLSearchParams({
            page: pagination.page.toString(),
            limit: '9',
            sentiment: filters.sentiment,
            source: filters.source
        });

        fetch(`/api/social-feed?${params}`)
            .then(res => res.json())
            .then(data => {
                setFeed(data.posts);
                setPagination(prev => ({ ...prev, ...data.pagination }));
                setFeedLoading(false);
            })
            .catch(err => console.error(err))
            .finally(() => setFeedLoading(false));
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
    };

    // Helper to format large numbers
    const formatMetric = (num: number) => {
        if (!num) return '0';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

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

                <div className="p-8 space-y-6 max-w-[1920px] mx-auto">
                    {/* ... (Header and Stats Grid skipped for brevity, keeping existing structure) ... */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Social Trends
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Aggregated insights from financial chatter.
                            </p>
                        </div>
                    </div>

                    {/* Premium Stats Grid - Compact */}
                    <div className="grid grid-cols-12 gap-4">

                        {/* 1. Total Volume (3 Cols) */}
                        <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-gradient-to-br from-slate-900 to-slate-900/50 p-px rounded-2xl border border-white/5 shadow-lg shadow-black/20 group hover:border-blue-500/20 transition-all">
                            <div className="h-full bg-slate-950/50 backdrop-blur-xl rounded-[15px] p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-2xl -mr-8 -mt-8"></div>

                                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 mb-3 ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <Database className="w-5 h-5" />
                                </div>
                                <h3 className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Total Volume</h3>
                                <div className="text-3xl font-black text-white tracking-tight">
                                    {loading ? "..." : stats?.totalPosts.toLocaleString()}
                                </div>
                                <p className="text-[10px] text-blue-400/60 mt-1 font-mono">Real-time Records</p>
                            </div>
                        </div>

                        {/* 2. Top Trend (3 Cols) */}
                        <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-gradient-to-br from-slate-900 to-slate-900/50 p-px rounded-2xl border border-white/5 shadow-lg shadow-black/20 group hover:border-purple-500/20 transition-all">
                            <div className="h-full bg-slate-950/50 backdrop-blur-xl rounded-[15px] p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-2xl -ml-8 -mt-8"></div>

                                <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 mb-3 ring-1 ring-purple-500/20 group-hover:rotate-12 transition-transform duration-500">
                                    <Hash className="w-5 h-5" />
                                </div>
                                <h3 className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Dominant Narrative</h3>
                                <div className="text-2xl font-black bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent truncate w-full px-2">
                                    {loading ? "..." : `#${stats?.topTrend}`}
                                </div>
                                <p className="text-[10px] text-purple-400/60 mt-1 font-mono">Highest Velocity</p>
                            </div>
                        </div>

                        {/* 3. Consolidated Sentiment Spectrum (6 Cols) */}
                        <div className="col-span-12 xl:col-span-6 bg-gradient-to-br from-slate-900 to-slate-900/50 p-px rounded-2xl border border-white/5 shadow-lg shadow-black/20 group hover:border-white/10 transition-all">
                            <div className="h-full bg-slate-950/50 backdrop-blur-xl rounded-[15px] p-5 flex flex-col relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-red-500/5 opacity-50"></div>

                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        Sentiment Spectrum
                                        <span className="px-1.5 py-px rounded-full bg-white/5 text-[9px] font-mono text-muted-foreground border border-white/5">AI ANALYSIS</span>
                                    </h3>
                                </div>

                                <div className="flex-1 grid grid-cols-3 gap-3 relative z-10 items-end">
                                    {/* Positive */}
                                    <div className="text-center group/item">
                                        <div className="mb-2 flex justify-center">
                                            <div className="p-1.5 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20 group-hover/item:bg-green-500/20 transition-colors">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-green-400 mb-0.5">{loading ? "-" : stats?.sentimentCounts.Positive}</div>
                                        <div className="text-[9px] text-green-500/60 uppercase font-bold tracking-wider">Positive</div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: stats ? `${(stats.sentimentCounts.Positive / stats.totalPosts) * 100}%` : '0%' }}></div>
                                        </div>
                                    </div>

                                    {/* Neutral */}
                                    <div className="text-center group/item scale-95 opacity-80 hover:opacity-100 hover:scale-100 transition-all">
                                        <div className="mb-2 flex justify-center">
                                            <div className="p-1.5 bg-slate-500/10 rounded-lg text-slate-400 border border-slate-500/20">
                                                <Minus className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-slate-400 mb-0.5">{loading ? "-" : stats?.sentimentCounts.Neutral}</div>
                                        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Neutral</div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-slate-500" style={{ width: stats ? `${(stats.sentimentCounts.Neutral / stats.totalPosts) * 100}%` : '0%' }}></div>
                                        </div>
                                    </div>

                                    {/* Negative */}
                                    <div className="text-center group/item">
                                        <div className="mb-2 flex justify-center">
                                            <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20 group-hover/item:bg-red-500/20 transition-colors">
                                                <TrendingDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-red-400 mb-0.5">{loading ? "-" : stats?.sentimentCounts.Negative}</div>
                                        <div className="text-[9px] text-red-500/60 uppercase font-bold tracking-wider">Negative</div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-red-500" style={{ width: stats ? `${(stats.sentimentCounts.Negative / stats.totalPosts) * 100}%` : '0%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Chart Row - Full Width */}
                    <div className="w-full h-[400px] bg-slate-900/50 rounded-2xl border border-white/5 p-6 backdrop-blur-xl flex flex-col mb-8">
                        <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Sentiment Velocity (24h)
                        </h3>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.trendData || []}>
                                    <defs>
                                        <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                                        itemStyle={{ fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="Positive" stroke="#4ade80" fillOpacity={1} fill="url(#colorPos)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="Negative" stroke="#f87171" fillOpacity={1} fill="url(#colorNeg)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="Neutral" stroke="#94a3b8" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Live Feed Row - Grid Layout */}
                    <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-0 backdrop-blur-xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Newspaper className="w-4 h-4 text-blue-400" />
                                Live Social Feed <span className="text-slate-500 font-normal">({pagination.total} total)</span>
                            </h3>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <div className="flex items-center gap-2 bg-slate-950/50 rounded-lg p-1 px-2 border border-white/5">
                                    <Filter className="w-3 h-3 text-slate-400" />
                                    <select
                                        className="bg-transparent text-xs text-slate-300 focus:outline-none"
                                        value={filters.sentiment}
                                        onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                                    >
                                        <option value="All">All Sentiment</option>
                                        <option value="Positive">Positive</option>
                                        <option value="Negative">Negative</option>
                                        <option value="Neutral">Neutral</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 bg-slate-950/50 rounded-lg p-1 px-2 border border-white/5">
                                    <Database className="w-3 h-3 text-slate-400" />
                                    <select
                                        className="bg-transparent text-xs text-slate-300 focus:outline-none"
                                        value={filters.source}
                                        onChange={(e) => handleFilterChange('source', e.target.value)}
                                    >
                                        <option value="All">All Sources</option>
                                        <option value="reddit">Reddit</option>
                                        <option value="news">News</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Loading State overlay could go here */}
                        <div className={`p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[500px] ${feedLoading ? 'opacity-50' : ''}`}>
                            {feed.map((post, i) => (
                                <div key={i} className="p-4 bg-slate-950/30 hover:bg-white/5 rounded-xl transition-colors group border border-white/5 hover:border-white/10 flex flex-col justify-between h-full min-h-[160px]">
                                    <div className="flex justify-between items-start gap-2 mb-3">
                                        <p className="text-sm text-slate-200 font-medium line-clamp-3 leading-relaxed">
                                            {post.title}
                                        </p>
                                        <a href={post.url} target="_blank" className="text-blue-400 hover:text-blue-300 shrink-0">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between pt-2 border-t border-white/5 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                                    ${post.analysis.sentiment_class === 'Positive' ? 'bg-green-500/10 text-green-400' :
                                                        post.analysis.sentiment_class === 'Negative' ? 'bg-red-500/10 text-red-400' :
                                                            'bg-slate-500/10 text-slate-400'}
                                                `}>
                                                    {post.analysis.sentiment_class}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-mono capitalize">{post.source}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-mono">
                                                {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {/* Engagement Metrics */}
                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                            <div className="flex items-center gap-1" title="Likes/Score">
                                                <TrendingUp className="w-3 h-3 text-slate-600" />
                                                {formatMetric(post.metrics?.likes || 0)}
                                            </div>
                                            <div className="flex items-center gap-1" title="Comments">
                                                <Minus className="w-3 h-3 text-slate-600 rotate-90" />
                                                {formatMetric(post.metrics?.comments || 0)}
                                            </div>
                                            {/* Only show shares if > 0 to save space, or just show universally */}
                                            {(post.metrics?.shares || 0) > 0 && (
                                                <div className="flex items-center gap-1" title="Shares">
                                                    <ExternalLink className="w-3 h-3 text-slate-600" />
                                                    {formatMetric(post.metrics?.shares || 0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {feed.length === 0 && !feedLoading && (
                                <div className="col-span-full h-40 flex items-center justify-center text-slate-500 text-sm">
                                    No posts found matching filter.
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="p-4 border-t border-white/5 bg-white/5 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page <= 1}
                                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function divClient(props: any) {
    return <div {...props} />
}
