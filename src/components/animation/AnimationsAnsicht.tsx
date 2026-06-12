import { useState } from 'react'
import type { BewegungsAnimation } from '../../datenmodell'
import { interpolierePose, interpoliereBahn } from '../../engine/pose/interpolation'
import { usePosePlayer, type Tempo } from '../../engine/pose/player'
import FigurAnsicht from './FigurAnsicht'
import CourtAnsicht from './CourtAnsicht'

interface Props {
  animation: BewegungsAnimation
  kompakt?: boolean // eingebettet in Übungsdetail: ohne Phasenliste
}

const TEMPI: Tempo[] = [0.25, 0.5, 1]

/**
 * Kompletter Player (§8.1): Figur- oder Court-Ansicht plus Controls
 * (Play/Pause, Zeitlupe, Phasen-Stepper, Scrubber) und Phasen-Lehrtext.
 */
export default function AnimationsAnsicht({ animation, kompakt = false }: Props) {
  const player = usePosePlayer(animation.dauerMs, animation.phasen)
  const [modus, setModus] = useState<'einzel' | 'doppel'>('einzel')
  const phase = animation.phasen[player.aktivePhase]

  const istFigur = animation.typ === 'figur'
  const pose = istFigur ? interpolierePose(animation.posen, player.t) : undefined
  // Spur des Schlägerkopfs über die letzten ~250 ms (alt → neu)
  const spur = istFigur
    ? [250, 190, 130, 70].map(
        (d) =>
          interpolierePose(animation.posen, Math.max(0, player.t - d)).joints
            .schlaegerKopf,
      )
    : undefined
  const shuttle =
    istFigur && animation.shuttleBahn
      ? interpoliereBahn(animation.shuttleBahn, player.t)
      : undefined

  return (
    <div className="rounded-xl border-2 border-court/30 bg-linie">
      {/* Bühne */}
      {istFigur && pose ? (
        <div className="grid grid-cols-1 gap-px bg-court/20 sm:grid-cols-2">
          <div>
            <div className="aspect-square w-full bg-boden">
              <FigurAnsicht pose={pose} shuttle={shuttle} netzX={animation.netzX} spur={spur} ansicht="seite" />
            </div>
            <p className="bg-boden pb-1 text-center text-xs font-semibold text-tinte/55">Seite</p>
          </div>
          <div>
            <div className="aspect-square w-full bg-boden">
              <FigurAnsicht pose={pose} shuttle={shuttle} netzX={animation.netzX} spur={spur} ansicht="front" />
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
