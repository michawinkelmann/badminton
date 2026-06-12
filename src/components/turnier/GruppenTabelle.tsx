import type { TabellenZeile } from '../../engine/turnier'
import type { SchweizerZeile } from '../../engine/turnier'

interface Props {
  zeilen: TabellenZeile[]
  name: (id: string) => string
  titel?: string
}

/** Live-Tabelle für Round Robin / Gruppenphase mit allen Tiebreaker-Spalten (§9.2). */
export default function GruppenTabelle({ zeilen, name, titel }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-court/25 bg-linie">
      {titel && (
        <p className="schrift-display border-b-2 border-boden px-3 pt-2.5 pb-2 text-sm text-court">
          {titel}
        </p>
      )}
      <table className="ziffern w-full text-sm">
        <thead>
          <tr className="border-b-2 border-court/20 text-left text-xs text-tinte/60">
            <th className="px-3 py-2">Pl.</th>
            <th className="py-2 pr-2">Name</th>
            <th className="py-2 pr-2 text-center">Sp.</th>
            <th className="py-2 pr-2 text-center">S</th>
            <th className="py-2 pr-2 text-center">N</th>
            <th className="py-2 pr-2 text-center">Sätze</th>
            <th className="py-2 pr-3 text-center">Punkte</th>
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z) => (
            <tr key={z.teilnehmerId} className="border-b border-boden last:border-0">
              <td className="schrift-display px-3 py-2 text-court">{z.platz}</td>
              <td className="py-2 pr-2 font-semibold">
                {name(z.teilnehmerId)}
                {z.losNoetig && (
                  <span className="ml-2 rounded bg-kork/15 px-1.5 py-0.5 text-xs font-bold text-kork">
                    Los nötig
                  </span>
                )}
              </td>
              <td className="py-2 pr-2 text-center">{z.spiele}</td>
              <td className="py-2 pr-2 text-center font-bold">{z.siege}</td>
              <td className="py-2 pr-2 text-center">{z.niederlagen}</td>
              <td className="py-2 pr-2 text-center">
                {z.saetzeFuer}:{z.saetzeGegen}
              </td>
              <td className="py-2 pr-3 text-center">
                {z.punkteFuer}:{z.punkteGegen}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Schweizer Endwertung: Punkte → Buchholz → Satzdifferenz → Ballpunktdifferenz. */
export function SchweizerTabelleAnsicht({
  zeilen,
  name,
}: {
  zeilen: SchweizerZeile[]
  name: (id: string) => string
}) {
  const diff = (n: number) => (n > 0 ? `+${n}` : `${n}`)
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-court/25 bg-linie">
      <table className="ziffern w-full text-sm">
        <thead>
          <tr className="border-b-2 border-court/20 text-left text-xs text-tinte/60">
            <th className="px-3 py-2">Pl.</th>
            <th className="py-2 pr-2">Name</th>
            <th className="py-2 pr-2 text-center">Punkte</th>
            <th className="py-2 pr-2 text-center">Buchholz</th>
            <th className="py-2 pr-2 text-center">Satzdiff.</th>
            <th className="py-2 pr-3 text-center">Balldiff.</th>
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z) => (
            <tr key={z.teilnehmerId} className="border-b border-boden last:border-0">
              <td className="schrift-display px-3 py-2 text-court">{z.platz}</td>
              <td className="py-2 pr-2 font-semibold">{name(z.teilnehmerId)}</td>
              <td className="py-2 pr-2 text-center font-bold">{z.punkte}</td>
              <td className="py-2 pr-2 text-center">{z.buchholz}</td>
              <td className="py-2 pr-2 text-center">{diff(z.satzDifferenz)}</td>
              <td className="py-2 pr-3 text-center">{diff(z.ballDifferenz)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
