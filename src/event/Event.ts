import { defineProps } from '../helpers'

export default interface Event {
  readonly eventName: string
}
export const define = obj => defineProps(obj, { eventName: { get: 'getEventName' } })
