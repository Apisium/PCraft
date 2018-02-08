import PlayerEvent, { define as define1 } from './PlayerEvent'
import { defineProps } from '../../helpers'

export default interface PlayerJoinEvent extends PlayerEvent {
  message: string
}
export const define = obj => defineProps(define1(obj), {
  message: { get: 'getMessage', set: 'setMessage' }
})
