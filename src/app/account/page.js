'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
    HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart,
    HiOutlineCog, HiOutlineLogout, HiOutlineMail, HiOutlinePhone,
    HiOutlineLocationMarker, HiOutlineGlobe, HiOutlineCheck,
    HiOutlineTruck, HiOutlineClock, HiOutlineBadgeCheck
} from 'react-icons/hi';
import styles from './account.module.css';

const tabs = [
    { id: 'overview', label: 'Overview', icon: HiOutlineUser },
    { id: 'orders', label: 'My Orders', icon: HiOutlineShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: HiOutlineHeart },
    { id: 'profile', label: 'Edit Profile', icon: HiOutlineCog },
];

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', address: '', city: '', country: '' });
    const [saved, setSaved] = useState(false);
    const router = useRouter();
    const { user, isLoggedIn, isLoading, logout, updateProfile, orders } = useAuth();
    const { wishlist, convertPrice, removeFromWishlist, addToCart } = useCart();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/auth');
        }
    }, [isLoggedIn, isLoading, router]);

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
            });
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateProfile(profileForm);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <span className={styles.loadingIcon}>✦</span>
                <p>Loading your account...</p>
            </div>
        );
    }

    if (!isLoggedIn) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return styles.statusConfirmed;
            case 'shipped': return styles.statusShipped;
            case 'delivered': return styles.statusDelivered;
            default: return '';
        }
    };

    return (
        <div className={styles.account}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <div className={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                        <div>
                            <h1>{user.name}</h1>
                            <p>{user.email}</p>
                            <span className={styles.memberSince}>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <HiOutlineLogout size={16} /> Sign Out
                    </button>
                </div>

                {/* Tabs + Content */}
                <div className={styles.layout}>
                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Content */}
                    <div className={styles.content}>
                        {/* Overview */}
                        {activeTab === 'overview' && (
                            <div className={styles.overview}>
                                <div className={styles.statCards}>
                                    <div className={styles.statCard}>
                                        <HiOutlineShoppingBag size={28} />
                                        <div>
                                            <span className={styles.statNum}>{orders.length}</span>
                                            <span className={styles.statLabel}>Total Orders</span>
                                        </div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <HiOutlineHeart size={28} />
                                        <div>
                                            <span className={styles.statNum}>{wishlist.length}</span>
                                            <span className={styles.statLabel}>Wishlist Items</span>
                                        </div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <HiOutlineBadgeCheck size={28} />
                                        <div>
                                            <span className={styles.statNum}>VIP</span>
                                            <span className={styles.statLabel}>Member Status</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className={styles.section}>
                                    <h2>Recent Orders</h2>
                                    {orders.length === 0 ? (
                                        <div className={styles.emptyState}>
                                            <span>📦</span>
                                            <p>No orders yet. Start shopping!</p>
                                            <Link href="/" className={styles.shopBtn}>Browse Jewelry</Link>
                                        </div>
                                    ) : (
                                        <div className={styles.ordersList}>
                                            {orders.slice(0, 3).map(order => (
                                                <div key={order.id} className={styles.orderCard}>
                                                    <div className={styles.orderHeader}>
                                                        <div>
                                                            <span className={styles.orderId}>{order.id}</span>
                                                            <span className={styles.orderDate}>
                                                                {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className={styles.orderItems}>
                                                        {order.items.map((item, i) => (
                                                            <div key={i} className={styles.orderItem}>
                                                                <span className={styles.oiName}>{item.name}</span>
                                                                <span className={styles.oiQty}>×{item.quantity}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className={styles.orderTotal}>
                                                        Total: <strong>{convertPrice(order.total)}</strong>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className={styles.section}>
                                <h2>All Orders</h2>
                                {orders.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <span>📦</span>
                                        <p>You haven&apos;t placed any orders yet.</p>
                                        <Link href="/" className={styles.shopBtn}>Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className={styles.ordersList}>
                                        {orders.map(order => (
                                            <div key={order.id} className={styles.orderCard}>
                                                <div className={styles.orderHeader}>
                                                    <div>
                                                        <span className={styles.orderId}>{order.id}</span>
                                                        <span className={styles.orderDate}>
                                                            {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className={styles.orderItems}>
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className={styles.orderItem}>
                                                            <span className={styles.oiName}>{item.name}</span>
                                                            <span className={styles.oiQty}>×{item.quantity}</span>
                                                            <span className={styles.oiPrice}>{convertPrice(item.price)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={styles.orderFooter}>
                                                    <div className={styles.orderTrack}>
                                                        <HiOutlineTruck size={16} />
                                                        <span>Track Package</span>
                                                    </div>
                                                    <div className={styles.orderTotal}>
                                                        Total: <strong>{convertPrice(order.total)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className={styles.section}>
                                <h2>My Wishlist</h2>
                                {wishlist.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <span>♡</span>
                                        <p>Your wishlist is empty.</p>
                                        <Link href="/" className={styles.shopBtn}>Explore Jewelry</Link>
                                    </div>
                                ) : (
                                    <div className={styles.wishGrid}>
                                        {wishlist.map(item => (
                                            <div key={item.slug} className={styles.wishItem}>
                                                <div className={styles.wishImage}>✦</div>
                                                <div className={styles.wishInfo}>
                                                    <h4>{item.name}</h4>
                                                    <p className={styles.wishPrice}>{convertPrice(item.price)}</p>
                                                    <div className={styles.wishActions}>
                                                        <button onClick={() => { addToCart(item); removeFromWishlist(item.slug); }} className={styles.moveBtn}>Move to Cart</button>
                                                        <button onClick={() => removeFromWishlist(item.slug)} className={styles.removeBtn}>Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className={styles.section}>
                                <h2>Edit Profile</h2>
                                {saved && (
                                    <div className={styles.savedBanner}>
                                        <HiOutlineCheck size={16} /> Profile updated successfully!
                                    </div>
                                )}
                                <form onSubmit={handleSaveProfile} className={styles.profileForm}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label><HiOutlineUser size={14} /> Full Name</label>
                                            <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label><HiOutlineMail size={14} /> Email</label>
                                            <input type="email" value={profileForm.email} disabled />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label><HiOutlinePhone size={14} /> Phone</label>
                                            <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label><HiOutlineGlobe size={14} /> Country</label>
                                            <input type="text" value={profileForm.country} onChange={e => setProfileForm(p => ({ ...p, country: e.target.value }))} placeholder="United States" />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><HiOutlineLocationMarker size={14} /> Address</label>
                                        <input type="text" value={profileForm.address} onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))} placeholder="Street address" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>City</label>
                                        <input type="text" value={profileForm.city} onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))} placeholder="City" />
                                    </div>
                                    <button type="submit" className={styles.saveBtn}>Save Changes</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
