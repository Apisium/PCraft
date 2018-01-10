import PlayerEvent from './PlayerEvent'
import Player from '../../entity/player/Player'

export default class PlayerJoinEvent extends PlayerEvent {
  public static readonly eventName: string = 'PlayerJoinEvent'
  public message: string
  public constructor (player: Player, message: string) {
    super(player)
    this.message = message
  }
}
