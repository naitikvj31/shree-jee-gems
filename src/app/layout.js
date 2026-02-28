import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
  title: 'Shree Jee Jewels | Premium Gold & Diamond Jewelry',
  description: 'Shop premium handcrafted gold, diamond & gemstone jewelry. Rings, necklaces, earrings, bracelets, bangles & pendants. Free worldwide shipping to Bangkok, USA, Japan & Africa.',
  keywords: 'jewelry, gold jewelry, diamond rings, necklaces, earrings, bracelets, bangles, pendants, hallmarked jewelry, certified diamonds',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main style={{
              marginTop: 'calc(var(--navbar-height) + var(--category-bar-height))'
            }}>
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
