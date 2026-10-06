import { buttonStyles } from '../styles/theme.js'

export function Button({
  children,
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <Component
      {...(Component === 'button' ? { type } : {})}
      className={`button-${variant} inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-brand ${size === 'sm' ? 'min-h-9 px-3 py-1.5' : 'min-h-10 px-4 py-2'} ${buttonStyles[variant] || buttonStyles.primary} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
