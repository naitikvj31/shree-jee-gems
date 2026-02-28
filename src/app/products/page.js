'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { HiOutlineFilter, HiOutlineX, HiOutlineAdjustments } from 'react-icons/hi';
import styles from './products.module.css';

const categories = [
    { name: 'All', slug: 'all' },
    { name: 'Rings', slug: 'rings' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Bangles', slug: 'bangles' },
    { name: 'Pendants', slug: 'pendants' },
];

const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' },
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const cat = searchParams.get('category');
        const s = searchParams.get('search');
        const featured = searchParams.get('featured');
        const bestseller = searchParams.get('bestseller');
        const isNew = searchParams.get('new');
        if (cat) setCategory(cat);
        if (s) setSearch(s);
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [category, sort, page, search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category && category !== 'all') params.set('category', category);
            if (sort) params.set('sort', sort);
            if (search) params.set('search', search);
            params.set('page', page.toString());
            params.set('limit', '12');

            const searchP = new URLSearchParams(window.location.search);
            if (searchP.get('featured')) params.set('featured', 'true');
            if (searchP.get('bestseller')) params.set('bestseller', 'true');
            if (searchP.get('new')) params.set('new', 'true');

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
                setTotalPages(data.pagination.pages);
                setTotal(data.pagination.total);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.productsPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Our Collections</h1>
                    <p>{search ? `Search results for "${search}"` : 'Discover our exquisite jewelry collection'}</p>
                </div>
            </div>

            <div className={`container ${styles.content}`}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.toolbarLeft}>
                        <button className={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
                            <HiOutlineFilter size={18} />
                            Filters
                        </button>
                        <span className={styles.resultCount}>{total} products</span>
                    </div>
                    <div className={styles.toolbarRight}>
                        <select
                            value={sort}
                            onChange={(e) => { setSort(e.target.value); setPage(1); }}
                            className={styles.sortSelect}
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.main}>
                    {/* Sidebar Filters */}
                    <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
                        <div className={styles.sidebarHeader}>
                            <h3><HiOutlineAdjustments size={18} /> Filters</h3>
                            <button onClick={() => setShowFilters(false)} className={styles.closeSidebar}>
                                <HiOutlineX size={20} />
                            </button>
                        </div>
                        <div className={styles.filterGroup}>
                            <h4>Category</h4>
                            <div className={styles.filterOptions}>
                                {categories.map(cat => (
                                    <button
                                        key={cat.slug}
                                        className={`${styles.filterBtn} ${category === cat.slug ? styles.filterActive : ''}`}
                                        onClick={() => { setCategory(cat.slug); setPage(1); }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {search && (
                            <div className={styles.activeFilter}>
                                <span>Search: &ldquo;{search}&rdquo;</span>
                                <button onClick={() => setSearch('')}><HiOutlineX size={14} /></button>
                            </div>
                        )}
                    </aside>

                    {/* Product Grid */}
                    <div className={styles.gridWrap}>
                        {loading ? (
                            <div className={styles.grid}>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={styles.skeleton}>
                                        <div className={styles.skeletonImg} />
                                        <div className={styles.skeletonText} />
                                        <div className={styles.skeletonTextSm} />
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className={styles.empty}>
                                <span className={styles.emptyIcon}>✦</span>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search criteria</p>
                                <button className="btn btn-primary" onClick={() => { setCategory('all'); setSearch(''); }}>
                                    View All Products
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.grid}>
                                    {products.map(product => (
                                        <ProductCard key={product._id || product.slug} product={product} />
                                    ))}
                                </div>
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className={styles.pagination}>
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(p => p - 1)}
                                            className={styles.pageBtn}
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                className={`${styles.pageBtn} ${page === i + 1 ? styles.pageActive : ''}`}
                                                onClick={() => setPage(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                            className={styles.pageBtn}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
