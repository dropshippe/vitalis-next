import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'

// Shared frame for every inner page: dark title band, light body, footer.
export default function PageShell({
  title,
  intro,
  children,
  narrow = false,
}: {
  title: string
  intro?: React.ReactNode
  children: React.ReactNode
  narrow?: boolean
}) {
  return (
    <>
      <SiteNav />
      <main>
        <header className="page-head" data-dark>
          <div className="page-head-inner">
            <h1 className="page-title">{title}</h1>
            {intro && <p className="page-intro">{intro}</p>}
          </div>
        </header>
        <div className={`page-body${narrow ? ' page-body-narrow' : ''}`}>{children}</div>
      </main>
      <SiteFooter />
    </>
  )
}

export function BuyBand({ line = 'Ninety days to decide. Free shipping.' }: { line?: string }) {
  return (
    <aside className="buy-band">
      <p>{line}</p>
      <a className="btn btn-dark" href="/#buy">
        Buy from $59.99
      </a>
    </aside>
  )
}
