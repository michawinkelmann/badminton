/** Animation 8: Unterhand-Clear (Lob aus der Abwehr) — hoch und weit befreien. */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausfallschritt, figurPose, grundstellung } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animUnterhandClear: BewegungsAnimation = {
  id: 'anim-unterhand-clear',
  name: 'Unterhand-Clear (Lob)',
  typ: 'figur',
  dauerMs: 2400,
  netzX: 86,
  beschreibung:
    'Die Befreiung: tiefe Bälle mit langem Ausfallschritt erlaufen und hoch zur Grundlinie spielen — Höhe kauft Zeit für den Rückweg.',
  posen: [
    figurPose(0, grundstellung(38)),
    // Anlauf, Arm senkt sich
    figurPose(600, {
      huefte: { x: 46, y: 60 },
      rumpf: -82,
      oberarm: 58, unterarm: 48, schlaeger: 78,
      eindreh: 18, oberarmSeit: 8,
      obL: 112, unL: 92, obR: 52, unR: 96,
    }),
    // Ausfallschritt, Ausholen unten-hinten
    figurPose(1000, {
      ...ausfallschritt(54, 1),
      oberarm: 118, unterarm: 92, schlaeger: 128,
    }),
    // Treffpunkt vor dem Knie, Fläche öffnet nach oben
    figurPose(1400, {
      ...ausfallschritt(55, 1),
      oberarm: 52, unterarm: 12, schlaeger: -58,
    }),
    // hoher Ausschwung
    figurPose(1800, {
      huefte: { x: 52, y: 60 },
      rumpf: -82,
      oberarm: -16, unterarm: -50, schlaeger: -78,
      eindreh: 14, oberarmSeit: 10,
      obL: 124, unL: 100, obR: 46, unR: 90,
    }),
    figurPose(2400, grundstellung(40)),
  ],
  phasen: [
    {
      vonT: 0, bisT: 1000,
      label: 'Anlauf & langer letzter Schritt',
      lehrtext: 'Mit Split-Step starten, der letzte Schritt ist ein langer Ausfallschritt — Ferse zuerst, Knie über dem Fuß.',
    },
    {
      vonT: 1000, bisT: 1340,
      label: 'Ausholen unten',
      lehrtext: 'Der Schläger holt unten-hinten aus, das Handgelenk ist gespannt. Der Oberkörper bleibt so aufrecht wie möglich.',
    },
    {
      vonT: 1340, bisT: 1580,
      label: 'Treffpunkt vor dem Körper',
      lehrtext: 'Tief vor dem Körper treffen, die Schlagfläche öffnet nach oben. Ganzer Schwung von unten nach oben — Höhe bewusst übertreiben!',
    },
    {
      vonT: 1580, bisT: 2400,
      label: 'Hoher Ausschwung & Rückweg',
      lehrtext: 'Der Arm schwingt steil nach oben aus. Über das vordere Bein zurückdrücken und zur Mitte — die gewonnene Zeit nutzen.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 94, y: 12 }, { x: 88, y: 18 }, { x: 82, y: 44 }, 900, 1380, 8, { von: 5, bis: 8 }),
    ...bezierBahn({ x: 82, y: 44 }, { x: 88, y: -8 }, { x: 98, y: 6 }, 1420, 2100, 10, { von: 8, bis: 4 }),
  ],
}
