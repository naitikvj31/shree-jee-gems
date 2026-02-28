'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { HiOutlineSparkles, HiOutlineGlobe, HiOutlineBadgeCheck, HiOutlineHeart, HiOutlineTruck, HiOutlineShieldCheck } from 'react-icons/hi';
import styles from './about.module.css';

const stats = [
    { num: '25+', label: 'Years of Craftsmanship' },
    { num: '10K+', label: 'Jewelry Pieces Sold' },
    { num: '50+', label: 'Countries Served' },
    { num: '4.9★', label: 'Customer Rating' },
];

const values = [
    { icon: '💎', title: 'Master Craftsmanship', desc: 'Each piece is meticulously handcrafted by skilled artisans with decades of experience, ensuring flawless beauty in every detail.' },
    { icon: '✨', title: 'Premium Quality', desc: 'We source only BIS-hallmarked gold and GIA/IGI certified diamonds, guaranteeing purity and brilliance you can trust.' },
    { icon: '🌍', title: 'Global Heritage', desc: 'Blending jewelry traditions from India, Thailand, Japan, and Africa, our designs celebrate the beauty of cultures worldwide.' },
    { icon: '💝', title: 'Customer First', desc: 'From personalized consultations to lifetime exchange policies, your satisfaction and joy is our highest priority.' },
];

const markets = [
    { flag: '🇹🇭', country: 'Bangkok, Thailand', desc: 'Our flagship Southeast Asian hub, renowned for exquisite Thai gold designs and gemstone craftsmanship. Home to our largest workshop.', highlight: 'Thai Gold Specialists' },
    { flag: '🇺🇸', country: 'United States', desc: 'Serving American customers with contemporary diamond jewelry, wedding collections, and custom pieces crafted for Western aesthetics.', highlight: 'Diamond Experts' },
    { flag: '🇯🇵', country: 'Tokyo, Japan', desc: 'Bringing Japanese precision and minimalist elegance to our jewelry lines. Premium Akoya pearl collections and modern gold designs.', highlight: 'Pearl Collection' },
    { flag: '🇿🇦', country: 'South Africa', desc: 'Celebrating African heritage through bold gold collar necklaces, Maasai-inspired pieces, and rare Tanzanite gemstone jewelry.', highlight: 'Heritage Designs' },
];

const timeline = [
    { year: '1998', event: 'Founded as a family goldsmith workshop in Jaipur, India' },
    { year: '2005', event: 'Expanded to Bangkok with our first international showroom' },
    { year: '2012', event: 'Launched online store, serving customers across 20+ countries' },
    { year: '2018', event: 'Opened New York and Tokyo offices, offering custom design services' },
    { year: '2022', event: 'Expanded to South Africa, celebrating African jewelry heritage' },
    { year: '2024', event: 'Serving 50+ countries with 10,000+ happy customers worldwide' },
];

function AnimatedSection({ children, className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.visible);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return <div ref={ref} className={`${styles.animSection} ${className}`}>{children}</div>;
}

