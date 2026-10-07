import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-light shadow-lg hover:shadow-xl hover:-translate-y-0.5',
  gold: 'bg-gold text-primary hover:bg-gold-light shadow-lg hover:shadow-xl hover:-translate-y-0.5',
  outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-primary',
  outlineWhite: 'border-2 border-white text-white hover:bg-white hover:text-primary',
  ghost: 'text-primary hover:bg-accent',
}

const sizes = {
  sm: 'px-4 py-2 text-sm min-h-[44px]',
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[48px]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
