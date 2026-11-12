export default function SiteNav() {
  return (
    <header className="site-nav">
      <a className="wordmark" href="/" aria-label="Oxyra home">
        Oxyra
      </a>
      <nav aria-label="Main">
        <a href="#details">Details</a>
        <a href="/science">Science</a>
        <a href="/faqs">Questions</a>
        <a className="nav-buy" href="#buy">
          Buy
        </a>
      </nav>
    </header>
  )
}
