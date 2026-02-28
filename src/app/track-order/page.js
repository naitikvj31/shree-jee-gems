'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineTruck, HiOutlineSearch, HiOutlineCheck, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi';
import styles from './track.module.css';

const demoOrderStatuses = {
    confirmed: { step: 1, label: 'Confirmed', icon: HiOutlineCheck },
    processing: { step: 2, label: 'Processing', icon: HiOutlineClock },
    shipped: { step: 3, label: 'Shipped', icon: HiOutlineTruck },
    delivered: { step: 4, label: 'Delivered', icon: HiOutlineLocationMarker },
};

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

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const { orders, isLoggedIn } = useAuth();

    const handleTrack = (e) => {
        e.preventDefault();
        setError('');
        setResult(null);

        if (!orderId.trim()) {
            setError('Please enter your order ID');
            return;
        }

        // Search in user orders
        const found = orders.find(o => o.id.toLowerCase() === orderId.trim().toLowerCase());
        if (found) {
            setResult(found);
        } else {
            setError('Order not found. Please check your order ID and try again.');
        }
    };

    const getStep = (status) => demoOrderStatuses[status]?.step || 1;

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroIcon}>
                        <HiOutlineTruck size={40} />
                    </div>
                    <h1 className={styles.title}>Track Your Order</h1>
                    <p className={styles.subtitle}>Enter your order ID below to check the current status and shipping details of your jewelry order.</p>

                    <form onSubmit={handleTrack} className={styles.searchForm}>
                        <div className={styles.searchWrap}>
                            <HiOutlineSearch size={20} className={styles.formIcon} />
                            <input
                                type="text"
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                                placeholder="Enter Order ID (e.g. SJJ-M1234ABC)"
                                className={styles.searchInput}
                            />
                        </div>
                        <button type="submit" className={styles.trackBtn}>Track</button>
                    </form>

                    {error && <div className={styles.error}>{error}</div>}
                </div>
            </section>

            {/* Result */}
            {result && (
                <AnimatedSection>
                    <section className={`container ${styles.resultSection}`}>
                        <div className={styles.resultCard}>
                            <div className={styles.resultHeader}>
                                <div>
                                    <h2>Order {result.id}</h2>
                                    <p>Placed on {new Date(result.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <span className={`${styles.statusBadge} ${styles[`status_${result.status}`]}`}>
                                    {result.status}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className={styles.progress}>
                                {Object.entries(demoOrderStatuses).map(([key, val], i) => {
                                    const isActive = getStep(result.status) >= val.step;
                                    const Icon = val.icon;
                                    return (
                                        <div key={key} className={`${styles.step} ${isActive ? styles.stepActive : ''}`}>
                                            <div className={styles.stepDot}>
                                                <Icon size={16} />
                                            </div>
                                            <span className={styles.stepLabel}>{val.label}</span>
                                            {i < 3 && <div className={`${styles.stepLine} ${isActive && getStep(result.status) > val.step ? styles.lineActive : ''}`} />}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Items */}
                            <div className={styles.itemsList}>
                                <h3>Order Items</h3>
                                {result.items.map((item, i) => (
                                    <div key={i} className={styles.item}>
                                        <div className={styles.itemImage}>✦</div>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <span className={styles.itemQty}>Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </AnimatedSection>
            )}

            {/* Recent Orders (if logged in) */}
            {isLoggedIn && orders.length > 0 && !result && (
                <AnimatedSection>
                    <section className={`container ${styles.recentSection}`}>
                        <h2>Your Recent Orders</h2>
                        <div className={styles.recentGrid}>
                            {orders.slice(0, 4).map(order => (
                                <button key={order.id} className={styles.recentCard} onClick={() => { setOrderId(order.id); setResult(order); }}>
                                    <span className={styles.recentId}>{order.id}</span>
                                    <span className={styles.recentDate}>
                                        {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className={`${styles.recentStatus} ${styles[`status_${order.status}`]}`}>
                                        {order.status}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                </AnimatedSection>
            )}

            {/* Help */}
            <AnimatedSection>
                <section className={`container ${styles.helpSection}`}>
                    <div className={styles.helpCard}>
                        <h3>Need Help?</h3>
                        <p>If you have any questions about your order, our jewelry experts are here to help.</p>
                        <div className={styles.helpActions}>
                            <a href="mailto:info@shreejeejewels.com" className={styles.helpBtn}>Email Support</a>
                            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '66000000000'}`} className={styles.helpBtnGreen}>WhatsApp Us</a>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
}
