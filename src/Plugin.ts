import Event from './event/Event'
import Commander from './command/Commander'
import Listener from './event/Listener'

export default interface Plugin {
  (pkg: string, dir?: string, options?: {}): Promise<void>

  name: string
  version: string

  register (dir: string): Promise<void>
  onDisable (callback: () => any): void

  addListener (path: string): Promise<cancel>
  addListener (type: string, listener: Listener | ((e: Event, ctx: any) => any)): cancel

  addCommander (path: string): Promise<cancel>
  addCommander (type: string, listener: Commander | ((e: Command, argv: any) => any)): cancel
}
type cancel = () => void
