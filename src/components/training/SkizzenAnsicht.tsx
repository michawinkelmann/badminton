import { useId } from 'react'
import type { SkizzenPunkt, UebungsSkizze } from '../../datenmodell'
import { COURT, courtLinienOben, viewBoxOben } from '../../engine/pose/court'

interface Props {
  skizze: UebungsSkizze
  /** Für den sprechenden Alternativtext, z. B. der Übungsname. */
  name?: string
}

const S = COURT.skala

function px(p: SkizzenPunkt): { x: number; y: number } {
  return { x: p.x * S, y: p.y * S }
}

/** Quadratischer Bogen: Kontrollpunkt senkrecht zur Strecke versetzt. */
function bogenPfad(von: SkizzenPunkt, bis: SkizzenPunkt, staerke: number): string {
  const a = px(von)
  const b = px(bis)
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const laenge = Math.hypot(dx, dy) || 1
  const nx = -dy / laenge
  const ny = dx / laenge
  return `M ${a.x} ${a.y} Q ${mx + nx * staerke} ${my + ny * staerke} ${b.x} ${b.y}`
}

/**
 * Statische Court-Skizze (Draufsicht) für Übungen: Aufbau, Positionen,
 * Laufwege und Shuttle-Bahnen als reine Daten gerendert. Bewusst ohne
 * Animation — drucktauglich (s/w) und überall einbettbar.
 */
export default function SkizzenAnsicht({ skizze, name }: Props) {
  const id = useId()
  const laufPfeil = `lauf-${id}`
  const shuttlePfeil = `shuttle-${id}`
  const linien = courtLinienOben()

  return (
    <figure className="m-0">
      <svg
        viewBox={viewBoxOben()}
        className="h-auto w-full"
        role="img"
        aria-label={name ? `Skizze: ${name}` : 'Übungs-Skizze'}
      >
        <defs>
          <marker
            id={laufPfeil}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--color-tinte)" />
          </marker>
          <marker
            id={shuttlePfeil}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--color-kork)" />
          </marker>
        </defs>

        {/* Matte (dezent, drucktauglich) */}
        <rect
          x={0}
          y={0}
          width={COURT.laenge * S}
          height={COURT.breite * S}
          fill="var(--color-court)"
          fillOpacity={0.08}
        />

        {/* Zielzonen unter den Linien, damit Linien sichtbar bleiben */}
        {(skizze.zonen ?? []).map((z, i) => (
          <g key={i}>
            <rect
              x={z.x * S}
              y={z.y * S}
              width={z.b * S}
              height={z.h * S}
              fill="var(--color-signal)"
              fillOpacity={0.35}
              stroke="var(--color-tinte)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            {z.label && (
              <text
                x={(z.x + z.b / 2) * S}
                y={(z.y + z.h / 2) * S}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fontWeight={700}
                fill="var(--color-tinte)"
              >
                {z.label}
              </text>
            )}
          </g>
        ))}

        {/* Court-Linien */}
        {linien.map((l, i) => (
          <line
            key={i}
            x1={l.x1 * S}
            y1={l.y1 * S}
            x2={l.x2 * S}
            y2={l.y2 * S}
            stroke="var(--color-court)"
            strokeWidth={l.staerke * S}
          />
        ))}
        {/* Netz */}
        <line
          x1={COURT.netzX * S}
          y1={-8}
          x2={COURT.netzX * S}
          y2={COURT.breite * S + 8}
          stroke="var(--color-tinte)"
          strokeWidth={3}
          strokeDasharray="6 4"
        />

        {/* Laufwege (gestrichelt, Pfeilspitze) */}
        {(skizze.laufwege ?? []).map((w, i) => (
          <path
            key={i}
            d={bogenPfad(w.von, w.bis, w.gebogen ? 26 : 0)}
            fill="none"
            stroke="var(--color-tinte)"
            strokeWidth={2.5}
            strokeDasharray="7 6"
            strokeLinecap="round"
            markerEnd={`url(#${laufPfeil})`}
          />
        ))}

        {/* Shuttle-Bahnen (durchgezogen, leicht gebogen) */}
        {(skizze.shuttlewege ?? []).map((w, i) => (
          <path
            key={i}
            d={bogenPfad(w.von, w.bis, 18)}
            fill="none"
            stroke="var(--color-kork)"
            strokeWidth={2}
            strokeLinecap="round"
            markerEnd={`url(#${shuttlePfeil})`}
          />
        ))}

        {/* Hütchen */}
        {(skizze.huetchen ?? []).map((h, i) => {
          const p = px(h)
          return (
            <path
              key={i}
              d={`M ${p.x} ${p.y - 7} L ${p.x + 6.5} ${p.y + 5} L ${p.x - 6.5} ${p.y + 5} Z`}
              fill="var(--color-kork)"
              stroke="var(--color-tinte)"
              strokeWidth={1}
            />
          )
        })}

        {/* Spieler (Partei a gefüllt, Partei b hohl) */}
        {(skizze.spieler ?? []).map((sp, i) => {
          const p = px(sp.pos)
          const hohl = sp.partei === 'b'
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={10}
                fill={hohl ? 'var(--color-linie)' : 'var(--color-court)'}
                stroke={hohl ? 'var(--color-court)' : 'var(--color-tinte)'}
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fontWeight={800}
                fill={hohl ? 'var(--color-court)' : 'var(--color-linie)'}
              >
                {sp.label}
              </text>
            </g>
          )
        })}
      </svg>
      {skizze.hinweis && (
        <figcaption className="mt-1 text-xs leading-snug text-tinte/65">
          {skizze.hinweis}
        </figcaption>
      )}
    </figure>
  )
}
