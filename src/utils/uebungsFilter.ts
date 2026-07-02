/**
 * Filterlogik der Übungsbibliothek (§4) — reine Funktionen, UI-frei.
 * Alle gesetzten Kriterien werden UND-verknüpft.
 */
import type { Kategorie, Profil, SkillId, Uebung } from '../datenmodell'

export interface UebungsFilter {
  kategorie?: Kategorie
  skill?: SkillId
  niveau?: Profil['niveau']
  personen?: Uebung['personen']
  material?: string
  maxDauer?: number
  suche?: string
}

function normalisiere(text: string): string {
  return text.toLowerCase()
}

/** Volltextsuche über Name, Beschreibung, Durchführung, Variationen, Fehlerbilder, Material. */
export function trifftSuche(uebung: Uebung, suche: string): boolean {
  const begriff = normalisiere(suche.trim())
  if (!begriff) return true
  const heuhaufen = [
    uebung.name,
    uebung.kurzbeschreibung,
    ...(uebung.beschreibung ?? []),
    ...uebung.durchfuehrung,
    ...(uebung.variationen ?? []),
    ...(uebung.fehlerbilder ?? []),
    ...uebung.material,
  ]
  return heuhaufen.some((t) => normalisiere(t).includes(begriff))
}

export function trifftFilter(uebung: Uebung, filter: UebungsFilter): boolean {
  if (filter.kategorie && uebung.kategorie !== filter.kategorie) return false
  if (filter.skill && !uebung.skills.includes(filter.skill)) return false
  if (filter.niveau && !uebung.niveau.includes(filter.niveau)) return false
  if (filter.personen && uebung.personen !== filter.personen) return false
  if (filter.material && !uebung.material.includes(filter.material)) return false
  if (filter.maxDauer !== undefined && uebung.dauerMin > filter.maxDauer) return false
  if (filter.suche && !trifftSuche(uebung, filter.suche)) return false
  return true
}

export function filtereUebungen(uebungen: Uebung[], filter: UebungsFilter): Uebung[] {
  return uebungen.filter((u) => trifftFilter(u, filter))
}
