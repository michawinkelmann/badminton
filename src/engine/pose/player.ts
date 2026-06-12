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

export function usePosePlayer(
  dauerMs: number,
  phasen: AnimationsPhase[],
): PosePlayerApi {
  const reduziert = useMemo(bevorzugtReduzierteBewegung, [])
  const [t, setT] = useState(0)
  const [laeuft, setLaeuft] = useState(!reduziert)
  const [tempo, setTempo] = useState<Tempo>(1)
  const tRef = useRef(0)
  tRef.current = t

  useEffect(() => {
    if (!laeuft) return
    let rahmen = 0
    let zuletzt = performance.now()
    const schritt = (jetzt: number) => {
      const delta = Math.min(100, jetzt - zuletzt)
      zuletzt = jetzt
      const neu = (tRef.current + delta * tempo) % dauerMs
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
