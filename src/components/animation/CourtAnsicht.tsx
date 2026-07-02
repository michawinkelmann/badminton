import type { BewegungsAnimation } from '../../datenmodell'
import { bahnBisJetzt, interpoliereBahn } from '../../engine/pose/interpolation'
import {
  COURT,
  courtLinienOben,
  seitenAnsicht,
  viewBoxOben,
  viewBoxSeite,
} from '../../engine/pose/court'

interface Props {
  animation: BewegungsAnimation
  t: number
  /** Aufschlagfelder-Animation: nur Zonen dieses Modus zeigen */
  modus?: 'einzel' | 'doppel'
}

const S = COURT.skala

/** Court-Ansicht (§8.1): Spielerpunkte, animiert gezeichnete Laufwege, Shuttle-Bahnen. */
export default function CourtAnsicht({ animation, t, modus }: Props) {
  const oben = (animation.courtAnsicht ?? 'oben') === 'oben'
  return oben ? <ObenAnsicht animation={animation} t={t} modus={modus} /> : <SeitenAnsichtSvg animation={animation} t={t} />
}

function ObenAnsicht({ animation, t, modus }: Props) {
  const linien = courtLinienOben()
  const shuttle = animation.shuttleBahn ? interpoliereBahn(animation.shuttleBahn, t) : undefined
  const zonen = (animation.zonen ?? []).filter(
    (z) => t >= z.vonT && t <= z.bisT && (!z.modus || z.modus === modus),
  )

  return (
    <svg viewBox={viewBoxOben()} className="h-full w-full" role="img" aria-label={`Court-Ansicht: ${animation.name}`}>
      {/* Matte */}
      <rect x={0} y={0} width={COURT.laenge * S} height={COURT.breite * S} fill="var(--color-court)" />

      {/* aktive Zonen */}
      {zonen.map((z, i) => (
        <g key={i}>
          <rect x={z.x * S} y={z.y * S} width={z.breite * S} height={z.hoehe * S} fill="var(--color-signal)" fillOpacity={0.4} stroke="var(--color-signal)" strokeWidth={2} />
          {z.label && (
            <text x={(z.x + z.breite / 2) * S} y={(z.y + z.hoehe / 2) * S} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="var(--color-linie)">
              {z.label}
            </text>
          )}
        </g>
      ))}

      {/* Linien */}
      {linien.map((l, i) => (
        <line key={i} x1={l.x1 * S} y1={l.y1 * S} x2={l.x2 * S} y2={l.y2 * S} stroke="var(--color-linie)" strokeWidth={l.staerke * S} />
      ))}
      {/* Netz */}
      <line x1={COURT.netzX * S} y1={-6} x2={COURT.netzX * S} y2={COURT.breite * S + 6} stroke="var(--color-tinte)" strokeWidth={3} strokeDasharray="6 4" />

      {/* Laufwege + Spieler (Läufer mit Smoothstep-Easing pro Bahnsegment, A6) */}
      {(animation.spieler ?? []).map((sp) => {
        const weg = bahnBisJetzt(sp.bahn, t, 'smooth')
        const pos = interpoliereBahn(sp.bahn, Math.max(t, sp.bahn[0]?.t ?? 0), 'smooth') ?? sp.bahn[0]
        const farbe = sp.seite === 'a' ? 'var(--color-signal)' : 'var(--color-linie)'
        return (
          <g key={sp.id}>
            {weg.length > 1 && (
              <polyline
                points={weg.map((p) => `${p.x * S},${p.y * S}`).join(' ')}
                fill="none"
                stroke={farbe}
                strokeWidth={2.5}
                strokeDasharray="7 6"
                strokeLinecap="round"
                opacity={0.9}
              />
            )}
            {pos && (
              <g>
                <circle cx={pos.x * S} cy={pos.y * S} r={9} fill={farbe} stroke="var(--color-tinte)" strokeWidth={1.5} />
                <text x={pos.x * S} y={pos.y * S} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={800} fill="var(--color-tinte)">
                  {sp.label}
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Shuttle */}
      {shuttle && <circle cx={shuttle.x * S} cy={shuttle.y * S} r={5} fill="var(--color-linie)" stroke="var(--color-tinte)" strokeWidth={1.5} />}
    </svg>
  )
}

function SeitenAnsichtSvg({ animation, t }: { animation: BewegungsAnimation; t: number }) {
  const seite = seitenAnsicht()
  const shuttle = animation.shuttleBahn ? interpoliereBahn(animation.shuttleBahn, t) : undefined
  const gezeichnet = animation.shuttleBahn ? bahnBisJetzt(animation.shuttleBahn, t) : []

  return (
    <svg viewBox={viewBoxSeite()} className="h-full w-full" role="img" aria-label={`Seitenansicht: ${animation.name}`}>
      {/* Boden */}
      <line x1={0} y1={seite.bodenY} x2={COURT.laenge * S} y2={seite.bodenY} stroke="var(--color-tinte)" strokeWidth={2.5} />
      {/* Netz */}
      <line x1={seite.netz.x} y1={seite.netz.vonY} x2={seite.netz.x} y2={seite.netz.bisY} stroke="var(--color-tinte)" strokeWidth={3} />
      <line x1={seite.netz.x - 8} y1={seite.netz.bisY} x2={seite.netz.x + 8} y2={seite.netz.bisY} stroke="var(--color-tinte)" strokeWidth={4} strokeLinecap="round" />
      <text x={seite.netz.x} y={seite.netz.bisY - 8} textAnchor="middle" fontSize={12} fill="var(--color-tinte)" opacity={0.7}>
        1,55 m
      </text>

      {/* Spieler als Punkte am Boden */}
      {(animation.spieler ?? []).map((sp) => {
        const pos = interpoliereBahn(sp.bahn, Math.max(t, sp.bahn[0]?.t ?? 0), 'smooth') ?? sp.bahn[0]
        if (!pos) return null
        return (
          <g key={sp.id}>
            <circle cx={pos.x * S} cy={seite.bodenY - 10} r={9} fill="var(--color-signal)" stroke="var(--color-tinte)" strokeWidth={1.5} />
            <text x={pos.x * S} y={seite.bodenY - 10} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={800} fill="var(--color-tinte)">
              {sp.label}
            </text>
          </g>
        )
      })}

      {/* Vergleichs-Flugbahnen (Clear/Drop/Smash/Drive) */}
      {(animation.bahnen ?? []).map((b, i) => {
        const teil = bahnBisJetzt(b.punkte, t)
        const letzter = teil[teil.length - 1]
        const fliegt = interpoliereBahn(b.punkte, t)
        return (
          <g key={i}>
            {teil.length > 1 && (
              <polyline
                points={teil.map((p) => `${p.x * S},${seite.hoehePx(p.y)}`).join(' ')}
                fill="none"
                stroke="var(--color-court)"
                strokeWidth={2.5}
                strokeDasharray="2 5"
                strokeLinecap="round"
              />
            )}
            {letzter && t >= (b.punkte[b.punkte.length - 1]?.t ?? 0) && (
              <text x={letzter.x * S} y={seite.hoehePx(letzter.y) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-tinte)">
                {b.label}
              </text>
            )}
            {fliegt && <circle cx={fliegt.x * S} cy={seite.hoehePx(fliegt.y)} r={5} fill="var(--color-signal)" stroke="var(--color-tinte)" strokeWidth={1.5} />}
          </g>
        )
      })}

      {/* bereits geflogene Bahn + Shuttle */}
      {gezeichnet.length > 1 && (
        <polyline
          points={gezeichnet.map((p) => `${p.x * S},${seite.hoehePx(p.y)}`).join(' ')}
          fill="none"
          stroke="var(--color-court)"
          strokeWidth={2.5}
          strokeDasharray="2 5"
          strokeLinecap="round"
        />
      )}
      {shuttle && <circle cx={shuttle.x * S} cy={seite.hoehePx(shuttle.y)} r={5} fill="var(--color-signal)" stroke="var(--color-tinte)" strokeWidth={1.5} />}
    </svg>
  )
}
