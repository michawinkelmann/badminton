import type { Pose } from '../../datenmodell'
import { BODEN_Y, FRONT_MITTE, figurTeile, frontTeile } from '../../engine/pose/figur'

interface Props {
  pose: Pose
  shuttle?: { x: number; y: number; z?: number }
  netzX?: number
  /** Letzte Schlägerkopf-Positionen (alt → neu) als Bewegungsspur */
  spur?: { x: number; y: number; z?: number }[]
  /** Seite (Standard) oder Front (Blick vom Netz, wie im Spiegel) */
  ansicht?: 'seite' | 'front'
}

const NETZ_HOEHE = 1.55 * 40 // 1 m ≈ 40 Einheiten

/** Strichfigur (§8.1): zwei synchrone Projektionen aus einem 3D-lite-Datensatz. */
export default function FigurAnsicht({ pose, shuttle, netzX, spur, ansicht = 'seite' }: Props) {
  return ansicht === 'seite' ? (
    <SeitenProjektion pose={pose} shuttle={shuttle} netzX={netzX} spur={spur} />
  ) : (
    <FrontProjektion pose={pose} shuttle={shuttle} netzX={netzX} spur={spur} />
  )
}

function SeitenProjektion({ pose, shuttle, netzX, spur }: Omit<Props, 'ansicht'>) {
  const teile = figurTeile(pose)

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Bewegungsablauf, Seitenansicht">
      <line x1={2} y1={BODEN_Y} x2={98} y2={BODEN_Y} stroke="var(--color-tinte)" strokeOpacity={0.25} strokeWidth={0.8} />

      {netzX !== undefined && (
        <g>
          <line x1={netzX} y1={BODEN_Y} x2={netzX} y2={BODEN_Y - NETZ_HOEHE} stroke="var(--color-tinte)" strokeOpacity={0.5} strokeWidth={1} />
          <line x1={netzX - 1.6} y1={BODEN_Y - NETZ_HOEHE} x2={netzX + 1.6} y2={BODEN_Y - NETZ_HOEHE} stroke="var(--color-tinte)" strokeWidth={1.6} strokeLinecap="round" />
          <line x1={netzX} y1={BODEN_Y - NETZ_HOEHE + 3} x2={netzX} y2={BODEN_Y - NETZ_HOEHE + 14} stroke="var(--color-tinte)" strokeOpacity={0.25} strokeWidth={3} strokeDasharray="0.8 1.4" />
        </g>
      )}

      {spur?.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.1} fill="var(--color-kork)" opacity={0.12 + (i / Math.max(1, spur.length - 1)) * 0.3} />
      ))}

      {teile.glieder.map((g, i) => (
        <line key={i} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="var(--color-court)" strokeOpacity={g.hinten ? 0.45 : 1} strokeWidth={g.dick} strokeLinecap="round" />
      ))}
      <circle cx={teile.kopf.x} cy={teile.kopf.y} r={teile.kopf.r} fill="var(--color-court)" />
      <line x1={teile.schlaegerLinie.x1} y1={teile.schlaegerLinie.y1} x2={teile.schlaegerLinie.x2} y2={teile.schlaegerLinie.y2} stroke="var(--color-kork)" strokeWidth={1.6} strokeLinecap="round" />
      <ellipse
        cx={teile.schlaegerKopf.x}
        cy={teile.schlaegerKopf.y}
        rx={teile.schlaegerKopf.rx}
        ry={teile.schlaegerKopf.ry}
        transform={`rotate(${teile.schlaegerKopf.winkel} ${teile.schlaegerKopf.x} ${teile.schlaegerKopf.y})`}
        fill="none"
        stroke="var(--color-kork)"
        strokeWidth={1.3}
      />
      {teile.gelenke.map((g, i) => (
        <circle key={i} cx={g.x} cy={g.y} r={1.2} fill="var(--color-linie)" stroke="var(--color-court)" strokeWidth={0.7} />
      ))}
      {shuttle && <circle cx={shuttle.x} cy={shuttle.y} r={1.7} fill="var(--color-signal)" stroke="var(--color-tinte)" strokeWidth={0.5} />}
    </svg>
  )
}

function FrontProjektion({ pose, shuttle, netzX, spur }: Omit<Props, 'ansicht'>) {
  const teile = frontTeile(pose)
  // Tiefensortierung: weiter vom Netz entfernt (kleines Seiten-x) zuerst zeichnen
  const linien = [...teile.linien].sort((a, b) => a.tiefe - b.tiefe)
  const fx = (z?: number) => FRONT_MITTE + (z ?? 7)

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Bewegungsablauf, Frontansicht (Spiegel)">
      <line x1={2} y1={BODEN_Y} x2={98} y2={BODEN_Y} stroke="var(--color-tinte)" strokeOpacity={0.25} strokeWidth={0.8} />

      {/* Netzkante als Höhenreferenz (das Netz liegt zwischen Betrachter und Figur) */}
      {netzX !== undefined && (
        <g>
          <line x1={4} y1={BODEN_Y - NETZ_HOEHE} x2={96} y2={BODEN_Y - NETZ_HOEHE} stroke="var(--color-tinte)" strokeOpacity={0.4} strokeWidth={1.2} strokeDasharray="3 2" />
          <text x={95} y={BODEN_Y - NETZ_HOEHE - 1.5} textAnchor="end" fontSize={3} fill="var(--color-tinte)" opacity={0.5}>
            Netzkante
          </text>
        </g>
      )}

      {spur?.map((p, i) => (
        <circle key={i} cx={fx(p.z)} cy={p.y} r={1.1} fill="var(--color-kork)" opacity={0.12 + (i / Math.max(1, spur.length - 1)) * 0.3} />
      ))}

      {linien.map((g, i) => (
        <line key={i} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="var(--color-court)" strokeWidth={g.dick} strokeLinecap="round" />
      ))}
      <circle cx={teile.kopf.x} cy={teile.kopf.y} r={teile.kopf.r} fill="var(--color-court)" />
      <line x1={teile.schlaegerLinie.x1} y1={teile.schlaegerLinie.y1} x2={teile.schlaegerLinie.x2} y2={teile.schlaegerLinie.y2} stroke="var(--color-kork)" strokeWidth={1.6} strokeLinecap="round" />
      <ellipse
        cx={teile.schlaegerKopf.x}
        cy={teile.schlaegerKopf.y}
        rx={teile.schlaegerKopf.rx}
        ry={teile.schlaegerKopf.ry}
        transform={`rotate(${teile.schlaegerKopf.winkel} ${teile.schlaegerKopf.x} ${teile.schlaegerKopf.y})`}
        fill="none"
        stroke="var(--color-kork)"
        strokeWidth={1.3}
      />
      {teile.gelenke.map((g, i) => (
        <circle key={i} cx={g.x} cy={g.y} r={1.2} fill="var(--color-linie)" stroke="var(--color-court)" strokeWidth={0.7} />
      ))}
      {shuttle && <circle cx={fx(shuttle.z)} cy={shuttle.y} r={1.7} fill="var(--color-signal)" stroke="var(--color-tinte)" strokeWidth={0.5} />}
    </svg>
  )
}
