import type { Pose } from '../../datenmodell'
import {
  BODEN_Y,
  FRONT_MITTE,
  FRONT_SCHLAGSEITE_Z,
  SCHULTER_HALB,
  figurTeile,
  frontTeile,
} from '../../engine/pose/figur'

interface SpurPunkt {
  x: number
  y: number
  z?: number
}

interface Props {
  pose: Pose
  shuttle?: SpurPunkt
  netzX?: number
  /** Letzte Schlägerkopf-Positionen (alt → neu) als Bewegungsspur */
  spur?: SpurPunkt[]
  /** Seite (Standard) oder Front (Blick vom Netz, wie im Spiegel) */
  ansicht?: 'seite' | 'front'
  /** Schlagmoment: 0–1 innerhalb des Kontakt-Fensters → Impact-Ring am Schlägerkopf */
  impact?: number
  /** Shuttle-Schweif (alt → neu): Flugrichtung und Tempo ablesbar */
  shuttleSpur?: SpurPunkt[]
  /** Fußspuren der Footwork-Animationen (alt → neu) */
  fussSpurL?: SpurPunkt[]
  fussSpurR?: SpurPunkt[]
  /** Fuß-Aufsetzer: expandierender Boden-Ring (progress 0–1) */
  aufsetzer?: { x: number; y: number; z?: number; progress: number }[]
  /** Onion-Skin: Nachbar-Keyframes als blasse Geister (Pausen-/Stepper-Modus) */
  geister?: Pose[]
}

const NETZ_HOEHE = 1.55 * 40 // 1 m ≈ 40 Einheiten

/** Expandierender, ausblendender Ring am Schlägerkopf im Schlagmoment. */
function ImpactRing({ x, y, impact }: { x: number; y: number; impact: number }) {
  const u = Math.min(1, Math.max(0, impact))
  return (
    <circle
      cx={x}
      cy={y}
      r={2.2 + u * 6}
      fill="none"
      stroke="var(--color-signal)"
      strokeWidth={1.4 * (1 - u) + 0.2}
      opacity={0.9 * (1 - u)}
    />
  )
}

/** Flacher Puls-Ring am Boden, wenn ein Fuß aufsetzt („tip-TAP"). */
function AufsetzRing({ x, progress }: { x: number; progress: number }) {
  const u = Math.min(1, Math.max(0, progress))
  return (
    <ellipse
      cx={x}
      cy={BODEN_Y}
      rx={1.2 + u * 4.2}
      ry={(1.2 + u * 4.2) * 0.32}
      fill="none"
      stroke="var(--color-signal)"
      strokeWidth={1.1 * (1 - u) + 0.2}
      opacity={0.8 * (1 - u)}
    />
  )
}

/** Bodenschatten: schrumpft und verblasst mit der Flughöhe der Figur. */
function BodenSchatten({ mitteX, spann, hoehe }: { mitteX: number; spann: number; hoehe: number }) {
  const faktor = Math.max(0.35, 1 - hoehe / 26)
  return (
    <ellipse
      cx={mitteX}
      cy={BODEN_Y + 1}
      rx={(spann / 2 + 3.5) * faktor}
      ry={1.15 * faktor}
      fill="var(--color-tinte)"
      opacity={0.05 + 0.11 * faktor}
    />
  )
}

/** Verblassende Punktspur (alt → neu). */
function PunktSpur({
  punkte,
  farbe,
  maxR = 1.1,
}: {
  punkte: { x: number; y: number }[]
  farbe: string
  maxR?: number
}) {
  const n = Math.max(1, punkte.length - 1)
  return (
    <g>
      {punkte.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={maxR * (0.55 + (i / n) * 0.45)}
          fill={farbe}
          opacity={0.12 + (i / n) * 0.3}
        />
      ))}
    </g>
  )
}

/** Strichfigur (§8.1): zwei synchrone Projektionen aus einem 3D-lite-Datensatz. */
export default function FigurAnsicht(props: Props) {
  return (props.ansicht ?? 'seite') === 'seite' ? (
    <SeitenProjektion {...props} />
  ) : (
    <FrontProjektion {...props} />
  )
}

