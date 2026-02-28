'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('sjj_user');
            const savedOrders = localStorage.getItem('sjj_orders');
            if (savedUser) setUser(JSON.parse(savedUser));
            if (savedOrders) setOrders(JSON.parse(savedOrders));
        } catch (e) {
            console.error('Error loading auth:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('sjj_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('sjj_user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('sjj_orders', JSON.stringify(orders));
    }, [orders]);

    const register = useCallback((name, email, password) => {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('sjj_users') || '[]');
        if (existingUsers.find(u => u.email === email)) {
            return { success: false, error: 'An account with this email already exists' };
        }

        const newUser = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            name,
            email,
            phone: '',
            address: '',
            city: '',
            country: '',
            createdAt: new Date().toISOString(),
        };

        existingUsers.push({ ...newUser, password });
        localStorage.setItem('sjj_users', JSON.stringify(existingUsers));
        setUser(newUser);
        return { success: true };
    }, []);

    const login = useCallback((email, password) => {
        const existingUsers = JSON.parse(localStorage.getItem('sjj_users') || '[]');
        const found = existingUsers.find(u => u.email === email && u.password === password);

        if (!found) {
            return { success: false, error: 'Invalid email or password' };
        }

        const { password: _, ...userData } = found;
        setUser(userData);
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('sjj_user');
    }, []);

    const updateProfile = useCallback((updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates };
            // Also update in users list
            const existingUsers = JSON.parse(localStorage.getItem('sjj_users') || '[]');
            const idx = existingUsers.findIndex(u => u.id === prev.id);
            if (idx > -1) {
                existingUsers[idx] = { ...existingUsers[idx], ...updates };
                localStorage.setItem('sjj_users', JSON.stringify(existingUsers));
            }
            return updated;
        });
    }, []);

    const placeOrder = useCallback((cartItems, total, currency) => {
        const order = {
            id: 'SJJ-' + Date.now().toString(36).toUpperCase(),
            items: cartItems,
            total,
            currency,
            status: 'confirmed',
            date: new Date().toISOString(),
            tracking: null,
        };
        setOrders(prev => [order, ...prev]);
        return order;
    }, []);

    return (
        <AuthContext.Provider value={{
            user, isLoading, orders,
            register, login, logout, updateProfile, placeOrder,
            isLoggedIn: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
