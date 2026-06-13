import { Link, useParams } from 'react-router-dom'
import type { Uebung } from '../datenmodell'
import { alleUebungen } from '../data/uebungen'
import { alleEinheitenMitVorlagen } from '../data/programme'
import { SKILL_NAMEN } from '../data/skills'
import { useAppStore } from '../store'
import SkizzenAnsicht from '../components/training/SkizzenAnsicht'

/**
 * Stationskarten (A5 quer, s/w): eine Karte pro Übung — für den Stationsbetrieb
 * in der Halle. Erreichbar je Übung (/uebungen/:id/karte) oder für eine ganze
 * Einheit (/einheiten/:id/karten). Mit Court-Skizze, falls vorhanden.
 */
export default function StationsKarten() {
  const { uebungId, einheitId } = useParams()
  const eigene = useAppStore((s) => s.eigeneUebungen)
  const einheiten = useAppStore((s) => s.einheiten)

  const bibliothek = alleUebungen(eigene)
  let uebungen: { uebung: Uebung; dauerMin?: number; station: number }[] = []
  let titel = ''
  let zurueck = '/uebungen'

  if (uebungId) {
    const uebung = bibliothek.find((u) => u.id === uebungId)
    if (uebung) {
      uebungen = [{ uebung, station: 1 }]
      titel = uebung.name
      zurueck = `/uebungen/${uebungId}`
    }
  } else if (einheitId) {
    const einheit = alleEinheitenMitVorlagen(einheiten).find((e) => e.id === einheitId)
    if (einheit) {
      uebungen = einheit.bloecke
        .map((block, i) => ({
          uebung: bibliothek.find((u) => u.id === block.uebungId),
          dauerMin: block.dauerMin,
          station: i + 1,
        }))
        .filter((e): e is { uebung: Uebung; dauerMin: number; station: number } => e.uebung !== undefined)
      titel = einheit.name
      zurueck = `/einheiten/${einheitId}`
    }
  }

  if (uebungen.length === 0) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Nichts zu drucken</h1>
        <Link to="/uebungen" className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zur Bibliothek
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* A5 quer nur für diese Seite */}
      <style>{'@media print { @page { size: A5 landscape; margin: 10mm } }'}</style>

      <div className="flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief">
          Drucken ({uebungen.length} {uebungen.length === 1 ? 'Karte' : 'Karten'}, A5 quer)
        </button>
        <Link to={zurueck} className="inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zurück
        </Link>
      </div>
      <p className="mt-2 text-xs text-tinte/60 print:hidden">
        Tipp: Im Druckdialog A5 bzw. „2 Seiten pro Blatt" auf A4 wählen. {titel && `— ${titel}`}
      </p>

      <div className="mt-6 space-y-6 print:mt-0 print:space-y-0">
        {uebungen.map(({ uebung, dauerMin, station }) => (
          <article
            key={`${station}-${uebung.id}`}
            className="break-after-page border-4 border-double border-black bg-white p-5 text-black"
          >
            <header className="flex items-start justify-between gap-3 border-b-2 border-black pb-2">
              <div>
                {uebungen.length > 1 && (
                  <p className="text-sm font-bold uppercase tracking-wide">Station {station}</p>
                )}
                <h2 className="text-2xl font-bold leading-tight">{uebung.name}</h2>
              </div>
              <p className="shrink-0 border-2 border-black px-2 py-1 text-center text-sm font-bold tabular-nums">
                {dauerMin ?? uebung.dauerMin} Min
              </p>
            </header>

            <p className="mt-2 text-sm">{uebung.kurzbeschreibung}</p>

            <div className={uebung.skizze ? 'mt-2 grid grid-cols-[3fr_2fr] items-start gap-4' : 'mt-2'}>
              <ol className="list-inside list-decimal space-y-1 text-sm font-semibold">
                {uebung.durchfuehrung.map((schritt, i) => (
                  <li key={i} className="font-normal">
                    <span className="font-semibold">{schritt}</span>
                  </li>
                ))}
              </ol>
              {uebung.skizze && (
                <div className="rounded border border-neutral-400 p-1.5">
                  <SkizzenAnsicht skizze={uebung.skizze} name={uebung.name} />
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-black pt-2 text-xs">
              <p>
                <span className="font-bold">Personen:</span>{' '}
                {uebung.personen === 'allein' ? 'allein' : uebung.personen === 'paar' ? 'zu zweit' : 'Gruppe'}
              </p>
              <p>
                <span className="font-bold">Material:</span>{' '}
                {uebung.material.length > 0 ? uebung.material.join(', ') : 'Schläger & Shuttle'}
              </p>
              <p className="col-span-2">
                <span className="font-bold">Trainiert:</span>{' '}
                {uebung.skills.map((s) => SKILL_NAMEN[s]).join(', ')}
              </p>
              {uebung.variationen && uebung.variationen.length > 0 && (
                <p className="col-span-2">
                  <span className="font-bold">Leichter/Schwerer:</span> {uebung.variationen.join(' · ')}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
