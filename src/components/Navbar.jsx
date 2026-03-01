'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineShoppingCart, HiOutlineMenu, HiOutlineX, HiOutlineSearch, HiOutlineChevronDown, HiOutlineUser } from 'react-icons/hi';
import styles from './Navbar.module.css';

// Exact Twisha Categories Structure
const navLinks = [
    {
        name: 'Shop By Category',
        children: [
            { name: 'Crown', slug: 'crown' },
            { name: 'Earrings', slug: 'earrings' },
            { name: 'Tops', slug: 'tops' },
            { name: 'Chains', slug: 'chains' },
            { name: 'Mangtika', slug: 'mangtika' },
            { name: 'Necklace', slug: 'necklace' },
            { name: 'Chokar', slug: 'chokar' },
            { name: 'Long bridal necklace', slug: 'long-bridal-necklace' },
            { name: 'Bracelet', slug: 'bracelet' },
            { name: 'Bangles', slug: 'bangles' },
            { name: 'Rings', slug: 'rings' },
            { name: 'Anklets', slug: 'anklets' },
            { name: 'Toerings', slug: 'toerings' },
            { name: 'Watches', slug: 'watches' },
            { name: 'Pendants', slug: 'pendant' },
            { name: 'Pandora', slug: 'pandora' },
            { name: 'Purses', slug: 'purses' },
        ]
    },
    {
        name: 'For Kids',
        children: [
            { name: 'Kids Bracelets', slug: 'bracelet' },
            { name: 'Kids Earrings', slug: 'earrings' },
        ]
    },
    { name: 'For Mens', slug: '/?category=chains' },
    {
        name: 'Collections',
        children: [
            { name: 'Classic Silver', slug: 'all' },
            { name: 'Bridal Selection', slug: 'bridal-necklace' },
        ]
    },
    {
        name: 'Gifting Guide',
        children: [
            { name: 'Gifts Under ₹999', slug: 'all' },
            { name: 'Premium Gifts', slug: 'all' },
        ]
    },
    {
        name: 'Shop By Price',
        children: [
            { name: 'Under ₹500', slug: 'all' },
            { name: '₹500 - ₹1000', slug: 'all' },
            { name: 'Above ₹1000', slug: 'all' },
        ]
    }
];

