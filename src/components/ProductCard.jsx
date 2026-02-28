'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiStar } from 'react-icons/hi';
import styles from './ProductCard.module.css';

// Jewelry category gradients for beautiful visual placeholders
const categoryGradients = {
    rings: 'linear-gradient(145deg, #FDF2E9 0%, #F5CBA7 40%, #E8DAEF 100%)',
    necklaces: 'linear-gradient(145deg, #EBF5FB 0%, #D4E6F1 40%, #FADBD8 100%)',
    earrings: 'linear-gradient(145deg, #FDEDEC 0%, #F5B7B1 40%, #F9E79F 100%)',
    bracelets: 'linear-gradient(145deg, #E8F8F5 0%, #A3E4D7 40%, #D5F5E3 100%)',
    bangles: 'linear-gradient(145deg, #F9EBEA 0%, #E8DAEF 40%, #D5D8DC 100%)',
    pendants: 'linear-gradient(145deg, #FEF9E7 0%, #F9E79F 40%, #FDEBD0 100%)',
};

const categoryEmojis = {
    rings: '💍',
    necklaces: '📿',
    earrings: '✨',
    bracelets: '⌚',
    bangles: '🔵',
    pendants: '🔶',
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
