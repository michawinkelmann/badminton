import { useMemo, useState } from 'react'
import type { Match, SatzErgebnis, Turnier } from '../../datenmodell'
import { korrekturBetroffene, pruefeSaetze } from '../../engine/turnier'
import { useAppStore } from '../../store'

interface Props {
  turnier: Turnier
  match: Match
  name: (id?: string) => string
  onClose: () => void
}

/** Große, touch-freundliche Satz-Eingabe mit ±-Buttons und Korrektur-Bestätigung (§9.3). */
export default function ErgebnisDialog({ turnier, match, name, onClose }: Props) {
  const ergebnisEintragen = useAppStore((s) => s.ergebnisEintragen)
  const zwischenstandSpeichern = useAppStore((s) => s.zwischenstandSpeichern)

  const [saetze, setSaetze] = useState<SatzErgebnis[]>(() =>
    match.saetze.length > 0 ? match.saetze.map((s) => ({ ...s })) : [{ a: 0, b: 0 }],
  )
  const [fehler, setFehler] = useState<string>()
  const [bestaetigung, setBestaetigung] = useState(false)

  const auswertung = useMemo(() => pruefeSaetze(saetze, turnier.zaehlweise), [saetze, turnier.zaehlweise])
  const betroffene = useMemo(
    () => (match.status === 'beendet' ? korrekturBetroffene(turnier, match.id) : []),
    [turnier, match],
  )
  const maxSaetze = turnier.zaehlweise.modus === 'zeit' ? 1 : turnier.zaehlweise.saetzeZumSieg * 2 - 1

  function plus(index: number, seite: 'a' | 'b', delta: number) {
    setFehler(undefined)
    setSaetze((alte) =>
      alte.map((s, i) =>
        i === index ? { ...s, [seite]: Math.max(0, s[seite] + delta) } : s,
      ),
    )
  }

  function speichern(verwerfen = false) {
    try {
      ergebnisEintragen(turnier.id, match.id, saetze, verwerfen)
      onClose()
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Unbekannter Fehler.'
      if (text.includes('Korrektur')) setBestaetigung(true)
      else setFehler(text)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinte/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ergebnis eintragen"
    >
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl border-2 border-court bg-linie p-5">
        <h2 className="schrift-display doppellinie text-lg">
          {match.feld !== undefined ? `Feld ${match.feld} · ` : ''}Ergebnis eintragen
        </h2>
        <p className="mt-4 text-sm font-bold">
          {name(match.teilnehmerAId)} <span className="font-normal text-tinte/50">gegen</span>{' '}
          {name(match.teilnehmerBId)}
        </p>

        {/* Sätze */}
        <div className="mt-4 space-y-3">
          {saetze.map((satz, i) => (
            <div key={i} className="rounded-lg bg-boden p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-semibold text-tinte/60">
                  {turnier.zaehlweise.modus === 'zeit' ? 'Punkte bei Zeitende' : `Satz ${i + 1}`}
                </p>
                {saetze.length > 1 && i === saetze.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setSaetze((alte) => alte.slice(0, -1))}
                    className="min-h-9 rounded px-2 text-xs font-semibold text-red-800 hover:bg-red-50"
                  >
                    Satz entfernen
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['a', 'b'] as const).map((seite) => (
                  <div key={seite} className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => plus(i, seite, -1)}
                      aria-label={`${name(seite === 'a' ? match.teilnehmerAId : match.teilnehmerBId)}: Punkt weniger`}
                      className="ziffern h-12 w-12 rounded-lg border-2 border-court/40 text-xl font-bold text-court active:bg-boden"
                    >
                      −
                    </button>
                    <span className="ziffern w-14 text-center text-3xl font-bold">
                      {satz[seite]}
                    </span>
                    <button
                      type="button"
                      onClick={() => plus(i, seite, 1)}
                      aria-label={`${name(seite === 'a' ? match.teilnehmerAId : match.teilnehmerBId)}: Punkt mehr`}
                      className="ziffern h-12 w-12 rounded-lg bg-court text-xl font-bold text-linie active:bg-court-tief"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-2 gap-3 text-center text-xs text-tinte/55">
                <span className="truncate">{name(match.teilnehmerAId)}</span>
                <span className="truncate">{name(match.teilnehmerBId)}</span>
              </div>
            </div>
          ))}
        </div>

        {saetze.length < maxSaetze && !auswertung.fertig && (
          <button
            type="button"
            onClick={() => setSaetze((alte) => [...alte, { a: 0, b: 0 }])}
            className="mt-3 min-h-11 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-boden"
          >
            Satz hinzufügen
          </button>
        )}

        {/* Live-Validierung */}
        <p className="mt-3 text-sm" role="status">
          {auswertung.fertig ? (
            <span className="font-semibold text-court">
              Sieg: {name(auswertung.siegerSeite === 'a' ? match.teilnehmerAId : match.teilnehmerBId)} (
              {auswertung.saetzeA}:{auswertung.saetzeB} Sätze)
            </span>
          ) : (
            <span className="text-tinte/60">
              {auswertung.gueltig
                ? 'Noch nicht entschieden — Sätze vervollständigen.'
                : auswertung.fehler}
            </span>
          )}
        </p>
        {fehler && (
          <p role="alert" className="mt-2 rounded-md border-2 border-red-700 bg-red-50 p-2.5 text-sm text-red-800">
            {fehler}
          </p>
        )}

        {/* Korrektur-Bestätigung (§9.3: Folge-Ergebnisse verwerfen) */}
        {bestaetigung && (
          <div className="mt-3 rounded-md border-2 border-kork bg-kork/10 p-3 text-sm">
            <p className="font-semibold">Diese Korrektur verwirft Folge-Ergebnisse:</p>
            <ul className="mt-1 list-inside list-disc text-tinte/80">
              {betroffene.map((m) => (
                <li key={m.id}>
                  {name(m.teilnehmerAId)} – {name(m.teilnehmerBId)}
                  {m.saetze.length > 0 && ` (${m.saetze.map((s) => `${s.a}:${s.b}`).join(', ')})`}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => speichern(true)}
              className="mt-3 min-h-11 rounded-md bg-red-700 px-4 text-sm font-semibold text-linie hover:bg-red-800"
            >
              Korrigieren & Folge-Ergebnisse verwerfen
            </button>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3 border-t-2 border-boden pt-4">
          <button
            type="button"
            disabled={!auswertung.fertig}
            onClick={() => speichern(false)}
            className="min-h-12 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief disabled:cursor-not-allowed disabled:opacity-40"
          >
            Ergebnis speichern
          </button>
          {match.status !== 'beendet' && (
            <button
              type="button"
              onClick={() => {
                zwischenstandSpeichern(turnier.id, match.id, saetze)
                onClose()
              }}
              className="min-h-12 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-boden"
            >
              Zwischenstand speichern
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-md px-4 text-sm font-semibold text-tinte/70 hover:text-tinte"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}
