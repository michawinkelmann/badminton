import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NIVEAU_NAMEN } from '../data/skills'
import { findeEinheitMitVorlagen, findeProgramm } from '../data/programme'
import { einheitGesamtdauer } from '../utils/vorschlag'
import { useAppStore } from '../store'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

export default function ProgrammDetail() {
  const { programmId } = useParams()
  const navigate = useNavigate()
  const programme = useAppStore((s) => s.programme)
  const einheiten = useAppStore((s) => s.einheiten)
  const programmLoeschen = useAppStore((s) => s.programmLoeschen)
  const [loeschDialog, setLoeschDialog] = useState(false)

  const programm = programmId ? findeProgramm(programmId, programme) : undefined

  if (!programm) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Programm nicht gefunden</h1>
        <Link to="/programme" className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zu den Programmen
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        {programm.istVorlage && (
          <span className="rounded bg-court px-2 py-0.5 text-xs font-semibold text-linie">Vorlage</span>
        )}
        <span className="rounded bg-kork/15 px-2 py-0.5 text-xs font-semibold text-kork">
          {NIVEAU_NAMEN[programm.zielniveau]}
        </span>
      </div>
      <h1 className="schrift-display doppellinie mt-3 text-3xl">{programm.name}</h1>
      <p className="mt-5 text-tinte/85">{programm.beschreibung}</p>

      <ol className="mt-6 space-y-3">
        {programm.wochen.map((w) => (
          <li key={w.nummer} className="rounded-xl border-2 border-court/25 bg-linie p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="schrift-display text-court">Woche {w.nummer}</span>
              <span className="font-bold">{w.fokus}</span>
            </div>
            {w.progressionsHinweis && (
              <p className="mt-1.5 border-l-4 border-signal pl-3 text-sm leading-relaxed text-tinte/80">
                {w.progressionsHinweis}
              </p>
            )}
            <ul className="mt-2 space-y-1">
              {w.einheitIds.map((eid, i) => {
                const e = findeEinheitMitVorlagen(eid, einheiten)
                return (
                  <li key={`${eid}-${i}`}>
                    {e ? (
                      <Link
                        to={`/einheiten/${e.id}`}
                        className="ziffern inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-court underline-offset-2 hover:underline"
                      >
                        {e.name} · {einheitGesamtdauer(e.bloecke)} Min
                      </Link>
                    ) : (
                      <span className="text-sm text-red-800">Einheit fehlt ({eid})</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap gap-3 border-t-2 border-court/20 pt-5">
        <Link to="/programme" className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zu den Programmen
        </Link>
        {!programm.istVorlage && (
          <>
            <Link
              to={`/programme/${programm.id}/bearbeiten`}
              className="inline-flex min-h-11 items-center rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
            >
              Bearbeiten
            </Link>
            <button
              type="button"
              onClick={() => setLoeschDialog(true)}
              className="min-h-11 rounded-md px-2 text-sm font-semibold text-red-800 hover:bg-red-50"
            >
              Löschen …
            </button>
          </>
        )}
      </div>

      <BestaetigungsDialog
        offen={loeschDialog}
        titel="Programm löschen?"
        bestaetigenLabel="Endgültig löschen"
        destruktiv
        onBestaetigen={() => {
          programmLoeschen(programm.id)
          setLoeschDialog(false)
          navigate('/programme')
        }}
        onAbbrechen={() => setLoeschDialog(false)}
      >
        „{programm.name}" und alle zugehörigen Zuweisungen werden gelöscht. Trainings-Logs
        bleiben erhalten.
      </BestaetigungsDialog>
    </div>
  )
}
