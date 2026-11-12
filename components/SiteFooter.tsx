export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-mark">Oxyra</p>
        <nav aria-label="Footer" className="footer-links">
          <a href="/science">Science</a>
          <a href="/faqs">Questions</a>
          <a href="/shipping">Shipping</a>
          <a href="/returns">Returns</a>
          <a href="mailto:hello@oxyrawater.com">hello@oxyrawater.com</a>
        </nav>
        <p className="footer-small">
          Oxyra is a water bottle, not a medicine. It isn&rsquo;t intended to diagnose, treat, cure or prevent any
          disease.
        </p>
        <p className="footer-small">© 2026 Oxyra</p>
      </div>
    </footer>
  )
}
