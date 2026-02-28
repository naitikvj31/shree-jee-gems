'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import styles from './auth.module.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login, register, isLoggedIn } = useAuth();

    if (isLoggedIn) {
        router.push('/account');
        return null;
    }

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isLogin) {
            const result = login(form.email, form.password);
            if (result.success) {
                router.push('/account');
            } else {
                setError(result.error);
            }
        } else {
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }
            if (form.password.length < 6) {
                setError('Password must be at least 6 characters');
                setLoading(false);
                return;
            }
            const result = register(form.name, form.email, form.password);
            if (result.success) {
                router.push('/account');
            } else {
                setError(result.error);
            }
        }
        setLoading(false);
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                {/* Left Side - Branding */}
                <div className={styles.brandSide}>
                    <div className={styles.brandContent}>
                        <span className={styles.brandIcon}>✦</span>
                        <h2 className={styles.brandTitle}>Shree Jee Jewels</h2>
                        <p className={styles.brandDesc}>
                            Join our family of 10,000+ jewelry enthusiasts worldwide. Access exclusive collections, track orders, and get personalized recommendations.
                        </p>
                        <div className={styles.brandFeatures}>
                            <div className={styles.brandFeature}>
                                <span>🔒</span>
                                <span>Secure & encrypted</span>
                            </div>
                            <div className={styles.brandFeature}>
                                <span>📦</span>
                                <span>Track your orders</span>
                            </div>
                            <div className={styles.brandFeature}>
                                <span>💎</span>
                                <span>Exclusive deals</span>
                            </div>
                            <div className={styles.brandFeature}>
                                <span>♡</span>
                                <span>Save your wishlist</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className={styles.formSide}>
                    {/* Toggle */}
                    <div className={styles.toggle}>
                        <button className={`${styles.toggleBtn} ${isLogin ? styles.toggleActive : ''}`} onClick={() => setIsLogin(true)}>
                            Sign In
                        </button>
                        <button className={`${styles.toggleBtn} ${!isLogin ? styles.toggleActive : ''}`} onClick={() => setIsLogin(false)}>
                            Sign Up
                        </button>
                    </div>

                    <div className={styles.formWrap}>
                        <h1 className={styles.formTitle}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className={styles.formSubtitle}>
                            {isLogin ? 'Sign in to access your account, orders, and wishlist' : 'Join us for exclusive jewelry collections and offers'}
                        </p>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {!isLogin && (
                                <div className={styles.inputGroup}>
                                    <HiOutlineUser className={styles.inputIcon} size={18} />
                                    <input
                                        type="text" name="name" value={form.name} onChange={handleChange}
                                        placeholder="Full Name" required
                                    />
                                </div>
                            )}
                            <div className={styles.inputGroup}>
                                <HiOutlineMail className={styles.inputIcon} size={18} />
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange}
                                    placeholder="Email Address" required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <HiOutlineLockClosed className={styles.inputIcon} size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'} name="password"
                                    value={form.password} onChange={handleChange}
                                    placeholder="Password" required
                                />
                                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                                </button>
                            </div>
                            {!isLogin && (
                                <div className={styles.inputGroup}>
                                    <HiOutlineLockClosed className={styles.inputIcon} size={18} />
                                    <input
                                        type="password" name="confirmPassword"
                                        value={form.confirmPassword} onChange={handleChange}
                                        placeholder="Confirm Password" required
                                    />
                                </div>
                            )}

                            {error && <div className={styles.error}>{error}</div>}

                            <button type="submit" disabled={loading} className={styles.submitBtn}>
                                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        {isLogin && (
                            <a href="#" className={styles.forgotLink}>Forgot your password?</a>
                        )}

                        <div className={styles.divider}>
                            <span>or</span>
                        </div>

                        <p className={styles.switchText}>
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button className={styles.switchBtn} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                                {isLogin ? 'Sign Up Free' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
