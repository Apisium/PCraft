import Event, { define as define1 } from '../Event'
import Player, { define as define2 } from '../../entity/player/Player'
import { defineProps } from '../../helpers'

const PLAYER = Symbol('Player')
export default interface PlayerEvent extends Event {
  readonly player: Player
}
export const define = obj => defineProps(define1(obj), {
  player: {
    getFn: () => obj[PLAYER] || (obj[PLAYER] = define2(obj.getPlayer()))
  }
})
