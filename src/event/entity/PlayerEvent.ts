import Event from '../Event'
import Player from '../../entity/player/Player'

export default interface PlayerEvent extends Event {
  readonly player: Player
}
