import './legacy.css'
import Nav from '@/components/legacy/Nav'
import Footer from '@/components/legacy/Footer'

// Inner pages from the previous site, kept working until each is rebuilt in the new design.
export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fafaf8' }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
