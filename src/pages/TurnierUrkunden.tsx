import { Link, useParams } from 'react-router-dom'
import type { Match } from '../datenmodell'
import { berechneTabelle, schweizerTabelle } from '../engine/turnier'
import { useAppStore } from '../store'

const PLATZ_NAMEN: Record<number, string> = { 1: 'den 1. Platz', 2: 'den 2. Platz', 3: 'den 3. Platz', 4: 'den 4. Platz' }

/** Urkunden (A4 hoch, s/w) für die Plätze 1–3 (bzw. 4 mit Spiel um Platz 3). */
export default function TurnierUrkunden() {
  const { turnierId } = useParams()
  const turnier = useAppStore((s) => s.turniere).find((t) => t.id === turnierId)

  if (!turnier || turnier.status !== 'beendet') {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Noch keine Urkunden</h1>
        <p className="mt-5 max-w-xl text-sm text-tinte/70">
          Urkunden gibt es, sobald das Turnier beendet ist.
        </p>
        <Link to={turnier ? `/turniere/${turnier.id}` : '/turniere'} className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zurück zum Turnier
        </Link>
      </div>
    )
  }

  const name = (id?: string) => turnier.teilnehmer.find((t) => t.id === id)?.name ?? '?'
  const plaetze: { platz: number; name: string }[] = []

  if (turnier.format === 'ko' || turnier.format === 'gruppen_ko') {
    const ko = turnier.matches.filter(
      (m) => m.bracketTyp === 'haupt' && (turnier.format === 'ko' || m.phase === 'ko'),
    )
    const finale = ko.reduce<Match | undefined>((b, m) => ((m.runde ?? 0) > (b?.runde ?? 0) ? m : b), undefined)
    if (finale?.siegerId) {
      const zweiter = finale.siegerId === finale.teilnehmerAId ? finale.teilnehmerBId : finale.teilnehmerAId
      plaetze.push({ platz: 1, name: name(finale.siegerId) }, { platz: 2, name: name(zweiter) })
      const p3 = turnier.matches.find((m) => m.bracketTyp === 'platz3' && (turnier.format === 'ko' || m.phase === 'ko'))
      if (p3?.siegerId) {
        const vierter = p3.siegerId === p3.teilnehmerAId ? p3.teilnehmerBId : p3.teilnehmerAId
        plaetze.push({ platz: 3, name: name(p3.siegerId) }, { platz: 4, name: name(vierter) })
      }
    }
  } else {
    const tabelle =
      turnier.format === 'schweizer'
        ? schweizerTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise)
        : berechneTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise)
    for (const z of tabelle.slice(0, 3)) plaetze.push({ platz: z.platz, name: name(z.teilnehmerId) })
  }

  const datum = new Date(turnier.datum).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="mx-auto max-w-2xl">
      <style>{'@media print { @page { size: A4 portrait; margin: 0 } }'}</style>

      <div className="flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief">
          Urkunden drucken ({plaetze.length} Seiten)
        </button>
        <Link to={`/turniere/${turnier.id}`} className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zurück zum Turnier
        </Link>
      </div>

      <div className="mt-6 space-y-8 print:mt-0 print:space-y-0">
        {plaetze.map((p) => (
          <section
            key={p.platz}
            className="break-after-page flex min-h-[27cm] flex-col bg-white p-[1.6cm] text-center text-black print:min-h-screen"
          >
            <div className="flex flex-1 flex-col justify-center border-8 border-double border-black px-8 py-10">
              <p className="text-sm uppercase tracking-[0.4em]">Badminton</p>
              <h2 className="mt-6 text-5xl font-bold uppercase tracking-widest">Urkunde</h2>
              <div className="mx-auto mt-3 h-1.5 w-40 border-y-2 border-black" aria-hidden="true" />

              <p className="mt-12 text-lg">{p.platz === 1 ? 'Der Turniersieg geht an' : 'Hiermit wird ausgezeichnet'}</p>
              <p className="mt-4 text-4xl font-bold">{p.name}</p>
              <p className="mt-10 text-lg leading-relaxed">
                für <span className="font-bold">{PLATZ_NAMEN[p.platz] ?? `Platz ${p.platz}`}</span>
                <br />
                beim Turnier
                <br />
                <span className="mt-2 inline-block text-2xl font-bold">„{turnier.name}"</span>
              </p>
              <p className="mt-8 text-base">{datum}</p>

              <div className="mx-auto mt-16 w-64 border-t-2 border-black pt-2 text-sm">
                Turnierleitung
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
