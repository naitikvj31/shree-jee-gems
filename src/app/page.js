'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { HiOutlineAdjustments, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineRefresh, HiOutlineLockClosed, HiOutlineSupport, HiOutlineBadgeCheck, HiOutlineArrowRight } from 'react-icons/hi';
import styles from './page.module.css';

const sortOptions = [
  { label: 'Relevance', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
];

const trustBadges = [
  { icon: HiOutlineBadgeCheck, title: 'BIS Hallmarked', desc: 'Every piece is 100% certified authentic' },
  { icon: HiOutlineTruck, title: 'Global Shipping', desc: 'Free insured delivery to 50+ countries' },
  { icon: HiOutlineShieldCheck, title: 'Certified Diamonds', desc: 'GIA & IGI certified natural diamonds' },
  { icon: HiOutlineRefresh, title: 'Lifetime Exchange', desc: '100% value exchange on gold jewelry' },
  { icon: HiOutlineLockClosed, title: 'Secure Payments', desc: '256-bit SSL encrypted transactions' },
  { icon: HiOutlineSupport, title: '24/7 Support', desc: 'Dedicated jewelry experts for you' },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

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
      params.set('limit', '20');

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

  const categoryLabel = category && category !== 'all'
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Products';

  const showHero = !category && !search;

  return (
    <div className={styles.home}>
      {/* ═══ HERO BANNER ═══ */}
      {showHero && (
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroContent}>
              <span className={styles.heroBadge}>✦ PREMIUM JEWELRY COLLECTION</span>
              <h1 className={styles.heroTitle}>
                Timeless Elegance,<br />
                <span className={styles.heroGold}>Crafted in Gold</span>
              </h1>
              <p className={styles.heroDesc}>
                Discover our exquisite collection of handcrafted gold &amp; diamond jewelry.
                Each piece tells a story of tradition, craftsmanship, and enduring beauty.
              </p>
              <div className={styles.heroBtns}>
                <Link href="/?category=rings" className={styles.heroBtn}>
                  Shop Now <HiOutlineArrowRight />
                </Link>
                <Link href="/about" className={styles.heroBtnOutline}>
                  Our Story
                </Link>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <strong>10,000+</strong>
                  <span>Happy Customers</span>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <strong>50+</strong>
                  <span>Countries Served</span>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <strong>100%</strong>
                  <span>BIS Hallmarked</span>
                </div>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroRing}>
                <span className={styles.heroEmoji}>💍</span>
              </div>
              <div className={styles.heroFloatingBadge} style={{ top: '15%', right: '10%' }}>
                <span>✨</span> Premium Quality
              </div>
              <div className={styles.heroFloatingBadge} style={{ bottom: '20%', left: '5%' }}>
                <span>🏆</span> Award Winning
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Product Header ═══ */}
      <div className={styles.productHeader}>
        <div className={`container ${styles.productHeaderInner}`}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {search ? `Results for "${search}"` : categoryLabel}
            </h1>
            <span className={styles.resultCount}>{total} products found</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.sortWrap}>
              <HiOutlineAdjustments size={16} />
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className={styles.sortSelect}>
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Product Grid ═══ */}
      <div className={`container ${styles.gridContainer}`}>
        {loading ? (
          <div className={styles.grid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.skeleton}>
                <div className={styles.skeletonImg} />
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineShort} />
                  <div className={styles.skeletonLinePrice} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>No products yet</h3>
            <p>Check back soon — we are adding new pieces every day!</p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {products.map((product, i) => (
                <ProductCard key={product._id || product.slug} product={product} index={i} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>← Previous</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} className={`${styles.pageBtn} ${page === i + 1 ? styles.pageActive : ''}`} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ Trust Badges ═══ */}
      <div className={styles.trustSection}>
        <div className={`container ${styles.trustGrid}`}>
          {trustBadges.map((badge, i) => (
            <div key={i} className={styles.trustItem}>
              <div className={styles.trustIcon}>
                <badge.icon size={22} />
              </div>
              <strong>{badge.title}</strong>
              <span>{badge.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>Loading...</div>
    }>
      <HomeContent />
    </Suspense>
  );
}
