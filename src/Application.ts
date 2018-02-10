import Y18n from './type/Y18n'
import Player from './entity/player/Player'

const S = Symbol()
export default interface Application {
  readonly pcraft: number
  readonly y: Y18n
  readonly players: Player[]
  readonly bannedPlayers: any
  readonly config: {
    readonly debug: boolean
    readonly locale: string
    readonly [key: string]: any
  }
  getLogger (name: string): Console
  banIp (address: string): void
  unBanIp (address: string): void
  broadcast (msg: string, permission?: string): void
}
