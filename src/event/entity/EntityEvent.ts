import Event from '../Event'
import Entity from '../../entity/Entity'

export default interface PlayerEvent extends Event {
  readonly entity: Entity
  readonly entityType: string
}
