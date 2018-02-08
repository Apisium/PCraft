import World from '../type/World'
import Vector from '../type/Vector'
import Location from '../type/Location'
import Nameable, { define as define1 } from '../type/Nameable'
import CommandSender, { define as define2 } from '../type/CommandSender'
import PistonMoveReaction from '../enum/PistonMoveReaction'
import EntityDamageEvent from '../event/entity/EntityDamageEvent'
import { defineProps } from '../helpers'

export default interface Entity extends Nameable, CommandSender {
  readonly isGlowing: boolean
  readonly vehicle: Entity
  readonly location: Location
  readonly maxFireTicks: number
  readonly passengers: Entity[]
  readonly pistonMoveReaction: PistonMoveReaction
  readonly scoreboardTags: string[]
  readonly type: string
  readonly uniqueId: string
  readonly entityId: number
  readonly width: number
  readonly world: World
  readonly isCustomNameVisible: boolean
  readonly isDead: boolean
  readonly isEmpty: boolean
  readonly height: number
  readonly isInvulnerable: boolean
  readonly isOnGround: boolean
  readonly isSilent: boolean
  readonly isValid: boolean
  readonly isInsideVehicle: boolean
  customNameVisible: boolean
  fallDistance: number
  fireTicks: number
  glowing: boolean
  invulnerable: boolean
  lastDamageCause: EntityDamageEvent
  portalCooldown: number
  silent: boolean
  ticksLived: number
  velocity: Vector
  gravity: boolean
  addPassenger (passenger: Entity): boolean
  eject (): boolean
  getLocation (loc: Location): Location
  addScoreboardTag (tag: string): boolean
  leaveVehicle (): boolean
  playEffect (type: string): void
  remove (): void
  removePassenger (passenger: Entity): boolean
  removeScoreboardTag (tag: string): boolean
  teleport (des: Entity | Location): boolean
}
export const define = obj => defineProps(define1(define2(obj)), {
  isDead: { get: 'isDead' }
})
