import SiteNav from '@/components/SiteNav'
import Stage from '@/components/stage/Stage'
import Details from '@/components/Details'
import Buy from '@/components/Buy'
import SiteFooter from '@/components/SiteFooter'

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Stage />
        <div className="surface" aria-hidden="true" />
        <Details />
        <Buy />
      </main>
      <SiteFooter />
    </>
  )
}
