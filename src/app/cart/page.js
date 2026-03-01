'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { HiMinus, HiPlus, HiOutlineArrowRight, HiOutlineShoppingBag, HiOutlineTag } from 'react-icons/hi';
import styles from './cart.module.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, convertPrice, cartTotal, cartCount, addToWishlist, wishlist } = useCart();

    const handleMoveToWishlist = (item) => {
        if (addToWishlist) {
            addToWishlist(item);
        }
        removeFromCart(item.slug, item.size);
    };

    if (cart.length === 0) {
        return (
            <div className={styles.empty}>
                <HiOutlineShoppingBag className={styles.emptyIcon} />
                <h2>Your Cart is Empty</h2>
                <p>Discover our exquisite jewelry collections and add your favorites to cart.</p>
                <Link href="/products" className={styles.emptyBtn}>
                    Browse Collections <HiOutlineArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.cartPage}>
            <div className={`container ${styles.header}`}>
                <h1>Shopping Cart</h1>
                <p><strong>{cartCount}</strong> {cartCount === 1 ? 'item' : 'items'} in your bag</p>
            </div>

            <div className={`container ${styles.content}`}>
                <div className={styles.main}>
                    <div className={styles.itemsHeader}>
                        My Shopping Bag ({cartCount} Items)
                    </div>
                    {/* Cart Items */}
                    <div className={styles.items}>
                        {cart.map((item, idx) => {
                            const inWishlist = wishlist?.some(w => w.slug === item.slug);

                            return (
                                <div key={`${item.slug}-${item.size}-${idx}`} className={styles.item}>
                                    <div className={styles.itemImage}>
                                        <div className={styles.imagePlaceholder}>
                                            <span>✦</span>
                                        </div>
                                    </div>
                                    <div className={styles.itemContent}>
                                        <div className={styles.itemInfoRow}>
                                            <div className={styles.itemTitleCol}>
                                                <span className={styles.itemCategory}>{item.category || 'Jewelry'}</span>
                                                <Link href={`/products/${item.slug}`} className={styles.itemName}>{item.name}</Link>
                                                {item.size && <span className={styles.itemSize}>Size: {item.size}</span>}
                                            </div>
                                            <div className={styles.itemPriceCol}>
                                                <span className={styles.priceValue}>{convertPrice(item.price * item.quantity)}</span>
                                                {item.quantity > 1 && (
                                                    <span className={styles.unitPrice}>{convertPrice(item.price)} each</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.itemBottomRow}>
                                            <div className={styles.itemQuantity}>
                                                <button onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                    <HiMinus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}>
                                                    <HiPlus size={14} />
                                                </button>
                                            </div>

                                            <div className={styles.itemActions}>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.removeBtn}`}
                                                    onClick={() => removeFromCart(item.slug, item.size)}
                                                >
                                                    REMOVE
                                                </button>
                                                <div className={styles.actionDivider}></div>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => handleMoveToWishlist(item)}
                                                >
                                                    {inWishlist ? 'IN WISHLIST' : 'MOVE TO WISHLIST'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Order Summary Column */}
                <div className={styles.summaryCol}>
                    {/* Promo Code Card */}
                    <div className={styles.promoCard}>
                        <div className={styles.promoTitle}>
                            <HiOutlineTag size={18} /> Apply Promo Code
                        </div>
                        <div className={styles.promoInputGroup}>
                            <input type="text" placeholder="Enter code here" className={styles.promoInput} />
                            <button className={styles.promoBtn}>APPLY</button>
                        </div>
                    </div>

                    <aside className={styles.summary}>
                        <h3>Price Details</h3>
                        <div className={styles.summaryRow}>
                            <span>Total MRP ({cartCount} items)</span>
                            <span>{convertPrice(cartTotal)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Discount on MRP</span>
                            <span className={styles.freeShipping}>- {convertPrice(0)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Shipping fee</span>
                            <span className={styles.freeShipping}>{cartTotal >= 500 ? 'FREE' : convertPrice(25)}</span>
                        </div>
                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                            <strong>Total Amount</strong>
                            <strong>{convertPrice(cartTotal >= 500 ? cartTotal : cartTotal + 25)}</strong>
                        </div>
                        {cartTotal < 500 && (
                            <p className={styles.freeShippingNote}>
                                Add {convertPrice(500 - cartTotal)} more for free shipping!
                            </p>
                        )}
                        <button className={styles.checkoutBtn}>
                            PLACE ORDER
                        </button>
                        <Link href="/products" className={styles.continueShopping}>
                            ← Continue Shopping
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
