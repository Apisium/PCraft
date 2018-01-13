import Nameable from '../../type/Nameable'

export default class OfflinePlayer implements Nameable {
  protected readonly p: any
  protected constructor (p: any) { this.p = p }
  get name (): string { return '' }
  get uuid (): string { return '' }

  get firstPlayed (): number { return 0 }
  get lastPlayed (): number { return 0 }

  get isPlayedBefore (): boolean { return false }
  get isBanned (): boolean { return false }
  get isOnline (): boolean { return false }

  set whitelisted (value: boolean) { }
  get whitelisted (): boolean { return false }

  set op (value: boolean) { }
  get op (): boolean { return false }

  set customName (value: string) {}
  get customName (): string { return '' }
}
