import Event, { define as define1 } from '../Event'
import { defineProps } from '../../helpers'

export default interface BlockEvent {
  readonly block: string
}
export const define = obj => defineProps(define(obj), { eventName: { get: 'getEventName' } })
