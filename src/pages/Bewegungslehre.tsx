import { Link } from 'react-router-dom'
import { animationsGruppen } from '../data/animationen'
import { useAppStore } from '../store'
import { alleUebungen } from '../data/uebungen'

const TYP_NAMEN = { figur: 'Strichfigur', court: 'Court-Ansicht', kombi: 'Kombination' } as const

export default function Bewegungslehre() {
  const eigene = useAppStore((s) => s.eigeneUebungen)
  const uebungen = alleUebungen(eigene)

  return (
    <div>
      <h1 className="schrift-display doppellinie text-3xl">Bewegungslehre</h1>
      <p className="mt-5 max-w-2xl text-tinte/80">
        25 animierte Bewegungsabläufe — jede Phase mit den Knackpunkten, auf die ein
        Trainer hinweisen würde. Mit Zeitlupe (0,25× / 0,5×) und Phasen-Stepper.
      </p>

      {animationsGruppen.map((gruppe) => (
        <section key={gruppe.titel} className="mt-8">
          <h2 className="schrift-display doppellinie text-xl">{gruppe.titel}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gruppe.animationen.map((a) => {
              const verknuepft = uebungen.filter((u) => u.animationId === a.id).length
              return (
                <Link
                  key={a.id}
                  to={`/bewegungslehre/${a.id}`}
                  className="flex flex-col rounded-xl border-2 border-court/25 bg-linie p-4 transition-colors hover:border-court"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold leading-snug">{a.name}</h3>
                    <span className="shrink-0 rounded bg-court px-2 py-0.5 text-xs font-semibold text-linie">
                      {TYP_NAMEN[a.typ]}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-tinte/70">{a.beschreibung}</p>
                  <p className="ziffern mt-3 border-t border-boden pt-2 text-xs text-tinte/60">
                    {a.phasen.length} Phasen
                    {verknuepft > 0 && ` · ${verknuepft} verknüpfte Übung(en)`}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
