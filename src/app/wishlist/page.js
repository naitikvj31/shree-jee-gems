'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineTrash, HiOutlineArrowRight } from 'react-icons/hi';
import styles from './wishlist.module.css';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, addToCart, convertPrice } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className={styles.empty}>
                <HiOutlineHeart size={64} className={styles.emptyIcon} />
                <h2>Your Wishlist is Empty</h2>
                <p>Save your favorite jewelry pieces to revisit later.</p>
                <Link href="/products" className="btn btn-primary btn-lg">
                    Explore Collections <HiOutlineArrowRight />
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.wishlistPage}>
            <div className={styles.header}>
                <div className="container">
                    <h1>My Wishlist</h1>
                    <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                </div>
            </div>
            <div className={`container ${styles.content}`}>
                <div className={styles.grid}>
                    {wishlist.map(item => (
                        <div key={item.slug} className={styles.card}>
                            <Link href={`/products/${item.slug}`} className={styles.imageWrap}>
                                <div className={styles.imagePlaceholder}>
                                    <span>✦</span>
                                    <p>{item.name}</p>
                                </div>
                            </Link>
                            <div className={styles.info}>
                                <span className={styles.category}>{item.category}</span>
                                <Link href={`/products/${item.slug}`}><h3>{item.name}</h3></Link>
                                <span className={styles.price}>{convertPrice(item.price)}</span>
                                <div className={styles.actions}>
                                    <button className={styles.addBtn} onClick={() => addToCart(item)}>
                                        <HiOutlineShoppingBag size={16} /> Add to Cart
                                    </button>
                                    <button className={styles.removeBtn} onClick={() => removeFromWishlist(item.slug)}>
                                        <HiOutlineTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
