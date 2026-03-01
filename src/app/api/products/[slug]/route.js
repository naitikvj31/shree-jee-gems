import { NextResponse } from 'next/server';
import seedProducts from '@/data/seedProducts';

function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>{}$]/g, '').trim().slice(0, 200);
}

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const cleanSlug = sanitizeString(slug);

        if (!cleanSlug) {
            return NextResponse.json({ success: false, error: 'Invalid slug' }, { status: 400 });
        }

        // Try MongoDB first
        let product = null;
        let related = [];

        try {
            const dbConnect = (await import('@/lib/mongodb')).default;
            const Product = (await import('@/models/Product')).default;
            await dbConnect();

            product = await Product.findOne({ slug: cleanSlug }).select('-__v').lean();

            if (product) {
                related = await Product.find({
                    category: product.category,
                    slug: { $ne: cleanSlug },
                }).limit(4).select('-__v').lean();
            }
        } catch (err) {
            console.warn('MongoDB unavailable, using seed data fallback for product detail');
        }

        // Fallback to seed data
        if (!product) {
            product = seedProducts.find(p => p.slug === cleanSlug);
            if (product) {
                related = seedProducts
                    .filter(p => p.category === product.category && p.slug !== cleanSlug)
                    .slice(0, 4);
            }
        }

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product, related });
    } catch (error) {
        console.error('Product Detail API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}
