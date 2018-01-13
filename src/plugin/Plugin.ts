import Event from '../event/Event'
import Listener from '../event/Listener'
import PackageInfo from './PackageInfo'
import Commander from '../command/Commander'

export default interface Plugin {
  (pkg: string | PackageInfo, dir?: string, options?: {}): Promise<void>

  config?: any
  pkg?: PackageInfo
  views?: { [name: string]: (data: any) => string }
  listeners?: IListener[]
  commands?: { [key: string]: ICommand }

  render? (name: string, data?: any): string

  register? (dir: string): Promise<void>
  onDisable? (callback: () => any): void

  addListenerAll? (path: string): Promise<Cancel>
  addListener? (type: string | Listener, listener?: IListener): Cancel

  addCommander? (path: string): Promise<Cancel>
  addCommander? (cmd: string, listener: Commander | ICommand): Cancel
  [name: string]: any
}
type Cancel = () => void
export interface IListener {
  (e: any): any
  type?: string
}
export type ICommand = (cmd: Command, argv: any) => any
