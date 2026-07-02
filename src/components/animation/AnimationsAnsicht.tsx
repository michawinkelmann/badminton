import { useMemo, useState } from 'react'
import type { BewegungsAnimation, Pose } from '../../datenmodell'
import {
  figurPoseZuZeit,
  fussAufsetzer,
  interpoliereBahn,
} from '../../engine/pose/interpolation'
import { figurPose } from '../../engine/pose/figur'
import { usePosePlayer, type Tempo } from '../../engine/pose/player'
import FigurAnsicht from './FigurAnsicht'
import CourtAnsicht from './CourtAnsicht'

interface Props {
  animation: BewegungsAnimation
  kompakt?: boolean // eingebettet in Übungsdetail: ohne Phasenliste
}

const TEMPI: Tempo[] = [0.25, 0.5, 1]
/** Zeitversätze der Bewegungsspuren (alt → neu). */
const SPUR_OFFSETS = [250, 190, 130, 70]
const SHUTTLE_SPUR_OFFSETS = [200, 160, 120, 80, 40]
/** Sichtbarkeitsdauer des Fuß-Aufsetz-Rings. */
const AUFSETZ_RING_MS = 260

/**
 * Kompletter Player (§8.1): Figur- oder Court-Ansicht plus Controls
 * (Play/Pause, Zeitlupe, Phasen-Stepper, Scrubber) und Phasen-Lehrtext.
 */
