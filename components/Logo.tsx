// The Oxyra mark: the O drawn as a single bubble, with the glint a real bubble carries.
export function Mark({ size = 24, title }: { size?: number | string; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="32" cy="32" r="29.5" stroke="currentColor" strokeWidth="5" />
      <path d="M17 27.5a16 16 0 0 1 10.5-10.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// Wordmark: the bubble stands in for the O, followed by XYRA.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <Mark size="0.72em" />
      <span className="logo-text" aria-hidden="true">
        xyra
      </span>
      <span className="sr-only">Oxyra</span>
    </span>
  )
}
