import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Uebung } from '../datenmodell'
import { findeUebung } from '../data/uebungen'
import { SKILL_NAMEN } from '../data/skills'
import { einheitGesamtdauer } from '../utils/vorschlag'
import { useAppStore } from '../store'
import { findeEinheitMitVorlagen } from '../data/programme'
import SkizzenAnsicht from '../components/training/SkizzenAnsicht'

/**
 * Druckansicht einer Einheit (§5): nüchtern, s/w-tauglich, möglichst eine A4-Seite.
 * Tabelle: Block / Übung / Dauer / Hinweise. Optional zuschaltbar: ein Anhang
 * pro Übung mit ausführlicher Beschreibung, Durchführung und Skizze.
 */
export default function EinheitDruck() {
  const { einheitId } = useParams()
  const einheiten = useAppStore((s) => s.einheiten)
  const eigeneUebungen = useAppStore((s) => s.eigeneUebungen)
  const [ausfuehrlich, setAusfuehrlich] = useState(false)
  const [mitSkizzen, setMitSkizzen] = useState(true)

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

  // Anhang: jede Übung nur einmal, in Reihenfolge des ersten Auftretens
  const anhangUebungen: Uebung[] = []
  if (ausfuehrlich) {
    const gesehen = new Set<string>()
    for (const b of einheit.bloecke) {
      if (gesehen.has(b.uebungId)) continue
      gesehen.add(b.uebungId)
      const u = findeUebung(b.uebungId, eigeneUebungen)
      if (u) anhangUebungen.push(u)
    }
  }

  return (
    <div className="mx-auto max-w-3xl print:max-w-none">
      <style>{'@media print { @page { size: A4 portrait; margin: 16mm 18mm } }'}</style>

      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Drucken
        </button>
        <Link
          to={`/einheiten/${einheit.id}/karten`}
          className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
        >
          Stationskarten (A5)
        </Link>
        <Link
          to={`/einheiten/${einheit.id}`}
          className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
        >
          Zurück zum Builder
        </Link>
      </div>

      {/* Druckoptionen */}
      <fieldset className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg border-2 border-court/25 bg-linie p-3 print:hidden">
        <legend className="px-1 text-xs font-semibold text-tinte/70">Druckoptionen</legend>
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={ausfuehrlich}
            onChange={(e) => setAusfuehrlich(e.target.checked)}
            className="h-5 w-5 accent-court"
          />
          Ausführliche Beschreibungen anhängen
        </label>
        <label className={`flex min-h-11 items-center gap-2 text-sm font-semibold ${ausfuehrlich ? '' : 'opacity-40'}`}>
          <input
            type="checkbox"
            checked={mitSkizzen}
            disabled={!ausfuehrlich}
            onChange={(e) => setMitSkizzen(e.target.checked)}
            className="h-5 w-5 accent-court"
          />
          mit Skizzen
        </label>
        <p className="basis-full text-xs text-tinte/60">
          Seite 1 bleibt die kompakte Übersicht; der Anhang ergänzt pro Übung Beschreibung,
          Durchführung{mitSkizzen ? ', Skizze' : ''} und typische Fehler.
        </p>
      </fieldset>

      <div className={`mt-6 bg-white p-6 text-black shadow-sm print:mt-0 print:p-0 print:shadow-none ${ausfuehrlich ? '' : 'print:flex print:min-h-[255mm] print:flex-col'}`}>
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

        {/* Notizen füllen bei der Einseiten-Übersicht den Rest der A4-Seite (statt leerer Fläche) */}
        {!ausfuehrlich && (
          <div className="mt-4 hidden border-t border-neutral-400 pt-2 print:block print:flex-1">
            <p className="text-sm font-bold">Notizen</p>
          </div>
        )}

        {/* Anhang: ausführliche Übungsbeschreibungen (per Checkbox zuschaltbar) */}
        {anhangUebungen.length > 0 && (
          <div className="mt-8 break-before-page print:mt-0">
            <h2 className="border-b-2 border-black pb-1 text-lg font-bold">
              Anhang: Übungen im Detail
            </h2>
            {anhangUebungen.map((u, i) => (
              <section
                key={u.id}
                className={`break-inside-avoid border-b border-neutral-400 py-4 ${i === anhangUebungen.length - 1 ? 'border-b-0' : ''}`}
              >
                <h3 className="text-base font-bold">
                  {i + 1}. {u.name}
                </h3>
                {mitSkizzen && u.skizze && (
                  <div className="mx-auto mt-2 max-w-md">
                    <SkizzenAnsicht skizze={u.skizze} name={u.name} />
                  </div>
                )}
                {u.beschreibung?.map((absatz, j) => (
                  <p key={j} className="mt-2 text-sm leading-relaxed">
                    {absatz}
                  </p>
                ))}
                <p className="mt-2 text-sm font-bold">Durchführung:</p>
                <ol className="mt-1 list-inside list-decimal space-y-0.5 text-sm">
                  {u.durchfuehrung.map((schritt, j) => (
                    <li key={j}>{schritt}</li>
                  ))}
                </ol>
                {u.fehlerbilder && u.fehlerbilder.length > 0 && (
                  <>
                    <p className="mt-2 text-sm font-bold">Achte auf:</p>
                    <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">
                      {u.fehlerbilder.map((f, j) => (
                        <li key={j}>{f}</li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            ))}
          </div>
        )}

        <footer className="mt-4 text-xs text-neutral-600">
          Erstellt mit dem Badminton-Planer.
        </footer>
      </div>
    </div>
  )
}
