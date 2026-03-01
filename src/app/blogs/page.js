'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineArrowRight } from 'react-icons/hi';
import styles from './blogs.module.css';

export default function BlogsIndex() {
    const blogs = [
        {
            title: "How To Care For Your Silver Jewellery?",
            excerpt: "Caring for your silver jewellery is essential to have a longer life without tarnishing or losing its sheen. Read our expert tips.",
            link: "/blogs/jewelry-care",
            tag: "Education & Care",
            readTime: "5 min read",
            image: "/categories/bracelet.png" // Placeholder
        },
        {
            title: "The Royal Legacy of Jaipur's Silver Jewellery",
            excerpt: "Nestled within the vibrant pink walls of Rajasthan's capital lies a centuries-old tradition that continues to captivate the world.",
            link: "/blogs/jaipur-heritage",
            tag: "Heritage & Craft",
            readTime: "4 min read",
            image: "/categories/chokar.png" // Placeholder
        }
    ];

    return (
        <div className={styles.blogsPage}>
            <div className={styles.blogsHero}>
                <div className={styles.heroContent}>
                    <h1>The Silver Journal</h1>
                    <p>Discover heritage, expert jewelry care tips, and the stories behind Shree Jee Jewels.</p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className={styles.blogsGrid}>
                    {blogs.map((blog, idx) => (
                        <Link href={blog.link} key={idx} className={styles.blogCard}>
                            <div className={styles.cardImageWrap}>
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    className={styles.cardImage}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.tag}>{blog.tag}</span>
                                    <span className={styles.readTime}>{blog.readTime}</span>
                                </div>
                                <h2 className={styles.cardTitle}>{blog.title}</h2>
                                <p className={styles.cardExcerpt}>{blog.excerpt}</p>
                                <div className={styles.readMoreBtn}>
                                    Read Full Article <HiOutlineArrowRight />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
