import { useState } from 'react'
import type { SkillId } from '../../datenmodell'
import { ALLE_SKILLS, SKILL_NAMEN } from '../../data/skills'

interface Props {
  startWerte: Partial<Record<SkillId, number>>
  onSpeichern: (werte: Record<SkillId, number>) => void
}

/** Schnelle Slider-Maske über alle Skills, ein Speichern-Klick (§7). */
export default function EinschaetzungsMaske({ startWerte, onSpeichern }: Props) {
  const [werte, setWerte] = useState<Record<SkillId, number>>(
    () =>
      Object.fromEntries(
        ALLE_SKILLS.map((s) => [s, startWerte[s] ?? 5]),
      ) as Record<SkillId, number>,
  )
  const [gespeichert, setGespeichert] = useState(false)

  return (
    <div>
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {ALLE_SKILLS.map((s) => (
          <label key={s} className="flex items-center gap-3 text-sm">
            <span className="w-28 shrink-0 font-semibold text-tinte/80">{SKILL_NAMEN[s]}</span>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={werte[s]}
              onChange={(e) => {
                setGespeichert(false)
                setWerte((w) => ({ ...w, [s]: Number(e.target.value) }))
              }}
              className="min-h-11 flex-1 accent-court"
            />
            <span className="ziffern w-7 text-right font-bold">{werte[s]}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            onSpeichern(werte)
            setGespeichert(true)
          }}
          className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Einschätzung speichern
        </button>
        {gespeichert && (
          <span role="status" className="text-sm font-semibold text-court">
            Gespeichert — taucht ab jetzt im Radar auf.
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-tinte/60">
        1 = noch ganz am Anfang · 10 = Wettkampfniveau. Einschätzungen werden historisiert —
        ältere Stände bleiben für den Vergleich erhalten.
      </p>
    </div>
  )
}
