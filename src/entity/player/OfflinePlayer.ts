import Nameable from '../../type/Nameable'
import ServerOperator from '../../permission/ServerOperator'
import Entity from '../Entity'

export default interface OfflinePlayer extends Nameable, ServerOperator, Entity {
  readonly uuid: string

  readonly firstPlayed: number
  readonly lastPlayed: number

  readonly isPlayedBefore: boolean
  readonly isBanned: boolean
  readonly isOnline: boolean

  whitelisted: boolean
  op: boolean
  customName: string
}
