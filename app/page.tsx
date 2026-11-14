import SiteNav from '@/components/SiteNav'
import Stage from '@/components/stage/Stage'
import Details from '@/components/Details'
import Anatomy from '@/components/Anatomy'
import Ritual from '@/components/Ritual'
import Compare from '@/components/Compare'
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
        <Anatomy />
        <Ritual />
        <Compare />
        <Buy />
      </main>
      <SiteFooter />
    </>
  )
}
