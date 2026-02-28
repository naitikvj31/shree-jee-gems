'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { HiOutlineTrash, HiMinus, HiPlus, HiOutlineArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';
import styles from './cart.module.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, convertPrice, cartTotal, cartCount } = useCart();

    if (cart.length === 0) {
        return (
            <div className={styles.empty}>
                <HiOutlineShoppingBag size={64} className={styles.emptyIcon} />
                <h2>Your Cart is Empty</h2>
                <p>Discover our exquisite jewelry collections and add your favorites to cart.</p>
                <Link href="/products" className="btn btn-primary btn-lg">
                    Browse Collections <HiOutlineArrowRight />
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.cartPage}>
            <div className={styles.header}>
                <div className="container">
                    <h1>Shopping Cart</h1>
                    <p>{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                </div>
            </div>

            <div className={`container ${styles.content}`}>
                <div className={styles.main}>
                    {/* Cart Items */}
                    <div className={styles.items}>
                        {cart.map((item, idx) => (
                            <div key={`${item.slug}-${item.size}-${idx}`} className={styles.item}>
                                <div className={styles.itemImage}>
                                    <div className={styles.imagePlaceholder}>
                                        <span>✦</span>
                                    </div>
                                </div>
                                <div className={styles.itemInfo}>
                                    <Link href={`/products/${item.slug}`} className={styles.itemName}>{item.name}</Link>
                                    {item.size && <span className={styles.itemSize}>Size: {item.size}</span>}
                                    <span className={styles.itemCategory}>{item.category}</span>
                                </div>
                                <div className={styles.itemQuantity}>
                                    <button onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)} disabled={item.quantity <= 1}>
                                        <HiMinus size={14} />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}>
                                        <HiPlus size={14} />
                                    </button>
                                </div>
                                <div className={styles.itemPrice}>
                                    <span className={styles.priceValue}>{convertPrice(item.price * item.quantity)}</span>
                                    {item.quantity > 1 && (
                                        <span className={styles.unitPrice}>{convertPrice(item.price)} each</span>
                                    )}
                                </div>
                                <button className={styles.removeBtn} onClick={() => removeFromCart(item.slug, item.size)}>
                                    <HiOutlineTrash size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.clearRow}>
                        <button className={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
                    </div>
                </div>

                {/* Order Summary */}
                <aside className={styles.summary}>
                    <h3>Order Summary</h3>
                    <div className={styles.summaryRow}>
                        <span>Subtotal ({cartCount} items)</span>
                        <span>{convertPrice(cartTotal)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span className={styles.freeShipping}>{cartTotal >= 500 ? 'FREE' : convertPrice(25)}</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <strong>Total</strong>
                        <strong>{convertPrice(cartTotal >= 500 ? cartTotal : cartTotal + 25)}</strong>
                    </div>
                    {cartTotal < 500 && (
                        <p className={styles.freeShippingNote}>
                            Add {convertPrice(500 - cartTotal)} more for free shipping!
                        </p>
                    )}
                    <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }}>
                        Proceed to Checkout
                    </button>
                    <Link href="/products" className={styles.continueShopping}>
                        ← Continue Shopping
                    </Link>
                </aside>
            </div>
        </div>
    );
}
