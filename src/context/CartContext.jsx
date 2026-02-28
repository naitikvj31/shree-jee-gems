'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const CURRENCY_RATES = {
    INR: { symbol: '₹', rate: 83.5 },
    USD: { symbol: '$', rate: 1 },
    THB: { symbol: '฿', rate: 34.5 },
    JPY: { symbol: '¥', rate: 149.5 },
    ZAR: { symbol: 'R', rate: 18.2 },
};

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [currency, setCurrency] = useState('INR');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toast, setToast] = useState('');

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('sjj_cart');
            const savedWishlist = localStorage.getItem('sjj_wishlist');
            const savedCurrency = localStorage.getItem('sjj_currency');
            if (savedCart) setCart(JSON.parse(savedCart));
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
            if (savedCurrency) setCurrency(savedCurrency);
        } catch (e) {
            console.error('Error loading cart data:', e);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('sjj_cart', JSON.stringify(cart));
        } catch (e) { console.error('Error saving cart:', e); }
    }, [cart]);

    useEffect(() => {
        try {
            localStorage.setItem('sjj_wishlist', JSON.stringify(wishlist));
        } catch (e) { console.error('Error saving wishlist:', e); }
    }, [wishlist]);

    useEffect(() => {
        try {
            localStorage.setItem('sjj_currency', currency);
        } catch (e) { console.error('Error saving currency:', e); }
    }, [currency]);

    const showToast = useCallback((msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    }, []);

    const convertPrice = useCallback((priceUSD) => {
        const { symbol, rate } = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
        const converted = (priceUSD * rate).toFixed((currency === 'JPY' || currency === 'INR') ? 0 : 2);
        return `${symbol}${Number(converted).toLocaleString()}`;
    }, [currency]);

    const addToCart = useCallback((product, quantity = 1, size = '') => {
        setCart(prev => {
            const existingIndex = prev.findIndex(
                item => item.slug === product.slug && item.size === size
            );
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, {
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '',
                size,
                quantity,
                category: product.category,
            }];
        });
        showToast(`${product.name} added to cart`);
    }, [showToast]);

    const removeFromCart = useCallback((slug, size = '') => {
        setCart(prev => prev.filter(item => !(item.slug === slug && item.size === size)));
        showToast('Item removed from cart');
    }, [showToast]);

    const updateQuantity = useCallback((slug, size, quantity) => {
        if (quantity < 1) return;
        setCart(prev =>
            prev.map(item =>
                item.slug === slug && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        showToast('Cart cleared');
    }, [showToast]);

    const addToWishlist = useCallback((product) => {
        setWishlist(prev => {
            if (prev.find(item => item.slug === product.slug)) {
                return prev.filter(item => item.slug !== product.slug);
            }
            showToast(`${product.name} added to wishlist`);
            return [...prev, {
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '',
                category: product.category,
            }];
        });
    }, [showToast]);

    const removeFromWishlist = useCallback((slug) => {
        setWishlist(prev => prev.filter(item => item.slug !== slug));
        showToast('Removed from wishlist');
    }, [showToast]);

    const isInWishlist = useCallback((slug) => {
        return wishlist.some(item => item.slug === slug);
    }, [wishlist]);

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, wishlist, currency, isCartOpen, toast,
            setCurrency, setIsCartOpen, convertPrice,
            addToCart, removeFromCart, updateQuantity, clearCart,
            addToWishlist, removeFromWishlist, isInWishlist,
            cartTotal, cartCount, showToast,
            currencyRates: CURRENCY_RATES,
        }}>
            {children}
            {toast && <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
