import Event from '../event/Event'
import PackageInfo from './PackageInfo'
import Listener from '../event/Listener'
import Command from '../command/Command'
import Commander from '../command/Commander'
import CommandSender from '../type/CommandSender'

export default interface Plugin {
  (pkg: string | PackageInfo, dir?: string, options?: {}): Promise<void>

  config?: any
  pkg?: PackageInfo
  views?: { [name: string]: (data: any) => string }
  listeners?: IListener[]
  commands?: { [key: string]: ICommand }
  _onDisable? (): any
  clear? (): any

  addCommander? (cmd: string, listener: typeof Commander | ((cmd: Command) => any)): Cancel
  addCommanderAll? (path: string): Promise<Cancel>

  render? (name: string, data?: any): string

  register? (dir: string): Promise<void>
  onDisable? (callback: () => any): void

  addListenerAll? (path: string): Promise<Cancel>
  addListener? (type: string | typeof Listener, listener?: IListener): Cancel
  [name: string]: any
}
type Cancel = () => void
export interface IListener {
  (e: any): any
  type?: string
}
export type ICommand = (cmder: CommandSender, cmd: string) => any
export type RegisterCommand = (cmd: string, listener: Commander | ICommand) => Cancel
