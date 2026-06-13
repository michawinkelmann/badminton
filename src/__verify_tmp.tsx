import { type MouseEvent } from 'react'

const REGEL_ABSCHNITTE: { id: string; titel: string }[] = []

function springeZu(e: MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault()
  const ziel = document.getElementById(id)
  if (!ziel) return
  ziel.scrollIntoView({ behavior: 'smooth', block: 'start' })
  ziel.setAttribute('tabindex', '-1')
  ziel.focus({ preventScroll: true })
}

export function Demo() {
  return (
    <nav>
      {REGEL_ABSCHNITTE.map((a) => (
        <a key={a.id} href={`#${a.id}`} onClick={(e) => springeZu(e, a.id)}>{a.titel.split(':')[0]}</a>
      ))}
      <a href="#glossar" onClick={(e) => springeZu(e, 'glossar')}>Glossar</a>
    </nav>
  )
}
