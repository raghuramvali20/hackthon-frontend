export function Card({ children, className = '', ...props }) {
  return (
    <section
      className={`rounded-2xl border border-line bg-surface shadow-sm ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}
