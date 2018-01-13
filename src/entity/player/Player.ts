import Entity from '../Entity'
import OfflinePlayer from './OfflinePlayer'

export default class Player extends OfflinePlayer implements Entity {
  set gamemode (value) {}
  get gamemode () { return 1 }

  get allowFilght () { return false }
  get address (): string { return '' }
  get bedSpawnLocation (): any { return 1 }

  set displayName (name: string) {}
  get displayName (): string { return '' }

  set exp (exp: number) {}
  get exp (): number { return 1 }

  set flySpeed (speed: number) {}
  get flySpeed (): number { return 1 }

  set foodLevel (level: number) {}
  get foodLevel (): number { return 1 }

  set healthScale (scale: number) {}
  get healthScale (): number { return 1 }

  set level (level: number) {}
  get level (): number { return 1 }

  get locale (): string { return '' }

  set playerListName (name: string) {}
  get playerListName (): string { return '' }

  set playerTime (time: number) {}
  get playerTime (): number { return 1 }

  get playerTimeOffset (): number { return 1 }

  public send (...msg: string[]) {}
  public canSee (player: Player): boolean { return false }
  public chat (msg: string) {}

  public get isGlowing (): boolean { return false }
}
