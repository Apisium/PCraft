import Application from '../Application'
import Plugin from '../plugin/Plugin'

export default class Listener<T = any> {
  public readonly app: Application
  public readonly plugin: Plugin
  public readonly config: T
  public handlers: any[]
  constructor (app: Application, plugin: Plugin) {
    this.app = app
    this.plugin = plugin
    this.config = plugin.config
    if (!this.handlers) this.handlers = []
  }
}
