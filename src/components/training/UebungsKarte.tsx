import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Uebung } from '../../datenmodell'
import { KATEGORIE_NAMEN, NIVEAU_NAMEN, PERSONEN_NAMEN, SKILL_NAMEN } from '../../data/skills'
import SkizzenAnsicht from './SkizzenAnsicht'

interface Props {
  uebung: Uebung
  istEigene?: boolean
}

export default function UebungsKarte({ uebung, istEigene = false }: Props) {
  const [offen, setOffen] = useState(false)
  const hatDetails = !!(uebung.skizze || (uebung.beschreibung && uebung.beschreibung.length > 0))

  return (
    <div className="flex flex-col rounded-xl border-2 border-court/25 bg-linie transition-colors hover:border-court focus-within:border-court">
      <Link to={`/uebungen/${uebung.id}`} className="flex flex-1 flex-col p-4 pb-0">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded bg-court px-2 py-0.5 text-xs font-semibold text-linie">
            {KATEGORIE_NAMEN[uebung.kategorie]}
          </span>
          {istEigene && (
            <span className="rounded bg-kork px-2 py-0.5 text-xs font-semibold text-linie">
              Eigene
            </span>
          )}
        </div>

        <h3 className="mt-2 font-bold leading-snug">{uebung.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-tinte/70">{uebung.kurzbeschreibung}</p>

        <div className="mt-3 flex flex-wrap gap-1">
          {uebung.skills.map((s) => (
            <span key={s} className="rounded-full border border-court/40 px-2 py-0.5 text-xs text-court">
              {SKILL_NAMEN[s]}
            </span>
          ))}
        </div>

        <div className="ziffern mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-boden pt-2 text-xs text-tinte/65">
          <span>~{uebung.dauerMin} Min</span>
          <span>{PERSONEN_NAMEN[uebung.personen]}</span>
          <span>{uebung.niveau.map((n) => NIVEAU_NAMEN[n]).join(' · ')}</span>
          {uebung.animationId && <span className="text-kork">▶ Animation</span>}
        </div>
      </Link>

      {/* Ausklappbare Details: Skizze + ausführliche Beschreibung */}
      {hatDetails ? (
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => setOffen((o) => !o)}
            aria-expanded={offen}
            aria-label={`${uebung.name}: ${offen ? 'Details verbergen' : 'Skizze & Beschreibung zeigen'}`}
            className="mt-1 flex min-h-9 w-full items-center gap-1.5 text-xs font-semibold text-court hover:text-court-tief"
          >
            <span aria-hidden="true" className={`transition-transform ${offen ? 'rotate-90' : ''}`}>
              ▸
            </span>
            {offen ? 'Details verbergen' : 'Skizze & Beschreibung'}
          </button>
          {offen && (
            <div className="mt-2 space-y-2 border-t border-boden pt-2">
              {uebung.skizze && (
                <div className="rounded-lg bg-boden/60 p-2">
                  <SkizzenAnsicht skizze={uebung.skizze} name={uebung.name} />
                </div>
              )}
              {uebung.beschreibung?.map((absatz, i) => (
                <p key={i} className="text-sm leading-relaxed text-tinte/85">
                  {absatz}
                </p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="pb-3" />
      )}
    </div>
  )
}
