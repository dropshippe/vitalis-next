import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/instrument-sans'
import './globals.css'
import Tracker from '@/components/Tracker'

export const metadata: Metadata = {
  title: 'Oxyra — Hydrogen water bottle',
  description:
    'A 460 ml glass and steel bottle that infuses still water with hydrogen in three to five minutes.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#04121f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Tracker />
        {children}
      </body>
    </html>
  )
}
