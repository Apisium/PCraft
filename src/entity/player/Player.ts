import Entity, { define as define1 } from '../Entity'
import OfflinePlayer, { define as define2 } from './OfflinePlayer'
import { defineProps } from '../../helpers'

export default interface Player extends OfflinePlayer, Entity {
  readonly allowFilght: boolean
  readonly address: string
  readonly bedSpawnLocation: any
  readonly locale: string
  readonly playerTimeOffset: string

  gamemode: number
  exp: number
  flySpeed: number
  foodLevel: number
  healthScale: number
  level: number
  playerTime: number

  playerListName: string
  displayName: string

  canSee (player: Player): boolean
  chat (msg: string): void
}
export const define = obj => defineProps(define1(define2(obj)), {
  level: { get: 'getLevel', set: 'setLevel' }
})
export const checkType = obj => !!obj.getPlayerTimeOffset
