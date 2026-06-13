import { Link, useParams } from 'react-router-dom'
import { useAppStore } from '../store'

/**
 * Schiedsrichterzettel (s/w): ein Aufschreibezettel pro offenem Spiel,
 * zwei pro A4-Seite — Punktekästchen je Satz, Gewinner-Zeile, Unterschrift.
 */
export default function TurnierZettel() {
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

  const name = (id?: string) => (id ? (turnier.teilnehmer.find((t) => t.id === id)?.name ?? '?') : '________________')
  const offene = turnier.matches.filter(
    (m) => m.status !== 'beendet' && m.teilnehmerAId && m.teilnehmerBId,
  )
  const maxSaetze = turnier.zaehlweise.modus === 'zeit' ? 1 : turnier.zaehlweise.saetzeZumSieg * 2 - 1

  return (
    <div className="mx-auto max-w-3xl">
      <style>{'@media print { @page { size: A4 portrait; margin: 10mm } }'}</style>

      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          disabled={offene.length === 0}
          className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief disabled:opacity-40"
        >
          Zettel drucken ({offene.length} offene Spiele)
        </button>
        <Link to={`/turniere/${turnier.id}`} className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zurück zum Turnier
        </Link>
      </div>

      {offene.length === 0 ? (
        <p className="mt-6 max-w-xl rounded-xl border-2 border-kork/40 bg-linie p-5 text-sm text-tinte/70">
          Keine offenen Spiele mit feststehenden Paarungen — Zettel gibt es, sobald
          der Spielplan steht oder die nächste Runde ausgelost ist.
        </p>
      ) : (
        <div className="mt-6 bg-white p-4 text-black print:mt-0 print:p-0">
          {offene.map((m, i) => (
            <section
              key={m.id}
              className={`border-2 border-black p-4 ${i % 2 === 1 ? 'break-after-page' : ''} ${i > 0 && i % 2 === 0 ? 'mt-6' : i > 0 ? 'mt-6 print:mt-8' : ''}`}
            >
              <header className="flex items-baseline justify-between gap-2 border-b-2 border-black pb-1.5">
                <p className="text-sm font-bold">{turnier.name}</p>
                <p className="text-xs">
                  {m.runde !== undefined && `Runde ${m.runde}`}
                  {m.gruppeId && ` · Gruppe ${m.gruppeId}`}
                  {m.feld !== undefined && ` · Feld ${m.feld}`}
                  {m.feld === undefined && ' · Feld ____'}
                </p>
              </header>

              <table className="mt-2 w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-neutral-600">
                    <th className="w-1/2 py-1 font-normal">Name</th>
                    {Array.from({ length: maxSaetze }, (_, satz) => (
                      <th key={satz} className="py-1 text-center font-normal">Satz {satz + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['a', 'b'] as const).map((seite) => (
                    <tr key={seite}>
                      <td className="border-t border-black py-2 pr-2 font-bold">
                        {name(seite === 'a' ? m.teilnehmerAId : m.teilnehmerBId)}
                      </td>
                      {Array.from({ length: maxSaetze }, (_, satz) => (
                        <td key={satz} className="border-t border-black px-1 py-2">
                          <div className="mx-auto h-9 w-14 border-2 border-black" aria-hidden="true" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-3 grid grid-cols-2 gap-6 text-xs">
                <p className="border-t border-black pt-1">Gewinner</p>
                <p className="border-t border-black pt-1">Zähler/Schiedsrichter</p>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
