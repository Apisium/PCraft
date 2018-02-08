import Nameable, { define as define1 } from '../../type/Nameable'
import ServerOperator, { define as define2 } from '../../permission/ServerOperator'
import Entity, { define as define3 } from '../Entity'
import { defineProps } from '../../helpers'

export default interface OfflinePlayer extends Nameable, ServerOperator, Entity {
  readonly uuid: string

  readonly firstPlayed: number
  readonly lastPlayed: number

  readonly isPlayedBefore: boolean
  readonly isBanned: boolean
  readonly isOnline: boolean

  whitelisted: boolean
}
export const define = obj => defineProps(define1(define2(define3(obj))), {
  uuid: { get: 'getUUID' }
})
