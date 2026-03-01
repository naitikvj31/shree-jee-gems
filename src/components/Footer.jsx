'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { HiOutlineArrowRight, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import styles from './Footer.module.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [openSection, setOpenSection] = useState('about');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = (section) => {
        if (!isMobile) return;
        setOpenSection(openSection === section ? '' : section);
    };

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <div className={styles.footerGrid}>
                    {/* About */}
                    <div className={styles.footerCol}>
                        <div className={styles.accordionHead} onClick={() => toggleSection('about')}>
                            <h4>About Shree Jee Jewels</h4>
                            {isMobile && (openSection === 'about' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />)}
                        </div>
                        <div className={`${styles.accordionBody} ${isMobile && openSection !== 'about' ? styles.closed : ''}`}>
                            <div className={styles.contactInfo}>
                                <p>Rahul Vijay (Shree Jee Jewels)</p>
                                <p>Address: 550-A, Near Chogan Stadium, Gangori Bazar Inside Gangori Gate, Choti Chopar, Jaipur-302001, Rajasthan</p>
                                <p>Email ID: info@shreejeejewels.com</p>
                                <p>Contact No.: +91-7737493229</p>
                            </div>
                        </div>
                    </div>

                    {/* HELP */}
                    <div className={styles.footerCol}>
                        <div className={styles.accordionHead} onClick={() => toggleSection('help')}>
                            <h4>HELP</h4>
                            {isMobile && (openSection === 'help' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />)}
                        </div>
                        <div className={`${styles.accordionBody} ${isMobile && openSection !== 'help' ? styles.closed : ''}`}>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                            <Link href="/refund-policy">Refund Policy</Link>
                            <Link href="/shipping-policy">Shipping Policy</Link>
                            <Link href="/terms">Terms &amp; Conditions</Link>
                            <Link href="/faq">FAQ</Link>
                        </div>
                    </div>

                    {/* KNOW MORE */}
                    <div className={styles.footerCol}>
                        <div className={styles.accordionHead} onClick={() => toggleSection('know')}>
                            <h4>KNOW MORE</h4>
                            {isMobile && (openSection === 'know' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />)}
                        </div>
                        <div className={`${styles.accordionBody} ${isMobile && openSection !== 'know' ? styles.closed : ''}`}>
                            <Link href="/materials">Our Materials</Link>
                            <Link href="/glossary">Glossary</Link>
                            <Link href="/care-guide">Care Guide</Link>
                            <Link href="/wholesale">Wholesale</Link>
                            <Link href="/client-diaries">Client Diaries</Link>
                            <Link href="/blogs">Blogs</Link>
                        </div>
                    </div>

                    {/* ABOUT THE BRAND */}
                    <div className={styles.footerCol}>
                        <div className={styles.accordionHead} onClick={() => toggleSection('brand')}>
                            <h4>ABOUT THE BRAND</h4>
                            {isMobile && (openSection === 'brand' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />)}
                        </div>
                        <div className={`${styles.accordionBody} ${isMobile && openSection !== 'brand' ? styles.closed : ''}`}>
                            <Link href="/about">About Shree Jee Jewels</Link>
                            <Link href="/exhibitions">Exhibitions</Link>
                            <Link href="/press">Press / Media</Link>
                        </div>
                    </div>

                    {/* Newsletter & Socials */}
                    <div className={styles.footerCol}>
                        <div className={styles.accordionHead} onClick={() => toggleSection('social')}>
                            <h4>STAY CONNECTED</h4>
                            {isMobile && (openSection === 'social' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />)}
                        </div>
                        <div className={`${styles.accordionBody} ${isMobile && openSection !== 'social' ? styles.closed : ''}`}>
                            <div className={styles.newsletter}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.newsletterInput}
                                />
                                <button className={styles.newsletterBtn}>
                                    <HiOutlineArrowRight size={16} />
                                </button>
                            </div>
                            <div className={styles.socialLinks}>
                                <a href="https://instagram.com/shree_jee_jewels" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                                <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                                <a href="#" aria-label="Pinterest"><FaPinterestP /></a>
                                <a href="#" aria-label="YouTube"><FaYoutube /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className={styles.footerBottom}>
                    <div className={styles.paymentIcons}>
                        <span>VISA</span>
                        <span>MC</span>
                        <span>AMEX</span>
                        <span>UPI</span>
                        <span>PAYPAL</span>
                    </div>
                    <p>© 2026, Shree Jee Jewels. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
