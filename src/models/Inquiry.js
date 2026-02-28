import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'closed'],
        default: 'new',
    },
    productSlug: {
        type: String,
    },
}, {
    timestamps: true,
});

InquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
