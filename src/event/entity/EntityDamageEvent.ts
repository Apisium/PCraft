import EntityEvent from './EntityEvent'
import Entity from '../../entity/Entity'
import DamageCause from '../../enum/DamageCause'

export default interface EntityDamageEvent extends EntityEvent {
  readonly cause: DamageCause
  readonly finalDamage: number
  readonly isCancelled: boolean

  cancelled: boolean
  damage: number
}
