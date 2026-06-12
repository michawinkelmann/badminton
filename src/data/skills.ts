/**
 * Skill- und Kategorie-Definitionen mit deutschen Anzeigenamen (§4, §13).
 */
import type { Kategorie, Profil, SkillId, Uebung } from '../datenmodell'

export const SKILL_NAMEN: Record<SkillId, string> = {
  clear: 'Clear',
  drop: 'Drop',
  smash: 'Smash',
  drive: 'Drive',
  netzspiel: 'Netzspiel',
  aufschlag: 'Aufschlag',
  beinarbeit: 'Beinarbeit',
  schnelligkeit: 'Schnelligkeit',
  ausdauer: 'Ausdauer',
  taktik_einzel: 'Taktik Einzel',
  taktik_doppel: 'Taktik Doppel',
}

export const ALLE_SKILLS = Object.keys(SKILL_NAMEN) as SkillId[]

export const KATEGORIE_NAMEN: Record<Kategorie, string> = {
  aufwaermen: 'Aufwärmen',
  schlagtechnik: 'Schlagtechnik',
  footwork: 'Footwork',
  taktik_einzel: 'Taktik Einzel',
  taktik_doppel: 'Taktik Doppel',
  kondition: 'Kondition',
  spielformen: 'Spielformen',
}

export const ALLE_KATEGORIEN = Object.keys(KATEGORIE_NAMEN) as Kategorie[]

export const NIVEAU_NAMEN: Record<Profil['niveau'], string> = {
  anfaenger: 'Anfänger',
  fortgeschritten: 'Fortgeschritten',
  leistung: 'Leistung',
}

export const ALLE_NIVEAUS = Object.keys(NIVEAU_NAMEN) as Profil['niveau'][]

export const PERSONEN_NAMEN: Record<Uebung['personen'], string> = {
  allein: 'Allein',
  paar: 'Zu zweit',
  gruppe: 'Gruppe',
}

/** Mindest-Personenzahl je Übungsform (für Vorschlagssystem & Filter). */
export const MIN_PERSONEN: Record<Uebung['personen'], number> = {
  allein: 1,
  paar: 2,
  gruppe: 3,
}
