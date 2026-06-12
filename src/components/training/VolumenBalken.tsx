import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import type { SkillId } from '../../datenmodell'
import { ALLE_SKILLS, SKILL_NAMEN } from '../../data/skills'

interface Props {
  minuten: Record<SkillId, number>
}

/** Trainingsvolumen (§7): Minuten je Skill als Balkendiagramm. */
export default function VolumenBalken({ minuten }: Props) {
  const daten = ALLE_SKILLS.map((s) => ({
    name: SKILL_NAMEN[s],
    minuten: Math.round(minuten[s]),
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={daten} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeOpacity={0.15} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} unit=" min" />
          <YAxis
            type="category"
            dataKey="name"
            width={104}
            tick={{ fontSize: 11, fill: 'var(--color-tinte)' }}
          />
          <Tooltip
            formatter={(wert) => [`${wert} Minuten`, 'Volumen']}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="minuten" fill="var(--color-court)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
