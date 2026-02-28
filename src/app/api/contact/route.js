import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>{}$]/g, '').trim();
}

// Simple rate limiting using in-memory store
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(ip) {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }

    const requests = rateLimitMap.get(ip).filter(time => time > windowStart);
    rateLimitMap.set(ip, requests);

    if (requests.length >= MAX_REQUESTS) {
        return false;
    }

    requests.push(now);
    return true;
}

export async function POST(request) {
    try {
        // Rate limiting
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { success: false, error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        await dbConnect();

        const body = await request.json();

        // Validate required fields
        const { name, email, country, message } = body;

        if (!name || !email || !country || !message) {
            return NextResponse.json(
                { success: false, error: 'All required fields must be filled' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Create sanitized inquiry
        const inquiry = await Inquiry.create({
            name: sanitizeString(name).slice(0, 100),
            email: sanitizeString(email).slice(0, 100),
            phone: sanitizeString(body.phone || '').slice(0, 20),
            country: sanitizeString(country).slice(0, 50),
            subject: sanitizeString(body.subject || '').slice(0, 200),
            message: sanitizeString(message).slice(0, 2000),
            productSlug: sanitizeString(body.productSlug || '').slice(0, 200),
        });

        return NextResponse.json({
            success: true,
            message: 'Inquiry submitted successfully',
            data: { id: inquiry._id },
        }, { status: 201 });
    } catch (error) {
        console.error('Contact API Error:', error);

        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: 'Invalid input data' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to submit inquiry' },
            { status: 500 }
        );
    }
}
