import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdSearch } from 'react-icons/md'
import { blogCategories, popularTreatments } from '../../data/blogs'

export default function BlogSidebar({ recentPosts = [], onSearch, activeCategory, onCategoryChange }) {
  const [searchQuery, setSearchQuery] = useState('')
  const latestPosts = [...recentPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-accent">
        <h3 className="text-lg font-bold text-primary mb-4">Search</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-accent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-primary min-h-[44px]"
            aria-label="Search blog articles"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gold hover:text-primary transition-colors"
            aria-label="Search"
          >
            <MdSearch className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-accent">
        <h3 className="text-lg font-bold text-primary mb-4">Categories</h3>
        <ul className="space-y-2">
          {blogCategories.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors min-h-[44px] ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'text-primary/70 hover:bg-accent hover:text-primary'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-accent">
        <h3 className="text-lg font-bold text-primary mb-4">Recent Posts</h3>
        {latestPosts.length === 0 ? (
          <p className="text-sm text-primary/50">No articles yet.</p>
        ) : (
          <ul className="space-y-4">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/blogs/${post.slug}`}
                  className="block group"
                >
                  <p className="text-sm font-semibold text-primary group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-xs text-primary/50 mt-1">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Popular Treatments */}
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 shadow-lg text-white">
        <h3 className="text-lg font-bold text-gold mb-4">Popular Treatments</h3>
        <ul className="space-y-2">
          {popularTreatments.map((treatment) => (
            <li key={treatment}>
              <Link
                to="/services"
                className="block text-sm text-white/80 hover:text-gold transition-colors py-1"
              >
                {treatment}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
