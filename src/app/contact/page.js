'use client';

import { useState, useRef, useEffect } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock, HiOutlineChatAlt2, HiOutlineGlobe, HiOutlineCheck } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './contact.module.css';

const contactInfo = [
    { icon: HiOutlineMail, title: 'Email Us', value: 'info@shreejeejewels.com', sub: 'We reply within 2 hours' },
    { icon: HiOutlinePhone, title: 'Call Us', value: '+66 2 XXX XXXX', sub: 'Mon-Sat, 9AM - 8PM' },
    { icon: FaWhatsapp, title: 'WhatsApp', value: '+66 XX XXX XXXX', sub: 'Instant jewelry support' },
    { icon: HiOutlineClock, title: 'Business Hours', value: '9 AM - 8 PM (UTC+7)', sub: 'Mon - Saturday' },
];

const offices = [
    { flag: '🇹🇭', city: 'Bangkok', address: 'Silom Road, Bangkok 10500, Thailand', phone: '+66 2 XXX XXXX' },
    { flag: '🇺🇸', city: 'New York', address: '47th St, Diamond District, NY 10036', phone: '+1 212 XXX XXXX' },
    { flag: '🇯🇵', city: 'Tokyo', address: 'Ginza 4-chome, Chuo-ku, Tokyo', phone: '+81 3 XXXX XXXX' },
    { flag: '🇿🇦', city: 'Johannesburg', address: 'Sandton City, Johannesburg 2196', phone: '+27 11 XXX XXXX' },
];

const inquiryTypes = [
    'General Inquiry',
    'Product Question',
    'Custom Jewelry Design',
    'Wholesale / Bulk Order',
    'Return / Exchange',
    'Shipping Question',
    'Partnership Opportunity',
];

function AnimatedSection({ children, className = '' }) {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { entry.target.classList.add(styles.visible); observer.disconnect(); } },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return <div ref={ref} className={`${styles.animSection} ${className}`}>{children}</div>;
}

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', subject: '', message: '' });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                setForm({ name: '', email: '', phone: '', type: '', subject: '', message: '' });
            } else {
                setStatus(data.error || 'Something went wrong');
            }
        } catch {
            setStatus('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.contact}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <span className={styles.subtitle}>Get in Touch</span>
                    <h1 className={styles.title}>
                        We&apos;d Love to <span className={styles.goldText}>Hear From You</span>
                    </h1>
                    <p className={styles.heroDesc}>
                        Have a question about our jewelry, need help with an order, or want to discuss a custom design? Our team of jewelry experts is here for you.
                    </p>
                </div>
                <div className={styles.heroDecor}>
                    <span className={styles.decorStar}>✦</span>
                    <span className={styles.decorStar2}>✦</span>
                </div>
            </section>

            {/* Contact Info Cards */}
            <AnimatedSection>
                <section className={styles.infoSection}>
                    <div className={`container ${styles.infoGrid}`}>
                        {contactInfo.map((info, i) => (
                            <div key={i} className={styles.infoCard}>
                                <div className={styles.infoIconWrap}>
                                    <info.icon size={24} />
                                </div>
                                <h3>{info.title}</h3>
                                <p className={styles.infoValue}>{info.value}</p>
                                <span className={styles.infoSub}>{info.sub}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </AnimatedSection>

            {/* Main Content: Form + Map */}
            <AnimatedSection>
                <section className={`container ${styles.content}`}>
                    {/* Form */}
                    <div className={styles.formSection}>
                        <div className={styles.formHeader}>
                            <HiOutlineChatAlt2 size={28} className={styles.formHeaderIcon} />
                            <div>
                                <h2>Send Us a Message</h2>
                                <p>Fill out the form below and our team will get back to you within 2 hours during business hours.</p>
                            </div>
                        </div>

                        {status === 'success' ? (
                            <div className={styles.success}>
                                <div className={styles.successIcon}>
                                    <HiOutlineCheck size={40} />
                                </div>
                                <h3>Message Sent Successfully!</h3>
                                <p>Thank you for reaching out. Our jewelry experts will respond within 2 business hours.</p>
                                <button onClick={() => setStatus('')} className={styles.sendAnother}>Send Another Message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Full Name *</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email Address *</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Phone Number</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Inquiry Type</label>
                                        <select name="type" value={form.type} onChange={handleChange}>
                                            <option value="">Select a topic</option>
                                            {inquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subject *</label>
                                    <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Message *</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your inquiry, product interest, or custom design idea..." required rows={5} />
                                </div>
                                {typeof status === 'string' && status && status !== 'success' && (
                                    <div className={styles.error}>{status}</div>
                                )}
                                <button type="submit" disabled={loading} className={styles.submitBtn}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Side Info */}
                    <div className={styles.sideInfo}>
                        <div className={styles.whyCard}>
                            <h3>Why Contact Us?</h3>
                            <ul className={styles.whyList}>
                                <li><HiOutlineCheck size={16} /> Custom jewelry design consultation</li>
                                <li><HiOutlineCheck size={16} /> Wholesale & bulk order pricing</li>
                                <li><HiOutlineCheck size={16} /> Product authentication queries</li>
                                <li><HiOutlineCheck size={16} /> Shipping & delivery support</li>
                                <li><HiOutlineCheck size={16} /> Returns & exchange assistance</li>
                                <li><HiOutlineCheck size={16} /> Wedding collection curation</li>
                            </ul>
                        </div>

                        <div className={styles.responseCard}>
                            <div className={styles.responseIcon}>⚡</div>
                            <h4>Fast Response Guarantee</h4>
                            <p>Our dedicated team responds to all inquiries within <strong>2 business hours</strong>. For urgent matters, call or WhatsApp us directly.</p>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Office Locations */}
            <AnimatedSection>
                <section className={styles.officesSection}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <HiOutlineGlobe size={28} className={styles.sectionIcon} />
                            <span className={styles.subtitle}>Our Offices</span>
                            <h2>Visit Us Worldwide</h2>
                        </div>
                        <div className={styles.officesGrid}>
                            {offices.map((o, i) => (
                                <div key={i} className={styles.officeCard}>
                                    <span className={styles.officeFlag}>{o.flag}</span>
                                    <h3>{o.city}</h3>
                                    <p className={styles.officeAddress}>{o.address}</p>
                                    <p className={styles.officePhone}>{o.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
}
