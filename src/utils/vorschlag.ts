/**
 * Vorschlagssystem „Was willst du verbessern?" (§5) — reine Engine, UI-frei.
 * Bewertung: Skill-Match > Niveau-Match > Material erfüllt.
 * Auto-Einheit: Aufwärmen (10–15 Min) → 2–3 Hauptübungen → Spielform/Abschluss,
 * Zeitbudget wird exakt eingehalten.
 */
import { nanoid } from 'nanoid'
import type { Einheit, EinheitBlock, Profil, SkillId, Uebung } from '../datenmodell'
import { MIN_PERSONEN, SKILL_NAMEN } from '../data/skills'

export interface VorschlagsKriterien {
  zielSkills: SkillId[] // 1–3
  niveau: Profil['niveau']
  zeitMin: number
  personen: number
  /** Verfügbares Zusatzmaterial; undefined = alles vorhanden. */
  material?: string[]
}

export function materialErfuellt(uebung: Uebung, verfuegbar?: string[]): boolean {
  if (!verfuegbar) return true
  return uebung.material.every((m) => verfuegbar.includes(m))
}

export function personenPassen(uebung: Uebung, personen: number): boolean {
  return MIN_PERSONEN[uebung.personen] <= personen
}

/** Grundvoraussetzungen: durchführbar mit dieser Personenzahl und diesem Material. */
export function istGeeignet(uebung: Uebung, kriterien: VorschlagsKriterien): boolean {
  return (
    personenPassen(uebung, kriterien.personen) &&
    materialErfuellt(uebung, kriterien.material)
  )
}

export interface BewerteteUebung {
  uebung: Uebung
  punkte: number
  skillTreffer: SkillId[]
  niveauPasst: boolean
}

/** Score: Skill-Match dominiert (×100), dann Niveau (×10), dann Material (×1). */
export function bewerte(uebung: Uebung, kriterien: VorschlagsKriterien): BewerteteUebung {
  const skillTreffer = uebung.skills.filter((s) => kriterien.zielSkills.includes(s))
  const niveauPasst = uebung.niveau.includes(kriterien.niveau)
  const punkte =
    skillTreffer.length * 100 +
    (niveauPasst ? 10 : 0) +
    (materialErfuellt(uebung, kriterien.material) ? 1 : 0)
  return { uebung, punkte, skillTreffer, niveauPasst }
}

/** Score-sortierte Vorschlagsliste (nur geeignete Übungen). */
export function schlageUebungenVor(
  uebungen: Uebung[],
  kriterien: VorschlagsKriterien,
): BewerteteUebung[] {
  return uebungen
    .filter((u) => istGeeignet(u, kriterien))
    .map((u) => bewerte(u, kriterien))
    .sort((a, b) => b.punkte - a.punkte || a.uebung.dauerMin - b.uebung.dauerMin)
}

function aufFuenfGerundet(min: number): number {
  return Math.max(5, Math.round(min / 5) * 5)
}

/**
 * Vollständige Einheit nach dem Muster Aufwärmen → Hauptteil → Abschluss.
 * Gibt undefined zurück, wenn gar keine geeigneten Übungen existieren.
 */
export function erstelleEinheitAutomatisch(
  uebungen: Uebung[],
  kriterien: VorschlagsKriterien,
): Einheit | undefined {
  const geeignete = uebungen.filter((u) => istGeeignet(u, kriterien))
  if (geeignete.length === 0) return undefined

  const zeit = Math.max(30, kriterien.zeitMin)
  const sortiertNachScore = (liste: Uebung[]) =>
    liste
      .map((u) => bewerte(u, kriterien))
      .sort((a, b) => b.punkte - a.punkte || a.uebung.dauerMin - b.uebung.dauerMin)

  // --- Aufwärmen: 10–15 Min (§5) ---
  const aufwaermKandidaten = sortiertNachScore(
    geeignete.filter((u) => u.kategorie === 'aufwaermen'),
  )
  const aufwaermUebung = aufwaermKandidaten[0]?.uebung
  const aufwaermDauer = aufwaermUebung ? (zeit <= 60 ? 10 : 15) : 0

  // --- Abschluss: Spielform ---
  const spielformKandidaten = sortiertNachScore(
    geeignete.filter((u) => u.kategorie === 'spielformen'),
  )
  const abschlussUebung = spielformKandidaten[0]?.uebung
  const abschlussDauer = abschlussUebung ? (zeit <= 45 ? 10 : zeit <= 75 ? 15 : 20) : 0

  // --- Hauptteil: 2–3 Übungen zu den Ziel-Skills ---
  const hauptZeit = zeit - aufwaermDauer - abschlussDauer
  let anzahlHaupt = hauptZeit >= 45 ? 3 : 2
  while (anzahlHaupt > 1 && hauptZeit / anzahlHaupt < 10) anzahlHaupt--

  const hauptPool = sortiertNachScore(
    geeignete.filter(
      (u) => u.kategorie !== 'aufwaermen' && u.kategorie !== 'spielformen',
    ),
  )

  // Greedy: erst je Ziel-Skill die beste Übung, dann nach Gesamtscore auffüllen.
  const haupt: Uebung[] = []
  for (const skill of kriterien.zielSkills) {
    if (haupt.length >= anzahlHaupt) break
    const beste = hauptPool.find(
      (b) => b.skillTreffer.includes(skill) && !haupt.includes(b.uebung),
    )
    if (beste) haupt.push(beste.uebung)
  }
  for (const b of hauptPool) {
    if (haupt.length >= anzahlHaupt) break
    if (!haupt.includes(b.uebung)) haupt.push(b.uebung)
  }
  if (haupt.length === 0) return undefined

  // --- Zeiten verteilen: Blöcke à 5er-Schritte, Summe exakt = Zeitbudget ---
  const bloecke: EinheitBlock[] = []
  if (aufwaermUebung) bloecke.push({ uebungId: aufwaermUebung.id, dauerMin: aufwaermDauer })

  const basis = aufFuenfGerundet(hauptZeit / haupt.length)
  haupt.forEach((u, i) => {
    const istLetzte = i === haupt.length - 1
    const bisher = basis * i
    const dauer = istLetzte ? hauptZeit - bisher : basis
    bloecke.push({ uebungId: u.id, dauerMin: dauer })
  })

  if (abschlussUebung) bloecke.push({ uebungId: abschlussUebung.id, dauerMin: abschlussDauer })

  const skillNamen = kriterien.zielSkills.map((s) => SKILL_NAMEN[s]).join(' & ')
  return {
    id: nanoid(),
    name: `Vorschlag: ${skillNamen} – ${zeit} Min`,
    zielSkills: kriterien.zielSkills,
    bloecke,
    istVorlage: false,
  }
}

/** Gesamtdauer einer Einheit in Minuten. */
export function einheitGesamtdauer(bloecke: { dauerMin: number }[]): number {
  return bloecke.reduce((summe, b) => summe + b.dauerMin, 0)
}
