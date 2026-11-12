'use client'

import { useEffect, useState } from 'react'

export default function SiteNav() {
  // White over the dark stage, ink over the light sections below it.
  const [onLight, setOnLight] = useState(false)

  useEffect(() => {
    const update = () => {
      const stage = document.querySelector('.surface')
      const footer = document.querySelector('.site-footer')
      if (!stage) return
      const pastStage = stage.getBoundingClientRect().bottom - stage.clientHeight * 0.45 < 40
      const inFooter = footer ? footer.getBoundingClientRect().top < 40 : false
      setOnLight(pastStage && !inFooter)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <header className="site-nav" data-on-light={onLight}>
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
