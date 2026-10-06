export function Card({ children, className = '', ...props }) {
  return (
    <section
      className={`card-elevated rounded-2xl border border-line bg-surface ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}
