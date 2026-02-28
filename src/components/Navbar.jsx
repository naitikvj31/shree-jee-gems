'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineMenu, HiOutlineX, HiOutlineSearch, HiOutlineChevronDown, HiOutlineTruck } from 'react-icons/hi';
import styles from './Navbar.module.css';

const categories = [
    { name: 'All', slug: 'all' },
    { name: 'Rings', slug: 'rings' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Pendants', slug: 'pendants' },
    { name: 'Bangles', slug: 'bangles' },
];

const currencies = ['INR', 'USD', 'THB', 'JPY', 'ZAR'];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [showCurrency, setShowCurrency] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount, wishlist, currency, setCurrency, currencyRates } = useCart();
    const { isLoggedIn, user } = useAuth();

    useEffect(() => { setIsOpen(false); }, [pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleCategoryClick = (slug) => {
        setActiveCategory(slug);
        router.push(slug === 'all' ? '/' : `/?category=${slug}`);
    };

    return (
        <>
            {/* ═══ ROW 1: Main Navigation ═══ */}
            <nav className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`}>
                <div className={styles.navInner}>
                    {/* Left: Logo */}
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoGem}>💎</span>
                        <div className={styles.logoWrap}>
                            <span className={styles.logoText}>Shree Jee Jewels</span>
                            <span className={styles.logoTag}>Premium Jewelry Since 1998</span>
                        </div>
                    </Link>

                    {/* Center: Search */}
                    <form onSubmit={handleSearch} className={styles.searchBar}>
                        <HiOutlineSearch size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for gold rings, diamond necklaces, bangles..."
                            className={styles.searchInput}
                        />
                    </form>

                    {/* Right: Actions */}
                    <div className={styles.rightActions}>
                        {/* Track Order */}
                        <Link href="/track-order" className={styles.navLink}>
                            <HiOutlineTruck size={20} />
                            <span>Track Order</span>
                        </Link>

                        {/* Wishlist */}
                        <Link href="/wishlist" className={styles.navLink}>
                            <HiOutlineHeart size={20} />
                            <span>Wishlist</span>
                            {wishlist.length > 0 && <span className={styles.badge}>{wishlist.length}</span>}
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className={styles.navLink}>
                            <HiOutlineShoppingCart size={20} />
                            <span>Cart</span>
                            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                        </Link>

                        {/* Currency */}
                        <div className={styles.currencyWrap}>
                            <button onClick={() => setShowCurrency(!showCurrency)} className={styles.currencyBtn}>
                                {currencyRates[currency]?.symbol} {currency}
                                <HiOutlineChevronDown size={12} />
                            </button>
                            {showCurrency && (
                                <div className={styles.currencyDrop}>
                                    {currencies.map(c => (
                                        <button key={c} className={c === currency ? styles.currActive : ''} onClick={() => { setCurrency(c); setShowCurrency(false); }}>
                                            {currencyRates[c]?.symbol} {c}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Auth */}
                        {isLoggedIn ? (
                            <Link href="/account" className={styles.accountChip}>
                                <span className={styles.accountAvatar}>{user?.name?.charAt(0)}</span>
                                <span className={styles.accountName}>{user?.name?.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <div className={styles.authBtns}>
                                <Link href="/auth" className={styles.signInBtn}>Sign In</Link>
                                <Link href="/auth" className={styles.signUpBtn}>Sign Up</Link>
                            </div>
                        )}

                        {/* Mobile */}
                        <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ═══ ROW 2: Category Tabs ═══ */}
            <div className={styles.categoryBar}>
                <div className={styles.categoryInner}>
                    <div className={styles.catScroll}>
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                className={`${styles.catBtn} ${activeCategory === cat.slug ? styles.catActive : ''}`}
                                onClick={() => handleCategoryClick(cat.slug)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className={styles.catLinks}>
                        <Link href="/about" className={styles.catLink}>About</Link>
                        <Link href="/contact" className={styles.catLink}>Contact</Link>
                    </div>
                </div>
            </div>

            {/* ═══ Mobile Drawer ═══ */}
            <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={() => setIsOpen(false)} />
            <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHead}>
                    <span className={styles.drawerLogo}>💎 Shree Jee Jewels</span>
                    <button onClick={() => setIsOpen(false)}><HiOutlineX size={22} /></button>
                </div>
                <div className={styles.drawerBody}>
                    {!isLoggedIn ? (
                        <div className={styles.drawerAuthBox}>
                            <Link href="/auth" onClick={() => setIsOpen(false)} className={styles.drawerSignIn}>Sign In</Link>
                            <Link href="/auth" onClick={() => setIsOpen(false)} className={styles.drawerSignUp}>Create Account</Link>
                        </div>
                    ) : (
                        <Link href="/account" onClick={() => setIsOpen(false)} className={styles.drawerAccountChip}>
                            <span className={styles.accountAvatar}>{user?.name?.charAt(0)}</span>
                            My Account
                        </Link>
                    )}
                    <Link href="/" onClick={() => setIsOpen(false)}>🏠 Home</Link>
                    {categories.filter((_, i) => i > 0).map(cat => (
                        <button key={cat.slug} onClick={() => { handleCategoryClick(cat.slug); setIsOpen(false); }} className={styles.drawerLink}>
                            {cat.name}
                        </button>
                    ))}
                    <div className={styles.drawerDivider} />
                    <Link href="/track-order" onClick={() => setIsOpen(false)}>📦 Track Order</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)}>ℹ️ About Us</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)}>✉️ Contact</Link>
                    <Link href="/wishlist" onClick={() => setIsOpen(false)}>♡ Wishlist ({wishlist.length})</Link>
                    <Link href="/cart" onClick={() => setIsOpen(false)}>🛒 Cart ({cartCount})</Link>
                    <div className={styles.drawerDivider} />
                    <div className={styles.drawerCurrency}>
                        <span className={styles.drawerCurrLabel}>Currency</span>
                        <div className={styles.drawerCurrBtns}>
                            {currencies.map(c => (
                                <button key={c} className={c === currency ? styles.currActive : ''} onClick={() => setCurrency(c)}>
                                    {currencyRates[c]?.symbol} {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
