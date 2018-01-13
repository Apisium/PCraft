import App from '../App'
import Plugin from '../plugin/Plugin'

export default class Listener<T = any> {
  public readonly app: App
  public readonly plugin: Plugin
  public readonly config: T
  constructor (app: App, plugin: Plugin) {
    this.app = app
    this.plugin = plugin
    this.config = plugin.config
  }
}
