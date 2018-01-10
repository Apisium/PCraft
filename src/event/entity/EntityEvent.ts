import Event from '../Event'
import Entity from '../../entity/Entity'

export default class PlayerEvent extends Event {
  public static readonly eventName: string = 'EntityEvent'
  public readonly entity: Entity
  public get entityType (): string { return this.entity.type }
  public constructor (what: Entity) {
    super()
    this.entity = what
  }
}
