'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { HiStar, HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiMinus, HiPlus, HiChevronLeft } from 'react-icons/hi';
import styles from './detail.module.css';

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { addToCart, addToWishlist, isInWishlist, convertPrice } = useCart();

    useEffect(() => {
        if (params.slug) {
            fetchProduct();
        }
    }, [params.slug]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${params.slug}`);
            const data = await res.json();
            if (data.success) {
                setProduct(data.data);
                setRelated(data.related || []);
                if (data.data.sizes?.length) {
                    setSelectedSize(data.data.sizes[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity, selectedSize);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner} />
                <p>Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.notFound}>
                <span className={styles.notFoundIcon}>✦</span>
                <h2>Product Not Found</h2>
                <p>The product you are looking for does not exist.</p>
                <Link href="/products" className="btn btn-primary">Browse Collections</Link>
            </div>
        );
    }

    const inWishlist = isInWishlist(product.slug);
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <div className={styles.detailPage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <div className="container">
                    <Link href="/products"><HiChevronLeft size={16} /> Back to Collections</Link>
                    <span> / </span>
                    <Link href={`/products?category=${product.category}`}>{product.category}</Link>
                    <span> / </span>
                    <span className={styles.current}>{product.name}</span>
                </div>
            </div>

            <div className={`container ${styles.productMain}`}>
                {/* Image Gallery */}
                <div className={styles.gallery}>
                    <div className={styles.mainImage}>
                        <div className={styles.imagePlaceholder}>
                            <span className={styles.phIcon}>✦</span>
                            <span className={styles.phCat}>{product.category}</span>
                            <span className={styles.phName}>{product.name}</span>
                        </div>
                        <div className={styles.imageBadges}>
                            {product.isNew && <span className="badge badge-new">New</span>}
                            {product.isBestseller && <span className="badge badge-best">Bestseller</span>}
                            {discount > 0 && <span className="badge badge-sale">{discount}% Off</span>}
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className={styles.info}>
                    <span className={styles.category}>{product.category}</span>
                    <h1 className={styles.name}>{product.name}</h1>

                    {/* Rating */}
                    <div className={styles.ratingRow}>
                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <HiStar key={i} className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty} />
                            ))}
                        </div>
                        <span className={styles.ratingText}>{product.rating} ({product.reviewCount} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className={styles.priceBlock}>
                        <span className={styles.price}>{convertPrice(product.price)}</span>
                        {product.originalPrice && (
                            <>
                                <span className={styles.originalPrice}>{convertPrice(product.originalPrice)}</span>
                                <span className={styles.discount}>Save {discount}%</span>
                            </>
                        )}
                    </div>

                    <p className={styles.description}>{product.description}</p>

                    {/* Product Details */}
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Material</span>
                            <span className={styles.detailValue}>{product.material}</span>
                        </div>
                        {product.weight && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Weight</span>
                                <span className={styles.detailValue}>{product.weight}</span>
                            </div>
                        )}
                        {product.purity && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Purity</span>
                                <span className={styles.detailValue}>{product.purity}</span>
                            </div>
                        )}
                        {product.gemstones?.length > 0 && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Gemstones</span>
                                <span className={styles.detailValue}>{product.gemstones.join(', ')}</span>
                            </div>
                        )}
                    </div>

                    {/* Size Selector */}
                    {product.sizes?.length > 0 && (
                        <div className={styles.sizeSection}>
                            <label className={styles.sizeLabel}>Size</label>
                            <div className={styles.sizeOptions}>
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className={styles.quantitySection}>
                        <label className={styles.sizeLabel}>Quantity</label>
                        <div className={styles.quantityControl}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><HiMinus /></button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}><HiPlus /></button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button className={`btn btn-primary btn-lg ${styles.addToCartBtn}`} onClick={handleAddToCart}>
                            <HiOutlineShoppingBag size={20} />
                            Add to Cart
                        </button>
                        <button
                            className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlisted : ''}`}
                            onClick={() => addToWishlist(product)}
                        >
                            {inWishlist ? <HiHeart size={22} /> : <HiOutlineHeart size={22} />}
                        </button>
                    </div>

                    {/* Trust Details */}
                    <div className={styles.trustInfo}>
                        <div className={styles.trustItem}>
                            <HiOutlineTruck size={20} />
                            <span>Free worldwide shipping on orders over $500</span>
                        </div>
                        <div className={styles.trustItem}>
                            <HiOutlineShieldCheck size={20} />
                            <span>100% certified & hallmarked jewelry</span>
                        </div>
                        <div className={styles.trustItem}>
                            <HiOutlineRefresh size={20} />
                            <span>30-day easy return policy</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {related.length > 0 && (
                <section className={`section ${styles.relatedSection}`}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-subtitle">You May Also Like</span>
                            <h2 className="section-title">Related Products</h2>
                        </div>
                        <div className={styles.relatedGrid}>
                            {related.map(p => (
                                <ProductCard key={p._id || p.slug} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
