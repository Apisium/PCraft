import Event from '../event/Event'
import Args from '../command/Args'
import PackageInfo from './PackageInfo'
import Listener from '../event/Listener'
import Commander from '../command/Commander'
import CommandSender from '../type/CommandSender'

export default interface Plugin {
  (pkg: string | PackageInfo, dir?: string, options?: {}): Promise<void>

  readonly config?: any
  readonly pkg: PackageInfo
  readonly views?: { [name: string]: (data: any) => string }
  readonly listeners: IListener[]
  readonly commands: ICommand[]
  readonly logger: Console

  addCommander (
    cmd: string,
    listener: typeof Commander | ((cmd: Args) => any),
    description?: string,
    alias?: string[]
  ): Cancel
  addCommanderAll (path: string): Promise<Cancel>

  render (name: string, data?: any): string

  register (dir: string): Promise<void>
  onDisable (callback: () => any): void

  addListenerAll (path: string): Promise<Cancel>
  addListener (type: string | typeof Listener, listener?: IListener): Cancel
}
export type Cancel = () => void
export interface IListener {
  (e: Event): any
  eventType?: string
  eventLevel?: number
}
export interface ICommand {
  (cmder: CommandSender, cmd: string, alias?: string): any
  commandName?: string
  commandDescription?: string
  commandAlias?: string[]
}
export type RegisterCommand = (cmd: string, listener: Commander | ICommand) => Cancel