export default function AboutPage() {
    return (
        <div className={styles.about}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <span className={styles.subtitle}>Our Story</span>
                    <h1 className={styles.title}>
                        Crafting <span className={styles.goldText}>Timeless Beauty</span><br />
                        Since Generations
                    </h1>
                    <p className={styles.heroDesc}>
                        From a humble goldsmith workshop in the heart of Jaipur to serving jewelry lovers across 50+ countries — Shree Jee Jewels is where heritage meets modern luxury.
                    </p>
                    <div className={styles.heroBtns}>
                        <Link href="/" className={styles.heroBtn}>Explore Collection</Link>
                        <Link href="/contact" className={styles.heroBtnOutline}>Get in Touch</Link>
                    </div>
                </div>
                <div className={styles.heroDecor}>
                    <span className={styles.decorStar}>✦</span>
                    <span className={styles.decorStar2}>✦</span>
                    <span className={styles.decorDot}>●</span>
                </div>
            </section>

            {/* Stats Bar */}
            <AnimatedSection>
                <section className={styles.statsBar}>
                    <div className={`container ${styles.statsGrid}`}>
                        {stats.map((s, i) => (
                            <div key={i} className={styles.stat}>
                                <span className={styles.statNum}>{s.num}</span>
                                <span className={styles.statLabel}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </AnimatedSection>

            {/* Story Section */}
            <AnimatedSection>
                <section className={`container ${styles.story}`}>
                    <div className={styles.storyGrid}>
                        <div className={styles.storyImageWrap}>
                            <div className={styles.storyImage}>✦</div>
                            <div className={styles.storyImageBadge}>
                                <HiOutlineSparkles size={18} />
                                <span>Handcrafted with Love</span>
                            </div>
                        </div>
                        <div className={styles.storyContent}>
                            <span className={styles.subtitle}>Our Journey</span>
                            <h2>From Jaipur to the World</h2>
                            <p>
                                Our story began in 1998 in a small workshop in Jaipur, where our founder master goldsmith learned the art of jewelry making from his father. What started as a passion for creating beautiful gold ornaments grew into a global brand that now serves customers across four continents.
                            </p>
                            <p>
                                Every piece at Shree Jee Jewels tells a story — a story of skilled hands shaping metal into art, of carefully selected gemstones finding their perfect setting, and of age-old techniques meeting modern design sensibilities.
                            </p>
                            <p>
                                Today, our team of 100+ master craftsmen blend traditional Indian goldsmithing with design influences from Bangkok, Tokyo, New York, and Johannesburg to create jewelry that transcends borders and cultures.
                            </p>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Timeline */}
            <AnimatedSection>
                <section className={styles.timelineSection}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <span className={styles.subtitle}>Our Milestones</span>
                            <h2>A Legacy of Excellence</h2>
                        </div>
                        <div className={styles.timeline}>
                            {timeline.map((t, i) => (
                                <div key={i} className={`${styles.timelineItem} ${i % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}>
                                    <div className={styles.timelineDot}></div>
                                    <div className={styles.timelineCard}>
                                        <span className={styles.timelineYear}>{t.year}</span>
                                        <p>{t.event}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Values */}
            <AnimatedSection>
                <section className={styles.valuesSection}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <span className={styles.subtitle}>Why Shree Jee Jewels</span>
                            <h2>Our Core Values</h2>
                        </div>
                        <div className={styles.valuesGrid}>
                            {values.map((v, i) => (
                                <div key={i} className={styles.valueCard}>
                                    <span className={styles.valueIcon}>{v.icon}</span>
                                    <h3>{v.title}</h3>
                                    <p>{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Markets */}
            <AnimatedSection>
                <section className={`container ${styles.marketsSection}`}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.subtitle}>Worldwide Presence</span>
                        <h2>Jewelry for Every Culture</h2>
                        <p className={styles.sectionDesc}>
                            We celebrate the unique jewelry traditions of each market we serve, creating pieces that resonate with local aesthetics while maintaining our signature quality.
                        </p>
                    </div>
                    <div className={styles.marketsGrid}>
                        {markets.map((m, i) => (
                            <div key={i} className={styles.marketCard}>
                                <span className={styles.marketFlag}>{m.flag}</span>
                                <span className={styles.marketHighlight}>{m.highlight}</span>
                                <h3>{m.country}</h3>
                                <p>{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </AnimatedSection>

            {/* Promises Strip */}
            <AnimatedSection>
                <section className={styles.promises}>
                    <div className={`container ${styles.promisesGrid}`}>
                        <div className={styles.promiseItem}>
                            <HiOutlineBadgeCheck size={28} />
                            <div>
                                <strong>100% Certified</strong>
                                <span>BIS Hallmarked & GIA Certified</span>
                            </div>
                        </div>
                        <div className={styles.promiseItem}>
                            <HiOutlineTruck size={28} />
                            <div>
                                <strong>Free Global Shipping</strong>
                                <span>Insured delivery to 50+ countries</span>
                            </div>
                        </div>
                        <div className={styles.promiseItem}>
                            <HiOutlineShieldCheck size={28} />
                            <div>
                                <strong>Lifetime Exchange</strong>
                                <span>100% value on gold jewelry</span>
                            </div>
                        </div>
                        <div className={styles.promiseItem}>
                            <HiOutlineHeart size={28} />
                            <div>
                                <strong>Customer Love</strong>
                                <span>4.9★ rating from 10K+ customers</span>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* CTA */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaInner}>
                        <h2>Ready to Find Your Perfect Piece?</h2>
                        <p>Explore our curated collections or let our experts create something uniquely yours.</p>
                        <div className={styles.ctaBtns}>
                            <Link href="/" className={styles.ctaBtn}>Shop Now</Link>
                            <Link href="/contact" className={styles.ctaBtnOutline}>Book a Consultation</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
