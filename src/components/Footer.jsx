'use client';

import Link from 'next/link';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaPinterestP, FaYoutube } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.brandCol}>
                        <span className={styles.footerLogo}>Shree Jee</span>
                        <span className={styles.footerLogoSub}>J E W E L S</span>
                        <p className={styles.footerDesc}>
                            Crafting exquisite jewelry since generations. Premium gold, diamond &amp; gemstone jewelry shipped worldwide.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialLink} aria-label="Facebook"><FaFacebookF /></a>
                            <a href="#" className={styles.socialLink} aria-label="Instagram"><FaInstagram /></a>
                            <a href="#" className={styles.socialLink} aria-label="Pinterest"><FaPinterestP /></a>
                            <a href="#" className={styles.socialLink} aria-label="YouTube"><FaYoutube /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.footerCol}>
                        <h4>Quick Links</h4>
                        <Link href="/">Home</Link>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact Us</Link>
                        <Link href="/cart">Shopping Cart</Link>
                        <Link href="/wishlist">Wishlist</Link>
                        <Link href="/track-order">Track Order</Link>
                    </div>

                    {/* Categories */}
                    <div className={styles.footerCol}>
                        <h4>Categories</h4>
                        <Link href="/?category=rings">Rings</Link>
                        <Link href="/?category=necklaces">Necklaces</Link>
                        <Link href="/?category=earrings">Earrings</Link>
                        <Link href="/?category=bracelets">Bracelets</Link>
                        <Link href="/?category=bangles">Bangles</Link>
                        <Link href="/?category=pendants">Pendants</Link>
                    </div>

                    {/* Contact */}
                    <div className={styles.footerCol}>
                        <h4>Contact Us</h4>
                        <div className={styles.contactItem}>
                            <HiOutlineLocationMarker size={16} />
                            <span>Bangkok · New York · Tokyo · Johannesburg</span>
                        </div>
                        <div className={styles.contactItem}>
                            <HiOutlinePhone size={16} />
                            <span>+66 2 XXX XXXX</span>
                        </div>
                        <div className={styles.contactItem}>
                            <HiOutlineMail size={16} />
                            <span>info@shreejeejewels.com</span>
                        </div>
                        <div className={styles.flagRow}>
                            <span title="Thailand">🇹🇭</span>
                            <span title="USA">🇺🇸</span>
                            <span title="Japan">🇯🇵</span>
                            <span title="South Africa">🇿🇦</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.footerBottom}>
                    <p className={styles.footerCopy}>
                        © 2024 Shree Jee Jewels. All rights reserved.
                    </p>
                    <div className={styles.paymentIcons}>
                        <span className={styles.payIcon}>VISA</span>
                        <span className={styles.payIcon}>MC</span>
                        <span className={styles.payIcon}>AMEX</span>
                        <span className={styles.payIcon}>PAYPAL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
