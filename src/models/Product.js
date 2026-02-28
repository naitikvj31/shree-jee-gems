import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'bangles', 'pendants'],
        index: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative'],
    },
    currency: {
        type: String,
        default: 'USD',
    },
    images: [{
        type: String,
        required: true,
    }],
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
        type: String,
        maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    material: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
    },
    purity: {
        type: String,
    },
    gemstones: [{
        type: String,
    }],
    sizes: [{
        type: String,
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    isNew: {
        type: Boolean,
        default: false,
    },
    isBestseller: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    tags: [{
        type: String,
        lowercase: true,
    }],
}, {
    timestamps: true,
});

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