export default function AnimationsAnsicht({ animation, kompakt = false }: Props) {
  const istFigur = animation.typ === 'figur' && (animation.stellungen?.length ?? 0) > 0
  const [zeitlupe, setZeitlupe] = useState(true)
  const player = usePosePlayer(
    animation.dauerMs,
    animation.phasen,
    zeitlupe && istFigur ? animation.kontaktT : undefined,
  )
  const [modus, setModus] = useState<'einzel' | 'doppel'>('einzel')
  const phase = animation.phasen[player.aktivePhase]

  const pose = istFigur ? figurPoseZuZeit(animation.stellungen!, player.t) : undefined
  // Bewegungsspuren über die letzten ~250 ms (alt → neu)
  const spurPosen = istFigur
    ? SPUR_OFFSETS.map((d) => figurPoseZuZeit(animation.stellungen!, Math.max(0, player.t - d)))
    : undefined
  const spur = spurPosen?.map((p) => p.joints.schlaegerKopf)
  // Fußspuren nur bei Footwork (Animationen ohne Schlagmoment)
  const istFootwork = istFigur && animation.kontaktT === undefined
  const fussSpurL = istFootwork ? spurPosen!.map((p) => p.joints.fussL) : undefined
  const fussSpurR = istFootwork ? spurPosen!.map((p) => p.joints.fussR) : undefined

  const shuttle =
    istFigur && animation.shuttleBahn
      ? interpoliereBahn(animation.shuttleBahn, player.t)
      : undefined
  // Shuttle-Schweif (alt → neu), nur wo die Bahn existiert
  const shuttleSpur =
    istFigur && animation.shuttleBahn
      ? SHUTTLE_SPUR_OFFSETS.flatMap((d) => {
          const p = interpoliereBahn(animation.shuttleBahn!, player.t - d)
          return p ? [p] : []
        })
      : undefined

  // Impact-Ring am Schlägerkopf im Kontakt-Fenster (±70 ms um kontaktT)
  const impact =
    istFigur &&
    animation.kontaktT !== undefined &&
    Math.abs(player.t - animation.kontaktT) < 70
      ? (player.t - animation.kontaktT + 70) / 140
      : undefined

  // Fuß-Aufsetzer (einmal pro Animation berechnet): Puls-Ringe beim Landen
  const aufsetzZeiten = useMemo(() => {
    if (!istFigur) return []
    return fussAufsetzer(animation.stellungen!).map((a) => {
      const j = figurPoseZuZeit(animation.stellungen!, a.t).joints
      const f = a.fuss === 'L' ? j.fussL : j.fussR
      return { t: a.t, x: f.x, y: f.y, z: f.z }
    })
  }, [animation, istFigur])
  const aufsetzer = aufsetzZeiten
    .filter((a) => player.t - a.t >= 0 && player.t - a.t < AUFSETZ_RING_MS)
    .map((a) => ({ x: a.x, y: a.y, z: a.z, progress: (player.t - a.t) / AUFSETZ_RING_MS }))

  // Onion-Skin im Pausen-/Stepper-Modus: Nachbar-Keyframes als Geister
  let geister: Pose[] | undefined
  if (istFigur && !player.laeuft) {
    const kf = animation.stellungen!
    const vor = [...kf].reverse().find((k) => k.t < player.t - 1)
    const nach = kf.find((k) => k.t > player.t + 1)
    geister = [vor, nach].flatMap((k) => (k ? [figurPose(k.t, k.s)] : []))
  }

  return (
    <div className="rounded-xl border-2 border-court/30 bg-linie">
      {/* Bühne */}
      {istFigur && pose ? (
        <div className="grid grid-cols-1 gap-px bg-court/20 sm:grid-cols-2">
          <div>
            <div className="aspect-square w-full bg-boden">
              <FigurAnsicht
                pose={pose}
                shuttle={shuttle}
                netzX={animation.netzX}
                spur={spur}
                ansicht="seite"
                impact={impact}
                shuttleSpur={shuttleSpur}
                fussSpurL={fussSpurL}
                fussSpurR={fussSpurR}
                aufsetzer={aufsetzer}
                geister={geister}
              />
            </div>
            <p className="bg-boden pb-1 text-center text-xs font-semibold text-tinte/55">Seite</p>
          </div>
          <div>
            <div className="aspect-square w-full bg-boden">
              <FigurAnsicht
                pose={pose}
                shuttle={shuttle}
                netzX={animation.netzX}
                spur={spur}
                ansicht="front"
                impact={impact}
                shuttleSpur={shuttleSpur}
                fussSpurL={fussSpurL}
                fussSpurR={fussSpurR}
                aufsetzer={aufsetzer}
                geister={geister}
              />
            </div>
            <p className="bg-boden pb-1 text-center text-xs font-semibold text-tinte/55">Front — wie im Spiegel</p>
          </div>
        </div>
      ) : (
        <div className="aspect-[2/1] w-full bg-boden p-2">
          <CourtAnsicht animation={animation} t={player.t} modus={modus} />
        </div>
      )}

      {/* Umschalter Einzel/Doppel (Aufschlagfelder) */}
      {animation.umschaltbar && (
        <div className="flex gap-2 border-t-2 border-boden px-3 pt-3">
          {(['einzel', 'doppel'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModus(m)}
              aria-pressed={modus === m}
              className={`min-h-11 rounded-md border-2 px-4 text-sm font-semibold ${
                modus === m ? 'border-court bg-court text-linie' : 'border-court/30 text-tinte/70 hover:border-court'
              }`}
            >
              {m === 'einzel' ? 'Einzel' : 'Doppel'}
            </button>
          ))}
        </div>
      )}

      {/* Steuerung */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-3">
        <button
          type="button"
          onClick={player.umschalten}
          aria-label={player.laeuft ? 'Pausieren' : 'Abspielen'}
          className="min-h-11 min-w-11 rounded-md bg-court text-lg font-bold text-linie hover:bg-court-tief"
        >
          {player.laeuft ? '⏸' : '▶'}
        </button>

        <div className="flex overflow-hidden rounded-md border-2 border-court/40" role="group" aria-label="Geschwindigkeit">
          {TEMPI.map((tempo) => (
            <button
              key={tempo}
              type="button"
              onClick={() => player.setTempo(tempo)}
              aria-pressed={player.tempo === tempo}
              className={`ziffern min-h-11 px-2.5 text-xs font-bold ${
                player.tempo === tempo ? 'bg-court text-linie' : 'text-tinte/70 hover:bg-boden'
              }`}
            >
              {tempo}×
            </button>
          ))}
        </div>

        {istFigur && animation.kontaktT !== undefined && (
          <button
            type="button"
            onClick={() => setZeitlupe((z) => !z)}
            aria-pressed={zeitlupe}
            title="Automatische Zeitlupe rund um den Treffpunkt"
            className={`min-h-11 rounded-md border-2 px-3 text-xs font-semibold ${
              zeitlupe ? 'border-court bg-court text-linie' : 'border-court/40 text-tinte/70 hover:border-court'
            }`}
          >
            Zeitlupe Treffpunkt
          </button>
        )}

        <div className="flex overflow-hidden rounded-md border-2 border-court/40" role="group" aria-label="Phasen-Stepper">
          <button type="button" onClick={player.vorherigePhase} aria-label="Vorherige Phase" className="min-h-11 px-3 font-bold text-tinte/80 hover:bg-boden">
            ⏮
          </button>
          <button type="button" onClick={player.naechstePhase} aria-label="Nächste Phase" className="min-h-11 px-3 font-bold text-tinte/80 hover:bg-boden">
            ⏭
          </button>
        </div>

        <input
          type="range"
          min={0}
          max={animation.dauerMs}
          step={10}
          value={player.t}
          onChange={(e) => {
            player.pausieren()
            player.setT(Number(e.target.value))
          }}
          aria-label="Zeitpunkt in der Animation"
          className="min-h-11 min-w-32 flex-1 accent-court"
        />
      </div>

      {/* Aktive Phase mit Lehrtext */}
      {phase && (
        <div className="border-t-2 border-boden px-4 py-3">
          <p className="schrift-display text-sm text-court">
            {player.aktivePhase + 1}/{animation.phasen.length} · {phase.label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-tinte/85">{phase.lehrtext}</p>
        </div>
      )}

      {/* Phasen-Chips */}
      {!kompakt && (
        <div className="flex flex-wrap gap-1.5 border-t-2 border-boden px-3 py-3">
          {animation.phasen.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => player.springeZuPhase(i)}
              aria-pressed={i === player.aktivePhase}
              className={`min-h-9 rounded-full border-2 px-3 text-xs font-semibold ${
                i === player.aktivePhase
                  ? 'border-court bg-court text-linie'
                  : 'border-court/30 text-tinte/70 hover:border-court'
              }`}
            >
              {i + 1} · {p.label}
            </button>
          ))}
        </div>
      )}

      {player.reduzierteBewegung && (
        <p className="border-t-2 border-boden px-4 py-2 text-xs text-tinte/60">
          Reduzierte Bewegung aktiv: Nutze den Phasen-Stepper, um den Ablauf Schritt für
          Schritt anzusehen.
        </p>
      )}
    </div>
  )
}
