import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import seedProducts from '@/data/seedProducts';

export async function POST(request) {
    try {
        // Verify secret key
        const body = await request.json();
        const secret = body.secret;

        if (secret !== process.env.SEED_SECRET) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        // Check if products already exist
        const existingCount = await Product.countDocuments();
        if (existingCount > 0) {
            return NextResponse.json({
                success: false,
                error: `Database already has ${existingCount} products. Delete them first if you want to re-seed.`,
            }, { status: 400 });
        }

        // Insert seed products
        const products = await Product.insertMany(seedProducts);

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${products.length} products`,
            count: products.length,
        }, { status: 201 });
    } catch (error) {
        console.error('Seed API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed database' },
            { status: 500 }
        );
    }
}
