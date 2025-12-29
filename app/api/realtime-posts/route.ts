
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('financial_sentiment_db'); // Make sure this matches script

        // Fetch latest 50 posts
        const posts = await db.collection('posts')
            .find({})
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();

        return NextResponse.json(posts);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
