import type { Match } from '../../datenmodell'

interface Props {
  matches: Match[] // nur bracketTyp 'haupt' einer Phase
  platz3?: Match
  name: (id?: string) => string
  onMatch: (match: Match) => void
}

const BOX_B = 200
const BOX_H = 60
const LUECKE = 14
const SPALTE = BOX_B + 48

const RUNDEN_NAMEN: Record<number, string> = { 1: 'Finale', 2: 'Halbfinale', 4: 'Viertelfinale', 8: 'Achtelfinale' }

function rundenName(r: number, maxRunde: number): string {
  const spieleInRunde = 2 ** (maxRunde - r)
  return RUNDEN_NAMEN[spieleInRunde] ?? `Runde ${r}`
}

/** K.o.-Bracket mit Verbindungslinien, horizontal scrollbar (§9.2). */
export default function Bracket({ matches, platz3, name, onMatch }: Props) {
  const maxRunde = Math.max(...matches.map((m) => m.runde ?? 1))
  const einheit = BOX_H + LUECKE
  const hoehe = matches.filter((m) => m.runde === 1).length * einheit
  const breite = maxRunde * SPALTE

  const centerY = (r: number, slot: number) => (slot + 0.5) * einheit * 2 ** (r - 1)
  const x = (r: number) => (r - 1) * SPALTE

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-court/25 bg-linie p-4">
      {/* Rundentitel */}
      <div className="relative mb-2" style={{ width: breite, height: 20 }}>
        {Array.from({ length: maxRunde }, (_, i) => (
          <span
            key={i}
            className="schrift-display absolute text-xs text-court"
            style={{ left: x(i + 1), width: BOX_B, textAlign: 'center' }}
          >
            {rundenName(i + 1, maxRunde)}
          </span>
        ))}
      </div>

      <div className="relative" style={{ width: breite, height: hoehe + 8 }}>
        {/* Verbindungslinien */}
        <svg className="absolute inset-0" width={breite} height={hoehe + 8} aria-hidden="true">
          {matches
            .filter((m) => (m.runde ?? 1) >= 2)
            .map((m) => {
              const r = m.runde!
              const s = m.bracketSlot!
              const yOben = centerY(r - 1, 2 * s)
              const yUnten = centerY(r - 1, 2 * s + 1)
              const xVon = x(r - 1) + BOX_B
              const xMitte = xVon + 24
              const xZiel = x(r)
              const pfad = `M ${xVon} ${yOben} H ${xMitte} V ${yUnten} H ${xVon} M ${xMitte} ${(yOben + yUnten) / 2} H ${xZiel}`
              return (
                <path key={m.id} d={pfad} fill="none" stroke="var(--color-court)" strokeOpacity={0.4} strokeWidth={2} />
              )
            })}
        </svg>

        {/* Matchboxen */}
        {matches.map((m) => {
          const top = centerY(m.runde!, m.bracketSlot!) - BOX_H / 2
          return (
            <BracketBox
              key={m.id}
              match={m}
              name={name}
              onMatch={onMatch}
              style={{ left: x(m.runde!), top, width: BOX_B, height: BOX_H }}
            />
          )
        })}
      </div>

      {platz3 && (
        <div className="mt-4 border-t-2 border-boden pt-3">
          <p className="schrift-display mb-1 text-xs text-court">Spiel um Platz 3</p>
          <BracketBox
            match={platz3}
            name={name}
            onMatch={onMatch}
            style={{ position: 'relative', width: BOX_B, height: BOX_H }}
          />
        </div>
      )}
    </div>
  )
}

function BracketBox({
  match,
  name,
  onMatch,
  style,
}: {
  match: Match
  name: (id?: string) => string
  onMatch: (m: Match) => void
  style: React.CSSProperties
}) {
  const istFreilos =
    match.runde === 1 &&
    match.status === 'beendet' &&
    (match.teilnehmerAId === undefined) !== (match.teilnehmerBId === undefined)
  const klickbar = !!(match.teilnehmerAId && match.teilnehmerBId)

  const zeile = (id: string | undefined, seite: 'a' | 'b') => {
    const sieger = match.siegerId !== undefined && match.siegerId === id
    const punkte = match.saetze.map((s) => (seite === 'a' ? s.a : s.b)).join(' ')
    return (
      <div
        className={`flex items-center justify-between gap-1 px-2 ${
          sieger ? 'font-bold text-court' : match.siegerId ? 'text-tinte/50' : ''
        }`}
      >
        <span className="truncate text-xs">
          {id ? name(id) : istFreilos ? 'Freilos' : '–'}
        </span>
        <span className="ziffern shrink-0 text-xs">{punkte}</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled={!klickbar}
      onClick={() => klickbar && onMatch(match)}
      style={{ position: 'absolute', ...style }}
      className={`grid grid-rows-2 divide-y divide-boden rounded-md border-2 bg-linie text-left ${
        match.status === 'beendet'
          ? 'border-court/30'
          : match.status === 'laufend'
            ? 'border-signal'
            : 'border-court/50'
      } ${klickbar ? 'hover:border-court' : 'cursor-default opacity-90'}`}
    >
      {zeile(match.teilnehmerAId, 'a')}
      {zeile(match.teilnehmerBId, 'b')}
      {match.feld !== undefined && match.status !== 'beendet' && (
        <span className="absolute -top-2 right-1 rounded bg-signal px-1 text-[10px] font-bold text-tinte">
          Feld {match.feld}
        </span>
      )}
    </button>
  )
}
