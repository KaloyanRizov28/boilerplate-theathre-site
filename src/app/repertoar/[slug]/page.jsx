import CastFilterSection from '@/features/repertoire/components/cast-filter-section'
import PlayPresentation from '@/features/repertoire/components/play-presentation'
import { getShowPageData } from '@/features/repertoire/lib/get-show-page-data'
import { notFound } from 'next/navigation'

export default async function SinglePlayPage({ params }) {
  const { slug } = await params
  const { show, employees } = await getShowPageData(slug)

  if (!show) {
    notFound()
  }

  const cleanSlug = show.slug ? show.slug.replace(/^[-]+/, '') : null
  const ticketLink = cleanSlug ? `https://www.entase.com/kalo/productions/${cleanSlug}?lc=bg` : null

  return (
    <main>
      <PlayPresentation
        playName={show.title}
        backgroundImage={show.image_URL}
        synopsis={show.information}
        productionId={cleanSlug}
        ticketLink={ticketLink}
      />
      <CastFilterSection employees={employees} />
    </main>
  )
}
