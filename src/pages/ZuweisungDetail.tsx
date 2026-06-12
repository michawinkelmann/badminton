import { Link, useParams } from 'react-router-dom'
import { findeEinheitMitVorlagen, findeProgramm } from '../data/programme'
import { einheitGesamtdauer } from '../utils/vorschlag'
import { aktuelleWoche, istAbgehakt, zuweisungFortschritt } from '../utils/tracking'
import { useAppStore } from '../store'

/** Wochenansicht mit Abhaken (§6): Abhaken erzeugt Logs für alle Betroffenen. */
export default function ZuweisungDetail() {
  const { zuweisungId } = useParams()
  const profile = useAppStore((s) => s.profile)
  const gruppen = useAppStore((s) => s.gruppen)
  const programme = useAppStore((s) => s.programme)
  const einheiten = useAppStore((s) => s.einheiten)
  const zuweisungen = useAppStore((s) => s.zuweisungen)
  const abhaken = useAppStore((s) => s.abhaken)
  const abhakenZuruecknehmen = useAppStore((s) => s.abhakenZuruecknehmen)

  const zuweisung = zuweisungen.find((z) => z.id === zuweisungId)
  const programm = zuweisung ? findeProgramm(zuweisung.programmId, programme) : undefined

  if (!zuweisung || !programm) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Zuweisung nicht gefunden</h1>
        <Link to="/programme" className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zu den Programmen
        </Link>
      </div>
    )
  }

  const ziel =
    zuweisung.zielTyp === 'profil'
      ? profile.find((p) => p.id === zuweisung.zielId)
      : gruppen.find((g) => g.id === zuweisung.zielId)
  const zielText =
    zuweisung.zielTyp === 'profil'
      ? `Profil: ${(ziel as { name?: string })?.name ?? '—'}`
      : `Gruppe: ${(ziel as { name?: string })?.name ?? '—'} (${
          gruppen.find((g) => g.id === zuweisung.zielId)?.mitgliederIds.length ?? 0
        } Mitglieder)`

  const f = zuweisungFortschritt(zuweisung, programm)
  const wocheJetzt = aktuelleWoche(zuweisung.startDatum)

  return (
    <div className="max-w-3xl">
      <h1 className="schrift-display doppellinie text-3xl">{programm.name}</h1>
      <p className="mt-5 text-sm text-tinte/75">
        {zielText} · Start {new Date(zuweisung.startDatum).toLocaleDateString('de-DE')}
      </p>

      <div className="mt-4 rounded-xl border-2 border-court/25 bg-linie p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold">Fortschritt</span>
          <span className="ziffern text-sm text-tinte/65">
            {f.erledigt}/{f.gesamt} Einheiten ({f.prozent} %)
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-boden">
          <div className="h-full bg-court transition-all" style={{ width: `${f.prozent}%` }} />
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {programm.wochen.map((w) => {
          const istJetzt = w.nummer === Math.min(wocheJetzt, programm.wochen.length)
          return (
            <li
              key={w.nummer}
              className={`rounded-xl border-2 bg-linie p-4 ${
                istJetzt ? 'border-signal' : 'border-court/25'
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="schrift-display text-court">Woche {w.nummer}</span>
                <span className="font-bold">{w.fokus}</span>
                {istJetzt && (
                  <span className="rounded bg-signal px-2 py-0.5 text-xs font-bold text-tinte">
                    Aktuelle Woche
                  </span>
                )}
              </div>
              {w.progressionsHinweis && (
                <p className="mt-1.5 border-l-4 border-signal pl-3 text-sm leading-relaxed text-tinte/80">
                  {w.progressionsHinweis}
                </p>
              )}
              <ul className="mt-3 space-y-2">
                {w.einheitIds.map((eid, i) => {
                  const einheit = findeEinheitMitVorlagen(eid, einheiten)
                  const haken = istAbgehakt(zuweisung, w.nummer, eid)
                  return (
                    <li
                      key={`${eid}-${i}`}
                      className="flex flex-wrap items-center gap-3 rounded-lg bg-boden p-2.5"
                    >
                      <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={haken !== undefined}
                          onChange={(e) =>
                            e.target.checked
                              ? abhaken(zuweisung.id, w.nummer, eid)
                              : abhakenZuruecknehmen(zuweisung.id, w.nummer, eid)
                          }
                          className="h-6 w-6 accent-court"
                        />
                        <span className={`text-sm font-semibold ${haken ? 'text-tinte/50 line-through' : ''}`}>
                          {einheit?.name ?? eid}
                        </span>
                        {einheit && (
                          <span className="ziffern text-xs text-tinte/55">
                            {einheitGesamtdauer(einheit.bloecke)} Min
                          </span>
                        )}
                      </label>
                      {haken && (
                        <span className="ziffern text-xs text-court">
                          ✓ {new Date(haken.datum).toLocaleDateString('de-DE')}
                        </span>
                      )}
                      {einheit && (
                        <Link
                          to={`/einheiten/${einheit.id}`}
                          className="min-h-9 rounded px-2 text-xs font-semibold text-court underline-offset-2 hover:underline"
                        >
                          Ansehen
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ol>

      <p className="mt-4 text-xs text-tinte/60">
        Abhaken erzeugt automatisch einen Trainings-Log{' '}
        {zuweisung.zielTyp === 'gruppe' ? 'für alle Gruppenmitglieder' : 'für das Profil'} —
        sichtbar im Profil unter Volumen und Historie.
      </p>

      <Link to="/programme" className="mt-6 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
        Zu den Programmen
      </Link>
    </div>
  )
}
