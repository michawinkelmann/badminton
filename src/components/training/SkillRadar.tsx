import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { RadarPunkt } from '../../utils/tracking'

interface Props {
  punkte: RadarPunkt[]
  hatVergleich: boolean
  vergleichLabel?: string
}

/** Skill-Radar (§7, recharts): aktuelle Einschätzung + optional Vergleichsebene. */
export default function SkillRadar({ punkte, hatVergleich, vergleichLabel }: Props) {
  const daten = punkte.map((p) => ({
    name: p.name,
    aktuell: p.aktuell ?? 0,
    vergleich: p.vergleich ?? 0,
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <RadarChart data={daten} outerRadius="72%">
          <PolarGrid stroke="var(--color-tinte)" strokeOpacity={0.2} />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: 'var(--color-tinte)', fontSize: 11 }}
          />
          <PolarRadiusAxis domain={[0, 10]} tickCount={6} tick={{ fontSize: 9 }} stroke="var(--color-tinte)" strokeOpacity={0.3} />
          {hatVergleich && (
            <Radar
              name={vergleichLabel ?? 'Vergleich'}
              dataKey="vergleich"
              stroke="var(--color-kork)"
              fill="var(--color-kork)"
              fillOpacity={0.18}
              strokeWidth={2}
            />
          )}
          <Radar
            name="Aktuell"
            dataKey="aktuell"
            stroke="var(--color-court)"
            fill="var(--color-court)"
            fillOpacity={0.3}
            strokeWidth={2.5}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
