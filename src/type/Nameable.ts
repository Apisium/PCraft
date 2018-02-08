import { defineProps } from '../helpers'

export default interface Nameable {
  customName: string
}
export const define = obj => defineProps(obj, {
  customName: { get: 'getCustomName', set: 'setCustomName' }
})