function SeitenProjektion({
  pose,
  shuttle,
  netzX,
  spur,
  impact,
  shuttleSpur,
  fussSpurL,
  fussSpurR,
  aufsetzer,
  geister,
}: Omit<Props, 'ansicht'>) {
  const teile = figurTeile(pose)
  const j = pose.joints
  const hoehe = Math.max(0, BODEN_Y - Math.max(j.fussL.y, j.fussR.y))

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

      <BodenSchatten
        mitteX={(j.fussL.x + j.fussR.x) / 2}
        spann={Math.abs(j.fussL.x - j.fussR.x)}
        hoehe={hoehe}
      />

      {/* Onion-Skin: Nachbar-Keyframes hinter der aktuellen Pose */}
      {geister?.map((g, gi) => {
        const gt = figurTeile(g)
        return (
          <g key={gi} opacity={0.16}>
            {gt.glieder.map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--color-court)" strokeWidth={l.dick} strokeLinecap="round" />
            ))}
            <circle cx={gt.kopf.x} cy={gt.kopf.y} r={gt.kopf.r} fill="var(--color-court)" />
            <line x1={gt.schlaegerLinie.x1} y1={gt.schlaegerLinie.y1} x2={gt.schlaegerLinie.x2} y2={gt.schlaegerLinie.y2} stroke="var(--color-kork)" strokeWidth={1.6} strokeLinecap="round" />
          </g>
        )
      })}

      {fussSpurL && <PunktSpur punkte={fussSpurL} farbe="var(--color-tinte)" maxR={0.9} />}
      {fussSpurR && <PunktSpur punkte={fussSpurR} farbe="var(--color-tinte)" maxR={0.9} />}
      {spur && <PunktSpur punkte={spur} farbe="var(--color-kork)" />}
      {shuttleSpur && <PunktSpur punkte={shuttleSpur} farbe="var(--color-signal)" maxR={1.3} />}

      {aufsetzer?.map((a, i) => (
        <AufsetzRing key={i} x={a.x} progress={a.progress} />
      ))}

      {teile.glieder.map((g, i) => (
        <line
          key={i}
          x1={g.x1}
          y1={g.y1}
          x2={g.x2}
          y2={g.y2}
          stroke="var(--color-court)"
          strokeOpacity={g.hinten ? 0.45 : g.arm ? 1 : 0.8}
          strokeWidth={g.arm ? g.dick + 0.5 : g.dick}
          strokeLinecap="round"
        />
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
      {impact !== undefined && (
        <ImpactRing x={teile.schlaegerKopf.x} y={teile.schlaegerKopf.y} impact={impact} />
      )}
      {shuttle && <circle cx={shuttle.x} cy={shuttle.y} r={1.7} fill="var(--color-signal)" stroke="var(--color-tinte)" strokeWidth={0.5} />}
    </svg>
  )
}

function FrontProjektion({
  pose,
  shuttle,
  netzX,
  spur,
  impact,
  shuttleSpur,
  fussSpurL,
  fussSpurR,
  aufsetzer,
  geister,
}: Omit<Props, 'ansicht'>) {
  const teile = frontTeile(pose)
  // Tiefensortierung: weiter vom Netz entfernt (kleines Seiten-x) zuerst zeichnen
  const linien = [...teile.linien].sort((a, b) => a.tiefe - b.tiefe)
  const fx = (z?: number) => FRONT_MITTE + (z ?? FRONT_SCHLAGSEITE_Z)
  const j = pose.joints
  const hoehe = Math.max(0, BODEN_Y - Math.max(j.fussL.y, j.fussR.y))
  // Tiefen-Staffelung (A5): netzferne Glieder dimmen (0.5–1.0 über die Tiefenspanne)
  const tiefen = teile.linien.map((l) => l.tiefe)
  const tMin = Math.min(...tiefen)
  const tMax = Math.max(...tiefen)
  const tiefenOpacity = (tiefe: number) =>
    tMax - tMin < 1e-6 ? 1 : 0.5 + (0.5 * (tiefe - tMin)) / (tMax - tMin)
  const front = (p: SpurPunkt) => ({ x: fx(p.z), y: p.y })

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Bewegungsablauf, Frontansicht (Spiegel)">
      <line x1={2} y1={BODEN_Y} x2={98} y2={BODEN_Y} stroke="var(--color-tinte)" strokeOpacity={0.25} strokeWidth={0.8} />

      {/* Standbreiten-Referenz: schulterbreite Markierung am Boden */}
      <g opacity={0.4}>
        <line x1={FRONT_MITTE - SCHULTER_HALB} y1={BODEN_Y - 1.8} x2={FRONT_MITTE - SCHULTER_HALB} y2={BODEN_Y + 1.8} stroke="var(--color-tinte)" strokeWidth={0.6} />
        <line x1={FRONT_MITTE + SCHULTER_HALB} y1={BODEN_Y - 1.8} x2={FRONT_MITTE + SCHULTER_HALB} y2={BODEN_Y + 1.8} stroke="var(--color-tinte)" strokeWidth={0.6} />
        <text x={FRONT_MITTE} y={BODEN_Y + 5} textAnchor="middle" fontSize={2.8} fill="var(--color-tinte)">
          schulterbreit
        </text>
      </g>

      {/* Netzkante als Höhenreferenz (das Netz liegt zwischen Betrachter und Figur) */}
      {netzX !== undefined && (
        <g>
          <line x1={4} y1={BODEN_Y - NETZ_HOEHE} x2={96} y2={BODEN_Y - NETZ_HOEHE} stroke="var(--color-tinte)" strokeOpacity={0.4} strokeWidth={1.2} strokeDasharray="3 2" />
          <text x={95} y={BODEN_Y - NETZ_HOEHE - 1.5} textAnchor="end" fontSize={3} fill="var(--color-tinte)" opacity={0.5}>
            Netzkante
          </text>
        </g>
      )}

      <BodenSchatten
        mitteX={(fx(j.fussL.z) + fx(j.fussR.z)) / 2}
        spann={Math.abs(fx(j.fussL.z) - fx(j.fussR.z))}
        hoehe={hoehe}
      />

      {/* Onion-Skin: Nachbar-Keyframes hinter der aktuellen Pose */}
      {geister?.map((g, gi) => {
        const gt = frontTeile(g)
        return (
          <g key={gi} opacity={0.14}>
            {gt.linien.map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--color-court)" strokeWidth={l.dick} strokeLinecap="round" />
            ))}
            <circle cx={gt.kopf.x} cy={gt.kopf.y} r={gt.kopf.r} fill="var(--color-court)" />
            <line x1={gt.schlaegerLinie.x1} y1={gt.schlaegerLinie.y1} x2={gt.schlaegerLinie.x2} y2={gt.schlaegerLinie.y2} stroke="var(--color-kork)" strokeWidth={1.6} strokeLinecap="round" />
          </g>
        )
      })}

      {fussSpurL && <PunktSpur punkte={fussSpurL.map(front)} farbe="var(--color-tinte)" maxR={0.9} />}
      {fussSpurR && <PunktSpur punkte={fussSpurR.map(front)} farbe="var(--color-tinte)" maxR={0.9} />}
      {spur && <PunktSpur punkte={spur.map(front)} farbe="var(--color-kork)" />}
      {shuttleSpur && <PunktSpur punkte={shuttleSpur.map(front)} farbe="var(--color-signal)" maxR={1.3} />}

      {aufsetzer?.map((a, i) => (
        <AufsetzRing key={i} x={fx(a.z)} progress={a.progress} />
      ))}

      {linien.map((g, i) => (
        <line
          key={i}
          x1={g.x1}
          y1={g.y1}
          x2={g.x2}
          y2={g.y2}
          stroke="var(--color-court)"
          strokeOpacity={tiefenOpacity(g.tiefe) * (g.arm ? 1 : 0.85)}
          strokeWidth={g.arm ? g.dick + 0.5 : g.dick}
          strokeLinecap="round"
        />
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
      {impact !== undefined && (
        <ImpactRing x={teile.schlaegerKopf.x} y={teile.schlaegerKopf.y} impact={impact} />
      )}
      {shuttle && <circle cx={fx(shuttle.z)} cy={shuttle.y} r={1.7} fill="var(--color-signal)" stroke="var(--color-tinte)" strokeWidth={0.5} />}
    </svg>
  )
}
