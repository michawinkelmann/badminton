import { Link, useParams } from 'react-router-dom'
import {
  berechneTabelle,
  gruppenAusMatches,
  schweizerTabelle,
} from '../engine/turnier'
import { useAppStore } from '../store'

/** Druckansicht (§9.3): Spielplan + Ergebnisse + Tabelle/Bracket, s/w-tauglich. */
export default function TurnierDruck() {
  const { turnierId } = useParams()
  const turnier = useAppStore((s) => s.turniere).find((t) => t.id === turnierId)

  if (!turnier) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Turnier nicht gefunden</h1>
        <Link to="/turniere" className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zu den Turnieren
        </Link>
      </div>
    )
  }

  const name = (id?: string) =>
    id ? (turnier.teilnehmer.find((t) => t.id === id)?.name ?? '?') : 'Freilos'

  const abschnitte: { titel: string; matches: typeof turnier.matches }[] = []
  if (turnier.format === 'ko') {
    const maxRunde = Math.max(...turnier.matches.map((m) => m.runde ?? 1))
    for (let r = 1; r <= maxRunde; r++) {
      abschnitte.push({
        titel: `Runde ${r}`,
        matches: turnier.matches.filter((m) => m.runde === r && m.bracketTyp === 'haupt'),
      })
    }
    const p3 = turnier.matches.filter((m) => m.bracketTyp === 'platz3')
    if (p3.length) abschnitte.push({ titel: 'Spiel um Platz 3', matches: p3 })
  } else if (turnier.format === 'gruppen_ko') {
    const gruppen = gruppenAusMatches(turnier.matches)
    for (const g of [...gruppen.keys()].sort()) {
      abschnitte.push({
        titel: `Gruppe ${g}`,
        matches: turnier.matches.filter((m) => m.phase === 'gruppe' && m.gruppeId === g),
      })
    }
    const ko = turnier.matches.filter((m) => m.phase === 'ko')
    if (ko.length) abschnitte.push({ titel: 'K.o.-Phase', matches: ko })
  } else {
    const runden = [...new Set(turnier.matches.map((m) => m.runde ?? 1))].sort((a, b) => a - b)
    for (const r of runden) {
      abschnitte.push({ titel: `Runde ${r}`, matches: turnier.matches.filter((m) => (m.runde ?? 1) === r) })
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief">
          Drucken
        </button>
        <Link to={`/turniere/${turnier.id}`} className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zurück zum Turnier
        </Link>
      </div>

      <div className="mt-6 bg-white p-6 text-black print:mt-0 print:p-0">
        <header className="border-b-4 border-double border-black pb-3">
          <h1 className="text-2xl font-bold">{turnier.name}</h1>
          <p className="mt-1 text-sm">
            {new Date(turnier.datum).toLocaleDateString('de-DE')} · {turnier.teilnehmer.length}{' '}
            Teilnehmer · {turnier.felderAnzahl} Felder
          </p>
        </header>

        {/* Teilnehmer */}
        <section className="mt-4">
          <h2 className="text-base font-bold">Teilnehmer</h2>
          <p className="mt-1 text-sm leading-relaxed">
            {turnier.teilnehmer
              .map((t) => `${t.name}${t.setzplatz ? ` [${t.setzplatz}]` : ''}`)
              .join(' · ')}
          </p>
        </section>

        {/* Spielplan */}
        {abschnitte.map((a) => (
          <section key={a.titel} className="mt-4">
            <h2 className="border-b-2 border-black pb-1 text-base font-bold">{a.titel}</h2>
            <table className="mt-1 w-full text-sm">
              <tbody>
                {a.matches.map((m) => (
                  <tr key={m.id} className="border-b border-neutral-300">
                    <td className="py-1 pr-2">
                      {name(m.teilnehmerAId)} – {name(m.teilnehmerBId)}
                    </td>
                    <td className="py-1 pr-2 text-right tabular-nums">
                      {m.saetze.map((s) => `${s.a}:${s.b}`).join('  ')}
                    </td>
                    <td className="w-24 py-1 text-right text-xs text-neutral-600">
                      {m.status === 'beendet' ? `Sieg ${name(m.siegerId)}` : '________'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        {/* Tabellen */}
        {turnier.format === 'jeder_gegen_jeden' && (
          <DruckTabelle
            titel="Tabelle"
            zeilen={berechneTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise).map(
              (z) => [String(z.platz), name(z.teilnehmerId), `${z.siege}–${z.niederlagen}`, `${z.saetzeFuer}:${z.saetzeGegen}`, `${z.punkteFuer}:${z.punkteGegen}`],
            )}
            spalten={['Pl.', 'Name', 'S–N', 'Sätze', 'Punkte']}
          />
        )}
        {turnier.format === 'schweizer' && (
          <DruckTabelle
            titel="Endwertung"
            zeilen={schweizerTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise).map(
              (z) => [String(z.platz), name(z.teilnehmerId), String(z.punkte), String(z.buchholz), String(z.satzDifferenz), String(z.ballDifferenz)],
            )}
            spalten={['Pl.', 'Name', 'Punkte', 'BH', 'Satzdiff.', 'Balldiff.']}
          />
        )}
        {turnier.format === 'gruppen_ko' &&
          [...gruppenAusMatches(turnier.matches).entries()].sort().map(([g, ids]) => (
            <DruckTabelle
              key={g}
              titel={`Tabelle Gruppe ${g}`}
              zeilen={berechneTabelle(
                [...ids],
                turnier.matches.filter((m) => m.phase === 'gruppe' && m.gruppeId === g),
                turnier.zaehlweise,
              ).map((z) => [String(z.platz), name(z.teilnehmerId), `${z.siege}–${z.niederlagen}`, `${z.saetzeFuer}:${z.saetzeGegen}`, `${z.punkteFuer}:${z.punkteGegen}`])}
              spalten={['Pl.', 'Name', 'S–N', 'Sätze', 'Punkte']}
            />
          ))}

        <footer className="mt-4 text-xs text-neutral-600">Erstellt mit dem Badminton-Planer.</footer>
      </div>
    </div>
  )
}

function DruckTabelle({ titel, spalten, zeilen }: { titel: string; spalten: string[]; zeilen: string[][] }) {
  return (
    <section className="mt-4">
      <h2 className="border-b-2 border-black pb-1 text-base font-bold">{titel}</h2>
      <table className="mt-1 w-full text-sm tabular-nums">
        <thead>
          <tr className="text-left text-xs text-neutral-600">
            {spalten.map((s) => (
              <th key={s} className="py-1 pr-3">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z, i) => (
            <tr key={i} className="border-b border-neutral-300">
              {z.map((wert, j) => (
                <td key={j} className={`py-1 pr-3 ${j === 1 ? 'font-semibold' : ''}`}>{wert}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
