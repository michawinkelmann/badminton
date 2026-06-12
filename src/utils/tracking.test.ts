/**
 * Phase-6/7-Abnahme (Engine-Teil):
 * – Geloggte Einheit erhöht Skill-Minuten korrekt (§14, Phase 6)
 * – Radar zeigt Vergleich zweier Zeitpunkte (historisiert)
 * – Abhaken erzeugt Logs für alle Gruppenmitglieder (§14, Phase 7)
 */
import { describe, expect, it } from 'vitest'
import type { Einheit, SkillEinschaetzung, TrainingsLog } from '../datenmodell'
import { findeUebung } from '../data/uebungen'
import { SKILL_NAMEN } from '../data/skills'
import {
  aktuelleWoche,
  einschaetzungZum,
  erzeugeAbhakLog,
  kennzahlen,
  radarDaten,
  skillMinuten,
  zuweisungFortschritt,
} from './tracking'
import { findeEinheitMitVorlagen, findeProgramm, programmVorlagen } from '../data/programme'

const einheit: Einheit = {
  id: 'e-test',
  name: 'Testeinheit',
  zielSkills: ['clear'],
  istVorlage: false,
  bloecke: [
    { uebungId: 'st-01', dauerMin: 15 }, // skills: [clear] → 15 auf clear
    { uebungId: 'fw-02', dauerMin: 10 }, // skills: [beinarbeit, ausdauer] → je 5
    { uebungId: 'st-10', dauerMin: 12 }, // skills: [netzspiel, beinarbeit] → je 6
  ],
}
const findeE = (id: string) => (id === 'e-test' ? einheit : findeEinheitMitVorlagen(id, []))
const findeU = (id: string) => findeUebung(id, [])

describe('Skill-Minuten aus Logs (Phase-6-Abnahme)', () => {
  it('verteilt Blockdauern gleichmäßig auf die Skills der Übung', () => {
    const log: TrainingsLog = {
      id: 'l1',
      profilIds: ['p1'],
      einheitId: 'e-test',
      datum: '2026-06-10',
      absolvierteUebungIds: ['st-01', 'fw-02', 'st-10'],
    }
    const m = skillMinuten([log], findeE, findeU)
    expect(m.clear).toBeCloseTo(15)
    expect(m.beinarbeit).toBeCloseTo(5 + 6)
    expect(m.ausdauer).toBeCloseTo(5)
    expect(m.netzspiel).toBeCloseTo(6)
    expect(m.smash).toBe(0)
  })

  it('zählt nur absolvierte Übungen (Teilmenge der Einheit)', () => {
    const log: TrainingsLog = {
      id: 'l2',
      profilIds: ['p1'],
      einheitId: 'e-test',
      datum: '2026-06-10',
      absolvierteUebungIds: ['st-01'],
    }
    const m = skillMinuten([log], findeE, findeU)
    expect(m.clear).toBeCloseTo(15)
    expect(m.beinarbeit).toBe(0)
  })

  it('Kennzahlen: Einheiten der letzten 4 Wochen + Gesamtminuten', () => {
    const heute = new Date('2026-06-12')
    const logs: TrainingsLog[] = [
      { id: 'a', profilIds: ['p1'], einheitId: 'e-test', datum: '2026-06-01', absolvierteUebungIds: ['st-01', 'fw-02', 'st-10'] },
      { id: 'b', profilIds: ['p1'], einheitId: 'e-test', datum: '2026-03-01', absolvierteUebungIds: ['st-01'] },
    ]
    const k = kennzahlen(logs, findeE, heute)
    expect(k.einheitenLetzte4Wochen).toBe(1)
    expect(k.einheitenGesamt).toBe(2)
    expect(k.minutenGesamt).toBe(37 + 15)
  })
})

