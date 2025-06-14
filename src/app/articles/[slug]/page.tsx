import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SocialShare from '@/components/SocialShare'

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: { name: true }
      },
      category: {
        select: { name: true, slug: true }
      }
    }
  })

  if (!article) {
    notFound()
  }

  return article
}

async function getRelatedArticles(categoryId: string, currentArticleId: string) {
  return await prisma.article.findMany({
    where: {
      categoryId,
      published: true,
      id: { not: currentArticleId }
    },
    include: {
      author: {
        select: { name: true }
      },
      category: {
        select: { name: true, slug: true }
      }
    },
    orderBy: { publishedAt: 'desc' },
    take: 3
  })
}

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  // Unwrap the async params
  const { slug } = await params

  const article = await getArticle(slug)
  const relatedArticles = await getRelatedArticles(article.categoryId, article.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Social Share Component */}
      <SocialShare
        url={`/articles/${article.slug}`}
        title={article.title}
        description={article.excerpt || ''}
      />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                Pontigram News
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Article Header */}
          <div className="px-8 pt-8">
            <div className="flex items-center mb-4">
              <Link
                href={`/category/${article.category.slug}`}
                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200"
              >
                {article.category.name}
              </Link>
              <span className="text-gray-500 text-sm ml-4">
                {formatDate(new Date(article.publishedAt!))}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex items-center text-gray-600 mb-8">
              <span>By {article.author.name}</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="aspect-video relative mb-8">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="px-8 pb-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <article
                  key={relatedArticle.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedArticle.featuredImage && (
                    <div className="aspect-video relative">
                      <Image
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link
                        href={`/articles/${relatedArticle.slug}`}
                        className="hover:text-blue-600"
                      >
                        {relatedArticle.title}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {relatedArticle.author.name}</span>
                      <span>{formatDate(new Date(relatedArticle.publishedAt!))}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-2">Pontigram News</h4>
            <p className="text-gray-400">
              Your trusted source for news and information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
