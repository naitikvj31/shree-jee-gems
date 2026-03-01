'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiStar } from 'react-icons/hi';
import styles from './ProductCard.module.css';

// Sophisticated Silver/Blue gradients for placeholders
const categoryGradients = {
    crown: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
    earrings: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
    tops: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
    chains: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
    mangtika: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    necklace: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    chokar: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%)',
    'bridal-necklace': 'linear-gradient(135deg, #E0E7FF 0%, #E2E8F0 100%)',
    bracelet: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    bangles: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    rings: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%)',
    anklets: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    'toe-rings': 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    purses: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
    watches: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
    pendant: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    pandora: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
};

const categoryEmojis = {
    crown: '👑', earrings: '✨', tops: '💠', chains: '🔗',
    mangtika: '🌸', necklace: '📿', chokar: '💫', 'bridal-necklace': '👰',
    bracelet: '⌚', bangles: '🧿', rings: '💍', anklets: '🦶',
    'toe-rings': '🔘', purses: '👛', watches: '⏱', pendant: '🔶',
    pandora: '💎',
};

export default function ProductCard({ product, index = 0 }) {
    const { addToCart, addToWishlist, isInWishlist, convertPrice } = useCart();
    const inWishlist = isInWishlist(product.slug);
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;
    const [isVisible, setIsVisible] = useState(false);
    const [imgError, setImgError] = useState(false);
    const cardRef = useRef(null);

    const hasRealImage = product.images?.[0] && !product.images[0].includes('/images/products/');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToWishlist(product);
    };

    const gradient = categoryGradients[product.category] || categoryGradients.rings;
    const emoji = categoryEmojis[product.category] || '💎';

    return (
        <div
            ref={cardRef}
            className={`${styles.card} ${isVisible ? styles.cardVisible : ''}`}
            style={{ animationDelay: `${(index % 8) * 0.06}s` }}
        >
            <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
                {hasRealImage && !imgError ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className={styles.productImage}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.imagePlaceholder} style={{ background: gradient }}>
                        <span className={styles.phEmoji}>{emoji}</span>
                        <span className={styles.phName}>{product.name.split(' ').slice(0, 2).join(' ')}</span>
                        <span className={styles.phMaterial}>{product.material}</span>
                    </div>
                )}
                <div className={styles.badges}>
                    {product.isNew && <span className="badge badge-new">New</span>}
                    {product.isBestseller && <span className="badge badge-best">Best</span>}
                    {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
                </div>
                <div className={styles.hoverOverlay}>
                    <button className={styles.quickView}>Quick View</button>
                </div>
            </Link>

            <button className={`${styles.wishBtn} ${inWishlist ? styles.wishlisted : ''}`} onClick={handleWishlist}>
                {inWishlist ? <HiHeart size={17} /> : <HiOutlineHeart size={17} />}
            </button>

            <div className={styles.info}>
                <Link href={`/products/${product.slug}`}>
                    <h3 className={styles.name}>{product.name}</h3>
                </Link>
                <p className={styles.material}>{product.material}</p>
                <div className={styles.ratingRow}>
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={i < Math.floor(product.rating) ? styles.starFull : styles.starEmpty} />
                        ))}
                    </div>
                    <span className={styles.reviewCount}>({product.reviewCount})</span>
                </div>
                <div className={styles.priceRow}>
                    <span className={styles.price}>{convertPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className={styles.oldPrice}>{convertPrice(product.originalPrice)}</span>
                    )}
                </div>
                <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                    <HiOutlineShoppingCart size={15} /> Add to Cart
                </button>
            </div>
        </div>
    );
}
