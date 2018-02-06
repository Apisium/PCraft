import Entity from '../entity/Entity'

export default interface Damageable extends Entity {
  health: number
  maxHealth: number
  damage (amount: number, source?: Entity)
}
