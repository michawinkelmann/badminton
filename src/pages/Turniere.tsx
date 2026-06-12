import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

const FORMAT_NAMEN = {
  ko: 'K.o.-System',
  gruppen_ko: 'Gruppen + K.o.',
  jeder_gegen_jeden: 'Jeder gegen Jeden',
  schweizer: 'Schweizer System',
} as const

const DISZIPLIN_NAMEN = { einzel: 'Einzel', doppel: 'Doppel', mixed: 'Mixed' } as const

const STATUS = {
  setup: { name: 'Setup', klasse: 'bg-kork/15 text-kork' },
  laufend: { name: 'Läuft', klasse: 'bg-signal text-tinte' },
  beendet: { name: 'Beendet', klasse: 'bg-court text-linie' },
} as const

export default function Turniere() {
  const turniere = useAppStore((s) => s.turniere)
  const turnierLoeschen = useAppStore((s) => s.turnierLoeschen)
  const [loeschId, setLoeschId] = useState<string>()

  const loeschTurnier = turniere.find((t) => t.id === loeschId)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="schrift-display doppellinie text-3xl">Turniere</h1>
        <Link
          to="/turniere/neu"
          className="min-h-11 rounded-md bg-court px-4 py-2.5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Turnier anlegen
        </Link>
      </div>

      {turniere.length === 0 ? (
        <p className="mt-8 max-w-2xl rounded-xl border-2 border-kork/40 bg-linie p-6 text-sm text-tinte/70">
          Noch kein Turnier. Leg eines an: vier Formate, Spielplan auf Knopfdruck,
          Ergebniseingabe für die Halle und Live-Tabellen — komplett offline.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[...turniere].reverse().map((t) => {
            const beendet = t.matches.filter((m) => m.status === 'beendet').length
            const status = STATUS[t.status]
            return (
              <div key={t.id} className="flex flex-col rounded-xl border-2 border-court/25 bg-linie p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold leading-snug">{t.name}</h2>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${status.klasse}`}>
                    {status.name}
                  </span>
                </div>
                <p className="ziffern mt-1 text-sm text-tinte/65">
                  {new Date(t.datum).toLocaleDateString('de-DE')} · {FORMAT_NAMEN[t.format]} ·{' '}
                  {DISZIPLIN_NAMEN[t.disziplin]} · {t.teilnehmer.length} Teilnehmer
                </p>
                {t.matches.length > 0 && (
                  <>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-boden">
                      <div
                        className="h-full bg-court"
                        style={{ width: `${(beendet / t.matches.length) * 100}%` }}
                      />
                    </div>
                    <p className="ziffern mt-1 text-xs text-tinte/55">
                      {beendet}/{t.matches.length} Spiele beendet
                    </p>
                  </>
                )}
                <div className="mt-3 flex flex-wrap gap-2 border-t border-boden pt-3">
                  <Link
                    to={t.status === 'setup' ? `/turniere/${t.id}/setup` : `/turniere/${t.id}`}
                    className="min-h-11 rounded-md bg-court px-4 py-2.5 text-sm font-semibold text-linie hover:bg-court-tief"
                  >
                    {t.status === 'setup' ? 'Setup fortsetzen' : 'Öffnen'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLoeschId(t.id)}
                    className="min-h-11 rounded-md px-2 text-sm font-semibold text-red-800 hover:bg-red-50"
                  >
                    Löschen …
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <BestaetigungsDialog
        offen={loeschId !== undefined}
        titel="Turnier löschen?"
        bestaetigenLabel="Endgültig löschen"
        destruktiv
        onBestaetigen={() => {
          if (loeschId) turnierLoeschen(loeschId)
          setLoeschId(undefined)
        }}
        onAbbrechen={() => setLoeschId(undefined)}
      >
        „{loeschTurnier?.name}" wird mit allen Spielen und Ergebnissen unwiderruflich
        gelöscht. Tipp: Vorher über die Detailseite exportieren.
      </BestaetigungsDialog>
    </div>
  )
}
