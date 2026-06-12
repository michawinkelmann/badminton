/**
 * Registry der 25 Bewegungs-Animationen (§8.2, verbindliche Liste).
 * Gruppiert: Schlagtechnik (14), Footwork (6), Taktik & Regeln (5).
 */
import type { BewegungsAnimation } from '../../datenmodell'
import { animClear } from './anim-clear'
import { animDrop } from './anim-drop'
import { animSmash } from './anim-smash'
import { animSprungsmash } from './anim-sprungsmash'
import { animRhClear } from './anim-rh-clear'
import { animDriveVh } from './anim-drive-vh'
import { animDriveRh } from './anim-drive-rh'
import { animUnterhandClear } from './anim-unterhand-clear'
import { animNetzdrop } from './anim-netzdrop'
import { animNetzlobRh } from './anim-netzlob-rh'
import { animAufschlagKurz } from './anim-aufschlag-kurz'
import { animAufschlagLang } from './anim-aufschlag-lang'
import { animNetzkill } from './anim-netzkill'
import { animBlock } from './anim-block'
import { animSplitstep } from './anim-splitstep'
import { animAusfallschritt } from './anim-ausfallschritt'
import { animUmsprung } from './anim-umsprung'
import { animRhEcke } from './anim-rh-ecke'
import { animSidesteps } from './anim-sidesteps'
import { animSternlauf } from './anim-sternlauf'
import { animEinzelPosition } from './anim-einzel-position'
import { animDoppelAngriff } from './anim-doppel-angriff'
import { animDoppelAbwehr } from './anim-doppel-abwehr'
import { animFlugbahnen } from './anim-flugbahnen'
import { animAufschlagfelder } from './anim-aufschlagfelder'

export interface AnimationsGruppe {
  titel: string
  animationen: BewegungsAnimation[]
}

export const animationsGruppen: AnimationsGruppe[] = [
  {
    titel: 'Schlagtechnik',
    animationen: [
      animClear,
      animDrop,
      animSmash,
      animSprungsmash,
      animRhClear,
      animDriveVh,
      animDriveRh,
      animUnterhandClear,
      animNetzdrop,
      animNetzlobRh,
      animAufschlagKurz,
      animAufschlagLang,
      animNetzkill,
      animBlock,
    ],
  },
  {
    titel: 'Footwork',
    animationen: [
      animSplitstep,
      animAusfallschritt,
      animUmsprung,
      animRhEcke,
      animSidesteps,
      animSternlauf,
    ],
  },
  {
    titel: 'Taktik & Regeln',
    animationen: [
      animEinzelPosition,
      animDoppelAngriff,
      animDoppelAbwehr,
      animFlugbahnen,
      animAufschlagfelder,
    ],
  },
]

export const alleAnimationen: BewegungsAnimation[] = animationsGruppen.flatMap(
  (g) => g.animationen,
)

export function findeAnimation(id: string): BewegungsAnimation | undefined {
  return alleAnimationen.find((a) => a.id === id)
}
