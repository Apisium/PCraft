import Entity from '../Entity'
import OfflinePlayer from './OfflinePlayer'

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

  send (...msg: string[]): void
  canSee (player: Player): boolean
  chat (msg: string): void
}
