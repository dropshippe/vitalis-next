import type { Metadata } from 'next'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Tracker from '../components/Tracker'

export const metadata: Metadata = {
  title: 'Oxyra — Hydrogen Water Bottle',
  description: 'Advanced SPE/PEM hydrogen water technology. 3000+ PPB. Science-backed. 90-day guarantee.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#fafaf8' }}>
        <Tracker />
          <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
