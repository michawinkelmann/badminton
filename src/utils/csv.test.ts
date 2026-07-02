import { describe, expect, it } from 'vitest'
import type { Einheit, Profil, SkillEinschaetzung, TrainingsLog } from '../datenmodell'
import { ALLE_SKILLS } from '../data/skills'
import { einschaetzungenCsv, logsCsv, zeilenZuCsv } from './csv'

const profil = (id: string, name: string): Profil => ({
  id,
  name,
  niveau: 'fortgeschritten',
  erstelltAm: '2026-01-01',
})

describe('CSV-Grundlagen', () => {
  it('setzt BOM, Semikolon und CRLF', () => {
    const csv = zeilenZuCsv([
      ['A', 'B'],
      [1, 2],
    ])
    expect(csv.startsWith('﻿')).toBe(true)
    expect(csv).toContain('A;B\r\n1;2')
  })

  it('quotet Felder mit Semikolon und Anführungszeichen', () => {
    const csv = zeilenZuCsv([['Smash; hart', 'Sagt "los"']])
    expect(csv).toContain('"Smash; hart";"Sagt ""los"""')
  })

  it('neutralisiert Formel-Injection (=, +, -, @), lässt Zahlen unangetastet', () => {
    const csv = zeilenZuCsv([['=SUM(A1)', '+HYPERLINK("x")', '@user', '-3', -3, 'B-Note']])
    expect(csv).toContain(`'=SUM(A1);"'+HYPERLINK(""x"")";'@user;-3;-3;B-Note`)
  })
})

describe('Einschätzungen-CSV', () => {
  it('nimmt je Skill den neuesten Wert und überspringt Archivierte', () => {
    const e = (profilId: string, skill: (typeof ALLE_SKILLS)[number], wert: number, datum: string): SkillEinschaetzung => ({
      id: `${profilId}-${skill}-${datum}`,
      profilId,
      skill,
      wert,
      datum,
    })
    const csv = einschaetzungenCsv(
      [profil('p1', 'Lena'), { ...profil('p2', 'Alt'), archiviert: true }],
      [e('p1', 'smash', 3, '2026-01-10'), e('p1', 'smash', 6, '2026-03-01'), e('p1', 'clear', 4, '2026-02-01')],
    )
    const zeilen = csv.trim().split('\r\n')
    expect(zeilen).toHaveLength(2) // Kopf + Lena (Archivierte fehlen)
    expect(zeilen[1]).toContain('Lena')
    expect(zeilen[1]).toContain('6') // neuester Smash-Wert, nicht 3
    expect(zeilen[1]).toContain('2026-03-01')
    expect(csv).not.toContain('Alt')
  })
})

describe('Logs-CSV', () => {
  it('eine Zeile pro Person, Minuten nur für absolvierte Blöcke', () => {
    const einheit: Einheit = {
      id: 'e1',
      name: 'Smash-Abend',
      zielSkills: ['smash'],
      istVorlage: false,
      bloecke: [
        { uebungId: 'u1', dauerMin: 20 },
        { uebungId: 'u2', dauerMin: 15 },
      ],
    }
    const log: TrainingsLog = {
      id: 'l1',
      profilIds: ['p1', 'p2'],
      einheitId: 'e1',
      datum: '2026-05-04',
      absolvierteUebungIds: ['u1'], // nur 20 von 35 Minuten
    }
    const csv = logsCsv([profil('p1', 'Lena'), profil('p2', 'Ben')], [log], [einheit])
    const zeilen = csv.trim().split('\r\n')
    expect(zeilen).toHaveLength(3)
    expect(zeilen[1]).toBe('2026-05-04;Lena;Smash-Abend;20;1')
    expect(zeilen[2]).toContain('Ben')
  })
})
