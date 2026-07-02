/** Animation 17: Umsprung (Scissor Jump) in der Vorhand-Ecke. */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausholungUeberkopf, grundstellung } from '../../engine/pose/figur'

export const animUmsprung: BewegungsAnimation = {
  id: 'anim-umsprung',
  name: 'Umsprung (Scissor Jump)',
  typ: 'figur',
  dauerMs: 2800,
  beschreibung:
    'Der Standard-Abschluss im Hinterfeld: hinter den Shuttle kommen, abspringen, Beine scheren — die Landung zieht automatisch zurück Richtung Mitte.',
  stellungen: [
    { t: 0, s: grundstellung(50) },
    // Rückwärts hinter den Shuttle (Chassé, eingedreht)
    { t: 700, s: {
      ...ausholungUeberkopf(44),
      huefte: { x: 44, y: 59 },
    } },
    // Absprung vom Schlagbein
    { t: 1100, s: {
      huefte: { x: 42, y: 52 },
      rumpf: -94,
      oberarm: -120, unterarm: -70, schlaeger: -60,
      obL: 80, unL: 100, obR: 95, unR: 70,
      eindreh: 62, oberarmSeit: 5, beinSeitL: -5, beinSeitR: 5,
      flugHoehe: 7.13,
    } },
    // Schere in der Luft + Treffpunkt
    { t: 1400, s: {
      huefte: { x: 41, y: 50 },
      rumpf: -88,
      kopf: -95,
      oberarm: -70, unterarm: -66, schlaeger: -60,
      obL: 50, unL: 98, obR: 130, unR: 76,
      eindreh: 38, oberarmSeit: 8, unterarmSeit: 6, beinSeitL: -8, beinSeitR: 8,
      flugHoehe: 12.01,
    } },
    // Landung: hinteres Bein setzt, vorderes zieht nach vorn
    { t: 1850, s: {
      huefte: { x: 43, y: 60.5 },
      rumpf: -80,
      oberarm: 20, unterarm: 55, schlaeger: 80,
      obL: 122, unL: 88, obR: 48, unR: 100,
      eindreh: 14, oberarmSeit: 8, beinSeitL: -9, beinSeitR: 9,
    } },
    // Antritt zur Mitte
    { t: 2250, s: {
      huefte: { x: 47, y: 59 },
      rumpf: -82,
      oberarm: 35, unterarm: -20, schlaeger: -25,
      eindreh: 12, oberarmSeit: 6,
      obL: 112, unL: 92, obR: 52, unR: 94,
    } },
    { t: 2800, s: grundstellung(50) },
  ],
  phasen: [
    {
      vonT: 0, bisT: 1000,
      label: 'Hinter den Shuttle',
      lehrtext: 'Eindrehen und mit Chassé-Schritten rückwärts arbeiten — der Treffpunkt muss am Ende VOR dem Körper liegen, nicht darüber.',
    },
    {
      vonT: 1000, bisT: 1300,
      label: 'Absprung vom Schlagbein',
      lehrtext: 'Vom hinteren (Schlagbein-)Fuß explosiv abspringen, die Hüfte dreht im Flug Richtung Netz ein.',
    },
    {
      vonT: 1300, bisT: 1600,
      label: 'Schere & Treffpunkt',
      lehrtext: 'Im höchsten Punkt treffen, während die Beine scheren: hinteres Bein schwingt nach vorn — „hinten landet, vorne zieht".',
    },
    {
      vonT: 1600, bisT: 2100,
      label: 'Landung zieht nach vorn',
      lehrtext: 'Das hintere Bein landet zuerst und drückt sofort ab — die Schere macht den ersten Schritt zur Mitte gratis.',
    },
    {
      vonT: 2100, bisT: 2800,
      label: 'Antritt zur Mitte',
      lehrtext: 'Ohne Pause in den Lauf übergehen: Wer nach der Landung steht, verliert den Vorteil des Umsprungs.',
    },
  ],
}