describe('Skill-Radar mit Vergleichszeitpunkt (Phase-6-Abnahme)', () => {
  const einschaetzungen: SkillEinschaetzung[] = [
    { id: '1', profilId: 'p1', skill: 'clear', wert: 4, datum: '2026-04-01' },
    { id: '2', profilId: 'p1', skill: 'clear', wert: 7, datum: '2026-06-10' },
    { id: '3', profilId: 'p1', skill: 'smash', wert: 3, datum: '2026-04-01' },
    { id: '4', profilId: 'anderes', skill: 'clear', wert: 9, datum: '2026-06-10' },
  ]
  const heute = new Date('2026-06-12')

  it('nimmt je Skill die letzte Einschätzung zum Stichtag (historisiert)', () => {
    expect(einschaetzungZum(einschaetzungen, 'p1', heute).clear).toBe(7)
    expect(einschaetzungZum(einschaetzungen, 'p1', new Date('2026-05-01')).clear).toBe(4)
  })

  it('liefert aktuelle und Vergleichswerte von vor X Wochen', () => {
    const { punkte, hatAktuell, hatVergleich } = radarDaten(
      einschaetzungen, 'p1', SKILL_NAMEN, 8, heute,
    )
    const clear = punkte.find((p) => p.skill === 'clear')!
    expect(clear.aktuell).toBe(7)
    expect(clear.vergleich).toBe(4) // Stand vor 8 Wochen
    expect(hatAktuell && hatVergleich).toBe(true)
    const smash = punkte.find((p) => p.skill === 'smash')!
    expect(smash.aktuell).toBe(3)
  })
})

describe('Programme: Abhaken & Fortschritt (Phase-7-Abnahme)', () => {
  it('Abhaken erzeugt einen Log für ALLE Gruppenmitglieder', () => {
    const mitglieder = ['p1', 'p2', 'p3']
    const log = erzeugeAbhakLog(einheit, mitglieder, '2026-06-12')
    expect(log.profilIds).toEqual(mitglieder)
    expect(log.einheitId).toBe('e-test')
    expect(log.absolvierteUebungIds).toEqual(['st-01', 'fw-02', 'st-10'])
  })

  it('Fortschrittsbalken: erledigt/gesamt korrekt', () => {
    const programm = findeProgramm('prog-grundlagen', [])!
    const f = zuweisungFortschritt(
      {
        id: 'z', programmId: programm.id, zielId: 'p1', zielTyp: 'profil',
        startDatum: '2026-06-01',
        abgehakt: [
          { woche: 1, einheitId: 've-grundlagen-1', datum: '2026-06-03' },
          { woche: 2, einheitId: 've-grundlagen-1', datum: '2026-06-10' },
        ],
      },
      programm,
    )
    expect(f.gesamt).toBe(6)
    expect(f.erledigt).toBe(2)
    expect(f.prozent).toBe(33)
  })

  it('aktuelle Programmwoche aus dem Startdatum', () => {
    expect(aktuelleWoche('2026-06-08', new Date('2026-06-12'))).toBe(1)
    expect(aktuelleWoche('2026-06-01', new Date('2026-06-12'))).toBe(2)
    expect(aktuelleWoche('2026-07-01', new Date('2026-06-12'))).toBe(1) // Zukunft → Woche 1
  })
})

describe('Programm-Vorlagen (§6): Struktur & Inhalte', () => {
  it('genau 4 Vorlagen mit 6/4/8/12 Wochen', () => {
    expect(programmVorlagen.map((p) => p.wochen.length).sort((a, b) => a - b)).toEqual([4, 6, 8, 12])
  })

  for (const p of programmVorlagen) {
    it(`${p.id}: Wochen vollständig, Einheiten existieren, je 85–95 Min`, () => {
      expect(p.beschreibung.length).toBeGreaterThan(40)
      p.wochen.forEach((w, i) => {
        expect(w.nummer).toBe(i + 1)
        expect(w.fokus.length).toBeGreaterThan(3)
        expect(w.progressionsHinweis?.length ?? 0, `Woche ${w.nummer} braucht Progressionshinweis`).toBeGreaterThan(20)
        expect(w.einheitIds.length).toBeGreaterThanOrEqual(1)
        expect(w.einheitIds.length).toBeLessThanOrEqual(3)
        for (const eid of w.einheitIds) {
          const e = findeEinheitMitVorlagen(eid, [])
          expect(e, `Einheit ${eid} fehlt`).toBeDefined()
          const dauer = e!.bloecke.reduce((s, b) => s + b.dauerMin, 0)
          expect(dauer).toBeGreaterThanOrEqual(85)
          expect(dauer).toBeLessThanOrEqual(95)
          for (const b of e!.bloecke) {
            expect(findeU(b.uebungId), `Übung ${b.uebungId} in ${eid} fehlt`).toBeDefined()
          }
        }
      })
    })
  }
})
