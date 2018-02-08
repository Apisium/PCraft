import Event from '../event/Event'
import Args from '../command/Args'
import PackageInfo from './PackageInfo'
import Listener from '../event/Listener'
import Commander from '../command/Commander'
import CommandSender from '../type/CommandSender'

export default interface Plugin {
  (pkg: string | PackageInfo, dir?: string, options?: {}): Promise<void>

  config?: any
  pkg?: PackageInfo
  views?: { [name: string]: (data: any) => string }
  listeners?: IListener[]
  commands?: ICommand[]
  _onDisable? (): any
  clear? (): any

  addCommander? (
    cmd: string,
    listener: typeof Commander | ((cmd: Args) => any),
    description?: string,
    alias?: string[]
  ): Cancel
  addCommanderAll? (path: string): Promise<Cancel>

  render? (name: string, data?: any): string

  register? (dir: string): Promise<void>
  onDisable? (callback: () => any): void

  addListenerAll? (path: string): Promise<Cancel>
  addListener? (type: string | typeof Listener, listener?: IListener): Cancel
  [name: string]: any
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
