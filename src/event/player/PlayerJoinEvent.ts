import PlayerEvent from './PlayerEvent'
import Player from '../../entity/player/Player'

export default interface PlayerJoinEvent extends PlayerEvent {
  message: string
}
