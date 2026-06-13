import type { UebungsSkizze } from '../../../datenmodell'

/**
 * Ausführliche Zusatzinhalte je Bibliotheks-Übung: erklärende Beschreibung
 * (für alle, die die Übung noch nicht kennen) und optionale Court-Skizze.
 * Wird in src/data/uebungen.ts per ID in die Übungen gemerged.
 *
 * Skizzen-Konvention (Draufsicht, Meter): linke Feldhälfte = übende
 * Person/Partei A (gefüllt), rechte Hälfte = Zuspiel/Gegenpartei B (hohl).
 * Labels: A/B = Spieler der Parteien, Z = Zuspieler:in, T = Trainer:in.
 */
export interface UebungsDetails {
  beschreibung: string[]
  skizze?: UebungsSkizze
}
