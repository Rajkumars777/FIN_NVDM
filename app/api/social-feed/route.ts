
import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12'); // 3 cols * 4 rows
        const sentiment = searchParams.get('sentiment');
        const source = searchParams.get('source');

        const client = await clientPromise;
        const db = client.db('financial_sentiment_db');

        const query: any = {};
        if (sentiment && sentiment !== 'All') {
            query['analysis.sentiment_class'] = sentiment;
        }
        if (source && source !== 'All') {
            // regex/fuzzy match or exact match depending on data
            query['source'] = { $regex: source, $options: 'i' };
        }

        const total = await db.collection('posts').countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const posts = await db.collection('posts')
            .find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page,
                totalPages,
                limit
            }
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
    }
}
