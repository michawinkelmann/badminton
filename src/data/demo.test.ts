import { describe, expect, it } from 'vitest'
import { AppStateSchema } from '../schemas/appState'
import { leererAppState } from '../datenmodell'
import { alleUebungen } from './uebungen'
import { findeProgramm } from './programme'
import { erzeugeDemoDaten } from './demo'

describe('Demodaten', () => {
  const demo = erzeugeDemoDaten()

  it('bestehen die komplette Schema-Validierung', () => {
    const state = { ...leererAppState, ...demo, eigeneUebungen: [] }
    expect(() => AppStateSchema.parse(state)).not.toThrow()
  })

  it('alle Ids beginnen mit demo- (rückstandsfreies Entfernen)', () => {
    const ids = [
      ...demo.profile, ...demo.gruppen, ...demo.einheiten, ...demo.zuweisungen,
      ...demo.logs, ...demo.einschaetzungen, ...demo.turniere, ...demo.termine,
    ].map((e) => e.id)
    expect(ids.every((id) => id.startsWith('demo-'))).toBe(true)
  })

  it('Referenzen stimmen: Übungen, Programm, Profile', () => {
    const uebungIds = new Set(alleUebungen([]).map((u) => u.id))
    for (const einheit of demo.einheiten) {
      for (const block of einheit.bloecke) expect(uebungIds.has(block.uebungId)).toBe(true)
    }
    expect(findeProgramm(demo.zuweisungen[0]!.programmId, [])).toBeDefined()
    const profilIds = new Set(demo.profile.map((p) => p.id))
    for (const log of demo.logs) {
      for (const id of log.profilIds) expect(profilIds.has(id)).toBe(true)
    }
  })

  it('Turnier 1 ist komplett durchgespielt (K.o. mit Platz 3), Turnier 2 läuft', () => {
    const [ko, liga] = demo.turniere
    expect(ko!.status).toBe('beendet')
    expect(ko!.matches.every((m) => m.status === 'beendet')).toBe(true)
    expect(ko!.matches.some((m) => m.bracketTyp === 'platz3' && m.siegerId)).toBe(true)
    expect(liga!.status).toBe('laufend')
    const beendete = liga!.matches.filter((m) => m.status === 'beendet')
    expect(beendete.length).toBeGreaterThanOrEqual(4)
    expect(liga!.matches.some((m) => m.status !== 'beendet')).toBe(true)
    // beendetUm gesetzt → Zeitschätzung und Wartezeit funktionieren sofort
    expect(beendete.every((m) => m.beendetUm !== undefined)).toBe(true)
  })
})
