import Logo from './Logo'
import { BUSINESS } from '@/lib/business'

export default function SiteFooter() {
  return (
    <footer className="site-footer" data-dark>
      <div className="footer-inner">
        <p className="footer-mark">
          <Logo />
        </p>
        <div className="footer-cols">
          <nav aria-label="Explore">
            <h2>Explore</h2>
            <a href="/#buy">Buy the bottle</a>
            <a href="/science">Science</a>
            <a href="/story">Our story</a>
            <a href="/reviews">Reviews</a>
          </nav>
          <nav aria-label="Help">
            <h2>Help</h2>
            <a href="/faqs">Questions</a>
            <a href="/shipping">Shipping</a>
            <a href="/returns">Returns and warranty</a>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </nav>
          <nav aria-label="Legal">
            <h2>Legal</h2>
            <a href="/privacy">Privacy policy</a>
            <a href="/terms">Terms and conditions</a>
          </nav>
        </div>
        <p className="footer-small">
          Oxyra is a water bottle, not a medicine. It isn&rsquo;t intended to diagnose, treat, cure or prevent any
          disease.
        </p>
        <p className="footer-small">
          © 2026 {BUSINESS.legalName || BUSINESS.brand}
          {BUSINESS.abn ? ` · ABN ${BUSINESS.abn}` : ''}
        </p>
      </div>
    </footer>
  )
}
