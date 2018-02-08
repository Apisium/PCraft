import { defineProps } from '../helpers'

export default interface ServerOperator {
  op: boolean
}
export const define = obj => defineProps(obj, { op: { get: 'isOp', set: 'setOp' } })
