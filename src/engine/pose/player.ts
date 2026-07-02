/**
 * Pose-Engine, Teil 2 (§8.1): Player-Hook mit requestAnimationFrame.
 * Controls: Play/Pause, Tempo 0.25/0.5/1, Phasen-Stepper, Scrubber.
 * `prefers-reduced-motion` → startet pausiert im Stepper-Modus.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { AnimationsPhase } from '../../datenmodell'
import { aktivePhasenIndex } from './interpolation'

export type Tempo = 0.25 | 0.5 | 1

export interface PosePlayerApi {
  t: number
  laeuft: boolean
  tempo: Tempo
  reduzierteBewegung: boolean
  aktivePhase: number
  abspielen: () => void
  pausieren: () => void
  umschalten: () => void
  setTempo: (tempo: Tempo) => void
  setT: (t: number) => void
  springeZuPhase: (index: number) => void
  naechstePhase: () => void
  vorherigePhase: () => void
}

export function bevorzugtReduzierteBewegung(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Kurze Pause auf der Endpose, bevor der Loop neu beginnt (lesbarer Zyklus). */
const END_HOLD_MS = 400
/** Auto-Zeitlupe: Fenster um den Schlagmoment und Verlangsamungsfaktor. */
const ZEITLUPE_FENSTER_MS = 200
const ZEITLUPE_FAKTOR = 0.25

export function usePosePlayer(
  dauerMs: number,
  phasen: AnimationsPhase[],
  /** Automatische Zeitlupe ±200 ms um diesen Zeitpunkt (z. B. kontaktT). */
  zeitlupeUm?: number,
): PosePlayerApi {
  const reduziert = useMemo(bevorzugtReduzierteBewegung, [])
  const [t, setT] = useState(0)
  const [laeuft, setLaeuft] = useState(!reduziert)
  const [tempo, setTempo] = useState<Tempo>(1)
  const tRef = useRef(0)
  tRef.current = t
  const zeitlupeRef = useRef(zeitlupeUm)
  zeitlupeRef.current = zeitlupeUm

  useEffect(() => {
    if (!laeuft) return
    let rahmen = 0
    let zuletzt = performance.now()
    // Roh-Position läuft über dauerMs hinaus weiter (End-Hold), t wird gekappt
    let roh = tRef.current
    const zyklus = dauerMs + END_HOLD_MS
    const schritt = (jetzt: number) => {
      const delta = Math.min(100, jetzt - zuletzt)
      zuletzt = jetzt
      const zl = zeitlupeRef.current
      const faktor =
        zl !== undefined && Math.abs(roh - zl) <= ZEITLUPE_FENSTER_MS ? ZEITLUPE_FAKTOR : 1
      roh = (roh + delta * tempo * faktor) % zyklus
      const neu = Math.min(roh, dauerMs)
      tRef.current = neu
      setT(neu)
      rahmen = requestAnimationFrame(schritt)
    }
    rahmen = requestAnimationFrame(schritt)
    return () => cancelAnimationFrame(rahmen)
  }, [laeuft, tempo, dauerMs])

  const aktivePhase = aktivePhasenIndex(phasen, t)

  function springeZuPhase(index: number) {
    const ziel = phasen[Math.max(0, Math.min(phasen.length - 1, index))]
    if (!ziel) return
    setLaeuft(false)
    // Mitte der Phase: dort zeigt das Bild den repräsentativen Moment
    const anker = ziel.vonT + (ziel.bisT - ziel.vonT) / 2
    tRef.current = anker
    setT(anker)
  }

  return {
    t,
    laeuft,
    tempo,
    reduzierteBewegung: reduziert,
    aktivePhase,
    abspielen: () => setLaeuft(true),
    pausieren: () => setLaeuft(false),
    umschalten: () => setLaeuft((l) => !l),
    setTempo,
    setT: (neu) => {
      tRef.current = neu
      setT(neu)
    },
    springeZuPhase,
    naechstePhase: () => springeZuPhase(aktivePhase + 1),
    vorherigePhase: () => springeZuPhase(aktivePhase - 1),
  }
}
