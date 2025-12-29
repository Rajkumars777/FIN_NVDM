export const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "d4t9johr01qhr5tp5dq0d4t9johr01qhr5tp5dqg";

export interface StockQuote {
    c: number; // Current price
    d: number; // Change
    dp: number; // Percent change
    h: number; // High
    l: number; // Low
    o: number; // Open
    pc: number; // Previous close
    t: number; // Timestamp
}

export interface StockCandles {
    c: number[]; // Close prices
    h: number[]; // High prices
    l: number[]; // Low prices
    o: number[]; // Open prices
    s: string;   // Status
    t: number[]; // Timestamps
    v: number[]; // Volumes
}

export async function fetchQuote(symbol: string): Promise<StockQuote | null> {
    try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        if (!res.ok) {
            if (res.status === 403 || res.status === 429) {
                console.warn(`Finnhub Quote API limited/restricted (${res.status}). Using fallback.`);
            } else {
                console.error(`Finnhub quote error ${res.status}`);
            }
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return null;
    }
}

export async function fetchCandles(symbol: string, resolution: string, from: number, to: number): Promise<StockCandles | null> {
    try {
        const res = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`);
        if (!res.ok) {
            if (res.status === 403 || res.status === 429) {
                console.warn(`Finnhub API limited/restricted (${res.status}). Using fallback data.`);
            } else {
                console.error(`Finnhub candle error ${res.status}`);
            }
            return null; // Return null instead of throwing
        }
        const data = await res.json();
        if (data.s === "no_data") return null;
        return data;
    } catch (error) {
        console.error(`Error fetching candles for ${symbol}:`, error);
        return null;
    }
}
