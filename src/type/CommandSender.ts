import Permissible, { define as define1 } from '../permission/Permissible'
import { defineProps } from '../helpers'
import format from '../format'

export default interface CommandSender extends Permissible {
  name: string
  send (...msg: string[])
}
export const define = obj => defineProps(define1(obj), {
  name: { get: 'getName', set: 'setName' },
  send: { value (...msg) { obj.sendMessage(format(msg)) } }
})
