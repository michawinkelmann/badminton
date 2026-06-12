import { Link } from 'react-router-dom'
import type { Uebung } from '../../datenmodell'
import { KATEGORIE_NAMEN, NIVEAU_NAMEN, PERSONEN_NAMEN, SKILL_NAMEN } from '../../data/skills'

interface Props {
  uebung: Uebung
  istEigene?: boolean
}

export default function UebungsKarte({ uebung, istEigene = false }: Props) {
  return (
    <Link
      to={`/uebungen/${uebung.id}`}
      className="flex flex-col rounded-xl border-2 border-court/25 bg-linie p-4 transition-colors hover:border-court focus-visible:border-court"
    >
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
  )
}
