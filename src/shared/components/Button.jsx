import { buttonStyles } from '../styles/theme.js'

export function Button({
  children,
  as: Component = 'button',
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <Component
      {...(Component === 'button' ? { type } : {})}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-brand ${buttonStyles[variant] || buttonStyles.primary} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
