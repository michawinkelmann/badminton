import { Link, useParams } from 'react-router-dom'
import { findeAnimation } from '../data/animationen'
import { alleUebungen } from '../data/uebungen'
import { KATEGORIE_NAMEN } from '../data/skills'
import { useAppStore } from '../store'
import AnimationsAnsicht from '../components/animation/AnimationsAnsicht'

export default function AnimationDetail() {
  const { animationId } = useParams()
  const eigene = useAppStore((s) => s.eigeneUebungen)
  const animation = animationId ? findeAnimation(animationId) : undefined

  if (!animation) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Animation nicht gefunden</h1>
        <Link
          to="/bewegungslehre"
          className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
        >
          Zur Bewegungslehre
        </Link>
      </div>
    )
  }

  const verknuepfteUebungen = alleUebungen(eigene).filter(
    (u) => u.animationId === animation.id,
  )

  return (
    <div className="max-w-3xl">
      <h1 className="schrift-display doppellinie text-3xl">{animation.name}</h1>
      <p className="mt-5 text-tinte/85">{animation.beschreibung}</p>

      <div className="mt-6">
        <AnimationsAnsicht animation={animation} />
      </div>

      <section className="mt-8">
        <h2 className="schrift-display text-lg">Alle Phasen im Überblick</h2>
        <ol className="mt-3 space-y-2">
          {animation.phasen.map((p, i) => (
            <li key={i} className="flex gap-3 rounded-lg bg-linie p-3">
              <span className="ziffern schrift-display shrink-0 text-court">{i + 1}</span>
              <div>
                <p className="text-sm font-bold">{p.label}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-tinte/75">{p.lehrtext}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {verknuepfteUebungen.length > 0 && (
        <section className="mt-8">
          <h2 className="schrift-display text-lg">Passende Übungen aus der Bibliothek</h2>
          <ul className="mt-3 space-y-2">
            {verknuepfteUebungen.map((u) => (
              <li key={u.id}>
                <Link
                  to={`/uebungen/${u.id}`}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border-2 border-court/25 bg-linie p-3 hover:border-court"
                >
                  <span className="font-semibold">{u.name}</span>
                  <span className="rounded bg-court px-2 py-0.5 text-xs font-semibold text-linie">
                    {KATEGORIE_NAMEN[u.kategorie]}
                  </span>
                  <span className="ziffern text-xs text-tinte/60">~{u.dauerMin} Min</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        to="/bewegungslehre"
        className="mt-8 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
      >
        Zur Übersicht
      </Link>
    </div>
  )
}
