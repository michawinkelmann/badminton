import type { Match } from '../../datenmodell'

interface Props {
  matches: Match[]
  name: (id?: string) => string
  onMatch: (match: Match) => void
  titel?: string
}

/** Kompakte Spielliste (Runden-/Gruppenabschnitte), klickbar zur Ergebniseingabe. */
export default function MatchListe({ matches, name, onMatch, titel }: Props) {
  if (matches.length === 0) return null
  return (
    <div>
      {titel && <p className="schrift-display mb-1.5 text-sm text-court">{titel}</p>}
      <ul className="space-y-1.5">
        {matches.map((m) => {
          const freilos = (m.teilnehmerAId === undefined) !== (m.teilnehmerBId === undefined)
          const klickbar = !!(m.teilnehmerAId && m.teilnehmerBId)
          return (
            <li key={m.id}>
              <button
                type="button"
                disabled={!klickbar}
                onClick={() => onMatch(m)}
                className={`flex w-full min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border-2 bg-linie px-3 py-2 text-left text-sm ${
                  m.status === 'laufend' ? 'border-signal' : 'border-court/20'
                } ${klickbar ? 'hover:border-court' : 'cursor-default opacity-80'}`}
              >
                <span className={`font-semibold ${m.siegerId === m.teilnehmerAId && m.siegerId ? 'text-court' : ''}`}>
                  {name(m.teilnehmerAId)}
                </span>
                <span className="text-tinte/40">–</span>
                <span className={`font-semibold ${m.siegerId === m.teilnehmerBId && m.siegerId ? 'text-court' : ''}`}>
                  {freilos ? 'Freilos' : name(m.teilnehmerBId)}
                </span>
                <span className="ziffern ml-auto text-tinte/70">
                  {m.saetze.map((s) => `${s.a}:${s.b}`).join('  ') ||
                    (m.status === 'beendet' ? '✓' : '')}
                </span>
                {m.feld !== undefined && m.status !== 'beendet' && (
                  <span className="rounded bg-signal px-1.5 py-0.5 text-xs font-bold text-tinte">
                    Feld {m.feld}
                  </span>
                )}
                {m.status === 'laufend' && (
                  <span className="text-xs font-semibold text-kork">läuft</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
