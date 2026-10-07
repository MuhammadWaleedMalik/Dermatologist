import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import SectionHeading from '../components/common/SectionHeading'
import BlogCard from '../components/blogs/BlogCard'
import BlogSidebar from '../components/blogs/BlogSidebar'
import { staggerContainer, staggerItem } from '../utils/motionVariants'
import { getBlogs } from '../services/blogService'

export default function Blogs() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    let active = true
    getBlogs()
      .then((data) => {
        if (active) setPosts(data.filter((post) => post.published !== false))
      })
      .catch(() => {
        if (active) setPosts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [posts, searchQuery, activeCategory])

  return (
    <PageTransition>
      <SEO
        title="Medical Blog"
        description="Expert insights on hair transplant, skin care, laser treatments, PRP therapy, and aesthetic medicine from Dr Salman Skin & Hair Clinic."
        path="/blogs"
      />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light">
        <div className="container-clinic px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Medical Blog</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Expert insights and educational articles on skin and hair aesthetics.
          </p>
        </div>
      </section>

      <section className="section-padding bg-accent-gray">
        <div className="container-clinic">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <SectionHeading
                subtitle="Latest Articles"
                title="Health & Beauty Insights"
                description="Stay informed with the latest trends, tips, and expert advice in aesthetic medicine."
                align="left"
              />

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading blogs" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <p className="text-primary/60 text-center py-12">No articles found matching your search.</p>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {filteredPosts.map((post) => (
                    <motion.div key={post.id} variants={staggerItem}>
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            <div>
              <BlogSidebar
                recentPosts={posts}
                onSearch={setSearchQuery}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}