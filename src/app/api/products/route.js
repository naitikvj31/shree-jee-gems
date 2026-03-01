import { NextResponse } from 'next/server';
import seedProducts from '@/data/seedProducts';

// Sanitize query parameters
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>{}$]/g, '').trim().slice(0, 200);
}

// Try MongoDB first, fallback to local seed data
async function getProductsFromDB(query, sortOption, skip, limit) {
    try {
        const dbConnect = (await import('@/lib/mongodb')).default;
        const Product = (await import('@/models/Product')).default;
        await dbConnect();

        const [products, total] = await Promise.all([
            Product.find(query).sort(sortOption).skip(skip).limit(limit).select('-__v').lean(),
            Product.countDocuments(query),
        ]);
        return { products, total, source: 'mongodb' };
    } catch (err) {
        console.warn('MongoDB unavailable, using seed data fallback');
        return null;
    }
}

function getProductsFromSeed(filters) {
    let data = [...seedProducts];

    // Filter
    if (filters.category && filters.category !== 'all') {
        data = data.filter(p => p.category === filters.category.toLowerCase());
    }
    if (filters.search) {
        const s = filters.search.toLowerCase();
        data = data.filter(p =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.tags?.some(t => t.toLowerCase().includes(s))
        );
    }
    if (filters.featured) data = data.filter(p => p.isFeatured);
    if (filters.bestseller) data = data.filter(p => p.isBestseller);
    if (filters.isNew) data = data.filter(p => p.isNew);

    data = data.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    // Sort
    switch (filters.sort) {
        case 'price-asc': data.sort((a, b) => a.price - b.price); break;
        case 'price-desc': data.sort((a, b) => b.price - a.price); break;
        case 'rating': data.sort((a, b) => b.rating - a.rating); break;
        case 'popular': data.sort((a, b) => b.reviewCount - a.reviewCount); break;
        default: break; // keep original order (newest-like)
    }

    const total = data.length;
    const paged = data.slice(filters.skip, filters.skip + filters.limit);
    return { products: paged, total, source: 'seed' };
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = sanitizeString(searchParams.get('category') || '');
        const sort = sanitizeString(searchParams.get('sort') || 'newest');
        const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
        const maxPrice = parseFloat(searchParams.get('maxPrice')) || 999999;
        const search = sanitizeString(searchParams.get('search') || '');
        const featured = searchParams.get('featured') === 'true';
        const bestseller = searchParams.get('bestseller') === 'true';
        const isNew = searchParams.get('new') === 'true';
        const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit')) || 12));
        const skip = (page - 1) * limit;

        // Build MongoDB query
        const query = { price: { $gte: minPrice, $lte: maxPrice }, inStock: true };
        if (category && category !== 'all') query.category = category.toLowerCase();
        if (search) query.$text = { $search: search };
        if (featured) query.isFeatured = true;
        if (bestseller) query.isBestseller = true;
        if (isNew) query.isNew = true;

        let sortOption = {};
        switch (sort) {
            case 'price-asc': sortOption = { price: 1 }; break;
            case 'price-desc': sortOption = { price: -1 }; break;
            case 'rating': sortOption = { rating: -1 }; break;
            case 'popular': sortOption = { reviewCount: -1 }; break;
            default: sortOption = { createdAt: -1 };
        }

        // Try MongoDB first
        let result = await getProductsFromDB(query, sortOption, skip, limit);

        // Fallback to seed data
        if (!result) {
            result = getProductsFromSeed({
                category, sort, minPrice, maxPrice, search,
                featured, bestseller, isNew, skip, limit
            });
        }

        return NextResponse.json({
            success: true,
            data: result.products,
            pagination: {
                page,
                limit,
                total: result.total,
                pages: Math.ceil(result.total / limit),
            },
        });
    } catch (error) {
        console.error('Products API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
