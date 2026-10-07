import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MdArrowBack, MdPerson, MdAccessTime, MdCategory } from 'react-icons/md'
import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import LazyImage from '../components/common/LazyImage'
import Button from '../components/common/Button'
import { getBlogBySlug } from '../services/blogService'

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    getBlogBySlug(slug)
      .then((data) => {
        if (active) {
          setPost(data)
          setError('')
        }
      })
      .catch((err) => {
        if (active) {
          setPost(null)
          setError(err.message || 'Could not load this article.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [slug])

  if (loading) {
    return (
      <PageTransition>
        <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light">
          <div className="container-clinic px-4 sm:px-6 lg:px-8 text-center min-h-[50vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading article" />
          </div>
        </section>
      </PageTransition>
    )
  }

  if (!post) {
    return (
      <PageTransition>
        <SEO
          title="Article Not Found"
          description="The article you are looking for could not be found."
          path="/blogs"
        />
        <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light">
          <div className="container-clinic px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {error || 'The article you are looking for may have been moved or removed.'}
            </p>
          </div>
        </section>
        <section className="section-padding bg-accent-gray">
          <div className="container-clinic text-center">
            <p className="text-primary/60 mb-6">Please explore our other articles on the Medical Blog.</p>
            <Button to="/blogs" variant="primary" size="md">
              <MdArrowBack className="w-4 h-4" />
              Back to Blogs
            </Button>
          </div>
        </section>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blogs/${post.slug}`}
        image={post.image}
      />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light">
        <div className="container-clinic px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="inline-block px-4 py-1.5 bg-gold/20 border border-gold/40 rounded-full text-gold text-sm font-semibold tracking-wider uppercase mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <MdPerson className="w-4 h-4 text-gold" /> {post.author}
            </span>
            <span>
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <MdAccessTime className="w-4 h-4 text-gold" /> {post.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <MdCategory className="w-4 h-4 text-gold" /> {post.category}
            </span>
          </div>
        </div>
      </section>

      <section className="section-padding bg-accent-gray">
        <div className="container-clinic max-w-4xl">
          <div className="mb-6">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1 text-gold font-semibold text-sm hover:gap-2 transition-all min-h-[44px]"
            >
              <MdArrowBack className="w-4 h-4" /> Back to Blogs
            </Link>
          </div>

          <LazyImage
            src={post.image}
            alt={post.title}
            className="w-full h-72 sm:h-96 object-cover"
            wrapperClassName="rounded-2xl shadow-xl mb-8"
          />

          <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-accent">
            <p className="text-primary/70 leading-relaxed mb-6 text-lg">{post.excerpt}</p>
            <div className="divide-y divide-accent">
              {post.content
                .split('\n')
                .filter((para) => para.trim())
                .map((para, i) => (
                  <p key={i} className="text-primary/70 leading-relaxed py-4">
                    {para}
                  </p>
                ))}
            </div>
          </article>

          <div className="mt-8 text-center">
            <Button to="/blogs" variant="gold" size="md">
              <MdArrowBack className="w-4 h-4" />
              More Articles
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
