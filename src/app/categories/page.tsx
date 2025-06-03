import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { published: true } } }
        },
        articles: {
          where: { published: true },
          take: 1,
          orderBy: { publishedAt: 'desc' },
          include: {
            author: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Database error in getCategories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  // Simplified color system - 4 main colors with subtle variations
  const getCategoryColor = (slug: string) => {
    const colorMap: { [key: string]: string } = {
      'berita-terkini': '#dc2626',
      'budaya-melayu': '#d97706',
      'pariwisata': '#0284c7',
      'ekonomi-bisnis': '#059669',
      'lingkungan': '#2c5f5d',
      'kuliner-khas': '#d97706',
      'sejarah-nostalgia': '#475569',
      'komunitas-gaya-hidup': '#2c5f5d',
      'pendidikan-pemuda': '#0284c7',
      'olahraga': '#dc2626',
      'kesehatan': '#059669',
      'hiburan-seni': '#475569',
      'teknologi-inovasi': '#2c5f5d',
      'agenda-acara': '#d97706',
      'opini-warga': '#475569'
    }
    return colorMap[slug] || '#2c3e50'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Unified Header */}
      <Header showCategories={false} variant="page" />

      {/* Page Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              Jelajahi Berdasarkan Kategori
            </h1>
            <p className="font-body text-xl max-w-2xl mx-auto" style={{ color: 'var(--secondary)' }}>
              Temukan artikel yang diorganisir berdasarkan topik yang paling menarik bagi Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12" style={{ backgroundColor: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="card-elegant overflow-hidden">
                  {/* Category Header */}
                  <div className="h-24 md:h-32 relative" style={{ backgroundColor: getCategoryColor(category.slug) }}>
                    <div className="relative h-full flex items-center justify-center">
                      <div className="text-center text-white px-2">
                        <h3 className="font-heading text-lg md:text-2xl font-bold mb-1 md:mb-2 line-clamp-2">{category.name}</h3>
                        <p className="text-xs md:text-sm opacity-90">
                          {category._count.articles} artikel
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category Content */}
                  <div className="p-3 md:p-6">
                    {category.description && (
                      <p className="font-body mb-3 md:mb-4 leading-relaxed text-xs md:text-base line-clamp-2 md:line-clamp-none" style={{ color: 'var(--secondary)' }}>
                        {category.description}
                      </p>
                    )}

                    {/* Latest Article Preview */}
                    {category.articles[0] && (
                      <div className="pt-3 md:pt-4" style={{ borderTop: `1px solid var(--border)` }}>
                        <p className="text-xs md:text-sm mb-1 md:mb-2" style={{ color: 'var(--secondary)' }}>Artikel Terbaru:</p>
                        <h4 className="font-subheading font-semibold mb-1 md:mb-2 line-clamp-2 transition-colors text-xs md:text-base" style={{ color: 'var(--primary)' }}>
                          {category.articles[0].title}
                        </h4>
                        <p className="text-xs md:text-sm" style={{ color: 'var(--secondary)' }}>
                          Oleh {category.articles[0].author.name}
                        </p>
                      </div>
                    )}

                    {/* View All Button */}
                    <div className="mt-3 md:mt-6 flex items-center justify-between">
                      <span className="font-medium transition-colors text-xs md:text-base" style={{ color: 'var(--accent)' }}>
                        <span className="hidden md:inline">Lihat Semua Artikel</span>
                        <span className="md:hidden">Lihat Semua</span>
                      </span>
                      <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-all" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Tetap Terkini dengan Berita Terbaru
          </h2>
          <p className="font-body mb-8 max-w-2xl mx-auto" style={{ color: 'var(--secondary)' }}>
            Jangan lewatkan cerita-cerita penting. Jelajahi kategori kami untuk menemukan berita yang paling relevan untuk Anda.
          </p>
          <Link
            href="/"
            className="btn-accent inline-flex items-center px-6 py-3 rounded-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <h4 className="font-heading text-2xl font-bold mb-4">Pontigram News</h4>
              <p className="font-body mb-6 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Portal berita terpercaya yang menyajikan informasi terkini, mendalam, dan berimbang
                tentang berbagai peristiwa di Indonesia dan dunia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h5 className="font-subheading text-lg font-semibold mb-4">Navigasi</h5>
              <ul className="space-y-2">
                <li><Link href="/" className="font-body text-sm transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Beranda</Link></li>
                <li><Link href="/categories" className="font-body text-sm transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Kategori</Link></li>
                <li><Link href="/search" className="font-body text-sm transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Pencarian</Link></li>
                <li><Link href="/contact" className="font-body text-sm transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Kontak</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h5 className="font-subheading text-lg font-semibold mb-4">Kontak</h5>
              <div className="space-y-2">
                <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Email: redaksi@pontigram.news
                </p>
                <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Telepon: +62 21 1234 5678
                </p>
                <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Alamat: Jakarta, Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t mt-8 pt-8" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                © 2024 Pontigram News. Seluruh hak cipta dilindungi.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Kebijakan Privasi
                </Link>
                <Link href="/terms" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Syarat & Ketentuan
                </Link>
                <Link href="/about" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Tentang Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
