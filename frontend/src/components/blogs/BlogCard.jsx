import { Link } from 'react-router-dom'
import { MdAccessTime, MdPerson, MdArrowForward } from 'react-icons/md'
import LazyImage from '../common/LazyImage'

export default function BlogCard({ post }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-accent">
      <div className="relative h-52 overflow-hidden">
        <LazyImage
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-primary text-xs font-semibold rounded-full">
          {post.category}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4 text-xs text-primary/50 mb-3">
          <span className="flex items-center gap-1">
            <MdPerson className="w-3.5 h-3.5" /> {post.author}
          </span>
          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="flex items-center gap-1">
            <MdAccessTime className="w-3.5 h-3.5" /> {post.readTime}
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-gold transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-primary/60 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
        <Link
          to={`/blogs/${post.slug}`}
          className="inline-flex items-center gap-1 text-gold font-semibold text-sm hover:gap-2 transition-all min-h-[44px]"
        >
          Read More
          <MdArrowForward className="w-4 h-4" />
        </Link>
      </div>
    </article>
  )
}
