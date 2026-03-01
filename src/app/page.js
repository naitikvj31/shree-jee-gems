'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { HiOutlineAdjustments, HiOutlineBadgeCheck, HiOutlineSparkles, HiOutlineHeart, HiOutlineLocationMarker, HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import styles from './page.module.css';

const sortOptions = [
  { label: 'Relevance', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
];

const browseCategories = [
  { name: 'Crown', slug: 'crown', image: '/categories/crown.png' },
  { name: 'Earrings', slug: 'earrings', image: '/categories/earrings.png' },
  { name: 'Tops', slug: 'tops', image: '/categories/tops.png' },
  { name: 'Chains', slug: 'chains', image: '/categories/bracelet.png' },
  { name: 'Mangtika', slug: 'mangtika', image: '/categories/mangtika.png' },
  { name: 'Necklace', slug: 'necklace', image: '/categories/necklace.png' },
  { name: 'Chokar', slug: 'chokar', image: '/categories/chokar.png' },
  { name: 'Long bridal necklace', slug: 'long-bridal-necklace', image: '/categories/bridal_necklace.png' },
  { name: 'Bracelet', slug: 'bracelet', image: '/categories/bracelet.png' },
  { name: 'Bangles', slug: 'bangles', image: '/categories/bangles.png' },
  { name: 'Rings', slug: 'rings', image: '/categories/ring.png' },
  { name: 'Anklets', slug: 'anklets', image: '/categories/anklet.png' },
  { name: 'Toerings', slug: 'toerings', image: '/categories/ring.png' },
  { name: 'Watches', slug: 'watches', image: '/categories/bracelet.png' },
  { name: 'Pendants', slug: 'pendant', image: '/categories/pendant.png' },
  { name: 'Pandora', slug: 'pandora', image: '/categories/bracelet.png' },
  { name: 'Purses', slug: 'purses', image: '/categories/purse.png' },
];

const heroSlides = [
  { title: 'Grace Around Your Wrist', subtitle: 'Delicate, stackable, and statement bracelets made to elevate every look.', cta: 'bracelet' },
  { title: 'Rings Everyday Elegance', subtitle: 'From subtle bands to bold designs, find rings that define your style.', cta: 'rings' },
  { title: 'Timeless Necklaces', subtitle: 'Handcrafted necklaces that blend tradition with modern artistry.', cta: 'necklace' },
];

const trustBadges = [
  { icon: HiOutlineBadgeCheck, title: '11+ Years of Jewellery Craftsmanship' },
  { icon: HiOutlineSparkles, title: 'Cut Stone Silver Specialists' },
  { icon: HiOutlineHeart, title: 'Custom Creations, Made for You' },
  { icon: HiOutlineLocationMarker, title: 'Handcrafted in India' },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [heroIndex, setHeroIndex] = useState(0);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
  }, [category, sort, page, search]);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
    ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
    : 'All Products';

  const showHero = !category && !search;
  const slide = heroSlides[heroIndex];

  return (
    <div className={styles.home}>


      {/* ═══ HERO SLIDER ═══ */}
      {showHero && (
        <>
          <section className={styles.hero}>
            <div className={`container ${styles.heroInner}`}>
              <div className={styles.heroContent}>
                <span className={styles.heroLogo}>SHREE JEE JEWELS</span>
                <h1 className={styles.heroTitle} key={heroIndex}>{slide.title}</h1>
                <p className={styles.heroDesc}>{slide.subtitle}</p>
                <Link href={`/?category=${slide.cta}`} className={styles.heroBtn}>
                  SHOP NOW
                </Link>
              </div>
            </div>
            {/* Slider arrows */}
            <button className={styles.heroArrow} style={{ left: 20 }} onClick={() => setHeroIndex(prev => prev === 0 ? heroSlides.length - 1 : prev - 1)}>
              <HiOutlineChevronLeft size={24} />
            </button>
            <button className={styles.heroArrow} style={{ right: 20 }} onClick={() => setHeroIndex(prev => (prev + 1) % heroSlides.length)}>
              <HiOutlineChevronRight size={24} />
            </button>
            {/* Dots */}
            <div className={styles.heroDots}>
              {heroSlides.map((_, i) => (
                <button key={i} className={`${styles.heroDot} ${i === heroIndex ? styles.heroDotActive : ''}`} onClick={() => setHeroIndex(i)} />
              ))}
            </div>
          </section>

          {/* ═══ CATEGORY BROWSE STRIP ═══ */}
          <section className={styles.categoryStrip}>
            <div className={`container ${styles.categoryStripInner}`}>
              {browseCategories.map(cat => (
                <Link href={`/?category=${cat.slug}`} key={cat.slug} className={styles.catCard}>
                  <div className={styles.catCardImg}>
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="120px"
                    />
                  </div>
                  <span className={styles.catCardName}>{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══ Product Header ═══ */}
      <div className={styles.productHeader} id="products">
        <div className={`container ${styles.productHeaderInner}`}>
          <div className={styles.headerLeft}>
            <h2 className={styles.pageTitle}>
              {search ? `Results for "${search}"` : showHero ? 'Most Loved' : categoryLabel}
            </h2>
            <span className={styles.resultCount}>{total} products</span>
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
            {showHero && (
              <div className={styles.viewAllWrap}>
                <Link href="/?category=all" className={styles.viewAllBtn}>View all products</Link>
              </div>
            )}
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

      {/* ═══ CRAFTED WITH CARE ═══ */}
      {showHero && (
        <section className={styles.craftedSection}>
          <div className="container">
            <h2 className={styles.craftedTitle}>Crafted with Care. Chosen with Confidence.</h2>
            <div className={styles.trustGrid}>
              {trustBadges.map((badge, i) => (
                <div key={i} className={styles.trustItem}>
                  <div className={styles.trustIcon}>
                    <badge.icon size={28} />
                  </div>
                  <strong>{badge.title}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>Loading...</div>
    }>
      <HomeContent />
    </Suspense>
  );
}