const currencies = ['INR', 'USD', 'THB', 'JPY', 'ZAR'];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showCurrency, setShowCurrency] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount, wishlist, currency, setCurrency, currencyRates } = useCart();
    const { isLoggedIn } = useAuth();

    useEffect(() => { setIsOpen(false); setActiveDropdown(null); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowSearch(false);
        }
    };

    return (
        <>
            {/* ═══ ANNOUNCEMENT BAR (Light Silver) ═══ */}
            <div className={styles.announcement}>
                <span>Enjoy 11% Off Your First Purchase — Our Welcome Gift to You | USE CODE: SHREEJEE11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Enjoy 11% Off Your First Purchase — Our Welcome Gift to You | USE CODE: SHREEJEE11</span>
            </div>

            {/* ═══ MAIN NAV ═══ */}
            <nav className={styles.navbar}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="Shree Jee Jewels" width={56} height={56} className={styles.logoImg} priority />
                    <div className={styles.logoText}>
                        <span className={styles.logoMain}>SHREE JEE JEWELS</span>
                        <span className={styles.logoSub}>BY RAHUL VIJAY</span>
                    </div>
                </Link>

                {/* Center Nav Links (Two rows conceptually, but flex wrap handles it if needed) */}
                <div className={styles.navCenter}>
                    {/* Top Row Links */}
                    <div className={styles.navLinksRow}>
                        {navLinks.map((link, i) => (
                            <div
                                key={i}
                                className={styles.navItem}
                                onMouseEnter={() => link.children && setActiveDropdown(i)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                {link.children ? (
                                    <button className={styles.navLink}>
                                        {link.name} <HiOutlineChevronDown size={12} style={{ marginLeft: 2, marginTop: 2 }} />
                                    </button>
                                ) : (
                                    <Link href={link.slug} className={styles.navLink}>{link.name}</Link>
                                )}
                                {link.children && activeDropdown === i && (
                                    <div className={`${styles.dropdown} ${link.children.length > 6 ? styles.dropdownGrid : ''}`}>
                                        {link.children.map(child => (
                                            <Link
                                                key={child.name}
                                                href={`/?category=${child.slug}`}
                                                className={styles.dropdownLink}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Bottom Row Link */}
                    <Link href="/about" className={styles.aboutBrandLink}>About The Brand</Link>
                </div>

                {/* Right Icons */}
                <div className={styles.navRight}>
                    {/* Currency */}
                    <div className={styles.currWrap}
                        onMouseEnter={() => setShowCurrency(true)}
                        onMouseLeave={() => setShowCurrency(false)}
                    >
                        <button className={styles.iconBtn}>
                            <span style={{ fontSize: 12, marginRight: 2 }}>{currencyRates[currency]?.symbol}</span>
                            <HiOutlineChevronDown size={10} />
                        </button>
                        {showCurrency && (
                            <div className={styles.dropdown} style={{ right: 0, left: 'auto', minWidth: 100, borderTop: 'none' }}>
                                {currencies.map(c => (
                                    <button key={c} className={`${styles.dropdownLink} ${c === currency ? styles.dropActive : ''}`}
                                        onClick={() => { setCurrency(c); setShowCurrency(false); }}
                                        style={{ padding: '8px 16px', fontSize: 12 }}
                                    >
                                        {currencyRates[c]?.symbol} {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className={styles.iconBtn} onClick={() => setShowSearch(!showSearch)}>
                        <HiOutlineSearch size={22} />
                    </button>
                    <Link href={isLoggedIn ? '/account' : '/auth'} className={styles.iconBtn}>
                        <HiOutlineUser size={22} />
                    </Link>
                    <Link href="/cart" className={styles.iconBtn}>
                        <HiOutlineShoppingCart size={22} />
                        {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                    </Link>

                    <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <HiOutlineX size={26} /> : <HiOutlineMenu size={26} />}
                    </button>
                </div>
            </nav>

            {/* ═══ SEARCH BAR (expandable) ═══ */}
            {showSearch && (
                <div className={styles.searchExpand}>
                    <form onSubmit={handleSearch} className={`container ${styles.searchForm}`}>
                        <HiOutlineSearch size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Looking for something specific?"
                            className={styles.searchInput}
                            autoFocus
                        />
                        <button type="button" onClick={() => setShowSearch(false)} className={styles.searchClose}>
                            <HiOutlineX size={20} />
                        </button>
                    </form>
                </div>
            )}

            {/* ═══ MOBILE DRAWER ═══ */}
            <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={() => setIsOpen(false)} />
            <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHead}>
                    <span className={styles.drawerLogo}>SHREE JEE</span>
                    <button onClick={() => setIsOpen(false)}><HiOutlineX size={24} /></button>
                </div>
                <div className={styles.drawerBody}>
                    {navLinks.map((link, i) => (
                        link.children ? (
                            <div key={i} className={styles.drawerSection}>
                                <span className={styles.drawerSectionTitle}>{link.name}</span>
                                {link.children.map(child => (
                                    <Link key={child.name} href={`/?category=${child.slug}`} onClick={() => setIsOpen(false)} className={styles.drawerLink}>
                                        {child.name}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Link key={i} href={link.slug || '#'} onClick={() => setIsOpen(false)} className={styles.drawerLinkMain}>{link.name}</Link>
                        )
                    ))}
                    <div className={styles.drawerDivider} />
                    <Link href="/about" onClick={() => setIsOpen(false)} className={styles.drawerLinkMain}>About The Brand</Link>
                    <Link href="/wishlist" onClick={() => setIsOpen(false)} className={styles.drawerLinkMain}>Wishlist ({wishlist.length})</Link>
                    <Link href="/track-order" onClick={() => setIsOpen(false)} className={styles.drawerLinkMain}>Track Order</Link>
                </div>
            </div>
        </>
    );
}
