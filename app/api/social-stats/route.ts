
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('financial_sentiment_db');

        // 1. Total Records
        const totalPosts = await db.collection('posts').countDocuments({});

        // 2. Sentiment Breakdown
        const sentimentAgg = await db.collection('posts').aggregate([
            {
                $group: {
                    _id: "$analysis.sentiment_class",
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        const sentimentCounts = {
            Positive: 0,
            Negative: 0,
            Neutral: 0
        };

        sentimentAgg.forEach((item: any) => {
            if (item._id === 'Positive') sentimentCounts.Positive = item.count;
            if (item._id === 'Negative') sentimentCounts.Negative = item.count;
            if (item._id === 'Neutral') sentimentCounts.Neutral = item.count;
        });

        // 3. Top Trend (Simple Word Frequency on recent 50 posts titles)
        const recentPosts = await db.collection('posts')
            .find({}, { projection: { title: 1 } })
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();

        const wordMap: Record<string, number> = {};
        const stopWords = new Set(['the', 'and', 'for', 'that', 'with', 'from', 'this', 'market', 'stock', 'video', 'news', 'update', 'analysis', 'price', 'today', '2025', '2024']);

        recentPosts.forEach(post => {
            const words = post.title.toLowerCase().match(/\b\w+\b/g) || [];
            words.forEach((w: string) => {
                if (w.length > 3 && !stopWords.has(w)) {
                    wordMap[w] = (wordMap[w] || 0) + 1;
                }
            });
        });

        let topTrend = "General Market";
        let maxCount = 0;

        for (const [word, count] of Object.entries(wordMap)) {
            if (count > maxCount) {
                maxCount = count;
                topTrend = word.charAt(0).toUpperCase() + word.slice(1);
            }
        }

        // 4. Trend Data (Sentiment over time - Last 24h grouped by hour)
        // Note: MongoDB Atlas Free Tier might limit some date operators, but standard $hour works.
        // We'll simulate a proper time-series for the frontend by grouping.
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const trendAgg = await db.collection('posts').aggregate([
            { $match: { timestamp: { $gte: yesterday } } },
            {
                $group: {
                    _id: {
                        hour: { $hour: "$timestamp" },
                        day: { $dayOfMonth: "$timestamp" }
                    },
                    positive: {
                        $sum: { $cond: [{ $eq: ["$analysis.sentiment_class", "Positive"] }, 1, 0] }
                    },
                    negative: {
                        $sum: { $cond: [{ $eq: ["$analysis.sentiment_class", "Negative"] }, 1, 0] }
                    },
                    neutral: {
                        $sum: { $cond: [{ $eq: ["$analysis.sentiment_class", "Neutral"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id.day": 1, "_id.hour": 1 } }
        ]).toArray();

        // Format trend data for Recharts
        const trendData = trendAgg.map((t: any) => ({
            time: `${t._id.hour}:00`,
            Positive: t.positive,
            Negative: t.negative,
            Neutral: t.neutral
        }));

        // 5. Recent Feed
        const recentFeed = await db.collection('posts')
            .find({}, {
                projection: {
                    title: 1,
                    "analysis.sentiment_class": 1,
                    source: 1,
                    timestamp: 1,
                    url: 1
                }
            })
            .sort({ timestamp: -1 })
            .limit(20)
            .toArray();

        return NextResponse.json({
            totalPosts,
            sentimentCounts,
            topTrend,
            trendData,
            recentFeed
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
