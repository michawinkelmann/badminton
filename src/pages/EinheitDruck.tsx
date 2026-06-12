import { Link, useParams } from 'react-router-dom'
import { findeUebung } from '../data/uebungen'
import { SKILL_NAMEN } from '../data/skills'
import { einheitGesamtdauer } from '../utils/vorschlag'
import { useAppStore } from '../store'
import { findeEinheitMitVorlagen } from '../data/programme'

/**
 * Druckansicht einer Einheit (§5): nüchtern, s/w-tauglich, möglichst eine A4-Seite.
 * Tabelle: Block / Übung / Dauer / Hinweise.
 */
export default function EinheitDruck() {
  const { einheitId } = useParams()
  const einheiten = useAppStore((s) => s.einheiten)
  const eigeneUebungen = useAppStore((s) => s.eigeneUebungen)
  const einheit =
    einheiten.find((e) => e.id === einheitId) ??
    (einheitId ? findeEinheitMitVorlagen(einheitId, []) : undefined)

  if (!einheit) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Einheit nicht gefunden</h1>
        <Link to="/einheiten" className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zur Übersicht
        </Link>
      </div>
    )
  }

  const gesamt = einheitGesamtdauer(einheit.bloecke)
  const material = new Set<string>()
  for (const b of einheit.bloecke) {
    for (const m of findeUebung(b.uebungId, eigeneUebungen)?.material ?? []) material.add(m)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Drucken
        </button>
        <Link
          to={`/einheiten/${einheit.id}`}
          className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
        >
          Zurück zum Builder
        </Link>
      </div>

      <div className="mt-6 bg-white p-6 text-black shadow-sm print:mt-0 print:p-0 print:shadow-none">
        <header className="border-b-4 border-double border-black pb-3">
          <h1 className="text-2xl font-bold">{einheit.name}</h1>
          <p className="mt-1 text-sm">
            Gesamtdauer: {gesamt} Minuten · Schwerpunkte:{' '}
            {einheit.zielSkills.map((s) => SKILL_NAMEN[s]).join(', ') || '—'}
          </p>
          <p className="mt-1 text-sm">
            Datum: ______________ · Gruppe/Spieler: ____________________________
          </p>
          {material.size > 0 && (
            <p className="mt-1 text-sm">Material: {[...material].join(', ')}</p>
          )}
        </header>

        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="w-12 py-1.5 pr-2">Block</th>
              <th className="py-1.5 pr-2">Übung</th>
              <th className="w-16 py-1.5 pr-2">Dauer</th>
              <th className="w-2/5 py-1.5">Hinweise</th>
            </tr>
          </thead>
          <tbody>
            {einheit.bloecke.map((b, i) => {
              const u = findeUebung(b.uebungId, eigeneUebungen)
              return (
                <tr key={i} className="border-b border-neutral-400 align-top">
                  <td className="py-2 pr-2 font-bold">{i + 1}</td>
                  <td className="py-2 pr-2">
                    <span className="font-semibold">{u?.name ?? '(Übung fehlt)'}</span>
                    {u && (
                      <span className="block text-xs text-neutral-700">
                        {u.kurzbeschreibung}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-2">{b.dauerMin} Min</td>
                  <td className="py-2 text-xs leading-relaxed">
                    {b.notiz ?? (u?.fehlerbilder?.[0] ? `Achte auf: ${u.fehlerbilder[0]}` : '')}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="py-2 font-bold">
                Gesamt
              </td>
              <td className="py-2 font-bold">{gesamt} Min</td>
              <td />
            </tr>
          </tfoot>
        </table>

        <footer className="mt-4 text-xs text-neutral-600">
          Erstellt mit dem Badminton-Planer.
        </footer>
      </div>
    </div>
  )
}
