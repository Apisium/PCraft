import Event from '../Event'
import Player from '../../entity/player/Player'

export default class PlayerEvent extends Event {
  public static readonly eventName: string = 'PlayerEvent'
  public readonly player: Player
  public constructor (player: Player) {
    super()
    this.player = player
  }
}
