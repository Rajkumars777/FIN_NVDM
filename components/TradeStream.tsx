"use client";

import { useEffect, useState, useRef } from "react";
import { Activity, Wifi, WifiOff, TrendingUp, TrendingDown } from "lucide-react";
import { FINNHUB_API_KEY } from "@/lib/finnhub";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface TradeData {
    p: number; // Price
    s: string; // Symbol
    t: number; // Timestamp (ms)
    v: number; // Volume
}

interface TradeMessage {
    data: TradeData[];
    type: string;
}

const SYMBOLS = [
    { id: "BINANCE:BTCUSDT", label: "Bitcoin (BTC)" },
    { id: "AAPL", label: "Apple (AAPL)" },
    { id: "AMZN", label: "Amazon (AMZN)" },
    { id: "IC MARKETS:1", label: "EUR/USD" },
];

export default function TradeStream() {
    const [trades, setTrades] = useState<TradeData[]>([]);
    const [activeSymbol, setActiveSymbol] = useState(SYMBOLS[0].id);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const tradeHistory = useRef<Record<string, TradeData[]>>({});

    const [isSimulated, setIsSimulated] = useState(false);
    const simulationRef = useRef<NodeJS.Timeout | null>(null);

    // Initial mock history for immediate display
    useEffect(() => {
        // Pre-fill history with some data so it's not empty start
        SYMBOLS.forEach(sym => {
            const basePrice = sym.id.includes('BTC') ? 95000 : sym.id.includes('EUR') ? 1.05 : 150;
            const history = [];
            let price = basePrice;
            const now = Date.now();
            for (let i = 100; i > 0; i--) {
                price = price * (1 + (Math.random() - 0.5) * 0.002);
                history.push({ p: price, s: sym.id, t: now - (i * 1000), v: 100 });
            }
            tradeHistory.current[sym.id] = history;
        });
        setTrades([...(tradeHistory.current[activeSymbol] || [])]);
    }, []);

    useEffect(() => {
        // If simulated, run the simulation loop
        if (isSimulated) {
            simulationRef.current = setInterval(() => {
                const symId = activeSymbol;
                const lastHistory = tradeHistory.current[symId] || [];
                const lastPrice = lastHistory.length > 0 ? lastHistory[lastHistory.length - 1].p : 150;

                // Random walk
                const change = lastPrice * (Math.random() - 0.5) * 0.005; // 0.5% volatility
                const newPrice = lastPrice + change;

                const newTrade = {
                    p: newPrice,
                    s: symId,
                    t: Date.now(),
                    v: Math.floor(Math.random() * 100)
                };

                if (!tradeHistory.current[symId]) tradeHistory.current[symId] = [];
                tradeHistory.current[symId].push(newTrade);
                if (tradeHistory.current[symId].length > 100) tradeHistory.current[symId].shift();

                setTrades([...tradeHistory.current[symId]]);
            }, 1000);

            return () => {
                if (simulationRef.current) clearInterval(simulationRef.current);
            };
        }

        // Otherwise try WebSocket
        if (ws.current?.readyState === WebSocket.OPEN) return;

        const connect = () => {
            try {
                const socket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
                ws.current = socket;

                socket.onopen = () => {
                    console.log("Connected to Finnhub WS");
                    setIsConnected(true);
                    setIsSimulated(false);
                    SYMBOLS.forEach((s) => {
                        socket.send(JSON.stringify({ type: "subscribe", symbol: s.id }));
                    });
                };

                socket.onmessage = (event) => {
                    try {
                        const message: TradeMessage = JSON.parse(event.data);
                        if (message.type === "trade" && message.data) {
                            message.data.forEach((trade) => {
                                if (!tradeHistory.current[trade.s]) {
                                    tradeHistory.current[trade.s] = [];
                                }
                                tradeHistory.current[trade.s].push(trade);
                                if (tradeHistory.current[trade.s].length > 100) {
                                    tradeHistory.current[trade.s].shift();
                                }
                            });
                            setTrades([...(tradeHistory.current[activeSymbol] || [])]);
                        }
                    } catch (e) {
                        // ignore parse errors
                    }
                };

                socket.onclose = () => {
                    console.log("Finnhub WS Disconnected - Switching to Simulation");
                    setIsConnected(false);
                    ws.current = null;
                    setIsSimulated(true); // Fallback
                };

                socket.onerror = (error) => {
                    console.warn("Finnhub WS Error (likely invalid key or rate limit) - Switching to Simulation");
                    socket.close();
                };
            } catch (err) {
                setIsSimulated(true);
            }
        };

        connect();

        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, [activeSymbol, isSimulated]); // Re-run if symbol changes (for sim) or sim state changes

    // Watch active symbol changes to update the displayed chart immediately
    useEffect(() => {
        setTrades([...(tradeHistory.current[activeSymbol] || [])]);
    }, [activeSymbol]);


    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setMounted(true);
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const currentPrice = trades.length > 0 ? trades[trades.length - 1].p : 0;
    const prevPrice = trades.length > 1 ? trades[trades.length - 2].p : currentPrice;
    const isUp = currentPrice >= prevPrice;
    const percentageChange = prevPrice ? ((currentPrice - prevPrice) / prevPrice) * 100 : 0;
    const priceChange = prevPrice ? currentPrice - prevPrice : 0;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            Last | {mounted && currentTime ? `${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}` : 'Loading...'}
                        </span>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${isConnected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                            }`}>
                            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <h2 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <div className={`flex items-baseline gap-2 text-xl font-semibold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                            <span className="flex items-center">
                                {isUp ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                                {Math.abs(priceChange).toFixed(2)}
                            </span>
                            <span>
                                ({Math.abs(percentageChange).toFixed(2)}%)
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <select
                            value={activeSymbol}
                            onChange={(e) => setActiveSymbol(e.target.value)}
                            className="bg-transparent text-lg font-medium text-slate-700 dark:text-slate-300 border-none focus:ring-0 cursor-pointer hover:text-blue-600 p-0"
                        >
                            {SYMBOLS.map((s) => (
                                <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900">
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 52 Week Range Mock Widget */}
                <div className="hidden md:block text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">52 week range</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mb-2">
                        {(currentPrice * 0.7).toFixed(2)} - {(currentPrice * 1.3).toFixed(2)}
                    </div>
                    {/* Visual Range Indicator mock */}
                    <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 bottom-0 bg-blue-500 w-2 h-full rounded-full" style={{ left: '60%' }}></div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                {/* Time Range Tabs */}
                <div className="flex space-x-4 overflow-x-auto">
                    {['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'ALL'].map((range) => (
                        <button
                            key={range}
                            className={`text-xs font-semibold px-1 py-1 ${range === '1D' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                {/* Chart Actions */}
                <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
                    <button className="flex items-center gap-1 text-xs font-medium hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span>+ Comparison</span>
                    </button>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <button className="flex items-center gap-1 text-xs font-medium hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span>Display</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs font-medium hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span>Studies</span>
                    </button>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                        <Activity className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chart Section */}
            <div className="flex-1 min-h-[300px] w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trades} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={true} horizontal={true} className="dark:stroke-slate-800" />
                        <XAxis
                            dataKey="t"
                            tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            stroke="#94a3b8"
                            fontSize={11}
                            tick={{ fill: '#64748b' }}
                            minTickGap={30}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            stroke="#94a3b8"
                            fontSize={11}
                            tick={{ fill: '#64748b' }}
                            width={50}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                            orientation="right"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#0f172a' }}
                            labelStyle={{ color: '#64748b', marginBottom: '0.25rem' }}
                            labelFormatter={formatTime}
                        />
                        <Area
                            type="monotone"
                            dataKey="p"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            isAnimationActive={false} // Disable animation for smoother real-time updates
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Ticks Log (Subtle Footer) */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Live Limit Feed</h3>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {trades.slice().reverse().slice(0, 10).map((trade, idx) => (
                        <div key={`${trade.t}-${idx}`} className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                            <span className="font-mono text-slate-500">{new Date(trade.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                            <span className={`font-semibold ${trade.p >= (trades[trades.length - 2]?.p || trade.p) ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {trade.p.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
