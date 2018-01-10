import EntityEvent from './EntityEvent'
import Entity from '../../entity/Entity'
import DamageCause from '../../enum/DamageCause'

export default class EntityDamageEvent extends EntityEvent {
  public static readonly eventName: string = 'EntityDamageEvent'

  public get cause (): DamageCause { return 0 } // readonly
  public get finalDamage (): number { return 0 } // readonly
  public get isCancelled (): boolean { return true } // readonly

  public set cancelled (value: boolean) {}
  public get cancelled (): boolean { return true }

  public set damage (value: number) {}
  public get damage (): number { return 0 }

  public constructor (what: Entity) {
    super(what)
  }
}
