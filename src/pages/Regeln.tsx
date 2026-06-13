import { useMemo, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { GLOSSAR, REGEL_ABSCHNITTE } from '../data/wissen'
import { findeAnimation } from '../data/animationen'

/** Regeln & Glossar: Grundregeln (inkl. 3×15 ab 2027) und Begriffslexikon mit Animations-Links. */
export default function Regeln() {
  const [suche, setSuche] = useState('')

  const treffer = useMemo(() => {
    const s = suche.trim().toLowerCase()
    if (!s) return GLOSSAR
    return GLOSSAR.filter(
      (e) => e.begriff.toLowerCase().includes(s) || e.erklaerung.toLowerCase().includes(s),
    )
  }, [suche])

  /**
   * Sanft zum Abschnitt scrollen statt den Anker dem Browser zu überlassen.
   * Nötig, weil die App den HashRouter nutzt: Ein echter „#id"-Sprung überschreibt
   * den Routing-Hash, findet keine Route und landet via Catch-all-Route auf der Startseite.
   */
  function springeZu(e: MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    const ziel = document.getElementById(id)
    if (!ziel) return
    ziel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    ziel.setAttribute('tabindex', '-1')
    ziel.focus({ preventScroll: true })
  }

  return (
    <div className="max-w-4xl">
      <h1 className="schrift-display doppellinie text-3xl">Regeln & Glossar</h1>
      <p className="mt-5 max-w-2xl text-sm text-tinte/70">
        Das Wichtigste fürs Spielen, Unterrichten und Turnier-Pfeifen — inklusive der neuen
        Zählweise, die ab 2027 international gilt.
      </p>

      {/* Sprungnavigation */}
      <nav aria-label="Abschnitte" className="mt-4 flex flex-wrap gap-2 print:hidden">
        {REGEL_ABSCHNITTE.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            onClick={(e) => springeZu(e, a.id)}
            className="min-h-11 inline-flex items-center rounded-full border-2 border-court/30 px-3 text-sm font-semibold text-court hover:border-court"
          >
            {a.titel.split(':')[0]}
          </a>
        ))}
        <a href="#glossar" onClick={(e) => springeZu(e, 'glossar')} className="min-h-11 inline-flex items-center rounded-full border-2 border-court/30 px-3 text-sm font-semibold text-court hover:border-court">
          Glossar
        </a>
      </nav>

      {/* Regel-Abschnitte */}
      {REGEL_ABSCHNITTE.map((a) => (
        <section key={a.id} id={a.id} className="mt-8 scroll-mt-20">
          <h2 className="schrift-display doppellinie text-xl">{a.titel}</h2>
          {a.absaetze.map((text, i) => (
            <p key={i} className="mt-4 max-w-2xl text-sm leading-relaxed text-tinte/85">{text}</p>
          ))}
          {a.punkte && (
            <ul className="mt-3 max-w-2xl space-y-1.5">
              {a.punkte.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-sm bg-signal" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Glossar */}
      <section id="glossar" className="mt-10 scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="schrift-display doppellinie text-xl">Glossar</h2>
          <input
            type="search"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Begriff suchen …"
            aria-label="Glossar durchsuchen"
            className="min-h-11 w-56 rounded-md border-2 border-court/30 bg-linie px-3 text-sm print:hidden"
          />
        </div>

        {treffer.length === 0 ? (
          <p className="mt-4 text-sm text-tinte/60">Kein Begriff passt zu „{suche}".</p>
        ) : (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {treffer.map((e) => {
              const animation = e.animationId ? findeAnimation(e.animationId) : undefined
              return (
                <div key={e.begriff} className="rounded-xl border-2 border-court/20 bg-linie p-4">
                  <dt className="font-bold">{e.begriff}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-tinte/80">
                    {e.erklaerung}
                    {animation && (
                      <Link
                        to={`/bewegungslehre/${animation.id}`}
                        className="mt-2 block font-semibold text-court underline hover:text-court-tief print:hidden"
                      >
                        Animation ansehen: {animation.name}
                      </Link>
                    )}
                  </dd>
                </div>
              )
            })}
          </dl>
        )}
      </section>

      <p className="mt-8 max-w-2xl rounded-lg border-2 border-kork/40 bg-linie p-4 text-xs text-tinte/60">
        Vereinfachte Darstellung für Training und Schulsport. Verbindlich sind die „Laws of
        Badminton" der BWF bzw. die Spielordnung deines Verbands. Die 3×15-Zählweise gilt ab
        Januar 2027 international; nationale Verbände entscheiden eigenständig über die Übernahme.
      </p>
    </div>
  )
}
