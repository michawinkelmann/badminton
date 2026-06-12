import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { findeUebung, istBibliotheksUebung } from '../data/uebungen'
import { KATEGORIE_NAMEN, NIVEAU_NAMEN, PERSONEN_NAMEN, SKILL_NAMEN } from '../data/skills'
import { useAppStore } from '../store'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'
import AnimationsAnsicht from '../components/animation/AnimationsAnsicht'
import { findeAnimation } from '../data/animationen'

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="schrift-display text-lg">{titel}</h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}

export default function UebungDetail() {
  const { uebungId } = useParams()
  const navigate = useNavigate()
  const eigene = useAppStore((s) => s.eigeneUebungen)
  const einheiten = useAppStore((s) => s.einheiten)
  const uebungLoeschen = useAppStore((s) => s.uebungLoeschen)
  const [loeschDialog, setLoeschDialog] = useState(false)

  const uebung = uebungId ? findeUebung(uebungId, eigene) : undefined

  if (!uebung) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Übung nicht gefunden</h1>
        <p className="mt-5 text-tinte/80">
          Diese Übung existiert nicht (mehr). Vielleicht wurde eine eigene Übung gelöscht.
        </p>
        <Link to="/uebungen" className="mt-4 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zur Bibliothek
        </Link>
      </div>
    )
  }

  const istEigene = !istBibliotheksUebung(uebung.id)
  const verwendetIn = einheiten.filter((e) =>
    e.bloecke.some((b) => b.uebungId === uebung.id),
  )

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-court px-2 py-0.5 text-xs font-semibold text-linie">
          {KATEGORIE_NAMEN[uebung.kategorie]}
        </span>
        {istEigene && (
          <span className="rounded bg-kork px-2 py-0.5 text-xs font-semibold text-linie">
            Eigene Übung
          </span>
        )}
      </div>

      <h1 className="schrift-display doppellinie mt-3 text-3xl">{uebung.name}</h1>
      <p className="mt-5 text-lg text-tinte/85">{uebung.kurzbeschreibung}</p>

      <dl className="ziffern mt-5 grid grid-cols-2 gap-3 rounded-xl border-2 border-court/25 bg-linie p-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs font-semibold text-tinte/60">Dauer (Richtwert)</dt>
          <dd className="font-bold">~{uebung.dauerMin} Min</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-tinte/60">Personen</dt>
          <dd className="font-bold">{PERSONEN_NAMEN[uebung.personen]}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-tinte/60">Niveau</dt>
          <dd className="font-bold">{uebung.niveau.map((n) => NIVEAU_NAMEN[n]).join(', ')}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-tinte/60">Material</dt>
          <dd className="font-bold">
            {uebung.material.length > 0 ? uebung.material.join(', ') : 'nur Schläger & Shuttles'}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {uebung.skills.map((s) => (
          <span key={s} className="rounded-full border border-court/40 px-2.5 py-1 text-xs font-semibold text-court">
            {SKILL_NAMEN[s]}
          </span>
        ))}
      </div>

      <Abschnitt titel="Durchführung">
        <ol className="space-y-2">
          {uebung.durchfuehrung.map((schritt, i) => (
            <li key={i} className="flex gap-3 rounded-lg bg-linie p-3 text-sm leading-relaxed">
              <span className="ziffern schrift-display shrink-0 text-court">{i + 1}</span>
              {schritt}
            </li>
          ))}
        </ol>
      </Abschnitt>

      {uebung.variationen && uebung.variationen.length > 0 && (
        <Abschnitt titel="Variationen">
          <ul className="space-y-2">
            {uebung.variationen.map((v, i) => (
              <li key={i} className="rounded-lg border-l-4 border-signal bg-linie p-3 text-sm leading-relaxed">
                {v}
              </li>
            ))}
          </ul>
        </Abschnitt>
      )}

      {uebung.fehlerbilder && uebung.fehlerbilder.length > 0 && (
        <Abschnitt titel="Typische Fehler & Korrektur">
          <ul className="space-y-2">
            {uebung.fehlerbilder.map((f, i) => (
              <li key={i} className="rounded-lg border-l-4 border-kork bg-linie p-3 text-sm leading-relaxed">
                {f}
              </li>
            ))}
          </ul>
        </Abschnitt>
      )}

      {uebung.animationId && (() => {
        const animation = findeAnimation(uebung.animationId)
        if (!animation) return null
        return (
          <Abschnitt titel="Bewegungsablauf">
            <AnimationsAnsicht animation={animation} kompakt />
            <Link
              to={`/bewegungslehre/${animation.id}`}
              className="mt-3 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
            >
              In der Bewegungslehre öffnen
            </Link>
          </Abschnitt>
        )
      })()}

      <div className="mt-8 flex flex-wrap gap-3 border-t-2 border-court/20 pt-5">
        <Link
          to="/uebungen"
          className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
        >
          Zur Bibliothek
        </Link>
        {istEigene && (
          <>
            <Link
              to={`/uebungen/${uebung.id}/bearbeiten`}
              className="inline-flex min-h-11 items-center rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
            >
              Übung bearbeiten
            </Link>
            <button
              type="button"
              onClick={() => setLoeschDialog(true)}
              className="min-h-11 rounded-md border-2 border-red-700 px-4 text-sm font-semibold text-red-800 hover:bg-red-50"
            >
              Übung löschen …
            </button>
          </>
        )}
      </div>

      <BestaetigungsDialog
        offen={loeschDialog}
        titel="Übung löschen?"
        bestaetigenLabel="Endgültig löschen"
        destruktiv
        onBestaetigen={() => {
          uebungLoeschen(uebung.id)
          setLoeschDialog(false)
          navigate('/uebungen')
        }}
        onAbbrechen={() => setLoeschDialog(false)}
      >
        {verwendetIn.length > 0 ? (
          <>
            Achtung: Diese Übung steckt noch in {verwendetIn.length} Einheit(en) (
            {verwendetIn.map((e) => `„${e.name}"`).join(', ')}). Die Blöcke dort zeigen nach
            dem Löschen ins Leere.
          </>
        ) : (
          <>„{uebung.name}" wird unwiderruflich gelöscht.</>
        )}
      </BestaetigungsDialog>
    </div>
  )
}
